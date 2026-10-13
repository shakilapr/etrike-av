import * as THREE from 'three';
import { PerceptionObject } from '../../types/can';

interface Actor {
  group: THREE.Group;
  meshes: Record<string, THREE.Object3D>;
  currentLabel: string;
  lastSeen: number;
  targetPos: THREE.Vector3;
  targetYaw: number;
}

const CLASS_COLORS: Record<string, number> = {
  CAR: 0x38bdf8,
  TRUCK: 0x60a5fa,
  BUS: 0x818cf8,
  MOTORCYCLE: 0x34d399,
  BICYCLE: 0x34d399,
  PEDESTRIAN: 0xf59e0b,
  BOX: 0xd97706,
  UNKNOWN: 0x9ca3af,
};

export class SurroundingTraffic {
  public group: THREE.Group;

  // Dynamic pool for live ROS2 perception objects, keyed by stable object id.
  private actors: Map<string, Actor> = new Map();
  private labelMaterials: Map<string, THREE.SpriteMaterial> = new Map();

  // Shared Geometries & Materials (cached for maximum WebGL performance)
  private carBodyGeo: THREE.BoxGeometry;
  private carCabinGeo: THREE.BoxGeometry;
  private wheelGeo: THREE.CylinderGeometry;
  private pedBodyGeo: THREE.CapsuleGeometry;
  private pedHeadGeo: THREE.SphereGeometry;
  private boxGeo: THREE.BoxGeometry;
  private truckBodyGeo: THREE.BoxGeometry;
  private truckCabGeo: THREE.BoxGeometry;

  private cabinGlassMat: THREE.MeshBasicMaterial;
  private headlightMat: THREE.MeshBasicMaterial;
  private taillightMat: THREE.MeshBasicMaterial;
  private wheelMat: THREE.MeshBasicMaterial;
  private pedSkinMat: THREE.MeshBasicMaterial;
  private pedHaloMat: THREE.MeshBasicMaterial;

