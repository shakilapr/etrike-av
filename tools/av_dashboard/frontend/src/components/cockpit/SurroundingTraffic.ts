import * as THREE from 'three';
import { PerceptionObject } from '../../types/can';

interface SimulatedActor {
  id: string;
  type: 'CAR' | 'TRUCK' | 'PEDESTRIAN' | 'BOX';
  x: number;
  z: number;
  speedMs: number;
  targetX: number;
  heading: number;
  color: number;
  mesh: THREE.Group;
  bboxMesh?: THREE.LineSegments;
  bobPhase?: number;
}

export class SurroundingTraffic {
  public group: THREE.Group;

  // Active simulated actors when offline
  private actors: SimulatedActor[] = [];

  // Dynamic pool for live ROS2 perception objects
  private liveObjectPool: THREE.Group[] = [];
  private activeLiveCount = 0;

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

    // 3. Initialize Procedural Simulated Traffic (Always lively when offline)
    this.initSimulatedActors();
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

  /** Initialize default simulated traffic for offline rich visual experience */
  private initSimulatedActors() {
    // 1. Lead Vehicle in adjacent left lane (overtaking at 26 km/h)
    const car1Mesh = this.createCarMesh(0x0284c7); // Deep Blue
    this.group.add(car1Mesh);
    this.actors.push({
      id: 'sim_car_1',
      type: 'CAR',
      x: -3.5,
      z: -35.0,
      speedMs: 7.2, // ~26 km/h
      targetX: -3.5,
      heading: 0,
      color: 0x0284c7,
      mesh: car1Mesh,
    });

    // 2. Slower vehicle ahead in right lane (cruising at 18 km/h)
    const car2Mesh = this.createCarMesh(0x10b981); // Emerald Green
    this.group.add(car2Mesh);
    this.actors.push({
      id: 'sim_car_2',
      type: 'CAR',
      x: 3.5,
      z: -18.0,
      speedMs: 5.0, // ~18 km/h
      targetX: 3.5,
      heading: 0,
      color: 0x10b981,
      mesh: car2Mesh,
    });

    // 3. Pedestrian walking along right sidewalk
    const ped1Mesh = this.createPedestrianMesh();
    this.group.add(ped1Mesh);
    this.actors.push({
      id: 'sim_ped_1',
      type: 'PEDESTRIAN',
      x: 7.8,
      z: -15.0,
      speedMs: 1.3, // ~4.6 km/h walking forward
      targetX: 7.8,
      heading: 0,
      color: 0xf59e0b,
      mesh: ped1Mesh,
      bobPhase: 0,
    });

    // 4. Pedestrian on left curb
    const ped2Mesh = this.createPedestrianMesh();
    this.group.add(ped2Mesh);
    this.actors.push({
      id: 'sim_ped_2',
      type: 'PEDESTRIAN',
      x: -7.6,
      z: -48.0,
      speedMs: -0.9, // Walking toward vehicle
      targetX: -7.6,
      heading: Math.PI,
      color: 0xf59e0b,
      mesh: ped2Mesh,
      bobPhase: 1.5,
    });

    // 5. Static Obstacle Box / Roadside Crate on shoulder
    const boxMesh = this.createBoxMesh();
    this.group.add(boxMesh);
    this.actors.push({
      id: 'sim_box_1',
      type: 'BOX',
      x: 5.8,
      z: -65.0,
      speedMs: 0.0, // Static
      targetX: 5.8,
      heading: 0.2,
      color: 0xd97706,
      mesh: boxMesh,
    });
  }

  /**
   * Main per-frame update loop
   * @param egoSpeedKmh Current e-trike speed in km/h
   * @param perceptionList Optional live ROS 2 perception objects from WebSocket
   * @param dt Frame delta time in seconds
   */
  public update(egoSpeedKmh: number, perceptionList: PerceptionObject[] | undefined, dt: number) {
    const egoSpeedMs = (egoSpeedKmh * 1000) / 3600;

    // A. If live ROS 2 perception objects are available, render them
    if (perceptionList && perceptionList.length > 0) {
      // Hide simulated actors
      for (const actor of this.actors) {
        actor.mesh.visible = false;
      }
      this.renderLivePerceptionObjects(perceptionList);
      return;
    }

    // B. Otherwise run smooth procedural simulation
    for (const actor of this.actors) {
      actor.mesh.visible = true;

      // Relative motion: actor speed minus ego speed
      const relSpeed = actor.speedMs - egoSpeedMs;
      actor.z += relSpeed * dt;

      // Loop actors smoothly across horizon (-140m to +25m)
      if (actor.z < -135) {
        actor.z = 25.0; // Wrap to behind/approaching
      } else if (actor.z > 28.0) {
        actor.z = -130.0; // Wrap to far horizon
      }

      // Smooth lane following / slight drift
      actor.x += (actor.targetX - actor.x) * (dt * 2.0);

      actor.mesh.position.set(actor.x, 0, actor.z);
      actor.mesh.rotation.y = actor.heading;

      // Pedestrian walking bob
      if (actor.type === 'PEDESTRIAN' && actor.bobPhase !== undefined) {
        actor.bobPhase += dt * 8.0;
        actor.mesh.position.y = Math.abs(Math.sin(actor.bobPhase)) * 0.08;
      }
    }

    // Hide any unused pooled live objects
    for (let i = 0; i < this.liveObjectPool.length; i++) {
      this.liveObjectPool[i].visible = false;
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

          // Scale car if dimensions available
          if (obj.dx && obj.dz) {
            carChild?.scale.set(obj.dz / 1.8, 1.0, obj.dx / 4.0);
          }
        }
      } else {
        group.visible = false;
      }
    }
  }
}
