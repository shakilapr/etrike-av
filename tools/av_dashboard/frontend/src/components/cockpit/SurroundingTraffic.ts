import * as THREE from 'three';
import { PerceptionObject } from '../../types/can';

interface ActorLimbs {
  armL?: THREE.Group;
  armR?: THREE.Group;
  legL?: THREE.Group;
  legR?: THREE.Group;
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
}

const CLASS_COLORS: Record<string, number> = {
  CAR: 0x94a3b8,
  TRUCK: 0x64748b,
  BUS: 0x64748b,
  MOTORCYCLE: 0x34d399,
  BICYCLE: 0x34d399,
  PEDESTRIAN: 0xd4d4d8,
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

  // Shared Materials
  private pedMat: THREE.MeshStandardMaterial;
  private pedShadowMat: THREE.MeshBasicMaterial;
  private pedHazardMat: THREE.MeshBasicMaterial;

  private carPaintMat: THREE.MeshStandardMaterial;
  private carGlassMat: THREE.MeshStandardMaterial;
  private truckPaintMat: THREE.MeshStandardMaterial;

  private coneOrangeMat: THREE.MeshStandardMaterial;
  private coneWhiteMat: THREE.MeshStandardMaterial;
  private coneBaseMat: THREE.MeshStandardMaterial;

  private headlightMat: THREE.MeshBasicMaterial;
  private taillightMat: THREE.MeshBasicMaterial;
  private wheelTireMat: THREE.MeshStandardMaterial;
  private wheelRimMat: THREE.MeshStandardMaterial;
  private shadowMat: THREE.MeshBasicMaterial;

  // Shared Geometries
  private shadowCircleGeo: THREE.CircleGeometry;
  private wheelTireGeo: THREE.CylinderGeometry;
  private wheelRimGeo: THREE.CylinderGeometry;

  // Pedestrian Geometries
  private pedHeadGeo: THREE.SphereGeometry;
  private pedNeckGeo: THREE.CylinderGeometry;
  private pedTorsoGeo: THREE.BoxGeometry;
  private pedPelvisGeo: THREE.BoxGeometry;
  private pedUpperArmGeo: THREE.CylinderGeometry;
  private pedForeArmGeo: THREE.CylinderGeometry;
  private pedHandGeo: THREE.SphereGeometry;
  private pedThighGeo: THREE.CylinderGeometry;
  private pedShinGeo: THREE.CylinderGeometry;
  private pedFootGeo: THREE.BoxGeometry;

  // Cone Geometries
  private coneBaseGeo: THREE.BoxGeometry;
  private coneBodyGeo: THREE.CylinderGeometry;
  private coneReflectGeo: THREE.CylinderGeometry;

  constructor() {
    this.group = new THREE.Group();

    // 1. Shared Materials (Tesla Autopilot / FSD Aesthetic)
    this.pedMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.32,
      metalness: 0.28,
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
      color: 0x94a3b8, // Tesla satin grey/silver
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

    // Pedestrian Geometries (Humanoid Articulated Skeleton)
    this.pedHeadGeo = new THREE.SphereGeometry(0.12, 16, 16);
    this.pedNeckGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.08, 12);
    this.pedTorsoGeo = new THREE.BoxGeometry(0.32, 0.44, 0.18);
    this.pedPelvisGeo = new THREE.BoxGeometry(0.26, 0.14, 0.16);

    this.pedUpperArmGeo = new THREE.CylinderGeometry(0.038, 0.034, 0.32, 10);
    this.pedForeArmGeo = new THREE.CylinderGeometry(0.032, 0.028, 0.28, 10);
    this.pedHandGeo = new THREE.SphereGeometry(0.032, 8, 8);

    this.pedThighGeo = new THREE.CylinderGeometry(0.065, 0.052, 0.42, 12);
    this.pedShinGeo = new THREE.CylinderGeometry(0.05, 0.042, 0.42, 12);
    this.pedFootGeo = new THREE.BoxGeometry(0.09, 0.07, 0.2);

    // Traffic Cone Geometries
    this.coneBaseGeo = new THREE.BoxGeometry(0.38, 0.04, 0.38);
    this.coneBodyGeo = new THREE.CylinderGeometry(0.035, 0.18, 0.65, 20);
    this.coneReflectGeo = new THREE.CylinderGeometry(0.08, 0.13, 0.16, 20);
  }

  /**
   * Builds an articulated Tesla-style humanoid pedestrian with swinging walk cycle limbs.
   */
  private createPedestrianMesh(): { mesh: THREE.Group; limbs: ActorLimbs } {
    const ped = new THREE.Group();

    // 1. Head & Neck
    const head = new THREE.Mesh(this.pedHeadGeo, this.pedMat);
    head.position.set(0, 1.58, 0);
    ped.add(head);

    const neck = new THREE.Mesh(this.pedNeckGeo, this.pedMat);
    neck.position.set(0, 1.45, 0);
    ped.add(neck);

    // 2. Torso & Pelvis
    const torso = new THREE.Mesh(this.pedTorsoGeo, this.pedMat);
    torso.position.set(0, 1.2, 0);
    ped.add(torso);

    const pelvis = new THREE.Mesh(this.pedPelvisGeo, this.pedMat);
    pelvis.position.set(0, 0.93, 0);
    ped.add(pelvis);

    // 3. Left Arm with shoulder pivot
    const armL = new THREE.Group();
    armL.position.set(-0.21, 1.38, 0);
    const upperArmL = new THREE.Mesh(this.pedUpperArmGeo, this.pedMat);
    upperArmL.position.set(0, -0.16, 0);
    armL.add(upperArmL);
    const foreArmL = new THREE.Mesh(this.pedForeArmGeo, this.pedMat);
    foreArmL.position.set(0, -0.42, 0.03);
    armL.add(foreArmL);
    const handL = new THREE.Mesh(this.pedHandGeo, this.pedMat);
    handL.position.set(0, -0.58, 0.05);
    armL.add(handL);
    ped.add(armL);

    // 4. Right Arm with shoulder pivot
    const armR = new THREE.Group();
    armR.position.set(0.21, 1.38, 0);
    const upperArmR = new THREE.Mesh(this.pedUpperArmGeo, this.pedMat);
    upperArmR.position.set(0, -0.16, 0);
    armR.add(upperArmR);
    const foreArmR = new THREE.Mesh(this.pedForeArmGeo, this.pedMat);
    foreArmR.position.set(0, -0.42, 0.03);
    armR.add(foreArmR);
    const handR = new THREE.Mesh(this.pedHandGeo, this.pedMat);
    handR.position.set(0, -0.58, 0.05);
    armR.add(handR);
    ped.add(armR);

    // 5. Left Leg with hip pivot
    const legL = new THREE.Group();
    legL.position.set(-0.09, 0.86, 0);
    const thighL = new THREE.Mesh(this.pedThighGeo, this.pedMat);
    thighL.position.set(0, -0.21, 0);
    legL.add(thighL);
    const shinL = new THREE.Mesh(this.pedShinGeo, this.pedMat);
    shinL.position.set(0, -0.6, 0);
    legL.add(shinL);
    const footL = new THREE.Mesh(this.pedFootGeo, this.pedMat);
    footL.position.set(0, -0.83, 0.04);
    legL.add(footL);
    ped.add(legL);

    // 6. Right Leg with hip pivot
    const legR = new THREE.Group();
    legR.position.set(0.09, 0.86, 0);
    const thighR = new THREE.Mesh(this.pedThighGeo, this.pedMat);
    thighR.position.set(0, -0.21, 0);
    legR.add(thighR);
    const shinR = new THREE.Mesh(this.pedShinGeo, this.pedMat);
    shinR.position.set(0, -0.6, 0);
    legR.add(shinR);
    const footR = new THREE.Mesh(this.pedFootGeo, this.pedMat);
    footR.position.set(0, -0.83, 0.04);
    legR.add(footR);
    ped.add(legR);

    // 7. Ground Contact Shadow
    const shadow = new THREE.Mesh(this.shadowCircleGeo, this.pedShadowMat);
    shadow.position.set(0, 0.02, 0);
    ped.add(shadow);

    return {
      mesh: ped,
      limbs: { armL, armR, legL, legR },
    };
  }

  /**
   * Builds an authentic Tesla safety road cone (Traffic Cone).
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
   * Builds a sleek Tesla Model 3/Y style aerodynamic sedan.
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
    const torso = new THREE.Mesh(this.pedTorsoGeo, this.pedMat);
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
   * Minimalist floating badge for actor classification & distance.
   */
  private getLabelMaterial(label: string, colorHex: number): THREE.SpriteMaterial {
    const existing = this.labelMaterials.get(label);
    if (existing) return existing;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cssColor = `#${colorHex.toString(16).padStart(6, '0')}`;
      ctx.fillStyle = 'rgba(8, 8, 8, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = cssColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
      ctx.fillStyle = cssColor;
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    this.labelMaterials.set(label, material);
    return material;
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
      BOX: this.createConeMesh(),
      UNKNOWN: this.createConeMesh(),
    };

    for (const mesh of Object.values(meshes)) {
      group.add(mesh);
    }

    const colorHex = CLASS_COLORS[obj.label] ?? CLASS_COLORS.UNKNOWN;
    const labelSprite = new THREE.Sprite(this.getLabelMaterial(obj.label, colorHex));
    labelSprite.position.y = 2.2;
    labelSprite.scale.set(1.4, 0.35, 1);
    group.add(labelSprite);
    meshes['__label'] = labelSprite;

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
    };
  }

  private resolveActiveModel(obj: PerceptionObject): string {
    const isSmall = Math.max(obj.dx || 0, obj.dy || 0, obj.dz || 0) <= 0.85;
    if (obj.label === 'PEDESTRIAN') return 'PEDESTRIAN';
    if (obj.label === 'CAR') return 'CAR';
    if (obj.label === 'TRUCK' || obj.label === 'BUS') return 'TRUCK';
    if (obj.label === 'BICYCLE' || obj.label === 'MOTORCYCLE') return 'BICYCLE';
    if ((obj.label as string) === 'CONE' || isSmall) return 'CONE';
    return 'CAR';
  }

  private applyClassGeometry(actor: Actor, obj: PerceptionObject) {
    const targetModel = this.resolveActiveModel(obj);

    for (const [key, mesh] of Object.entries(actor.meshes)) {
      if (key.startsWith('__')) continue;
      mesh.visible = key === targetModel;
    }

    if (actor.currentLabel !== obj.label) {
      actor.currentLabel = obj.label;
      const labelSprite = actor.meshes['__label'] as THREE.Sprite | undefined;
      if (labelSprite) {
        const colorHex = CLASS_COLORS[targetModel] ?? CLASS_COLORS.UNKNOWN;
        labelSprite.material = this.getLabelMaterial(targetModel, colorHex);
      }
    }

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
    });
  }

  /**
   * Main per-frame update loop.
   * Renders real-world Autoware perception objects with authentic Tesla FSD animations.
   */
  public update(
    _egoSpeedKmh: number,
    perceptionList: PerceptionObject[] | undefined,
    _rosActive: boolean,
    dt: number
  ) {
    const now = performance.now() / 1000;
    const step = Math.min(dt > 0 ? dt : 0.016, 0.1);
    this.animTime += step;

    const seen = new Set<string>();
    if (perceptionList && perceptionList.length > 0) {
      perceptionList.forEach((obj, index) => {
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
      });
    }

    // Smooth position interpolation and animate walk cycles
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

      // Dynamic humanoid walking animation
      if (actor.limbs && actor.meshes['PEDESTRIAN']?.visible) {
        const walkFreq = 5.2; // Natural pedestrian cadence
        const walkPhase = this.animTime * walkFreq + actor.animSeed;
        const walkAngle = Math.sin(walkPhase) * 0.42;
        const armAngle = Math.sin(walkPhase) * 0.35;

        if (actor.limbs.legL) actor.limbs.legL.rotation.x = walkAngle;
        if (actor.limbs.legR) actor.limbs.legR.rotation.x = -walkAngle;
        if (actor.limbs.armL) actor.limbs.armL.rotation.x = -armAngle;
        if (actor.limbs.armR) actor.limbs.armR.rotation.x = armAngle;
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