  private lastUpdateTime = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Shared Geometries
    this.carBodyGeo = new THREE.BoxGeometry(1.8, 0.6, 4.0);
    this.carCabinGeo = new THREE.BoxGeometry(1.5, 0.55, 2.2);
    this.wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12);
    this.wheelGeo.rotateZ(Math.PI / 2);

    this.pedBodyGeo = new THREE.CapsuleGeometry(0.24, 0.8, 4, 8);
    this.pedHeadGeo = new THREE.SphereGeometry(0.18, 8, 8);
    this.boxGeo = new THREE.BoxGeometry(0.9, 0.8, 0.9);

    this.truckBodyGeo = new THREE.BoxGeometry(2.4, 2.4, 7.0);
    this.truckCabGeo = new THREE.BoxGeometry(2.3, 1.6, 2.0);

    // 2. Shared Materials
    this.cabinGlassMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.85,
    });
    this.headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    this.wheelMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
    this.pedSkinMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });
    this.pedHaloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
  }

  /** Builds a stylized 3D Car with FSD-style bounding wireframe */
  private createCarMesh(colorHex: number): THREE.Group {
    const car = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.35, metalness: 0.65 });

    const body = new THREE.Mesh(this.carBodyGeo, bodyMat);
    body.position.y = 0.55;
    car.add(body);

    const cabin = new THREE.Mesh(this.carCabinGeo, this.cabinGlassMat);
    cabin.position.set(0, 1.05, -0.2);
    car.add(cabin);

    for (const [wx, wz] of [
      [0.92, -1.2],
      [-0.92, -1.2],
      [0.92, 1.2],
      [-0.92, 1.2],
    ]) {
      const wheel = new THREE.Mesh(this.wheelGeo, this.wheelMat);
      wheel.position.set(wx, 0.32, wz);
      car.add(wheel);
    }

    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), this.headlightMat);
    hlL.position.set(0.65, 0.6, -2.01);
    car.add(hlL);
    const hlR = hlL.clone();
    hlR.position.x = -0.65;
    car.add(hlR);

    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), this.taillightMat);
    tlL.position.set(0.65, 0.65, 2.01);
    car.add(tlL);
    const tlR = tlL.clone();
    tlR.position.x = -0.65;
    car.add(tlR);

    car.add(this.createBoundingBox(2.0, 1.45, 4.2, colorHex, 0.45, 0.8));
    return car;
  }

  /** Builds a large box truck / bus. */
  private createTruckMesh(colorHex: number): THREE.Group {
    const truck = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5, metalness: 0.4 });

    const body = new THREE.Mesh(this.truckBodyGeo, bodyMat);
    body.position.set(0, 1.5, 0.6);
    truck.add(body);

    const cab = new THREE.Mesh(this.truckCabGeo, bodyMat);
    cab.position.set(0, 1.1, -3.2);
    truck.add(cab);

    for (const [wx, wz] of [
      [1.25, -3.2],
      [-1.25, -3.2],
      [1.25, 2.4],
      [-1.25, 2.4],
    ]) {
      const wheel = new THREE.Mesh(this.wheelGeo, this.wheelMat);
      wheel.position.set(wx, 0.45, wz);
      wheel.scale.setScalar(1.4);
      truck.add(wheel);
    }

    truck.add(this.createBoundingBox(2.5, 2.8, 8.0, colorHex, 0.4, 1.4));
    return truck;
  }

  /** Builds a two-wheeler (bicycle / motorcycle) with rider. */
  private createCyclistMesh(colorHex: number): THREE.Group {
    const two = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });

    const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wF = new THREE.Mesh(wheelGeo, this.wheelMat);
    wF.position.set(0, 0.34, -0.7);
    two.add(wF);
    const wR = new THREE.Mesh(wheelGeo, this.wheelMat);
    wR.position.set(0, 0.34, 0.7);
    two.add(wR);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.4), frameMat);
    frame.position.set(0, 0.6, 0);
    two.add(frame);

    const rider = new THREE.Mesh(this.pedBodyGeo, frameMat);
    rider.position.y = 1.15;
    rider.scale.setScalar(0.9);
    two.add(rider);
    const head = new THREE.Mesh(this.pedHeadGeo, this.pedSkinMat);
    head.position.y = 1.78;
    two.add(head);

    two.add(this.createBoundingBox(1.0, 1.9, 2.0, colorHex, 0.4, 0.95));
    return two;
  }

  /** Builds a stylized 3D Pedestrian / Passenger with proximity halo */
  private createPedestrianMesh(colorHex: number): THREE.Group {
    const ped = new THREE.Group();
    const torsoMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });

    const torso = new THREE.Mesh(this.pedBodyGeo, torsoMat);
    torso.position.y = 0.85;
    ped.add(torso);

    const head = new THREE.Mesh(this.pedHeadGeo, this.pedSkinMat);
    head.position.y = 1.55;
    ped.add(head);

    const haloGeo = new THREE.RingGeometry(0.4, 0.65, 16);
    haloGeo.rotateX(-Math.PI / 2);
    const halo = new THREE.Mesh(haloGeo, this.pedHaloMat);
    halo.position.y = 0.03;
    ped.add(halo);

    ped.add(this.createBoundingBox(0.7, 1.8, 0.7, colorHex, 0.55, 0.9));
    return ped;
  }

  /** Builds an obstacle box / roadwork crate */
  private createBoxMesh(colorHex: number): THREE.Group {
    const group = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.8 });
    const box = new THREE.Mesh(this.boxGeo, boxMat);
    box.position.y = 0.4;
    group.add(box);
    group.add(this.createBoundingBox(1.0, 0.9, 1.0, colorHex, 0.6, 0.45));
    return group;
  }

  /** FSD-style bounding wireframe marker. */
  private createBoundingBox(
    w: number,
    h: number,
    l: number,
    colorHex: number,
    opacity: number,
    yOffset: number
  ): THREE.LineSegments {
    const geo = new THREE.WireframeGeometry(new THREE.BoxGeometry(w, h, l));
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity });
    const wire = new THREE.LineSegments(geo, mat);
    wire.position.y = yOffset;
    return wire;
  }

  /** Cached canvas texture label (class name) so actors are self-describing. */
  private getLabelMaterial(label: string, colorHex: number): THREE.SpriteMaterial {
    const existing = this.labelMaterials.get(label);
    if (existing) return existing;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cssColor = `#${colorHex.toString(16).padStart(6, '0')}`;
      ctx.fillStyle = 'rgba(8, 8, 8, 0.82)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = cssColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
      ctx.fillStyle = cssColor;
      ctx.font = 'bold 34px monospace';
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

  private buildActor(obj: PerceptionObject): Actor {
    const colorHex = CLASS_COLORS[obj.label] ?? CLASS_COLORS.UNKNOWN;
    const group = new THREE.Group();

    const meshes: Record<string, THREE.Object3D> = {
      CAR: this.createCarMesh(colorHex),
      TRUCK: this.createTruckMesh(colorHex),
      BUS: this.createTruckMesh(colorHex),
      BICYCLE: this.createCyclistMesh(colorHex),
      MOTORCYCLE: this.createCyclistMesh(colorHex),
      PEDESTRIAN: this.createPedestrianMesh(colorHex),
      BOX: this.createBoxMesh(colorHex),
      UNKNOWN: this.createBoxMesh(CLASS_COLORS.UNKNOWN),
    };
    for (const mesh of Object.values(meshes)) {
      group.add(mesh);
    }

    const label = new THREE.Sprite(this.getLabelMaterial(obj.label, colorHex));
    label.position.y = 2.5;
    label.scale.set(1.6, 0.4, 1);
    group.add(label);
    meshes['__label'] = label;

    this.group.add(group);
    return {
      group,
      meshes,
      currentLabel: obj.label,
      lastSeen: 0,
      targetPos: new THREE.Vector3(),
      targetYaw: 0,
    };
  }

  private applyClassGeometry(actor: Actor, obj: PerceptionObject) {
    for (const [key, mesh] of Object.entries(actor.meshes)) {
      if (key.startsWith('__')) continue;
      mesh.visible = key === obj.label || (key === 'UNKNOWN' && !CLASS_COLORS[obj.label]);
    }

    if (actor.currentLabel !== obj.label) {
      actor.currentLabel = obj.label;
      const labelSprite = actor.meshes['__label'] as THREE.Sprite | undefined;
      if (labelSprite) {
        const colorHex = CLASS_COLORS[obj.label] ?? CLASS_COLORS.UNKNOWN;
        labelSprite.material = this.getLabelMaterial(obj.label, colorHex);
      }
    }

    const active = actor.meshes[obj.label] ?? actor.meshes['UNKNOWN'];
    if (!active) return;

    // Scale actors from reported obstacle dimensions (dx=length, dy=width, dz=height).
    const width = obj.dy && obj.dy > 0 ? obj.dy : 1.8;
    const length = obj.dx && obj.dx > 0 ? obj.dx : 4.0;
    const height = obj.dz && obj.dz > 0 ? obj.dz : 1.5;

    if (obj.label === 'PEDESTRIAN') {
      active.scale.set(1, height / 1.8, 1);
    } else if (obj.label === 'BICYCLE' || obj.label === 'MOTORCYCLE') {
      active.scale.set(Math.max(width / 0.8, 0.7), height / 1.6, Math.max(length / 1.8, 0.7));
    } else if (obj.label === 'TRUCK' || obj.label === 'BUS') {
      active.scale.set(width / 2.5, height / 2.8, length / 8.0);
    } else {
      active.scale.set(width / 1.8, height / 1.4, length / 4.2);
    }
  }

  private disposeActor(actor: Actor) {
    actor.group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
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
   * Renders only real-world Autoware perception objects. When Autoware is offline or
   * zero objects are detected, all actors fade out and are recycled.
   */
  public update(
    _egoSpeedKmh: number,
    perceptionList: PerceptionObject[] | undefined,
    _rosActive: boolean,
    dt: number
  ) {
    const now = performance.now() / 1000;
    const step = Math.min(dt > 0 ? dt : 0.016, 0.1);

    const seen = new Set<string>();
    if (perceptionList && perceptionList.length > 0) {
      perceptionList.forEach((obj, index) => {
        // Only meaningful when ego pose is valid: the bridge zeroes coordinates otherwise.
        const key = String(obj.id || `anon-${index}`);
        seen.add(key);

        let actor = this.actors.get(key);
        if (!actor) {
          actor = this.buildActor(obj);
          // Spawn at target immediately to avoid flying in from the origin.
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

    // Smoothly interpolate every visible actor toward its latest target (10 Hz input -> 60 fps).
    const posLerp = 1 - Math.exp(-step * 12);
    const yawLerp = 1 - Math.exp(-step * 10);
    const TWO_PI = Math.PI * 2;
    for (const [key, actor] of this.actors) {
      const isVisible = seen.has(key);
      if (!isVisible && now - actor.lastSeen > 0.5) {
        actor.group.visible = false;
        continue;
      }
      actor.group.position.lerp(actor.targetPos, posLerp);
      const rawDiff = actor.targetYaw - actor.group.rotation.y + Math.PI;
      const delta = (((rawDiff % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI;
      actor.group.rotation.y += delta * yawLerp;
    }

    // Recycle actors that have been gone for a while to bound memory.
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
