import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { PerceptionObject, HumanPosesPayload, HumanPoseItem, MhrHumanPayload } from '../../types/can';
import { MhrHuman } from './MhrHuman';

interface ActorLimbs {
  bodyRoot: THREE.Object3D;
  hips: THREE.Object3D;
  spine?: THREE.Object3D;
  chest?: THREE.Object3D;
  neck?: THREE.Object3D;
  head?: THREE.Object3D;
  armL: THREE.Object3D;
  elbowL: THREE.Object3D;
  armR: THREE.Object3D;
  elbowR: THREE.Object3D;
  legL: THREE.Object3D;
  kneeL: THREE.Object3D;
  legR: THREE.Object3D;
  kneeR: THREE.Object3D;
}

interface KinematicState {
  rollL: number;
  pitchL: number;
  elbowL: number;
  rollR: number;
  pitchR: number;
  elbowR: number;
  torsoRoll: number;
  headYaw: number;
}

const SKELETON_PAIRS: [number, number, number][] = [
  // Facial constellation (Sky & Violet)
  [0, 1, 0x38bdf8], // nose -> eyeL
  [0, 2, 0x38bdf8], // nose -> eyeR
  [1, 3, 0xc084fc], // eyeL -> earL
  [2, 4, 0xc084fc], // eyeR -> earR
  // Torso & Shoulders (Cyan & Sky)
  [5, 6, 0x06b6d4], // shoulderL -> shoulderR
  [5, 11, 0x06b6d4], // shoulderL -> hipL
  [6, 12, 0x06b6d4], // shoulderR -> hipR
  [11, 12, 0x10b981], // hipL -> hipR (Emerald)
  // Left Arm (Electric Sky)
  [5, 7, 0x22d3ee], // shoulderL -> elbowL
  [7, 9, 0x22d3ee], // elbowL -> wristL
  // Right Arm (Electric Sky)
  [6, 8, 0x22d3ee], // shoulderR -> elbowR
  [8, 10, 0x22d3ee], // elbowR -> wristR
  // Left Leg (Amber)
  [11, 13, 0xf59e0b], // hipL -> kneeL
  [13, 15, 0xf59e0b], // kneeL -> ankleL
  // Right Leg (Highway Orange)
  [12, 14, 0xf97316], // hipR -> kneeR
  [14, 16, 0xf97316], // kneeR -> ankleR
];

interface Actor {
  group: THREE.Group;
  meshes: Record<string, THREE.Object3D>;
  currentLabel: string;
  lastSeen: number;
  targetPos: THREE.Vector3;
  targetYaw: number;
  limbs?: ActorLimbs;
  animSeed: number;
  isSeated: boolean;
  seatedBlend: number;
  hasLivePose: boolean;
  postureText: string;
  poseTarget: KinematicState;
  poseCurrent: KinematicState;
  skeletonGroup?: THREE.Group;
  skeletonJoints?: THREE.Mesh[];
  skeletonBones?: THREE.Mesh[];
  smplMesh?: THREE.Object3D;
  smplBones?: Record<string, THREE.Bone>;
  proceduralMesh?: THREE.Object3D;
  humanObjMesh?: THREE.Object3D;
  pedBoxMesh?: THREE.Mesh;
  pedEdgesMesh?: THREE.LineSegments;
  pedRingMesh?: THREE.Mesh;
  sensorProvenance?: string;
  lastPoseItem?: HumanPoseItem;
}

const CLASS_COLORS: Record<string, number> = {
  CAR: 0x94a3b8,
  TRUCK: 0x64748b,
  BUS: 0x64748b,
  MOTORCYCLE: 0x34d399,
  BICYCLE: 0x34d399,
  PEDESTRIAN: 0x94a3b8, // SMPL slate-grey
  CONE: 0xf97316,
  BOX: 0xf97316,
  UNKNOWN: 0x9ca3af,
};

export class SurroundingTraffic {
  public group: THREE.Group;

  // Dynamic pool for live ROS 2 perception objects
  private actors: Map<string, Actor> = new Map();
  private labelMaterials: Map<string, THREE.SpriteMaterial> = new Map();
  private animTime = 0;
  private smplTemplate: THREE.Group | null = null;
  private isSmplLoaded = false;
  private humanModelTemplate: THREE.Group | null = null;
  private isHumanModelLoaded = false;
  private mhr: MhrHuman;

  // Shared Materials
  private pedMat: THREE.MeshStandardMaterial;
  private pedAccentMat: THREE.MeshStandardMaterial;
  private pedVisorMat: THREE.MeshStandardMaterial;
  private pedShadowMat: THREE.MeshBasicMaterial;
  private pedHazardMat: THREE.MeshBasicMaterial;

  // RViz Multi-Modal Semantic Materials
  private pedFusedMat: THREE.MeshStandardMaterial;
  private pedLidarMat: THREE.MeshStandardMaterial;
  private pedCameraMat: THREE.MeshStandardMaterial;

  // RTMPose-s 17-Keypoint Glowing Emissive Materials
  private jointCyanMat: THREE.MeshBasicMaterial;
  private jointSkyMat: THREE.MeshBasicMaterial;
  private jointVioletMat: THREE.MeshBasicMaterial;
  private jointEmeraldMat: THREE.MeshBasicMaterial;
  private jointAmberMat: THREE.MeshBasicMaterial;
  private jointOrangeMat: THREE.MeshBasicMaterial;

  private boneCyanMat: THREE.MeshBasicMaterial;
  private boneSkyMat: THREE.MeshBasicMaterial;
  private boneVioletMat: THREE.MeshBasicMaterial;
  private boneEmeraldMat: THREE.MeshBasicMaterial;
  private boneAmberMat: THREE.MeshBasicMaterial;
  private boneOrangeMat: THREE.MeshBasicMaterial;
  private boneCylinderGeo: THREE.CylinderGeometry;

  private carPaintMat: THREE.MeshStandardMaterial;
  private carGlassMat: THREE.MeshStandardMaterial;
  private truckPaintMat: THREE.MeshStandardMaterial;

  private coneOrangeMat: THREE.MeshStandardMaterial;
  private coneWhiteMat: THREE.MeshStandardMaterial;
  private coneBaseMat: THREE.MeshStandardMaterial;
  private obstacleMat: THREE.MeshStandardMaterial;
  private obstacleRingMat: THREE.MeshBasicMaterial;

  private headlightMat: THREE.MeshBasicMaterial;
  private taillightMat: THREE.MeshBasicMaterial;
  private wheelTireMat: THREE.MeshStandardMaterial;
  private wheelRimMat: THREE.MeshStandardMaterial;
  private shadowMat: THREE.MeshBasicMaterial;

  // Shared Geometries
  private shadowCircleGeo: THREE.CircleGeometry;
  private wheelTireGeo: THREE.CylinderGeometry;
  private wheelRimGeo: THREE.CylinderGeometry;

  // Pedestrian Geometries (SMPL-derived Anatomical Humanoid Mesh)
  private pedHeadGeo: THREE.SphereGeometry;
  private pedVisorGeo: THREE.BoxGeometry;
  private pedNeckGeo: THREE.CylinderGeometry;
  private pedChestGeo: THREE.CapsuleGeometry;
  private pedAbdomenGeo: THREE.CapsuleGeometry;
  private pedPelvisGeo: THREE.CapsuleGeometry;
  private pedUpperArmGeo: THREE.CapsuleGeometry;
  private pedForeArmGeo: THREE.CapsuleGeometry;
  private pedHandGeo: THREE.BoxGeometry;
  private pedThighGeo: THREE.CapsuleGeometry;
  private pedShinGeo: THREE.CapsuleGeometry;
  private pedFootGeo: THREE.BoxGeometry;

  // Cone Geometries
  private coneBaseGeo: THREE.BoxGeometry;
  private coneBodyGeo: THREE.CylinderGeometry;
  private coneReflectGeo: THREE.CylinderGeometry;

