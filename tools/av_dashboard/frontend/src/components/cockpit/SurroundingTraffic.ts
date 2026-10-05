import * as THREE from 'three';
import { PerceptionObject } from '../../types/can';

export class SurroundingTraffic {
  public group: THREE.Group;

  // Dynamic pool for live ROS2 perception objects
  private liveObjectPool: THREE.Group[] = [];

  // Shared Geometries & Materials (cached for maximum WebGL performance)
  private carBodyGeo: THREE.BufferGeometry;
  private carCabinGeo: THREE.BufferGeometry;
  private wheelGeo: THREE.CylinderGeometry;
  private pedBodyGeo: THREE.CapsuleGeometry;
  private pedHeadGeo: THREE.SphereGeometry;
  private boxGeo: THREE.BoxGeometry;

  private carPaintMat: THREE.MeshStandardMaterial;
  private cabinGlassMat: THREE.MeshBasicMaterial;
  private headlightMat: THREE.MeshBasicMaterial;
  private taillightMat: THREE.MeshBasicMaterial;
  private wheelMat: THREE.MeshBasicMaterial;
  private pedTorsoMat: THREE.MeshStandardMaterial;
  private pedSkinMat: THREE.MeshBasicMaterial;
  private pedHaloMat: THREE.MeshBasicMaterial;
  private boxMat: THREE.MeshStandardMaterial;

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

