import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { PerceptionObject, HumanPosesPayload, MhrHumanPayload } from '../../types/can';
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
  private mhr: MhrHuman;

  // Shared Materials
  private pedMat: THREE.MeshStandardMaterial;
  private pedAccentMat: THREE.MeshStandardMaterial;
  private pedVisorMat: THREE.MeshStandardMaterial;
  private pedShadowMat: THREE.MeshBasicMaterial;
  private pedHazardMat: THREE.MeshBasicMaterial;

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

    // Use the clean, clothed procedural ADAS avatar to prevent anatomical/nude appearances
    // The procedural avatar features a sleek automotive sensor visor, dark footwear/accents,
    // and full 17-joint RTMPose-s live kinematics.
    this.isSmplLoaded = false;
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
    const { mesh: newMesh, limbs, smplMesh, smplBones, proceduralMesh } = this.createPedestrianMesh();
    const { group: skelGroup, joints: skelJoints, bones: skelBones } = this.createRTMPoseSkeletonOverlay();
    newMesh.add(skelGroup);

    actor.meshes['PEDESTRIAN'] = newMesh;
    actor.limbs = limbs;
    actor.smplMesh = smplMesh;
    actor.smplBones = smplBones;
    actor.proceduralMesh = proceduralMesh;
    actor.skeletonGroup = skelGroup;
    actor.skeletonJoints = skelJoints;
    actor.skeletonBones = skelBones;
    actor.group.add(newMesh);
    newMesh.visible = actor.currentLabel === 'PEDESTRIAN';
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
  } {
    const ped = new THREE.Group();

    // 1. Ground Contact Shadow
    const shadow = new THREE.Mesh(this.shadowCircleGeo, this.pedShadowMat);
    shadow.position.set(0, 0.02, 0);
    ped.add(shadow);

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

    return {
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
    };
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
   * Minimalist automotive HUD distance pill (e.g. "2.8 m").
   */
  private createDistanceBadge(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 56;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.68, 0.21, 1);
    sprite.position.y = 2.1;
    sprite.userData = { canvas, ctx, texture, lastText: '', lastHazard: null };
    return sprite;
  }

  private updateDistanceBadge(sprite: THREE.Sprite, text: string, isHazard: boolean) {
    const data = sprite.userData;
    if (!data || !data.ctx) return;
    if (data.lastText === text && data.lastHazard === isHazard) return;
    data.lastText = text;
    data.lastHazard = isHazard;

    const ctx = data.ctx as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 440, 56);

    ctx.fillStyle = isHazard ? 'rgba(239, 68, 68, 0.92)' : 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    const r = 20;
    ctx.moveTo(r, 4);
    ctx.lineTo(440 - r, 4);
    ctx.arcTo(440 - 4, 4, 440 - 4, 52, r);
    ctx.arcTo(440 - 4, 52, 4, 52, r);
    ctx.arcTo(4, 52, 4, 4, r);
    ctx.arcTo(4, 4, 440 - r, 4, r);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isHazard ? '#f87171' : '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 220, 28);

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
    const { mesh: pedMesh, limbs, smplMesh, smplBones, proceduralMesh } = this.createPedestrianMesh();
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
    return {
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
    };
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
    let effectivePoses = rawPoses ? [...rawPoses] : [];
    const hasRealPed = effectiveList.some((o) => o.label === 'PEDESTRIAN');

    // Demo Mode: If demoPedestrian is active and no real pedestrians are present, render interactive SMPL + RTMPose model
    if (demoPedestrian && !hasRealPed) {
      const lookPhase = this.animTime * 1.5;
      const wavePhase = this.animTime * 2.8;
      const isDemoSeated = Math.sin(this.animTime * 0.35) > 0.6;

      const demoObj: PerceptionObject = {
        id: 'demo-smpl-pedestrian',
        label: 'PEDESTRIAN',
        x: 0.22 * Math.sin(lookPhase),
        y: 0.0,
        z: -3.8,
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

        // Check for matching human pose from RTMPose-s
        if (obj.label === 'PEDESTRIAN' && poses && poses.length > 0) {
          let matchedPose = poses.find((p) => p.id === String(obj.id));
          if (!matchedPose && poses.length === 1 && effectiveList.filter((o) => o.label === 'PEDESTRIAN').length === 1) {
            matchedPose = poses[0];
          }
          if (!matchedPose) {
            // Nearest spatial detection (Three.js: x ≈ -y_base, z ≈ -x_base)
            let bestDist = Infinity;
            for (const p of poses) {
              const dx = obj.x - (-p.y_base);
              const dz = obj.z - (-p.x_base);
              const d = Math.sqrt(dx * dx + dz * dz);
              if (d < 3.0 && d < bestDist) {
                bestDist = d;
                matchedPose = p;
              }
            }
          }
          if (matchedPose) {
            actor.isSeated = Boolean(matchedPose.is_seated);
            actor.postureText = matchedPose.posture || (actor.isSeated ? 'SEATED' : 'STANDING');
            if (typeof (matchedPose as any).yaw === 'number') {
              actor.targetYaw = (matchedPose as any).yaw;
            }
            const kpts = matchedPose.keypoints;
            if (kpts && kpts.left_shoulder && kpts.right_shoulder) {
              actor.hasLivePose = true;

              // Orientation-aware arm kinematics: account for whether human is facing towards or away from vehicle
              const isFacingCamera = (kpts.left_shoulder.x > kpts.right_shoulder.x);
              const armSign = isFacingCamera ? 1.0 : -1.0;

              // Left Arm kinematics (resting lap/side vs deliberate gesture)
              if (kpts.left_elbow) {
                const dxl = (kpts.left_elbow.x - kpts.left_shoulder.x) * armSign;
                const dyl = kpts.left_elbow.y - kpts.left_shoulder.y;
                const isLeftRaised = kpts.left_wrist && (kpts.left_wrist.y < kpts.left_elbow.y - 15 || kpts.left_wrist.y < kpts.left_shoulder.y + 15);

                if (isLeftRaised) {
                  const rawRollL = Math.atan2(dxl, Math.max(0.1, dyl));
                  actor.poseTarget.rollL = THREE.MathUtils.clamp(rawRollL * 0.7, -0.3, 1.6);
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
                  actor.poseTarget.elbowL = 0.0;
                }
              }

              // Right Arm kinematics (resting lap/side vs deliberate gesture)
              if (kpts.right_elbow) {
                const dxr = (kpts.right_elbow.x - kpts.right_shoulder.x) * armSign;
                const dyr = kpts.right_elbow.y - kpts.right_shoulder.y;
                const isRightRaised = kpts.right_wrist && (kpts.right_wrist.y < kpts.right_elbow.y - 15 || kpts.right_wrist.y < kpts.right_shoulder.y + 15);

                if (isRightRaised) {
                  const rawRollR = Math.atan2(-dxr, Math.max(0.1, dyr));
                  actor.poseTarget.rollR = THREE.MathUtils.clamp(rawRollR * 0.7, -0.3, 1.6);
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
                  actor.poseTarget.elbowR = 0.0;
                }
              }

              // Torso roll (clamped to realistic seated posture bounds)
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

      // Update lead hazard badge and proximity highlight (suppressed for human pedestrians)
      const distBadge = actor.meshes['__dist'] as THREE.Sprite | undefined;
      const isPedestrian = actor.currentLabel === 'PEDESTRIAN' || Boolean(actor.meshes['PEDESTRIAN']?.visible) || Boolean(actor.skeletonGroup?.visible);
      const isLead = key === leadKey && closestDist < 8.0;
      if (distBadge) {
        if (isLead && !isPedestrian) {
          distBadge.visible = true;
          const isCritical = closestDist < 3.5;
          distBadge.position.y = 1.35;
          const dStr = `${closestDist.toFixed(1)} m`;
          this.updateDistanceBadge(distBadge, dStr, isCritical);
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
        actor.poseCurrent.elbowL = THREE.MathUtils.lerp(actor.poseCurrent.elbowL, actor.poseTarget.elbowL, rotLerp);
        actor.poseCurrent.rollR = THREE.MathUtils.lerp(actor.poseCurrent.rollR, actor.poseTarget.rollR, rotLerp);
        actor.poseCurrent.elbowR = THREE.MathUtils.lerp(actor.poseCurrent.elbowR, actor.poseTarget.elbowR, rotLerp);
        actor.poseCurrent.torsoRoll = THREE.MathUtils.lerp(actor.poseCurrent.torsoRoll, actor.poseTarget.torsoRoll, rotLerp);
        actor.poseCurrent.headYaw = THREE.MathUtils.lerp(actor.poseCurrent.headYaw, actor.poseTarget.headYaw, rotLerp);

        // 1. Direct 25-Bone Articulation on Rigged SMPL Model (Linear Blend Skinning)
        if (actor.smplBones) {
          const b = actor.smplBones;
          // Suppress procedural capsule primitives when authentic rigged SMPL model is loaded
          if (actor.proceduralMesh) actor.proceduralMesh.visible = false;
          if (actor.skeletonGroup) actor.skeletonGroup.visible = false;

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
              b['m_avg_L_Shoulder'].rotation.x = seatedArmPitch;
            }
            if (b['m_avg_R_Shoulder']) {
              b['m_avg_R_Shoulder'].rotation.z = 1.25 - actor.poseCurrent.rollR;
              b['m_avg_R_Shoulder'].rotation.x = seatedArmPitch;
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
          if (actor.proceduralMesh) actor.proceduralMesh.visible = true;
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
            actor.limbs.armL.rotation.x = seatedArm;
            actor.limbs.elbowL.rotation.x = Math.max(seatedElbow, actor.poseCurrent.elbowL);

            actor.limbs.armR.rotation.z = actor.poseCurrent.rollR;
            actor.limbs.armR.rotation.x = seatedArm;
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

        // Live RTMPose-s 17-Keypoint Skeletal Rig Dynamic Alignment
        if (actor.skeletonJoints && actor.skeletonBones && actor.skeletonGroup && actor.limbs) {
          actor.skeletonGroup.visible = !actor.smplBones;
          const positions: THREE.Vector3[] = [];
          const headObj = actor.limbs.head || actor.limbs.hips;

          // 17 Kinematic Joint Points in World Coordinates
          positions[0] = headObj.localToWorld(new THREE.Vector3(0, 0.06, -0.12)); // Nose
          positions[1] = headObj.localToWorld(new THREE.Vector3(-0.035, 0.08, -0.10)); // EyeL
          positions[2] = headObj.localToWorld(new THREE.Vector3(0.035, 0.08, -0.10)); // EyeR
          positions[3] = headObj.localToWorld(new THREE.Vector3(-0.085, 0.06, -0.02)); // EarL
          positions[4] = headObj.localToWorld(new THREE.Vector3(0.085, 0.06, -0.02)); // EarR
          positions[5] = actor.limbs.armL.localToWorld(new THREE.Vector3(0, 0, 0)); // ShoulderL
          positions[6] = actor.limbs.armR.localToWorld(new THREE.Vector3(0, 0, 0)); // ShoulderR
          positions[7] = actor.limbs.elbowL.localToWorld(new THREE.Vector3(0, 0, 0)); // ElbowL
          positions[8] = actor.limbs.elbowR.localToWorld(new THREE.Vector3(0, 0, 0)); // ElbowR
          positions[9] = actor.limbs.elbowL.localToWorld(new THREE.Vector3(0, -0.22, 0)); // WristL
          positions[10] = actor.limbs.elbowR.localToWorld(new THREE.Vector3(0, -0.22, 0)); // WristR
          positions[11] = actor.limbs.legL.localToWorld(new THREE.Vector3(0, 0, 0)); // HipL
          positions[12] = actor.limbs.legR.localToWorld(new THREE.Vector3(0, 0, 0)); // HipR
          positions[13] = actor.limbs.kneeL.localToWorld(new THREE.Vector3(0, 0, 0)); // KneeL
          positions[14] = actor.limbs.kneeR.localToWorld(new THREE.Vector3(0, 0, 0)); // KneeR
          positions[15] = actor.limbs.kneeL.localToWorld(new THREE.Vector3(0, -0.35, 0)); // AnkleL
          positions[16] = actor.limbs.kneeR.localToWorld(new THREE.Vector3(0, -0.35, 0)); // AnkleR

          actor.skeletonGroup.updateMatrixWorld(true);
          const invMatrix = actor.skeletonGroup.matrixWorld.clone().invert();

          for (let k = 0; k < 17; k++) {
            const localPt = positions[k].applyMatrix4(invMatrix);
            actor.skeletonJoints[k].position.copy(localPt);
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
    const mhrActive = this.mhr.update(mhrHuman, (id) => {
      const actor = this.actors.get(id);
      if (!actor || !actor.group.visible) return null;
      return { position: actor.group.position, yaw: actor.group.rotation.y, visible: true };
    });
    if (mhrActive.size > 0) {
      for (const [key, actor] of this.actors) {
        const pedMesh = actor.meshes['PEDESTRIAN'];
        if (!pedMesh) continue;
        if (mhrActive.has(String(key))) {
          pedMesh.visible = false;
          if (actor.skeletonGroup) actor.skeletonGroup.visible = false;
        }
      }
    }
  }
}