  constructor() {
    this.group = new THREE.Group();

    // Optional Meta Momentum Human Rig (MHR) renderer; fail-soft if the backend
    // has no MHR assets (procedural pedestrian meshes remain authoritative).
    this.mhr = new MhrHuman();
    this.group.add(this.mhr.group);

    // 1. Shared Materials (Automotive Digital Cockpit Palette)
    // Sleek automotive ADAS pedestrian avatar palette (clothed athletic styling, zero nudity)
    this.pedMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Slate-600 tailored jacket/body tone
      roughness: 0.55,
      metalness: 0.20,
      transparent: false,
    });
    this.pedAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Slate-900 footwear & cuff accents
      roughness: 0.70,
      metalness: 0.15,
      transparent: false,
    });
    this.pedVisorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sky-400 subtle sensor visor
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x0284c7,
      emissiveIntensity: 1.5,
    });
    this.pedShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    this.pedHazardMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });

    // RViz Multi-Modal Semantic Materials
    this.pedFusedMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff, // Vivid Cyan / Teal (#00E5FF)
      roughness: 0.35,
      metalness: 0.25,
      emissive: 0x003344,
      emissiveIntensity: 0.4,
    });
    this.pedLidarMat = new THREE.MeshStandardMaterial({
      color: 0xff8c00, // High-vis Highway Orange (#FF8C00)
      roughness: 0.35,
      metalness: 0.25,
      emissive: 0x442200,
      emissiveIntensity: 0.4,
    });
    this.pedCameraMat = new THREE.MeshStandardMaterial({
      color: 0xffe600, // Electric Yellow (#FFE600)
      roughness: 0.35,
      metalness: 0.25,
      emissive: 0x443b00,
      emissiveIntensity: 0.4,
    });

    this.carPaintMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Satin metallic slate/silver
      roughness: 0.25,
      metalness: 0.55,
    });
    this.carGlassMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
    });

    this.truckPaintMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.45,
    });

    this.coneOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Vibrant safety highway orange
      roughness: 0.4,
      metalness: 0.05,
    });
    this.coneWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Reflective white collar
      roughness: 0.2,
      metalness: 0.1,
    });
    this.coneBaseMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8,
      metalness: 0.1,
    });

    this.obstacleMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Neutral slate gray mass
      roughness: 0.45,
      metalness: 0.25,
    });
    this.obstacleRingMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });

    this.headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    this.wheelTireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85, metalness: 0.1 });
    this.wheelRimMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.2, metalness: 0.85 });
    this.shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false });

    // RTMPose-s 17-Keypoint Glowing Emissive Materials
    this.jointCyanMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, depthTest: false, transparent: true, opacity: 0.95 });
    this.jointSkyMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, depthTest: false, transparent: true, opacity: 0.95 });
    this.jointVioletMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, depthTest: false, transparent: true, opacity: 0.95 });
    this.jointEmeraldMat = new THREE.MeshBasicMaterial({ color: 0x10b981, depthTest: false, transparent: true, opacity: 0.95 });
    this.jointAmberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, depthTest: false, transparent: true, opacity: 0.95 });
    this.jointOrangeMat = new THREE.MeshBasicMaterial({ color: 0xf97316, depthTest: false, transparent: true, opacity: 0.95 });

    this.boneCyanMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, depthTest: false, transparent: true, opacity: 0.90 });
    this.boneSkyMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, depthTest: false, transparent: true, opacity: 0.90 });
    this.boneVioletMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, depthTest: false, transparent: true, opacity: 0.90 });
    this.boneEmeraldMat = new THREE.MeshBasicMaterial({ color: 0x10b981, depthTest: false, transparent: true, opacity: 0.90 });
    this.boneAmberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, depthTest: false, transparent: true, opacity: 0.90 });
    this.boneOrangeMat = new THREE.MeshBasicMaterial({ color: 0xf97316, depthTest: false, transparent: true, opacity: 0.90 });
    this.boneCylinderGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.0, 8);

    // 2. Shared Geometries
    this.shadowCircleGeo = new THREE.CircleGeometry(0.35, 18);
    this.shadowCircleGeo.rotateX(-Math.PI / 2);

    this.wheelTireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16);
    this.wheelTireGeo.rotateZ(Math.PI / 2);
    this.wheelRimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.23, 16);
    this.wheelRimGeo.rotateZ(Math.PI / 2);

    // Pedestrian Geometries (Anatomical Sculpted SMPL Humanoid Mesh)
    this.pedHeadGeo = new THREE.SphereGeometry(0.105, 24, 24);
    this.pedHeadGeo.scale(0.85, 1.16, 1.02);
    this.pedVisorGeo = new THREE.BoxGeometry(0.13, 0.035, 0.06);
    this.pedNeckGeo = new THREE.CylinderGeometry(0.048, 0.062, 0.09, 16);
    this.pedChestGeo = new THREE.CapsuleGeometry(0.125, 0.22, 16, 20);
    this.pedChestGeo.scale(1.26, 1.0, 0.86);
    this.pedAbdomenGeo = new THREE.CapsuleGeometry(0.105, 0.16, 16, 20);
    this.pedAbdomenGeo.scale(1.10, 1.0, 0.86);
    this.pedPelvisGeo = new THREE.CapsuleGeometry(0.118, 0.14, 16, 20);
    this.pedPelvisGeo.scale(1.14, 1.0, 0.90);
    this.pedUpperArmGeo = new THREE.CapsuleGeometry(0.040, 0.24, 12, 16);
    this.pedForeArmGeo = new THREE.CapsuleGeometry(0.032, 0.22, 12, 16);
    this.pedHandGeo = new THREE.BoxGeometry(0.026, 0.08, 0.065);
    this.pedThighGeo = new THREE.CapsuleGeometry(0.060, 0.36, 12, 18);
    this.pedShinGeo = new THREE.CapsuleGeometry(0.044, 0.34, 12, 18);
    this.pedFootGeo = new THREE.BoxGeometry(0.075, 0.05, 0.22);

    // Traffic Cone Geometries
    this.coneBaseGeo = new THREE.BoxGeometry(0.38, 0.04, 0.38);
    this.coneBodyGeo = new THREE.CylinderGeometry(0.035, 0.18, 0.65, 20);
    this.coneReflectGeo = new THREE.CylinderGeometry(0.08, 0.13, 0.16, 20);

    // Load authentic 3D human body mesh (human_model.obj) matching RViz2
    this.loadHumanModelTemplate();

    // Load the rigged SMPL/MHR pedestrian mesh (bones named m_avg_*). The
    // procedural avatar (clothed ADAS silhouette + 17-joint RTMPose-s rig) is the
    // immediate fallback; any actor built before the asset resolves is upgraded
    // in place, so exactly one pedestrian renderer is ever active per actor.
    this.loadSmplTemplate();
  }

  /**
   * Loads the authentic 3D human body mesh (human_model.obj) used by RViz2.
   * Maps ROS coordinates (+X forward, +Y left, +Z up) into Three.js (-Z forward, -X left, +Y up).
   */
  private loadHumanModelTemplate(): void {
    const loader = new OBJLoader();
    loader.load(
      '/models/human_model.obj',
      (group) => {
        // Map ROS (+X fwd, +Y left, +Z up) to Three.js (-Z fwd, -X left, +Y up):
        // X_three = -Y_ros, Y_three = +Z_ros, Z_three = -X_ros
        const rotMat = new THREE.Matrix4().set(
          0, -1,  0, 0,
          0,  0,  1, 0,
         -1,  0,  0, 0,
          0,  0,  0, 1
        );
        group.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.geometry.applyMatrix4(rotMat);
            m.geometry.computeVertexNormals();
            m.castShadow = true;
            m.receiveShadow = true;
            m.material = this.pedFusedMat;
          }
        });
        group.name = 'HumanModel_OBJ';
        this.humanModelTemplate = group;
        this.isHumanModelLoaded = true;

        for (const actor of this.actors.values()) {
          if (actor.currentLabel === 'PEDESTRIAN') {
            this.upgradeActorHumanMesh(actor);
          }
        }
      },
      undefined,
      (err) => {
        console.warn('[SurroundingTraffic] human_model.obj load error:', err);
      }
    );
  }

  private upgradeActorHumanMesh(actor: Actor): void {
    if (!this.humanModelTemplate) return;
    const pedRoot = actor.meshes['PEDESTRIAN'] as THREE.Group | undefined;
    if (!pedRoot) return;

    if (!actor.humanObjMesh) {
      const cloned = this.humanModelTemplate.clone(true);
      actor.humanObjMesh = cloned;
      pedRoot.add(cloned);
      this.applySemanticThemeToActor(actor, actor.sensorProvenance || 'fused');
    }

    if (actor.proceduralMesh) {
      actor.proceduralMesh.visible = false;
    }
  }

  /**
   * Dynamically applies multi-modal semantic colors (Cyan/Fused, Orange/LiDAR, Yellow/Camera)
   * across the 3D human mesh, volumetric bounding box, wireframe edges, and ground ring.
   */
  private applySemanticThemeToActor(actor: Actor, provenance: string) {
    let mat = this.pedFusedMat;
    let colorHex = 0x00e5ff;
    let edgeHex = 0x38bdf8;
    if (provenance === 'lidar') {
      mat = this.pedLidarMat;
      colorHex = 0xff8c00;
      edgeHex = 0xfba04b;
    } else if (provenance === 'camera') {
      mat = this.pedCameraMat;
      colorHex = 0xffe600;
      edgeHex = 0xfef08a;
    }

    if (actor.humanObjMesh) {
      actor.humanObjMesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = mat;
        }
      });
    }
    if (actor.smplMesh) {
      actor.smplMesh.traverse((child) => {
        if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
          (child as THREE.SkinnedMesh).material = mat;
        }
      });
    }
    if (actor.proceduralMesh) {
      actor.proceduralMesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && child.name !== 'Head' && !child.name.includes('Visor')) {
          (child as THREE.Mesh).material = mat;
        }
      });
    }
    if (actor.pedBoxMesh) {
      (actor.pedBoxMesh.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
    }
    if (actor.pedEdgesMesh) {
      (actor.pedEdgesMesh.material as THREE.LineBasicMaterial).color.setHex(edgeHex);
    }
    if (actor.pedRingMesh) {
      (actor.pedRingMesh.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
    }
  }

  /**
   * Loads the rigged SMPL/MHR pedestrian GLB from /models and upgrades any
   * pedestrians that were already spawned with the procedural fallback.
   */
  private loadSmplTemplate(): void {
    const loader = new GLTFLoader();
    loader.load(
      '/models/pedestrian_smpl.glb',
      (gltf) => {
        this.smplTemplate = gltf.scene as unknown as THREE.Group;
        this.isSmplLoaded = true;
        for (const actor of this.actors.values()) {
          if (actor.currentLabel === 'PEDESTRIAN') {
            this.upgradeActorToSmpl(actor);
          }
        }
      },
      undefined,
      (err) => {
        console.warn('[SurroundingTraffic] SMPL pedestrian mesh unavailable, using procedural avatar:', err);
      }
    );
  }

  /**
   * Upgrades an existing procedural actor to the loaded SMPL GLB mesh.
   */
  private upgradeActorToSmpl(actor: Actor) {
    if (!this.smplTemplate) return;
    const oldPedMesh = actor.meshes['PEDESTRIAN'];
    if (oldPedMesh) {
      actor.group.remove(oldPedMesh);
      this.disposeHierarchy(oldPedMesh);
    }
    const { mesh: newMesh, limbs, smplMesh, smplBones, proceduralMesh, humanObjMesh, pedBox, pedEdges, pedRing } = this.createPedestrianMesh();
    const { group: skelGroup, joints: skelJoints, bones: skelBones } = this.createRTMPoseSkeletonOverlay();
    newMesh.add(skelGroup);

    actor.meshes['PEDESTRIAN'] = newMesh;
    actor.limbs = limbs;
    actor.smplMesh = smplMesh;
    actor.smplBones = smplBones;
    actor.proceduralMesh = proceduralMesh;
    actor.humanObjMesh = humanObjMesh;
    actor.pedBoxMesh = pedBox;
    actor.pedEdgesMesh = pedEdges;
    actor.pedRingMesh = pedRing;
    actor.skeletonGroup = skelGroup;
    actor.skeletonJoints = skelJoints;
    actor.skeletonBones = skelBones;
    actor.group.add(newMesh);
    newMesh.visible = actor.currentLabel === 'PEDESTRIAN';
    this.applySemanticThemeToActor(actor, actor.sensorProvenance || 'fused');
  }

  private disposeHierarchy(obj: THREE.Object3D) {
    obj.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
  }

  /**
   * Constructs the 17-keypoint glowing skeletal rig representing live RTMPose-s tracking.
   * Uses 17 glowing neon joint beacons and 16 3D cylindrical bone linkages with depthTest: false.
   */
  private createRTMPoseSkeletonOverlay(): { group: THREE.Group; joints: THREE.Mesh[]; bones: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = 'RTMPose_17Keypoint_Rig';
    group.renderOrder = 150;

    const jointMatMap = [
      this.jointCyanMat,   // 0: Nose
      this.jointSkyMat,    // 1: EyeL
      this.jointSkyMat,    // 2: EyeR
      this.jointVioletMat, // 3: EarL
      this.jointVioletMat, // 4: EarR
      this.jointCyanMat,   // 5: ShoulderL
      this.jointCyanMat,   // 6: ShoulderR
      this.jointSkyMat,    // 7: ElbowL
      this.jointSkyMat,    // 8: ElbowR
      this.jointEmeraldMat,// 9: WristL
      this.jointEmeraldMat,// 10: WristR
      this.jointEmeraldMat,// 11: HipL
      this.jointEmeraldMat,// 12: HipR
      this.jointAmberMat,  // 13: KneeL
      this.jointAmberMat,  // 14: KneeR
      this.jointOrangeMat, // 15: AnkleL
      this.jointOrangeMat, // 16: AnkleR
    ];

    const sphereGeo = new THREE.SphereGeometry(0.038, 12, 12);
    const joints: THREE.Mesh[] = [];

    for (let i = 0; i < 17; i++) {
      const jMesh = new THREE.Mesh(sphereGeo, jointMatMap[i] || this.jointCyanMat);
      jMesh.name = `RTMPose_J_${i}`;
      jMesh.renderOrder = 155;
      group.add(jMesh);
      joints.push(jMesh);
    }

    // 16 3D Kinematic Bone Linkage Cylinders
    const boneMatMap = [
      this.boneSkyMat,     // 0: nose -> eyeL
      this.boneSkyMat,     // 1: nose -> eyeR
      this.boneVioletMat,  // 2: eyeL -> earL
      this.boneVioletMat,  // 3: eyeR -> earR
      this.boneCyanMat,    // 4: shoulderL -> shoulderR
      this.boneCyanMat,    // 5: shoulderL -> hipL
      this.boneCyanMat,    // 6: shoulderR -> hipR
      this.boneEmeraldMat, // 7: hipL -> hipR
      this.boneSkyMat,     // 8: shoulderL -> elbowL
      this.boneSkyMat,     // 9: elbowL -> wristL
      this.boneSkyMat,     // 10: shoulderR -> elbowR
      this.boneSkyMat,     // 11: elbowR -> wristR
      this.boneAmberMat,   // 12: hipL -> kneeL
      this.boneAmberMat,   // 13: kneeL -> ankleL
      this.boneOrangeMat,  // 14: hipR -> kneeR
      this.boneOrangeMat,  // 15: kneeR -> ankleR
    ];

    const bones: THREE.Mesh[] = [];
    for (let i = 0; i < SKELETON_PAIRS.length; i++) {
      const bMesh = new THREE.Mesh(this.boneCylinderGeo, boneMatMap[i] || this.boneSkyMat);
      bMesh.name = `RTMPose_Bone_${i}`;
      bMesh.renderOrder = 150;
      bMesh.visible = false;
      group.add(bMesh);
      bones.push(bMesh);
    }

    return { group, joints, bones };
  }

  /**
   * Builds an articulated SMPL humanoid model with athletic proportions and rigged pivots for RTMPose-s.
   */
  private createPedestrianMesh(): {
    mesh: THREE.Group;
    limbs: ActorLimbs;
    smplMesh?: THREE.Object3D;
    smplBones?: Record<string, THREE.Bone>;
    proceduralMesh?: THREE.Object3D;
    humanObjMesh?: THREE.Object3D;
    pedBox?: THREE.Mesh;
    pedEdges?: THREE.LineSegments;
    pedRing?: THREE.Mesh;
  } {
    const ped = new THREE.Group();

    // 1. Ground Contact Shadow
    const shadow = new THREE.Mesh(this.shadowCircleGeo, this.pedShadowMat);
    shadow.position.set(0, 0.02, 0);
    ped.add(shadow);

    // 2. Volumetric 3D Bounding Box & Wireframe Edges (RViz-grade)
    const boxGeo = new THREE.BoxGeometry(0.70, 1.80, 0.70);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      roughness: 0.25,
      metalness: 0.75,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const pedBox = new THREE.Mesh(boxGeo, boxMat);
    pedBox.position.y = 0.90;
    ped.add(pedBox);

    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const pedEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    pedEdges.position.y = 0.90;
    ped.add(pedEdges);

    // 3. Ground Contact Ring
    const ringGeo = new THREE.RingGeometry(0.35, 0.52, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pedRing = new THREE.Mesh(ringGeo, ringMat);
    pedRing.position.y = 0.02;
    ped.add(pedRing);

    // 4. Authentic 3D Human Body Mesh (RViz human_model.obj)
    let humanObjMesh: THREE.Object3D | undefined;
    if (this.humanModelTemplate) {
      humanObjMesh = this.humanModelTemplate.clone(true);
      ped.add(humanObjMesh);
    }

    // 2. Rigged Skinned SMPL Humanoid Mesh (25 Bones, Linear Blend Skinning)
    let smplMesh: THREE.Object3D | undefined;
    let smplBones: Record<string, THREE.Bone> | undefined;
    if (this.smplTemplate) {
      smplMesh = SkeletonUtils.clone(this.smplTemplate);
      smplMesh.name = 'SMPL_Rigged_Mesh';
      smplMesh.scale.setScalar(0.0096);
      smplMesh.rotation.y = Math.PI;

      const bones: Record<string, THREE.Bone> = {};
      smplMesh.traverse((child) => {
        if ((child as THREE.Bone).isBone) {
          bones[child.name] = child as THREE.Bone;
        }
        if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
          const m = child as THREE.SkinnedMesh;
          m.castShadow = true;
          m.receiveShadow = true;
          m.material = this.pedMat;
        }
      });
      smplBones = bones;
      ped.add(smplMesh);
    }

    // 3. Anatomical Articulated Limb Hierarchy (Procedural Kinematic Driver)
    const bodyRoot = new THREE.Group();
    bodyRoot.position.set(0, 0, 0);
    ped.add(bodyRoot);

    const hips = new THREE.Group();
    hips.name = 'Hips';
    hips.position.set(0, 0.86, 0);
    bodyRoot.add(hips);

    const pelvis = new THREE.Mesh(this.pedPelvisGeo, this.pedMat);
    pelvis.position.set(0, 0, 0);
    hips.add(pelvis);

    const torsoGroup = new THREE.Group();
    torsoGroup.name = 'Spine';
    torsoGroup.position.set(0, 0.08, 0);
    hips.add(torsoGroup);

    const abdomen = new THREE.Mesh(this.pedAbdomenGeo, this.pedMat);
    abdomen.position.set(0, 0.08, 0);
    torsoGroup.add(abdomen);

    const chest = new THREE.Mesh(this.pedChestGeo, this.pedMat);
    chest.name = 'Chest';
    chest.position.set(0, 0.26, 0);
    torsoGroup.add(chest);

    const neck = new THREE.Mesh(this.pedNeckGeo, this.pedAccentMat);
    neck.name = 'Neck';
    neck.position.set(0, 0.42, 0);
    torsoGroup.add(neck);

    const head = new THREE.Mesh(this.pedHeadGeo, this.pedMat);
    head.name = 'Head';
    head.position.set(0, 0.54, 0);
    const visor = new THREE.Mesh(this.pedVisorGeo, this.pedVisorMat);
    visor.position.set(0, 0.01, -0.09);
    head.add(visor);
    torsoGroup.add(head);

    // Left Arm (pivot at shoulder)
    const armL = new THREE.Group();
    armL.name = 'LeftArm';
    armL.position.set(-0.19, 0.36, 0);
    const upperArmL = new THREE.Mesh(this.pedUpperArmGeo, this.pedMat);
    upperArmL.position.set(0, -0.12, 0);
    armL.add(upperArmL);

    const elbowL = new THREE.Group();
    elbowL.name = 'LeftForeArm';
    elbowL.position.set(0, -0.24, 0);
    const foreArmL = new THREE.Mesh(this.pedForeArmGeo, this.pedMat);
    foreArmL.position.set(0, -0.11, 0);
    elbowL.add(foreArmL);
    const handL = new THREE.Mesh(this.pedHandGeo, this.pedAccentMat);
    handL.position.set(0, -0.24, 0);
    elbowL.add(handL);
    armL.add(elbowL);
    torsoGroup.add(armL);

    // Right Arm (pivot at shoulder)
    const armR = new THREE.Group();
    armR.name = 'RightArm';
    armR.position.set(0.19, 0.36, 0);
    const upperArmR = new THREE.Mesh(this.pedUpperArmGeo, this.pedMat);
    upperArmR.position.set(0, -0.12, 0);
    armR.add(upperArmR);

    const elbowR = new THREE.Group();
    elbowR.name = 'RightForeArm';
    elbowR.position.set(0, -0.24, 0);
    const foreArmR = new THREE.Mesh(this.pedForeArmGeo, this.pedMat);
    foreArmR.position.set(0, -0.11, 0);
    elbowR.add(foreArmR);
    const handR = new THREE.Mesh(this.pedHandGeo, this.pedAccentMat);
    handR.position.set(0, -0.24, 0);
    elbowR.add(handR);
    armR.add(elbowR);
    torsoGroup.add(armR);

    // Left Leg (pivot at hip)
    const legL = new THREE.Group();
    legL.name = 'LeftUpLeg';
    legL.position.set(-0.095, -0.05, 0);
    const thighL = new THREE.Mesh(this.pedThighGeo, this.pedMat);
    thighL.position.set(0, -0.18, 0);
    legL.add(thighL);

    const kneeL = new THREE.Group();
    kneeL.name = 'LeftLeg';
    kneeL.position.set(0, -0.36, 0);
    const shinL = new THREE.Mesh(this.pedShinGeo, this.pedMat);
    shinL.position.set(0, -0.17, 0);
    kneeL.add(shinL);
    const footL = new THREE.Mesh(this.pedFootGeo, this.pedAccentMat);
    footL.position.set(0, -0.35, 0.04);
    kneeL.add(footL);
    legL.add(kneeL);
    hips.add(legL);

    // Right Leg (pivot at hip)
    const legR = new THREE.Group();
    legR.name = 'RightUpLeg';
    legR.position.set(0.095, -0.05, 0);
    const thighR = new THREE.Mesh(this.pedThighGeo, this.pedMat);
    thighR.position.set(0, -0.18, 0);
    legR.add(thighR);

    const kneeR = new THREE.Group();
    kneeR.name = 'RightLeg';
    kneeR.position.set(0, -0.36, 0);
    const shinR = new THREE.Mesh(this.pedShinGeo, this.pedMat);
    shinR.position.set(0, -0.17, 0);
    kneeR.add(shinR);
    const footR = new THREE.Mesh(this.pedFootGeo, this.pedAccentMat);
    footR.position.set(0, -0.35, 0.04);
    kneeR.add(footR);
    legR.add(kneeR);
    hips.add(legR);

    const result = {
      mesh: ped,
      limbs: {
        bodyRoot,
        hips,
        spine: torsoGroup,
        chest,
        neck,
        head,
        armL,
        elbowL,
        armR,
        elbowR,
        legL,
        kneeL,
        legR,
        kneeR,
      },
      smplMesh,
      smplBones,
      proceduralMesh: bodyRoot,
      humanObjMesh,
      pedBox,
      pedEdges,
      pedRing,
    };

    if (humanObjMesh) {
      if (smplMesh) smplMesh.visible = false;
      bodyRoot.visible = false;
    }

    return result;
  }

  /**
   * Builds a high-visibility highway safety traffic cone.
   */
  private createConeMesh(): THREE.Group {
    const cone = new THREE.Group();

    // Base square rubber plate
    const base = new THREE.Mesh(this.coneBaseGeo, this.coneBaseMat);
    base.position.set(0, 0.02, 0);
    cone.add(base);

    // Tapered highway orange cone body
    const body = new THREE.Mesh(this.coneBodyGeo, this.coneOrangeMat);
    body.position.set(0, 0.35, 0);
    cone.add(body);

    // White reflective collar band
    const collar = new THREE.Mesh(this.coneReflectGeo, this.coneWhiteMat);
    collar.position.set(0, 0.36, 0);
    cone.add(collar);

    // Ground contact shadow
    const shadowGeo = new THREE.CircleGeometry(0.25, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadow = new THREE.Mesh(shadowGeo, this.shadowMat);
    shadow.position.set(0, 0.01, 0);
    cone.add(shadow);

    return cone;
  }

  /**
   * Builds a clean, neutral, low-poly physical obstacle shape (representing inanimate lab objects, furniture, boxes).
   */
  private createObstacleMesh(): THREE.Group {
    const group = new THREE.Group();
    // Neutral rounded cylinder marker representing generic physical mass
    const geo = new THREE.CylinderGeometry(0.34, 0.36, 0.75, 18);
    const body = new THREE.Mesh(geo, this.obstacleMat);
    body.position.set(0, 0.375, 0);
    body.name = 'obstacle_body';
    group.add(body);

    // Subtle crown ring for automotive depth
    const ringGeo = new THREE.TorusGeometry(0.34, 0.02, 8, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, this.obstacleRingMat);
    ring.position.set(0, 0.75, 0);
    ring.name = 'obstacle_ring';
    group.add(ring);

    // Ground contact shadow
    const shadowGeo = new THREE.CircleGeometry(0.4, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadow = new THREE.Mesh(shadowGeo, this.shadowMat);
    shadow.position.set(0, 0.01, 0);
    group.add(shadow);
    return group;
  }

  /**
   * Builds an aerodynamic passenger car sedan mesh.
   */
  private createCarMesh(): THREE.Group {
    const car = new THREE.Group();

    // 1. Lower chassis body (aerodynamic slab)
    const lowerBodyGeo = new THREE.BoxGeometry(1.85, 0.52, 4.3);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, this.carPaintMat);
    lowerBody.position.set(0, 0.52, 0);
    car.add(lowerBody);

    // 2. Sloping Hood / Nose
    const hoodGeo = new THREE.BoxGeometry(1.8, 0.28, 1.4);
    const hood = new THREE.Mesh(hoodGeo, this.carPaintMat);
    hood.position.set(0, 0.62, -1.4);
    hood.rotation.x = 0.08;
    car.add(hood);

    // 3. Curved Glass Canopy / Greenhouse
    const cabinGeo = new THREE.BoxGeometry(1.5, 0.52, 2.3);
    const cabin = new THREE.Mesh(cabinGeo, this.carGlassMat);
    cabin.position.set(0, 0.98, -0.15);
    car.add(cabin);

    // 4. Wheels with aerodynamic rims
    for (const [wx, wz] of [
      [0.96, -1.3],
      [-0.96, -1.3],
      [0.96, 1.3],
      [-0.96, 1.3],
    ]) {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.34, wz);

      const tire = new THREE.Mesh(this.wheelTireGeo, this.wheelTireMat);
      wheelGroup.add(tire);
      const rim = new THREE.Mesh(this.wheelRimGeo, this.wheelRimMat);
      wheelGroup.add(rim);

      car.add(wheelGroup);
    }

    // 5. Front LED Lightbar
    const hlGeo = new THREE.BoxGeometry(1.6, 0.08, 0.05);
    const hl = new THREE.Mesh(hlGeo, this.headlightMat);
    hl.position.set(0, 0.55, -2.16);
    car.add(hl);

    // 6. Rear LED Taillight Bar
    const tlGeo = new THREE.BoxGeometry(1.6, 0.08, 0.05);
    const tl = new THREE.Mesh(tlGeo, this.taillightMat);
    tl.position.set(0, 0.65, 2.16);
    car.add(tl);

    // 7. Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.1, 4.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadow = new THREE.Mesh(shadowGeo, this.shadowMat);
    shadow.position.set(0, 0.02, 0);
    car.add(shadow);

    return car;
  }

  /**
   * Builds a sleek modern delivery van / transit bus.
   */
  private createTruckMesh(): THREE.Group {
    const truck = new THREE.Group();

    // Body cargo box
    const bodyGeo = new THREE.BoxGeometry(2.3, 2.3, 6.4);
    const body = new THREE.Mesh(bodyGeo, this.truckPaintMat);
    body.position.set(0, 1.5, 0.4);
    truck.add(body);

    // Front aerodynamic cab
    const cabGeo = new THREE.BoxGeometry(2.2, 1.6, 1.8);
    const cab = new THREE.Mesh(cabGeo, this.truckPaintMat);
    cab.position.set(0, 1.15, -2.9);
    truck.add(cab);

    // Windshield
    const glassGeo = new THREE.BoxGeometry(2.1, 0.75, 0.6);
    const glass = new THREE.Mesh(glassGeo, this.carGlassMat);
    glass.position.set(0, 1.45, -3.45);
    truck.add(glass);

    // 4 Heavy wheels
    for (const [wx, wz] of [
      [1.2, -2.8],
      [-1.2, -2.8],
      [1.2, 2.2],
      [-1.2, 2.2],
    ]) {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.46, wz);
      wheelGroup.scale.setScalar(1.35);

      const tire = new THREE.Mesh(this.wheelTireGeo, this.wheelTireMat);
      wheelGroup.add(tire);
      const rim = new THREE.Mesh(this.wheelRimGeo, this.wheelRimMat);
      wheelGroup.add(rim);

      truck.add(wheelGroup);
    }

    // Taillights
    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.05), this.taillightMat);
    tlL.position.set(0.85, 0.8, 3.61);
    truck.add(tlL);
    const tlR = tlL.clone();
    tlR.position.x = -0.85;
    truck.add(tlR);

    // Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.6, 7.0);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadow = new THREE.Mesh(shadowGeo, this.shadowMat);
    shadow.position.set(0, 0.02, 0);
    truck.add(shadow);

    return truck;
  }

  /**
   * Builds a two-wheeler with a stylized humanoid rider.
   */
  private createCyclistMesh(): THREE.Group {
    const two = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.4, metalness: 0.6 });

    // Wheels
    const wF = new THREE.Mesh(this.wheelTireGeo, this.wheelTireMat);
    wF.position.set(0, 0.34, -0.75);
    wF.scale.set(0.9, 0.5, 0.9);
    two.add(wF);
    const wR = wF.clone();
    wR.position.z = 0.75;
    two.add(wR);

    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.4), frameMat);
    frame.position.set(0, 0.6, 0);
    two.add(frame);

    // Rider
    const torso = new THREE.Mesh(this.pedChestGeo, this.pedMat);
    torso.position.set(0, 1.1, -0.05);
    torso.rotation.x = 0.25;
    torso.scale.setScalar(0.85);
    two.add(torso);

    const head = new THREE.Mesh(this.pedHeadGeo, this.pedMat);
    head.position.set(0, 1.48, -0.15);
    head.scale.setScalar(0.85);
    two.add(head);

    return two;
  }

  /**
   * Minimalist automotive HUD distance pill (e.g. "[CAM] 2.8 m · STANDING").
   */
  private createDistanceBadge(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.30, 0.195, 1);
    sprite.position.y = 1.90;
    sprite.userData = { canvas, ctx, texture, lastText: '', lastHazard: null };
    return sprite;
  }

  private updateDistanceBadge(sprite: THREE.Sprite, text: string, isHazard: boolean, provenance?: string) {
    const data = sprite.userData;
    if (!data || !data.ctx) return;
    const cacheKey = `${text}_${isHazard}_${provenance || ''}`;
    if (data.lastCacheKey === cacheKey) return;
    data.lastCacheKey = cacheKey;

    const ctx = data.ctx as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 320, 48);

    let borderColor = '#38bdf8';
    let tagBgColor = '#0284c7';
    if (provenance === 'lidar') {
      borderColor = '#ff8c00';
      tagBgColor = '#ea580c';
    } else if (provenance === 'camera') {
      borderColor = '#ffe600';
      tagBgColor = '#ca8a04';
    } else if (provenance === 'fused') {
      borderColor = '#00e5ff';
      tagBgColor = '#0891b2';
    } else if (provenance === 'hazard' || isHazard) {
      borderColor = '#f87171';
      tagBgColor = '#ef4444';
    }

    ctx.fillStyle = isHazard ? 'rgba(220, 38, 38, 0.94)' : 'rgba(10, 18, 30, 0.90)';
    ctx.beginPath();
    const r = 16;
    ctx.moveTo(r, 4);
    ctx.lineTo(320 - r, 4);
    ctx.arcTo(320 - 4, 4, 320 - 4, 44, r);
    ctx.arcTo(320 - 4, 44, 4, 44, r);
    ctx.arcTo(4, 44, 4, 4, r);
    ctx.arcTo(4, 4, 320 - r, 4, r);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.0;
    ctx.stroke();

    const match = text.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      const tag = match[1];
      const remainder = match[2];

      const tagWidth = tag.length * 10 + 16;
      ctx.fillStyle = tagBgColor;
      ctx.beginPath();
      const tr = 8;
      ctx.moveTo(10 + tr, 8);
      ctx.lineTo(10 + tagWidth - tr, 8);
      ctx.arcTo(10 + tagWidth, 8, 10 + tagWidth, 40, tr);
      ctx.arcTo(10 + tagWidth, 40, 10, 40, tr);
      ctx.arcTo(10, 40, 10, 8, tr);
      ctx.arcTo(10, 8, 10 + tagWidth, 8, tr);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tag, 10 + tagWidth / 2, 24);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(remainder, 10 + tagWidth + 10, 24);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 160, 24);
    }

    (data.texture as THREE.CanvasTexture).needsUpdate = true;
  }

  private createClusterMesh(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'LidarCluster';

    // 1. Semi-transparent bounding box with glowing cyan edges
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.25,
      metalness: 0.75,
      transparent: true,
      opacity: 0.35,
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 0.5;
    group.add(box);

    // 2. Glowing wireframe bounding edges
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
    });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    edges.position.y = 0.5;
    group.add(edges);

    // 3. Ground contact ring
    const ringGeo = new THREE.RingGeometry(0.35, 0.55, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.02;
    group.add(ring);

    return group;
  }

  private buildActor(obj: PerceptionObject, seedIndex: number): Actor {
    const group = new THREE.Group();

    // Create pedestrian
    const { mesh: pedMesh, limbs, smplMesh, smplBones, proceduralMesh, humanObjMesh, pedBox, pedEdges, pedRing } = this.createPedestrianMesh();
    const { group: skelGroup, joints: skelJoints, bones: skelBones } = this.createRTMPoseSkeletonOverlay();
    pedMesh.add(skelGroup);

    const meshes: Record<string, THREE.Object3D> = {
      PEDESTRIAN: pedMesh,
      CONE: this.createConeMesh(),
      CAR: this.createCarMesh(),
      TRUCK: this.createTruckMesh(),
      BUS: this.createTruckMesh(),
      BICYCLE: this.createCyclistMesh(),
      MOTORCYCLE: this.createCyclistMesh(),
      CLUSTER: this.createClusterMesh(),
    };

    for (const mesh of Object.values(meshes)) {
      group.add(mesh);
    }

    const distBadge = this.createDistanceBadge();
    distBadge.visible = false;
    group.add(distBadge);
    meshes['__dist'] = distBadge;

    this.group.add(group);
    const actor: Actor = {
      group,
      meshes,
      currentLabel: obj.label,
      lastSeen: 0,
      targetPos: new THREE.Vector3(),
      targetYaw: 0,
      limbs,
      animSeed: seedIndex * 1.618,
      isSeated: false,
      seatedBlend: 0,
      hasLivePose: false,
      postureText: 'STANDING',
      poseTarget: { rollL: 0, pitchL: 0, elbowL: 0, rollR: 0, pitchR: 0, elbowR: 0, torsoRoll: 0, headYaw: 0 },
      poseCurrent: { rollL: 0, pitchL: 0, elbowL: 0, rollR: 0, pitchR: 0, elbowR: 0, torsoRoll: 0, headYaw: 0 },
      skeletonGroup: skelGroup,
      skeletonJoints: skelJoints,
      skeletonBones: skelBones,
      smplMesh,
      smplBones,
      proceduralMesh,
      humanObjMesh,
      pedBoxMesh: pedBox,
      pedEdgesMesh: pedEdges,
      pedRingMesh: pedRing,
      sensorProvenance: obj.sensor || (obj.fused ? 'fused' : 'fused'),
    };

    if (obj.label === 'PEDESTRIAN') {
      this.applySemanticThemeToActor(actor, actor.sensorProvenance || 'fused');
    }

    return actor;
  }

  private resolveActiveModel(obj: PerceptionObject): string | null {
    const lbl = String(obj.label);
    if (lbl === 'PEDESTRIAN') return 'PEDESTRIAN';
    if (lbl === 'CAR') return 'CAR';
    if (lbl === 'TRUCK' || lbl === 'BUS') return 'TRUCK';
    if (lbl === 'BICYCLE' || lbl === 'MOTORCYCLE') return 'BICYCLE';
    if (lbl === 'CONE') return 'CONE';
    if (lbl === 'CLUSTER' || lbl === 'UNKNOWN' || lbl === 'OBSTACLE' || lbl === 'BOX') return 'CLUSTER';
    return null;
  }

  private applyClassGeometry(actor: Actor, obj: PerceptionObject) {
    const targetModel = this.resolveActiveModel(obj);
    if (!targetModel) {
      for (const [key, mesh] of Object.entries(actor.meshes)) {
        if (key.startsWith('__')) continue;
        mesh.visible = false;
      }
      return;
    }

    for (const [key, mesh] of Object.entries(actor.meshes)) {
      if (key.startsWith('__')) continue;
      mesh.visible = key === targetModel;
    }

    actor.currentLabel = obj.label;

    const active = actor.meshes[targetModel];
    if (!active) return;

    // Apply natural scaling based on detected dimensions
    const width = obj.dy && obj.dy > 0 ? obj.dy : 1.8;
    const length = obj.dx && obj.dx > 0 ? obj.dx : 4.0;
    const height = obj.dz && obj.dz > 0 ? obj.dz : 1.5;

    if (targetModel === 'PEDESTRIAN') {
      if (actor.skeletonGroup) actor.skeletonGroup.visible = true;
      const hScale = Math.min(Math.max(height / 1.75, 0.8), 1.25);
      active.scale.set(hScale, hScale, hScale);
    } else {
      if (actor.skeletonGroup) actor.skeletonGroup.visible = false;
      if (targetModel === 'CLUSTER') {
        const w = Math.max(width || 1.0, 0.4);
        const l = Math.max(length || 1.0, 0.4);
        const h = Math.max(height || 1.0, 0.4);
        active.scale.set(w, h, l);
      } else if (targetModel === 'CONE') {
        const coneScale = Math.min(Math.max((width + length) / 1.0, 0.8), 1.4);
        active.scale.set(coneScale, coneScale, coneScale);
      } else if (targetModel === 'CAR') {
        active.scale.set(Math.max(width / 1.85, 0.8), Math.max(height / 1.45, 0.8), Math.max(length / 4.3, 0.8));
      }
    }
  }

  private disposeActor(actor: Actor) {
    actor.group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
      if (child.userData && child.userData.texture) {
        (child.userData.texture as THREE.Texture).dispose();
      }
    });
  }

  /**
   * Main per-frame update loop.
   * Renders real-world perception objects with smooth 60 FPS motion and articulated gait/posture cycles.
   */
  public update(
    _egoSpeedKmh: number,
    perceptionList: PerceptionObject[] | undefined,
    _rosActive: boolean,
    dt: number,
    humanPoses?: HumanPosesPayload | null,
    demoPedestrian: boolean = false,
    mhrHuman?: MhrHumanPayload | null
  ) {
    const now = performance.now() / 1000;
    const step = Math.min(dt > 0 ? dt : 0.016, 0.1);
    this.animTime += step;

    const rawPoses = humanPoses?.poses;
    const effectiveList: PerceptionObject[] = [...(perceptionList || [])];
    const rawPosesCount = rawPoses ? rawPoses.length : 0;
    const hasRealPed = effectiveList.some((o) => o.label === 'PEDESTRIAN') || rawPosesCount > 0;

    // Ensure every detected human pose from YOLO26x-Pose / RTMPose has a corresponding PEDESTRIAN actor in effectiveList
    if (rawPoses && rawPoses.length > 0) {
      rawPoses.forEach((pose, pIdx) => {
        const targetX = pose.y_base;
        const targetZ = 1.0 - pose.x_base;
        const alreadyInList = effectiveList.some((obj) => {
          if (obj.label !== 'PEDESTRIAN') return false;
          if (obj.id && pose.id && String(obj.id) === String(pose.id)) return true;
          return Math.hypot(obj.x - targetX, obj.z - targetZ) < 2.0;
        });

        if (!alreadyInList) {
          effectiveList.push({
            id: pose.id || `yolo-ped-${pIdx}`,
            label: 'PEDESTRIAN',
            x: targetX,
            y: 0.0,
            z: targetZ,
            dx: 0.8,
            dy: 0.8,
            dz: 1.75,
            yaw: typeof (pose as any).yaw === 'number' ? (pose as any).yaw : 0.0,
            speed_kmh: 0.0,
          });
        }
      });
    }

    let effectivePoses = rawPoses ? [...rawPoses] : [];

    // Demo Mode: If demoPedestrian is active and no real pedestrians or real poses are present, render interactive SMPL + RTMPose model
    if (demoPedestrian && !hasRealPed) {
      const lookPhase = this.animTime * 1.5;
      const wavePhase = this.animTime * 2.8;
      const isDemoSeated = Math.sin(this.animTime * 0.35) > 0.6;

      const demoObj: PerceptionObject = {
        id: 'demo-smpl-pedestrian',
        label: 'PEDESTRIAN',
        x: 0.22 * Math.sin(lookPhase),
        y: 0.0,
        // 3.8 m ahead of the rear axle (base_link) == 2.8 m ahead of the scene
        // origin (wheelbase center): z = 1.0 - base_x.
        z: -2.8,
        dx: 0.8,
        dy: 0.8,
        dz: 1.75,
        yaw: 0.12 * Math.sin(lookPhase),
        speed_kmh: 0.0,
      };
      effectiveList.push(demoObj);

      effectivePoses.push({
        id: 'demo-smpl-pedestrian',
        x_base: 3.8,
        y_base: 0.0,
        z_base: 0.9,
        posture: isDemoSeated ? 'SEATED' : 'STANDING',
        is_seated: isDemoSeated,
        confidence: 0.98,
        keypoints: {
          nose: { x: 320 + 15 * Math.sin(lookPhase), y: 120 },
          left_shoulder: { x: 285, y: 160 },
          right_shoulder: { x: 355, y: 160 },
          left_elbow: { x: 275 - 10 * Math.sin(wavePhase), y: 215 },
          left_wrist: { x: 265 - 20 * Math.sin(wavePhase), y: 155 - 15 * Math.cos(wavePhase) },
          right_elbow: { x: 365, y: 220 },
          right_wrist: { x: 370, y: 275 },
        },
      });
    }

    const poses = effectivePoses;
    const seen = new Set<string>();
    const usedPoseIds = new Set<string>();

    if (effectiveList && effectiveList.length > 0) {
      effectiveList.forEach((obj, index) => {
        // Suppress unknown obstacle cylinders and generic boxes from 3D cockpit
        if (obj.label === 'UNKNOWN' || (obj.label as string) === 'BOX') {
          const key = String(obj.id || `anon-${index}`);
          const existing = this.actors.get(key);
          if (existing) {
            existing.group.visible = false;
          }
          return;
        }

        const key = String(obj.id || `anon-${index}`);
        seen.add(key);

        const targetY = obj.label === 'PEDESTRIAN' ? 0.0 : (obj.y || 0);

        let actor = this.actors.get(key);
        if (!actor) {
          actor = this.buildActor(obj, index);
          actor.group.position.set(obj.x, targetY, obj.z);
          actor.group.rotation.y = obj.yaw || 0;
          this.actors.set(key, actor);
        }

        actor.lastSeen = now;
        actor.group.visible = true;
        actor.targetPos.set(obj.x, targetY, obj.z);
        actor.targetYaw = obj.yaw || 0;
        this.applyClassGeometry(actor, obj);

        // Apply semantic provenance theme (FUSED, LIDAR_ONLY, CAMERA_ONLY)
        if (obj.label === 'PEDESTRIAN') {
          const prov = (obj.sensor || (obj.fused ? 'fused' : 'fused')).toLowerCase();
          actor.sensorProvenance = prov;
          this.applySemanticThemeToActor(actor, prov);

          // Dynamically scale bounding box & mesh height to LiDAR cluster dimensions if provided
          if (obj.dz && obj.dz > 0.8 && obj.dz < 2.5) {
            if (actor.pedBoxMesh) {
              actor.pedBoxMesh.scale.set(Math.max(0.45, obj.dx || 0.70), obj.dz, Math.max(0.45, obj.dy || 0.70));
              actor.pedBoxMesh.position.y = obj.dz * 0.5;
            }
            if (actor.pedEdgesMesh) {
              actor.pedEdgesMesh.scale.set(Math.max(0.45, obj.dx || 0.70), obj.dz, Math.max(0.45, obj.dy || 0.70));
              actor.pedEdgesMesh.position.y = obj.dz * 0.5;
            }
            if (actor.humanObjMesh) {
              const hScale = obj.dz / 1.74;
              actor.humanObjMesh.scale.set(hScale, hScale, hScale);
            }
          }
        }

        // Check for matching human pose from RTMPose-s / YOLO26x-Pose (Unique 1-to-1 assignment)
        if (obj.label === 'PEDESTRIAN' && poses && poses.length > 0) {
          // 1. Exact ID match among unused poses
          let matchedPose = poses.find((p) => !usedPoseIds.has(p.id) && p.id === String(obj.id));

          // 2. Fallback: single remaining candidate match
          if (!matchedPose && poses.length === 1 && !usedPoseIds.has(poses[0].id)) {
            matchedPose = poses[0];
          }

          // 3. Nearest spatial detection among remaining unused poses (Three.js: x ≈ +y_base, z ≈ 1.0 - x_base)
          if (!matchedPose) {
            let bestDist = Infinity;
            for (const p of poses) {
              if (usedPoseIds.has(p.id)) continue;
              const dx = obj.x - p.y_base;
              const dz = obj.z - (1.0 - p.x_base);
              const d = Math.sqrt(dx * dx + dz * dz);
              if (d < 4.0 && d < bestDist) {
                bestDist = d;
                matchedPose = p;
              }
            }
          }

          if (matchedPose) {
            usedPoseIds.add(matchedPose.id);
            actor.lastPoseItem = matchedPose;
            actor.isSeated = Boolean(matchedPose.is_seated);
            actor.postureText = matchedPose.posture || (actor.isSeated ? 'SEATED' : 'STANDING');
            if (typeof (matchedPose as any).yaw === 'number') {
              actor.targetYaw = (matchedPose as any).yaw;
            }
            const k3d = matchedPose.keypoints_3d;
            const kpts = matchedPose.keypoints;

            if (k3d && k3d.left_shoulder && k3d.right_shoulder) {
              // =========================================================================
              // TRUE 3D METRIC KINEMATICS (From Registered Depth & Base_Link 3D Vectors)
              // =========================================================================
              actor.hasLivePose = true;
              const yaw = actor.targetYaw;
              const cosY = Math.cos(yaw);
              const sinY = Math.sin(yaw);

              // Helper: Transform vehicle base_link 3D vector (+X fwd, +Y left, +Z up)
              // into pedestrian local body frame:
              //   fwd (chest normal): along base_link [cos(yaw), sin(yaw), 0]
              //   lat (leftward): along base_link [-sin(yaw), cos(yaw), 0]
              //   up: along base_link [0, 0, 1]
              const toBodyFrame = (dx_b: number, dy_b: number, dz_b: number) => {
                const fwd = dx_b * cosY + dy_b * sinY;
                const lat = -dx_b * sinY + dy_b * cosY;
                const up = dz_b;
                return { fwd, lat, up };
              };

              // 1. Left Arm 3D Kinematics
              if (k3d.left_elbow) {
                const upper_dx = k3d.left_elbow.x - k3d.left_shoulder.x;
                const upper_dy = k3d.left_elbow.y - k3d.left_shoulder.y;
                const upper_dz = k3d.left_elbow.z - k3d.left_shoulder.z;
                const upper = toBodyFrame(upper_dx, upper_dy, upper_dz);

                // Arm Pitch: forward reach (fwd > 0) vs backward reach (fwd < 0)
                const armPitchL = Math.atan2(upper.fwd, Math.max(0.06, -upper.up));
                actor.poseTarget.pitchL = THREE.MathUtils.clamp(armPitchL, -0.6, 1.6);

                // Arm Roll: lateral abduction (leftward swing for left arm)
                const armRollL = Math.atan2(upper.lat, Math.max(0.06, -upper.up));
                actor.poseTarget.rollL = THREE.MathUtils.clamp(armRollL, -0.4, 1.8);

                // 3D Elbow Flexion via vector dot product
                if (k3d.left_wrist) {
                  const fore_dx = k3d.left_wrist.x - k3d.left_elbow.x;
                  const fore_dy = k3d.left_wrist.y - k3d.left_elbow.y;
                  const fore_dz = k3d.left_wrist.z - k3d.left_elbow.z;
                  const dot = upper_dx * fore_dx + upper_dy * fore_dy + upper_dz * fore_dz;
                  const magUpper = Math.hypot(upper_dx, upper_dy, upper_dz);
                  const magFore = Math.hypot(fore_dx, fore_dy, fore_dz);
                  if (magUpper > 0.05 && magFore > 0.05) {
                    const cosElbow = THREE.MathUtils.clamp(dot / (magUpper * magFore), -1, 1);
                    actor.poseTarget.elbowL = Math.acos(cosElbow);
                  }
                }
              }

              // 2. Right Arm 3D Kinematics
              if (k3d.right_elbow) {
                const upper_dx = k3d.right_elbow.x - k3d.right_shoulder.x;
                const upper_dy = k3d.right_elbow.y - k3d.right_shoulder.y;
                const upper_dz = k3d.right_elbow.z - k3d.right_shoulder.z;
                const upper = toBodyFrame(upper_dx, upper_dy, upper_dz);

                // Right arm pitch: forward reach
                const armPitchR = Math.atan2(upper.fwd, Math.max(0.06, -upper.up));
                actor.poseTarget.pitchR = THREE.MathUtils.clamp(armPitchR, -0.6, 1.6);

                // Right arm roll: lateral abduction (rightward swing is -lat)
                const armRollR = Math.atan2(-upper.lat, Math.max(0.06, -upper.up));
                actor.poseTarget.rollR = THREE.MathUtils.clamp(armRollR, -0.4, 1.8);

                // 3D Elbow Flexion
                if (k3d.right_wrist) {
                  const fore_dx = k3d.right_wrist.x - k3d.right_elbow.x;
                  const fore_dy = k3d.right_wrist.y - k3d.right_elbow.y;
                  const fore_dz = k3d.right_wrist.z - k3d.right_elbow.z;
                  const dotR = upper_dx * fore_dx + upper_dy * fore_dy + upper_dz * fore_dz;
                  const magUpperR = Math.hypot(upper_dx, upper_dy, upper_dz);
                  const magForeR = Math.hypot(fore_dx, fore_dy, fore_dz);
                  if (magUpperR > 0.05 && magForeR > 0.05) {
                    const cosElbowR = THREE.MathUtils.clamp(dotR / (magUpperR * magForeR), -1, 1);
                    actor.poseTarget.elbowR = Math.acos(cosElbowR);
                  }
                }
              }

              // 3. Torso Roll from 3D shoulder height delta in base_link
              const sh_dz = k3d.left_shoulder.z - k3d.right_shoulder.z;
              const sh_dxy = Math.hypot(k3d.left_shoulder.x - k3d.right_shoulder.x, k3d.left_shoulder.y - k3d.right_shoulder.y);
              actor.poseTarget.torsoRoll = THREE.MathUtils.clamp(Math.atan2(sh_dz, Math.max(0.15, sh_dxy)), -0.25, 0.25);

              // 4. Head Yaw from 3D Nose relative to shoulder center
              if (k3d.nose) {
                const midShX = (k3d.left_shoulder.x + k3d.right_shoulder.x) / 2;
                const midShY = (k3d.left_shoulder.y + k3d.right_shoulder.y) / 2;
                const noseBody = toBodyFrame(k3d.nose.x - midShX, k3d.nose.y - midShY, 0);
                actor.poseTarget.headYaw = THREE.MathUtils.clamp(Math.atan2(noseBody.lat, Math.max(0.08, noseBody.fwd)), -0.65, 0.65);
              }
            } else if (kpts && kpts.left_shoulder && kpts.right_shoulder) {
              // =========================================================================
              // 2D IMAGE-PLANE SLOPE FALLBACK (If registered depth is unavailable)
              // =========================================================================
              actor.hasLivePose = true;

              // Orientation-aware arm kinematics: account for whether human is facing towards or away from vehicle
              const isFacingCamera = (kpts.left_shoulder.x > kpts.right_shoulder.x);
              const armSign = isFacingCamera ? 1.0 : -1.0;

              // Left Arm kinematics
              if (kpts.left_elbow) {
                const dxl = (kpts.left_elbow.x - kpts.left_shoulder.x) * armSign;
                const dyl = kpts.left_elbow.y - kpts.left_shoulder.y;
                const isLeftRaised = kpts.left_wrist && (kpts.left_wrist.y < kpts.left_elbow.y - 15 || kpts.left_wrist.y < kpts.left_shoulder.y + 15);

                if (isLeftRaised) {
                  const rawRollL = Math.atan2(dxl, Math.max(0.1, dyl));
                  actor.poseTarget.rollL = THREE.MathUtils.clamp(rawRollL * 0.7, -0.3, 1.6);
                  actor.poseTarget.pitchL = 0.0;
                  if (kpts.left_wrist) {
                    const dxw = kpts.left_wrist.x - kpts.left_elbow.x;
                    const dyw = kpts.left_wrist.y - kpts.left_elbow.y;
                    const dot = dxl * dxw + dyl * dyw;
                    const mag1 = Math.hypot(dxl, dyl);
                    const mag2 = Math.hypot(dxw, dyw);
                    if (mag1 > 3 && mag2 > 3) {
                      const cosA = THREE.MathUtils.clamp(dot / (mag1 * mag2), -1, 1);
                      actor.poseTarget.elbowL = Math.acos(cosA);
                    }
                  }
                } else {
                  actor.poseTarget.rollL = 0.0;
                  actor.poseTarget.pitchL = 0.0;
                  actor.poseTarget.elbowL = 0.0;
                }
              }

              // Right Arm kinematics
              if (kpts.right_elbow) {
                const dxr = (kpts.right_elbow.x - kpts.right_shoulder.x) * armSign;
                const dyr = kpts.right_elbow.y - kpts.right_shoulder.y;
                const isRightRaised = kpts.right_wrist && (kpts.right_wrist.y < kpts.right_elbow.y - 15 || kpts.right_wrist.y < kpts.right_shoulder.y + 15);

                if (isRightRaised) {
                  const rawRollR = Math.atan2(-dxr, Math.max(0.1, dyr));
                  actor.poseTarget.rollR = THREE.MathUtils.clamp(rawRollR * 0.7, -0.3, 1.6);
                  actor.poseTarget.pitchR = 0.0;
                  if (kpts.right_wrist) {
                    const dxwr = kpts.right_wrist.x - kpts.right_elbow.x;
                    const dywr = kpts.right_wrist.y - kpts.right_elbow.y;
                    const dotR = dxr * dxwr + dyr * dywr;
                    const mag1R = Math.hypot(dxr, dyr);
                    const mag2R = Math.hypot(dxwr, dywr);
                    if (mag1R > 3 && mag2R > 3) {
                      const cosAR = THREE.MathUtils.clamp(dotR / (mag1R * mag2R), -1, 1);
                      actor.poseTarget.elbowR = Math.acos(cosAR);
                    }
                  }
                } else {
                  actor.poseTarget.rollR = 0.0;
                  actor.poseTarget.pitchR = 0.0;
                  actor.poseTarget.elbowR = 0.0;
                }
              }

              // Torso roll
              const dshX = kpts.left_shoulder.x - kpts.right_shoulder.x;
              const dshY = kpts.left_shoulder.y - kpts.right_shoulder.y;
              actor.poseTarget.torsoRoll = THREE.MathUtils.clamp(Math.atan2(dshY, Math.max(10, Math.abs(dshX))) * 0.4, -0.20, 0.20);

              // Head yaw
              if (kpts.nose) {
                const midShX = (kpts.left_shoulder.x + kpts.right_shoulder.x) / 2;
                const dHeadX = kpts.nose.x - midShX;
                actor.poseTarget.headYaw = THREE.MathUtils.clamp(-dHeadX * 0.015, -0.6, 0.6);
              }
            } else {
              actor.hasLivePose = false;
            }
          }
        }
      });
    }

    // Identify closest lead hazard ahead in vehicle path (-Z is forward)
    let closestDist = Infinity;
    let leadKey = '';
    for (const [key, actor] of this.actors) {
      if (!actor.group.visible) continue;
      const x = actor.group.position.x;
      const z = actor.group.position.z;
      if (z < -0.3 && z > -12.0 && Math.abs(x) < 1.6) {
        const d = Math.sqrt(x * x + z * z);
        if (d < closestDist) {
          closestDist = d;
          leadKey = key;
        }
      }
    }

    // Smooth position interpolation and animate walk/seated cycles
    const posLerp = 1 - Math.exp(-step * 12);
    const yawLerp = 1 - Math.exp(-step * 10);

    for (const [key, actor] of this.actors) {
      const isVisible = seen.has(key);
      if (!isVisible && now - actor.lastSeen > 0.5) {
        actor.group.visible = false;
        continue;
      }

      // Smooth position & rotation (canonical circular shortest-delta interpolation)
      actor.group.position.lerp(actor.targetPos, posLerp);
      const diff = actor.targetYaw - actor.group.rotation.y;
      const delta = Math.atan2(Math.sin(diff), Math.cos(diff));
      actor.group.rotation.y += delta * yawLerp;

      // Update floating HUD distance and provenance telemetry badges
      const distBadge = actor.meshes['__dist'] as THREE.Sprite | undefined;
      const isPedestrian = actor.currentLabel === 'PEDESTRIAN' || Boolean(actor.meshes['PEDESTRIAN']?.visible) || Boolean(actor.skeletonGroup?.visible);
      const isLead = key === leadKey && closestDist < 12.0;

      // Planar horizontal distance from ego origin
      const dHorizontal = Math.sqrt(actor.group.position.x * actor.group.position.x + actor.group.position.z * actor.group.position.z);

      if (distBadge) {
        if (isPedestrian && dHorizontal < 25.0) {
          distBadge.visible = true;
          distBadge.position.y = 1.90; // Floating right above head at 1.90m
          const isHazard = dHorizontal < 3.5 && Math.abs(actor.group.position.x) < 1.6 && actor.group.position.z < -0.3;
          const prov = (actor.sensorProvenance || 'fused').toLowerCase();
          const tag = prov === 'fused' ? 'FUSED' : prov === 'lidar' ? 'LIDAR' : prov === 'camera' ? 'CAM' : 'HUMAN';
          const postStr = actor.postureText && actor.postureText !== 'UNKNOWN' ? ` · ${actor.postureText}` : '';
          const dStr = `[${tag}] ${dHorizontal.toFixed(1)} m${postStr}`;
          this.updateDistanceBadge(distBadge, dStr, isHazard, prov);
        } else if (isLead && !isPedestrian) {
          distBadge.visible = true;
          distBadge.position.y = 1.35;
          const isCritical = closestDist < 3.5;
          const dStr = `[LEAD] ${closestDist.toFixed(1)} m`;
          this.updateDistanceBadge(distBadge, dStr, isCritical, 'hazard');
        } else {
          distBadge.visible = false;
        }
      }

      // Dynamic humanoid walking & RTMPose-s observed kinematics (SMPL rigged skeleton)
      if (actor.limbs && actor.meshes['PEDESTRIAN']?.visible) {
        const targetBlend = actor.isSeated ? 1.0 : 0.0;
        actor.seatedBlend = THREE.MathUtils.lerp(actor.seatedBlend, targetBlend, 1 - Math.exp(-step * 10));
        const sb = actor.seatedBlend;

        // Smooth RTMPose joint angles
        const rotLerp = 1 - Math.exp(-step * 14);
        actor.poseCurrent.rollL = THREE.MathUtils.lerp(actor.poseCurrent.rollL, actor.poseTarget.rollL, rotLerp);
        actor.poseCurrent.pitchL = THREE.MathUtils.lerp(actor.poseCurrent.pitchL || 0, actor.poseTarget.pitchL || 0, rotLerp);
        actor.poseCurrent.elbowL = THREE.MathUtils.lerp(actor.poseCurrent.elbowL, actor.poseTarget.elbowL, rotLerp);
        actor.poseCurrent.rollR = THREE.MathUtils.lerp(actor.poseCurrent.rollR, actor.poseTarget.rollR, rotLerp);
        actor.poseCurrent.pitchR = THREE.MathUtils.lerp(actor.poseCurrent.pitchR || 0, actor.poseTarget.pitchR || 0, rotLerp);
        actor.poseCurrent.elbowR = THREE.MathUtils.lerp(actor.poseCurrent.elbowR, actor.poseTarget.elbowR, rotLerp);
        actor.poseCurrent.torsoRoll = THREE.MathUtils.lerp(actor.poseCurrent.torsoRoll, actor.poseTarget.torsoRoll, rotLerp);
        actor.poseCurrent.headYaw = THREE.MathUtils.lerp(actor.poseCurrent.headYaw, actor.poseTarget.headYaw, rotLerp);

        // 1. Direct 25-Bone Articulation on Rigged SMPL Model (Linear Blend Skinning)
        if (actor.smplBones) {
          const b = actor.smplBones;
          // Suppress procedural capsule primitives when authentic rigged SMPL model is loaded
          if (actor.proceduralMesh) actor.proceduralMesh.visible = false;
          if (actor.humanObjMesh) {
            if (actor.smplMesh) actor.smplMesh.visible = false;
            actor.humanObjMesh.visible = true;
          }

          // Pelvis height (rest = 97.27 cm; drops down ~36 cm when seated)
          if (b['m_avg_Pelvis']) {
            b['m_avg_Pelvis'].position.y = 97.27 - 36 * sb;
            b['m_avg_Pelvis'].position.z = 2.86 - 5 * sb;
            b['m_avg_Pelvis'].rotation.x = 0.08 * sb;
          }

          // Walk cycle dynamics
          const walkWeight = Math.max(0, 1.0 - sb);
          const walkFreq = 5.2;
          const walkPhase = this.animTime * walkFreq + actor.animSeed;
          const walkAngle = Math.sin(walkPhase) * 0.42 * walkWeight;
          const armAngle = Math.sin(walkPhase) * 0.35 * walkWeight;
          const kneeFlexL = Math.max(0, -walkAngle * 0.75) * walkWeight;
          const kneeFlexR = Math.max(0, walkAngle * 0.75) * walkWeight;

          // Hips & Legs articulation (thighs bend forward onto seat, shins bend down)
          const seatedHip = -1.45 * sb;
          const seatedKnee = 1.45 * sb;
          const seatedAnkle = -0.15 * sb;
          if (b['m_avg_L_Hip']) b['m_avg_L_Hip'].rotation.x = seatedHip - walkAngle * 0.7;
          if (b['m_avg_R_Hip']) b['m_avg_R_Hip'].rotation.x = seatedHip + walkAngle * 0.7;
          if (b['m_avg_L_Knee']) b['m_avg_L_Knee'].rotation.x = seatedKnee + kneeFlexL;
          if (b['m_avg_R_Knee']) b['m_avg_R_Knee'].rotation.x = seatedKnee + kneeFlexR;
          if (b['m_avg_L_Ankle']) b['m_avg_L_Ankle'].rotation.x = seatedAnkle;
          if (b['m_avg_R_Ankle']) b['m_avg_R_Ankle'].rotation.x = seatedAnkle;

          // Shoulders & Arms: natural arms-down resting posture (z = -1.25 / +1.25)
          // When seated: arms pitch forward onto lap with relaxed elbows (y = 1.35)
          const seatedArmPitch = -0.45 * sb;
          const seatedElbowFlex = 1.35 * sb;

          if (actor.hasLivePose) {
            if (b['m_avg_L_Shoulder']) {
              b['m_avg_L_Shoulder'].rotation.z = -1.25 + actor.poseCurrent.rollL;
              b['m_avg_L_Shoulder'].rotation.x = seatedArmPitch + actor.poseCurrent.pitchL;
            }
            if (b['m_avg_R_Shoulder']) {
              b['m_avg_R_Shoulder'].rotation.z = 1.25 - actor.poseCurrent.rollR;
              b['m_avg_R_Shoulder'].rotation.x = seatedArmPitch + actor.poseCurrent.pitchR;
            }
            if (b['m_avg_L_Elbow']) {
              b['m_avg_L_Elbow'].rotation.y = 0.25 + seatedElbowFlex + actor.poseCurrent.elbowL * 0.6;
            }
            if (b['m_avg_R_Elbow']) {
              b['m_avg_R_Elbow'].rotation.y = -0.25 - seatedElbowFlex - actor.poseCurrent.elbowR * 0.6;
            }
          } else {
            if (b['m_avg_L_Shoulder']) {
              b['m_avg_L_Shoulder'].rotation.z = -1.25;
              b['m_avg_L_Shoulder'].rotation.x = seatedArmPitch + armAngle * 0.5;
            }
            if (b['m_avg_R_Shoulder']) {
              b['m_avg_R_Shoulder'].rotation.z = 1.25;
              b['m_avg_R_Shoulder'].rotation.x = seatedArmPitch - armAngle * 0.5;
            }
            if (b['m_avg_L_Elbow']) {
              b['m_avg_L_Elbow'].rotation.y = 0.25 + seatedElbowFlex;
            }
            if (b['m_avg_R_Elbow']) {
              b['m_avg_R_Elbow'].rotation.y = -0.25 - seatedElbowFlex;
            }
          }

          // Head & Spine
          if (b['m_avg_Head']) b['m_avg_Head'].rotation.y = actor.poseCurrent.headYaw;
          if (b['m_avg_Spine3']) b['m_avg_Spine3'].rotation.z = -actor.poseCurrent.torsoRoll;
        } else {
          // Fallback procedural capsule articulation if GLB not yet loaded
          if (actor.proceduralMesh) actor.proceduralMesh.visible = !actor.humanObjMesh;
          if (actor.humanObjMesh) actor.humanObjMesh.visible = true;
          actor.limbs.hips.position.y = 0.86 - 0.34 * sb;
          actor.limbs.hips.rotation.x = 0.08 * sb;

          const seatedHip = 1.48 * sb;
          const seatedKnee = -1.40 * sb;
          const seatedArm = -0.55 * sb;
          const seatedElbow = 0.75 * sb;

          if (actor.limbs.spine) actor.limbs.spine.rotation.z = -actor.poseCurrent.torsoRoll;
          if (actor.limbs.head) actor.limbs.head.rotation.y = actor.poseCurrent.headYaw;

          const walkWeight = Math.max(0, 1.0 - sb);
          const walkFreq = 5.2;
          const walkPhase = this.animTime * walkFreq + actor.animSeed;
          const walkAngle = Math.sin(walkPhase) * 0.42 * walkWeight;
          const armAngle = Math.sin(walkPhase) * 0.35 * walkWeight;
          const kneeFlexL = Math.max(0, -walkAngle * 0.75) * walkWeight;
          const kneeFlexR = Math.max(0, walkAngle * 0.75) * walkWeight;

          actor.limbs.legL.rotation.x = seatedHip + walkAngle;
          actor.limbs.kneeL.rotation.x = seatedKnee - kneeFlexL;
          actor.limbs.legR.rotation.x = seatedHip - walkAngle;
          actor.limbs.kneeR.rotation.x = seatedKnee - kneeFlexR;

          if (actor.hasLivePose) {
            actor.limbs.armL.rotation.z = -actor.poseCurrent.rollL;
            actor.limbs.armL.rotation.x = seatedArm + actor.poseCurrent.pitchL;
            actor.limbs.elbowL.rotation.x = Math.max(seatedElbow, actor.poseCurrent.elbowL);

            actor.limbs.armR.rotation.z = actor.poseCurrent.rollR;
            actor.limbs.armR.rotation.x = seatedArm + actor.poseCurrent.pitchR;
            actor.limbs.elbowR.rotation.x = Math.max(seatedElbow, actor.poseCurrent.elbowR);
          } else {
            actor.limbs.armL.rotation.z = 0;
            actor.limbs.armL.rotation.x = seatedArm - armAngle;
            actor.limbs.elbowL.rotation.x = seatedElbow + (0.2 + Math.abs(armAngle) * 0.3) * walkWeight;

            actor.limbs.armR.rotation.z = 0;
            actor.limbs.armR.rotation.x = seatedArm + armAngle;
            actor.limbs.elbowR.rotation.x = seatedElbow + (0.2 + Math.abs(armAngle) * 0.3) * walkWeight;
          }
        }

        // Live YOLO26x-Pose / RTMPose 17-Keypoint Skeletal Rig Dynamic Alignment
        if (actor.skeletonJoints && actor.skeletonBones && actor.skeletonGroup) {
          actor.skeletonGroup.visible = true;

          // 17 Kinematic Joint Points in Local Pedestrian Frame:
          // In the pedestrian avatar:
          //   Origin (0, 0, 0) is at ground level under pelvis.
          //   +Y is UP (metric height above ground).
          //   -Z is FORWARD (along chest normal facing direction).
          //   -X is LEFT (pedestrian's left).
          //   +X is RIGHT (pedestrian's right).
          const k3d = actor.lastPoseItem?.keypoints_3d;
          const k3dOrder = [
            'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
            'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
            'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
            'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
          ];

          const localPositions: (THREE.Vector3 | null)[] = new Array(17).fill(null);

          if (k3d && actor.lastPoseItem) {
            const rootX = actor.lastPoseItem.x_base;
            const rootY = actor.lastPoseItem.y_base;
            const yaw = actor.lastPoseItem.yaw ?? actor.targetYaw;
            const cosY = Math.cos(yaw);
            const sinY = Math.sin(yaw);

            for (let k = 0; k < 17; k++) {
              const kp3 = k3d[k3dOrder[k]];
              if (kp3 && kp3.x !== undefined && kp3.y !== undefined && kp3.z !== undefined) {
                // Vector in vehicle base_link (+X fwd, +Y left) from human root to joint
                const rel_x = kp3.rel_x !== undefined ? kp3.rel_x : (kp3.x - rootX);
                const rel_y = kp3.rel_y !== undefined ? kp3.rel_y : (kp3.y - rootY);

                // Project into pedestrian body frame:
                // fwd (>0): along chest facing direction
                // lat (>0): along pedestrian's leftward direction
                const fwd = rel_x * cosY + rel_y * sinY;
                const lat = -rel_x * sinY + rel_y * cosY;

                // Avatar local frame: -lat is left (-X), -fwd is forward (-Z), kp3.z is height (+Y)
                const lx = -lat;
                const ly = Math.max(0.04, kp3.z);
                const lz = -fwd;

                localPositions[k] = new THREE.Vector3(lx, ly, lz);
              }
            }
          }

          // Fallback joint positions in pedestrian local frame (anatomically aligned)
          const fallbackLocal = [
            new THREE.Vector3(0.0, 1.58, -0.14),    // 0: nose
            new THREE.Vector3(-0.035, 1.62, -0.10), // 1: left_eye
            new THREE.Vector3(0.035, 1.62, -0.10),  // 2: right_eye
            new THREE.Vector3(-0.08, 1.61, -0.02),  // 3: left_ear
            new THREE.Vector3(0.08, 1.61, -0.02),   // 4: right_ear
            new THREE.Vector3(-0.19, 1.40, 0.0),    // 5: left_shoulder
            new THREE.Vector3(0.19, 1.40, 0.0),     // 6: right_shoulder
            new THREE.Vector3(-0.25, 1.15, 0.0),    // 7: left_elbow
            new THREE.Vector3(0.25, 1.15, 0.0),     // 8: right_elbow
            new THREE.Vector3(-0.28, 0.90, 0.0),    // 9: left_wrist
            new THREE.Vector3(0.28, 0.90, 0.0),     // 10: right_wrist
            new THREE.Vector3(-0.11, 0.86, 0.0),    // 11: left_hip
            new THREE.Vector3(0.11, 0.86, 0.0),     // 12: right_hip
            new THREE.Vector3(-0.11, 0.46, 0.0),    // 13: left_knee
            new THREE.Vector3(0.11, 0.46, 0.0),     // 14: right_knee
            new THREE.Vector3(-0.11, 0.08, 0.0),    // 15: left_ankle
            new THREE.Vector3(0.11, 0.08, 0.0),     // 16: right_ankle
          ];

          // Adapt lower-body fallback heights if seated
          if (actor.isSeated) {
            fallbackLocal[11].y -= 0.35;
            fallbackLocal[12].y -= 0.35;
            fallbackLocal[13].y -= 0.35;
            fallbackLocal[13].z -= 0.38;
            fallbackLocal[14].y -= 0.35;
            fallbackLocal[14].z -= 0.38;
            fallbackLocal[15].z -= 0.38;
            fallbackLocal[16].z -= 0.38;
          }

          for (let k = 0; k < 17; k++) {
            const pos = localPositions[k] || fallbackLocal[k];
            actor.skeletonJoints[k].position.copy(pos);
          }

          for (let bIdx = 0; bIdx < SKELETON_PAIRS.length; bIdx++) {
            const [p1, p2] = SKELETON_PAIRS[bIdx];
            const pt1 = actor.skeletonJoints[p1].position;
            const pt2 = actor.skeletonJoints[p2].position;
            const bone = actor.skeletonBones[bIdx];
            if (!bone) continue;
            const dir = new THREE.Vector3().subVectors(pt2, pt1);
            const len = dir.length();
            if (len > 0.01) {
              bone.visible = true;
              bone.position.copy(pt1).addScaledVector(dir, 0.5);
              bone.scale.set(1, len, 1);
              bone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
            } else {
              bone.visible = false;
            }
          }
        } else if (actor.skeletonGroup) {
          actor.skeletonGroup.visible = false;
        }
      }
    }

    // Garbage collection of old actors
    if (this.actors.size > 64) {
      for (const [key, actor] of this.actors) {
        if (now - actor.lastSeen > 3.0) {
          this.group.remove(actor.group);
          this.disposeActor(actor);
          this.actors.delete(key);
        }
      }
    }

    // MHR overlay: when the backend streams posed MHR meshes, render them and
    // suppress the procedural pedestrian mesh for the same actor ids.
    //
    // MULTI-PEDESTRIAN FIX: Each MHR actor id (det_0, det_1, ...) must be placed
    // at its own detected position — NOT all stacked on the first pedestrian.
    // Resolution order:
    //   1. Exact match by ID in this.actors map (ideal: YOLO obj IDs == MHR IDs)
    //   2. Match by pose coordinates from rawPoses (x_base/y_base → Three.js space)
    //   3. Index-based match: det_N → Nth PEDESTRIAN actor in the actors map
    const mhrActive = this.mhr.update(mhrHuman, (id) => {
      // 1. Exact actor map match
      const actor = this.actors.get(id);
      if (actor && actor.group.visible) {
        return { position: actor.group.position, yaw: actor.group.rotation.y, visible: true };
      }

      // 2. Use pose spatial coordinates directly from rawPoses.
      // Transforms: base_link (x=forward, y=left) → Three.js (x=right, z=1-forward).
      // Works regardless of whether a matching ROS perception object exists.
      if (rawPoses) {
        const pose = rawPoses.find((p) => p.id === id);
        if (pose) {
          const threeX = (pose as any).y_base != null ? Number((pose as any).y_base) : 0;
          const threeZ = (pose as any).x_base != null ? 1.0 - Number((pose as any).x_base) : 1.0;
          const pos = new THREE.Vector3(threeX, 0, threeZ);
          const yaw = typeof (pose as any).yaw === 'number' ? -Number((pose as any).yaw) : 0;
          return { position: pos, yaw, visible: true };
        }
      }

      // 3. Index-based fallback: det_N → Nth visible PEDESTRIAN actor.
      // Handles ID mismatch when fusion track IDs (fuse_N) don't match MHR pose IDs (det_N).
      const detMatch = id.match(/^det_(\d+)$/);
      if (detMatch) {
        const targetIdx = parseInt(detMatch[1], 10);
        let pedCount = 0;
        for (const act of this.actors.values()) {
          if (act.group.visible && (act.meshes['PEDESTRIAN'] || act.currentLabel === 'PEDESTRIAN')) {
            if (pedCount === targetIdx) {
              return { position: act.group.position, yaw: act.group.rotation.y, visible: true };
            }
            pedCount++;
          }
        }
      }

      return null;
    });
    if (mhrActive.size > 0) {
      for (const [key, actor] of this.actors) {
        const pedMesh = actor.meshes['PEDESTRIAN'];
        if (!pedMesh) continue;
        if (mhrActive.has(String(key)) || mhrActive.size > 0) {
          pedMesh.visible = false;
          if (actor.skeletonGroup) actor.skeletonGroup.visible = false;
        }
      }
    }
  }

  /** Release every actor, shared geometry/material and the MHR overlay. */
  public dispose(): void {
    for (const key of Array.from(this.actors.keys())) {
      const actor = this.actors.get(key);
      if (!actor) continue;
      this.group.remove(actor.group);
      this.disposeActor(actor);
      this.actors.delete(key);
    }
    this.labelMaterials.forEach((mat) => {
      if (mat.map) mat.map.dispose();
      mat.dispose();
    });
    this.labelMaterials.clear();
    this.mhr.dispose();
    this.boneCylinderGeo.dispose();
    this.shadowCircleGeo.dispose();
    this.wheelTireGeo.dispose();
    this.wheelRimGeo.dispose();
  }
}