    // 2. Shared Materials
    this.carPaintMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sleek electric cyan / metallic
      roughness: 0.35,
      metalness: 0.65,
    });
    this.cabinGlassMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.85,
    });
    this.headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    this.wheelMat = new THREE.MeshBasicMaterial({ color: 0x18181b });

    this.pedTorsoMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // High-visibility amber jacket
      roughness: 0.6,
    });
    this.pedSkinMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });
    this.pedHaloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    this.boxMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Industrial amber cardboard/crate
      roughness: 0.8,
    });
  }

  /** Builds a stylized 3D Car with FSD-style bounding wireframe */
  private createCarMesh(colorHex = 0x38bdf8): THREE.Group {
    const car = new THREE.Group();

    // Lower Chassis Body
    const bodyMat = this.carPaintMat.clone();
    bodyMat.color.setHex(colorHex);
    const body = new THREE.Mesh(this.carBodyGeo, bodyMat);
    body.position.y = 0.55;
    car.add(body);

    // Cabin Glass
    const cabin = new THREE.Mesh(this.carCabinGeo, this.cabinGlassMat);
    cabin.position.set(0, 1.05, -0.2);
    car.add(cabin);

    // 4 Wheels
    const wFL = new THREE.Mesh(this.wheelGeo, this.wheelMat);
    wFL.position.set(0.92, 0.32, -1.2);
    car.add(wFL);

    const wFR = new THREE.Mesh(this.wheelGeo, this.wheelMat);
    wFR.position.set(-0.92, 0.32, -1.2);
    car.add(wFR);

    const wRL = new THREE.Mesh(this.wheelGeo, this.wheelMat);
    wRL.position.set(0.92, 0.32, 1.2);
    car.add(wRL);

    const wRR = new THREE.Mesh(this.wheelGeo, this.wheelMat);
    wRR.position.set(-0.92, 0.32, 1.2);
    car.add(wRR);

    // Headlights (Front -Z)
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), this.headlightMat);
    hlL.position.set(0.65, 0.6, -2.01);
    car.add(hlL);

    const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), this.headlightMat);
    hlR.position.set(-0.65, 0.6, -2.01);
    car.add(hlR);

    // Taillights (Rear +Z)
    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), this.taillightMat);
    tlL.position.set(0.65, 0.65, 2.01);
    car.add(tlL);

    const tlR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), this.taillightMat);
    tlR.position.set(-0.65, 0.65, 2.01);
    car.add(tlR);

    // Tesla FSD style bounding wireframe
    const bboxGeo = new THREE.BoxGeometry(2.0, 1.45, 4.2);
    const wireGeo = new THREE.WireframeGeometry(bboxGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    wire.position.y = 0.8;
    car.add(wire);

    return car;
  }

  /** Builds a stylized 3D Pedestrian / Passenger with proximity halo */
  private createPedestrianMesh(): THREE.Group {
    const ped = new THREE.Group();

    // Torso Capsule
    const torso = new THREE.Mesh(this.pedBodyGeo, this.pedTorsoMat);
    torso.position.y = 0.85;
    ped.add(torso);

    // Head Sphere
    const head = new THREE.Mesh(this.pedHeadGeo, this.pedSkinMat);
    head.position.y = 1.55;
    ped.add(head);

    // Ground Proximity Ring / Halo (FSD Detection Marker)
    const haloGeo = new THREE.RingGeometry(0.4, 0.65, 16);
    haloGeo.rotateX(-Math.PI / 2);
    const halo = new THREE.Mesh(haloGeo, this.pedHaloMat);
    halo.position.y = 0.03;
    ped.add(halo);

    return ped;
  }

  /** Builds an obstacle box / roadwork crate */
  private createBoxMesh(): THREE.Group {
    const group = new THREE.Group();
    const box = new THREE.Mesh(this.boxGeo, this.boxMat);
    box.position.y = 0.4;
    group.add(box);

    // Wireframe bounding marker
    const wireGeo = new THREE.WireframeGeometry(new THREE.BoxGeometry(1.0, 0.9, 1.0));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6,
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    wire.position.y = 0.45;
    group.add(wire);

    return group;
  }

  /**
   * Main per-frame update loop.
   * Strictly renders real-world Autoware perception objects only.
   * If Autoware is offline or 0 objects are detected, no actors are rendered.
   */
  public update(
    _egoSpeedKmh: number,
    perceptionList: PerceptionObject[] | undefined,
    _rosActive: boolean,
    _dt: number
  ) {
    if (perceptionList && perceptionList.length > 0) {
      this.renderLivePerceptionObjects(perceptionList);
    } else {
      // Clear live pool when 0 objects detected
      for (let i = 0; i < this.liveObjectPool.length; i++) {
        this.liveObjectPool[i].visible = false;
      }
    }
  }

  /** Render real-world Autoware / ROS 2 3D detected obstacles */
  private renderLivePerceptionObjects(objects: PerceptionObject[]) {
    // Ensure object pool has enough instances
    while (this.liveObjectPool.length < objects.length) {
      const objGroup = new THREE.Group();
      const car = this.createCarMesh(0x38bdf8);
      const ped = this.createPedestrianMesh();
      const box = this.createBoxMesh();

      car.name = 'CAR';
      ped.name = 'PEDESTRIAN';
      box.name = 'BOX';

      objGroup.add(car);
      objGroup.add(ped);
      objGroup.add(box);

      this.group.add(objGroup);
      this.liveObjectPool.push(objGroup);
    }

    for (let i = 0; i < this.liveObjectPool.length; i++) {
      const group = this.liveObjectPool[i];
      if (i < objects.length) {
        const obj = objects[i];
        group.visible = true;

        // Position & Orientation (Three.js coordinates: X lateral, Y elevation, Z forward=-Z)
        group.position.set(obj.x, obj.y || 0, obj.z);
        group.rotation.y = obj.yaw || 0;

        const carChild = group.getObjectByName('CAR');
        const pedChild = group.getObjectByName('PEDESTRIAN');
        const boxChild = group.getObjectByName('BOX');

        if (obj.label === 'PEDESTRIAN') {
          if (carChild) carChild.visible = false;
          if (pedChild) pedChild.visible = true;
          if (boxChild) boxChild.visible = false;
        } else if (obj.label === 'BOX') {
          if (carChild) carChild.visible = false;
          if (pedChild) pedChild.visible = false;
          if (boxChild) boxChild.visible = true;
        } else {
          // Cars, Trucks, Vans, Buses
          if (carChild) carChild.visible = true;
          if (pedChild) pedChild.visible = false;
          if (boxChild) boxChild.visible = false;

          // Scale car if dimensions available (dx=length, dy=width, dz=height)
          if (obj.dx && obj.dy) {
            carChild?.scale.set(obj.dy / 1.8, (obj.dz || 1.4) / 1.4, obj.dx / 4.0);
          }
        }
      } else {
        group.visible = false;
      }
    }
  }
}
