import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { PerceptionObject, HumanPosesPayload } from '../../types/can';

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

  // Shared Materials
  private pedMat: THREE.MeshStandardMaterial;
  private pedAccentMat: THREE.MeshStandardMaterial;
  private pedVisorMat: THREE.MeshStandardMaterial;
  private pedShadowMat: THREE.MeshBasicMaterial;
  private pedHazardMat: THREE.MeshBasicMaterial;

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
  private pedChestGeo: THREE.BoxGeometry;
  private pedAbdomenGeo: THREE.BoxGeometry;
  private pedPelvisGeo: THREE.BoxGeometry;
  private pedUpperArmGeo: THREE.CapsuleGeometry;
  private pedForeArmGeo: THREE.CapsuleGeometry;
  private pedJointGeo: THREE.SphereGeometry;
  private pedHandGeo: THREE.SphereGeometry;
  private pedThighGeo: THREE.CapsuleGeometry;
  private pedShinGeo: THREE.CapsuleGeometry;
  private pedFootGeo: THREE.BoxGeometry;

  // Cone Geometries
  private coneBaseGeo: THREE.BoxGeometry;
  private coneBodyGeo: THREE.CylinderGeometry;
  private coneReflectGeo: THREE.CylinderGeometry;

  constructor() {
    this.group = new THREE.Group();

    // 1. Shared Materials (Automotive Digital Cockpit Palette)
    // SMPL neutral slate-grey humanoid styling
    this.pedMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Slate-400 anatomical neutral grey
      roughness: 0.45,
      metalness: 0.15,
    });
    this.pedAccentMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Slate-500 joints and footwear
      roughness: 0.50,
      metalness: 0.20,
    });
    this.pedVisorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sky-400 subtle sensor visor
      roughness: 0.25,
      metalness: 0.75,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
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

    // 2. Shared Geometries
    this.shadowCircleGeo = new THREE.CircleGeometry(0.35, 18);
    this.shadowCircleGeo.rotateX(-Math.PI / 2);

    this.wheelTireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16);
    this.wheelTireGeo.rotateZ(Math.PI / 2);
    this.wheelRimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.23, 16);
    this.wheelRimGeo.rotateZ(Math.PI / 2);

    // Pedestrian Geometries (SMPL-derived Anatomical Humanoid Mesh)
    this.pedHeadGeo = new THREE.SphereGeometry(0.11, 16, 16);
    this.pedVisorGeo = new THREE.BoxGeometry(0.13, 0.04, 0.08);
    this.pedNeckGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.08, 12);
    this.pedChestGeo = new THREE.BoxGeometry(0.32, 0.24, 0.18);
    this.pedAbdomenGeo = new THREE.BoxGeometry(0.26, 0.18, 0.16);
    this.pedPelvisGeo = new THREE.BoxGeometry(0.28, 0.14, 0.17);
    this.pedUpperArmGeo = new THREE.CapsuleGeometry(0.042, 0.22, 6, 12);
    this.pedForeArmGeo = new THREE.CapsuleGeometry(0.036, 0.20, 6, 12);
    this.pedJointGeo = new THREE.SphereGeometry(0.045, 10, 10);
    this.pedHandGeo = new THREE.SphereGeometry(0.035, 8, 8);
    this.pedThighGeo = new THREE.CapsuleGeometry(0.065, 0.30, 8, 14);
    this.pedShinGeo = new THREE.CapsuleGeometry(0.052, 0.30, 8, 14);
    this.pedFootGeo = new THREE.BoxGeometry(0.09, 0.06, 0.18);

    // Traffic Cone Geometries
    this.coneBaseGeo = new THREE.BoxGeometry(0.38, 0.04, 0.38);
    this.coneBodyGeo = new THREE.CylinderGeometry(0.035, 0.18, 0.65, 20);
    this.coneReflectGeo = new THREE.CylinderGeometry(0.08, 0.13, 0.16, 20);

    // Preload SMPL-derived rigged humanoid asset
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/pedestrian_smpl.glb',
      (gltf) => {
        this.smplTemplate = gltf.scene;
        this.isSmplLoaded = true;
        this.smplTemplate.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        // Upgrade any existing pedestrian actors created before GLB loaded
        this.actors.forEach((actor) => {
          if (actor.currentLabel === 'PEDESTRIAN') {
            this.upgradeActorToSmpl(actor);
          }
        });
        console.log('[Cockpit 3D] Loaded SMPL-derived rigged humanoid mesh (pedestrian_smpl.glb)');
      },
      undefined,
      (err) => {
        console.warn('[Cockpit 3D] Using procedural SMPL model:', err);
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
    const { mesh: newMesh, limbs } = this.createPedestrianMesh();
    actor.meshes['PEDESTRIAN'] = newMesh;
    actor.limbs = limbs;
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
   * Builds an articulated SMPL humanoid model with rigged bone pivots for RTMPose-s.
   */
  private createPedestrianMesh(): { mesh: THREE.Group; limbs: ActorLimbs } {
    const ped = new THREE.Group();

    // 1. Ground Contact Shadow
    const shadow = new THREE.Mesh(this.shadowCircleGeo, this.pedShadowMat);
    shadow.position.set(0, 0.02, 0);
    ped.add(shadow);

    // If official SMPL rigged GLB is loaded, clone it via SkeletonUtils
    if (this.smplTemplate) {
      const clone = SkeletonUtils.clone(this.smplTemplate) as THREE.Group;
      clone.name = 'SMPL_Rigged_Body';
      ped.add(clone);

      const hips = clone.getObjectByName('Hips') || clone;
      const spine = clone.getObjectByName('Spine');
      const chest = clone.getObjectByName('Chest');
      const neck = clone.getObjectByName('Neck');
      const head = clone.getObjectByName('Head');
      const armL = clone.getObjectByName('LeftArm') || clone;
      const elbowL = clone.getObjectByName('LeftForeArm') || clone;
      const armR = clone.getObjectByName('RightArm') || clone;
      const elbowR = clone.getObjectByName('RightForeArm') || clone;
      const legL = clone.getObjectByName('LeftUpLeg') || clone;
      const kneeL = clone.getObjectByName('LeftLeg') || clone;
      const legR = clone.getObjectByName('RightUpLeg') || clone;
      const kneeR = clone.getObjectByName('RightLeg') || clone;

      return {
        mesh: ped,
        limbs: {
          bodyRoot: clone,
          hips,
          spine: spine || undefined,
          chest: chest || undefined,
          neck: neck || undefined,
          head: head || undefined,
          armL,
          elbowL,
          armR,
          elbowR,
          legL,
          kneeL,
          legR,
          kneeR,
        },
      };
    }

    // 2. Procedural Anatomical SMPL Model (Fallback & Immediate Init)
    const bodyRoot = new THREE.Group();
    bodyRoot.position.set(0, 0, 0);
    ped.add(bodyRoot);

    const pelvis = new THREE.Mesh(this.pedPelvisGeo, this.pedAccentMat);
    pelvis.position.set(0, 0.88, 0);
    bodyRoot.add(pelvis);

    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.94, 0);
    bodyRoot.add(torsoGroup);

    const abdomen = new THREE.Mesh(this.pedAbdomenGeo, this.pedMat);
    abdomen.position.set(0, 0.08, 0);
    torsoGroup.add(abdomen);

    const chest = new THREE.Mesh(this.pedChestGeo, this.pedMat);
    chest.position.set(0, 0.28, 0);
    torsoGroup.add(chest);

    const neck = new THREE.Mesh(this.pedNeckGeo, this.pedAccentMat);
    neck.position.set(0, 0.44, 0);
    torsoGroup.add(neck);

    const head = new THREE.Mesh(this.pedHeadGeo, this.pedMat);
    head.position.set(0, 0.56, 0);
    const visor = new THREE.Mesh(this.pedVisorGeo, this.pedVisorMat);
    visor.position.set(0, 0.01, -0.08);
    head.add(visor);
    torsoGroup.add(head);

    const armL = new THREE.Group();
    armL.position.set(-0.21, 0.38, 0);
    const shoulderJointL = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    armL.add(shoulderJointL);
    const upperArmL = new THREE.Mesh(this.pedUpperArmGeo, this.pedMat);
    upperArmL.position.set(0, -0.14, 0);
    armL.add(upperArmL);

    const elbowL = new THREE.Group();
    elbowL.position.set(0, -0.28, 0);
    const elbowJointL = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    elbowL.add(elbowJointL);
    const foreArmL = new THREE.Mesh(this.pedForeArmGeo, this.pedMat);
    foreArmL.position.set(0, -0.13, 0);
    elbowL.add(foreArmL);
    const handL = new THREE.Mesh(this.pedHandGeo, this.pedAccentMat);
    handL.position.set(0, -0.27, 0);
    elbowL.add(handL);
    armL.add(elbowL);
    torsoGroup.add(armL);

    const armR = new THREE.Group();
    armR.position.set(0.21, 0.38, 0);
    const shoulderJointR = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    armR.add(shoulderJointR);
    const upperArmR = new THREE.Mesh(this.pedUpperArmGeo, this.pedMat);
    upperArmR.position.set(0, -0.14, 0);
    armR.add(upperArmR);

    const elbowR = new THREE.Group();
    elbowR.position.set(0, -0.28, 0);
    const elbowJointR = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    elbowR.add(elbowJointR);
    const foreArmR = new THREE.Mesh(this.pedForeArmGeo, this.pedMat);
    foreArmR.position.set(0, -0.13, 0);
    elbowR.add(foreArmR);
    const handR = new THREE.Mesh(this.pedHandGeo, this.pedAccentMat);
    handR.position.set(0, -0.27, 0);
    elbowR.add(handR);
    armR.add(elbowR);
    torsoGroup.add(armR);

    const legL = new THREE.Group();
    legL.position.set(-0.10, 0.84, 0);
    const hipJointL = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    legL.add(hipJointL);
    const thighL = new THREE.Mesh(this.pedThighGeo, this.pedMat);
    thighL.position.set(0, -0.20, 0);
    legL.add(thighL);

    const kneeL = new THREE.Group();
    kneeL.position.set(0, -0.40, 0);
    const kneeJointL = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    kneeL.add(kneeJointL);
    const shinL = new THREE.Mesh(this.pedShinGeo, this.pedMat);
    shinL.position.set(0, -0.18, 0);
    kneeL.add(shinL);
    const footL = new THREE.Mesh(this.pedFootGeo, this.pedAccentMat);
    footL.position.set(0, -0.37, 0.04);
    kneeL.add(footL);
    legL.add(kneeL);
    bodyRoot.add(legL);

    const legR = new THREE.Group();
    legR.position.set(0.10, 0.84, 0);
    const hipJointR = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    legR.add(hipJointR);
    const thighR = new THREE.Mesh(this.pedThighGeo, this.pedMat);
    thighR.position.set(0, -0.20, 0);
    legR.add(thighR);

    const kneeR = new THREE.Group();
    kneeR.position.set(0, -0.40, 0);
    const kneeJointR = new THREE.Mesh(this.pedJointGeo, this.pedAccentMat);
    kneeR.add(kneeJointR);
    const shinR = new THREE.Mesh(this.pedShinGeo, this.pedMat);
    shinR.position.set(0, -0.18, 0);
    kneeR.add(shinR);
    const footR = new THREE.Mesh(this.pedFootGeo, this.pedAccentMat);
    footR.position.set(0, -0.37, 0.04);
    kneeR.add(footR);
    legR.add(kneeR);
    bodyRoot.add(legR);

    return {
      mesh: ped,
      limbs: {
        bodyRoot,
        hips: pelvis,
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
    canvas.width = 160;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.75, 0.24, 1);
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
    ctx.clearRect(0, 0, 160, 48);

    ctx.fillStyle = isHazard ? 'rgba(239, 68, 68, 0.90)' : 'rgba(15, 23, 42, 0.82)';
    ctx.beginPath();
    const r = 18;
    ctx.moveTo(r, 6);
    ctx.lineTo(160 - r, 6);
    ctx.arcTo(160 - 6, 6, 160 - 6, 42, r);
    ctx.arcTo(160 - 6, 42, 6, 42, r);
    ctx.arcTo(6, 42, 6, 6, r);
    ctx.arcTo(6, 6, 160 - r, 6, r);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isHazard ? '#f87171' : 'rgba(148, 163, 184, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 80, 24);

    (data.texture as THREE.CanvasTexture).needsUpdate = true;
  }

  private buildActor(obj: PerceptionObject, seedIndex: number): Actor {
    const group = new THREE.Group();

    // Create pedestrian
    const { mesh: pedMesh, limbs } = this.createPedestrianMesh();

    const meshes: Record<string, THREE.Object3D> = {
      PEDESTRIAN: pedMesh,
      CONE: this.createConeMesh(),
      CAR: this.createCarMesh(),
      TRUCK: this.createTruckMesh(),
      BUS: this.createTruckMesh(),
      BICYCLE: this.createCyclistMesh(),
      MOTORCYCLE: this.createCyclistMesh(),
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
    };
  }

  private resolveActiveModel(obj: PerceptionObject): string | null {
    if (obj.label === 'PEDESTRIAN') return 'PEDESTRIAN';
    if (obj.label === 'CAR') return 'CAR';
    if (obj.label === 'TRUCK' || obj.label === 'BUS') return 'TRUCK';
    if (obj.label === 'BICYCLE' || obj.label === 'MOTORCYCLE') return 'BICYCLE';
    if ((obj.label as string) === 'CONE') return 'CONE';
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
      const hScale = Math.min(Math.max(height / 1.75, 0.8), 1.25);
      active.scale.set(hScale, hScale, hScale);
    } else if (targetModel === 'CONE') {
      const coneScale = Math.min(Math.max((width + length) / 1.0, 0.8), 1.4);
      active.scale.set(coneScale, coneScale, coneScale);
    } else if (targetModel === 'CAR') {
      active.scale.set(Math.max(width / 1.85, 0.8), Math.max(height / 1.45, 0.8), Math.max(length / 4.3, 0.8));
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
    humanPoses?: HumanPosesPayload | null
  ) {
    const now = performance.now() / 1000;
    const step = Math.min(dt > 0 ? dt : 0.016, 0.1);
    this.animTime += step;

    const poses = humanPoses?.poses;
    const seen = new Set<string>();
    if (perceptionList && perceptionList.length > 0) {
      perceptionList.forEach((obj, index) => {
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

        let actor = this.actors.get(key);
        if (!actor) {
          actor = this.buildActor(obj, index);
          actor.group.position.set(obj.x, obj.y || 0, obj.z);
          actor.group.rotation.y = obj.yaw || 0;
          this.actors.set(key, actor);
        }

        actor.lastSeen = now;
        actor.group.visible = true;
        actor.targetPos.set(obj.x, obj.y || 0, obj.z);
        actor.targetYaw = obj.yaw || 0;
        this.applyClassGeometry(actor, obj);

        // Check for matching human pose from RTMPose-s
        if (obj.label === 'PEDESTRIAN' && poses && poses.length > 0) {
          let matchedPose = poses.find((p) => p.id === String(obj.id));
          if (!matchedPose && poses.length === 1 && perceptionList.filter((o) => o.label === 'PEDESTRIAN').length === 1) {
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
            const kpts = matchedPose.keypoints;
            if (kpts && kpts.left_shoulder && kpts.right_shoulder) {
              actor.hasLivePose = true;

              // Left Arm kinematics
              if (kpts.left_elbow) {
                const dxl = kpts.left_elbow.x - kpts.left_shoulder.x;
                const dyl = kpts.left_elbow.y - kpts.left_shoulder.y;
                const rawRollL = Math.atan2(dxl, Math.max(0.1, dyl));
                actor.poseTarget.rollL = THREE.MathUtils.clamp(rawRollL, -0.4, 2.5);

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
              }

              // Right Arm kinematics
              if (kpts.right_elbow) {
                const dxr = kpts.right_elbow.x - kpts.right_shoulder.x;
                const dyr = kpts.right_elbow.y - kpts.right_shoulder.y;
                const rawRollR = Math.atan2(-dxr, Math.max(0.1, dyr));
                actor.poseTarget.rollR = THREE.MathUtils.clamp(rawRollR, -0.4, 2.5);

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
              }

              // Torso roll
              const dshX = kpts.left_shoulder.x - kpts.right_shoulder.x;
              const dshY = kpts.left_shoulder.y - kpts.right_shoulder.y;
              actor.poseTarget.torsoRoll = Math.atan2(dshY, Math.max(10, dshX)) * 0.7;

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
    const TWO_PI = Math.PI * 2;

    for (const [key, actor] of this.actors) {
      const isVisible = seen.has(key);
      if (!isVisible && now - actor.lastSeen > 0.5) {
        actor.group.visible = false;
        continue;
      }

      // Smooth position & rotation
      actor.group.position.lerp(actor.targetPos, posLerp);
      const rawDiff = actor.targetYaw - actor.group.rotation.y + Math.PI;
      const delta = (((rawDiff % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
      actor.group.rotation.y += delta * yawLerp;

      // Update lead hazard badge and proximity highlight
      const distBadge = actor.meshes['__dist'] as THREE.Sprite | undefined;
      const isLead = key === leadKey && closestDist < 8.0;
      if (distBadge) {
        if (isLead) {
          distBadge.visible = true;
          const isCritical = closestDist < 3.5;
          distBadge.position.y = actor.meshes['PEDESTRIAN']?.visible ? (actor.isSeated ? 1.7 : 2.1) : 1.35;
          const postureTag = actor.meshes['PEDESTRIAN']?.visible ? ` • ${actor.postureText}${actor.hasLivePose ? ' (RTMPose)' : ''}` : '';
          const dStr = `${closestDist.toFixed(1)} m${postureTag}`;
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

        // Seated vertical pelvis drop
        actor.limbs.hips.position.y = 0.86 - 0.34 * sb;

        // Ergonomic forward lean when seated
        actor.limbs.hips.rotation.x = 0.08 * sb;

        // Kinematic joint angles
        const seatedHip = 1.48 * sb;
        const seatedKnee = -1.40 * sb;
        const seatedArm = -0.55 * sb;
        const seatedElbow = 0.75 * sb;

        // Torso / Head articulation
        if (actor.limbs.spine) {
          actor.limbs.spine.rotation.z = -actor.poseCurrent.torsoRoll;
        }
        if (actor.limbs.head) {
          actor.limbs.head.rotation.y = actor.poseCurrent.headYaw;
        }

        // Walk cycle dynamics (weighted by standing ratio when no explicit keypoint leg constraint)
        const walkWeight = Math.max(0, 1.0 - sb);
        const walkFreq = 5.2;
        const walkPhase = this.animTime * walkFreq + actor.animSeed;
        const walkAngle = Math.sin(walkPhase) * 0.42 * walkWeight;
        const armAngle = Math.sin(walkPhase) * 0.35 * walkWeight;
        const kneeFlexL = Math.max(0, -walkAngle * 0.75) * walkWeight;
        const kneeFlexR = Math.max(0, walkAngle * 0.75) * walkWeight;

        // Leg articulation (hips & knees)
        actor.limbs.legL.rotation.x = seatedHip + walkAngle;
        actor.limbs.kneeL.rotation.x = seatedKnee - kneeFlexL;
        actor.limbs.legR.rotation.x = seatedHip - walkAngle;
        actor.limbs.kneeR.rotation.x = seatedKnee - kneeFlexR;

        // Arm articulation: blend RTMPose observed keypoints with seated/walk kinematics
        if (actor.hasLivePose) {
          // Observed RTMPose-s motion
          actor.limbs.armL.rotation.z = -actor.poseCurrent.rollL;
          actor.limbs.armL.rotation.x = seatedArm;
          actor.limbs.elbowL.rotation.x = Math.max(seatedElbow, actor.poseCurrent.elbowL);

          actor.limbs.armR.rotation.z = actor.poseCurrent.rollR;
          actor.limbs.armR.rotation.x = seatedArm;
          actor.limbs.elbowR.rotation.x = Math.max(seatedElbow, actor.poseCurrent.elbowR);
        } else {
          // Fallback procedural gait
          actor.limbs.armL.rotation.z = 0;
          actor.limbs.armL.rotation.x = seatedArm - armAngle;
          actor.limbs.elbowL.rotation.x = seatedElbow + (0.2 + Math.abs(armAngle) * 0.3) * walkWeight;

          actor.limbs.armR.rotation.z = 0;
          actor.limbs.armR.rotation.x = seatedArm + armAngle;
          actor.limbs.elbowR.rotation.x = seatedElbow + (0.2 + Math.abs(armAngle) * 0.3) * walkWeight;
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
  }
}
