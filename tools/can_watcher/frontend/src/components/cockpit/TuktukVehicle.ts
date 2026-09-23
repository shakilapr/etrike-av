import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export class TuktukVehicle {
  public group: THREE.Group;
  public chassisGroup: THREE.Group;
  public frontWheelPivot: THREE.Group;
  public frontWheelMesh: THREE.Mesh;
  public rearLeftWheelMesh: THREE.Mesh;
  public rearRightWheelMesh: THREE.Mesh;
  public leftHeadlight: THREE.SpotLight;
  public rightHeadlight: THREE.SpotLight;
  public brakeLightsMaterial: THREE.MeshBasicMaterial;

  private wheelRadius = 0.203;
  private wheelWidth = 0.102;
  private wheelRotation = 0;
  private currentSteerAngle = 0;
  private currentRoll = 0;
  private currentPitch = 0;

  constructor() {
    this.group = new THREE.Group();
    this.chassisGroup = new THREE.Group();
    this.group.add(this.chassisGroup);

    // High quality automotive wheel materials
    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.85,
      metalness: 0.1,
    });
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.25,
      metalness: 0.85,
    });
    const hubCapMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan center hubcap
      roughness: 0.3,
      metalness: 0.7,
    });

    const createWheel = () => {
      const wheelGroup = new THREE.Group();
      // Three.js CylinderGeometry default is along Y axis, rotate to align with axle (X axis)
      const tireGeo = new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, this.wheelWidth, 28);
      tireGeo.rotateZ(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, tireMaterial);
      tire.castShadow = true;
      tire.receiveShadow = true;

      // Rim
      const rimGeo = new THREE.CylinderGeometry(this.wheelRadius * 0.62, this.wheelRadius * 0.62, this.wheelWidth * 1.04, 20);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMaterial);

      // Center Hubcap
      const hubGeo = new THREE.CylinderGeometry(this.wheelRadius * 0.22, this.wheelRadius * 0.22, this.wheelWidth * 1.08, 16);
      hubGeo.rotateZ(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, hubCapMaterial);

      wheelGroup.add(tire);
      wheelGroup.add(rim);
      wheelGroup.add(hub);
      return wheelGroup;
    };

    // ================= WHEELS ARCHITECTURE =================
    // Wheelbase L = 2.000m, Rear Track = 1.150m (half-track = 0.575m)
    // Vehicle Center of Wheelbase is at Z = 0.0

    // 1. Front Wheel with Steering Pivot (Z = -1.0m, Y = wheelRadius, X = 0.0)
    this.frontWheelPivot = new THREE.Group();
    this.frontWheelPivot.position.set(0, this.wheelRadius, -1.0);
    this.frontWheelMesh = createWheel() as unknown as THREE.Mesh;
    this.frontWheelPivot.add(this.frontWheelMesh);

    this.group.add(this.frontWheelPivot);

    // 2. Rear Left Wheel (X = -0.575m, Z = +1.0m, Y = wheelRadius)
    this.rearLeftWheelMesh = createWheel() as unknown as THREE.Mesh;
    this.rearLeftWheelMesh.position.set(-0.575, this.wheelRadius, 1.0);
    this.group.add(this.rearLeftWheelMesh);

    // 3. Rear Right Wheel (X = +0.575m, Z = +1.0m, Y = wheelRadius)
    this.rearRightWheelMesh = createWheel() as unknown as THREE.Mesh;
    this.rearRightWheelMesh.position.set(0.575, this.wheelRadius, 1.0);
    this.group.add(this.rearRightWheelMesh);

    // 4. Rear Axle Beam
    const axleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.6, roughness: 0.4 });
    const axleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.15, 12);
    axleGeo.rotateZ(Math.PI / 2);
    const rearAxle = new THREE.Mesh(axleGeo, axleMat);
    rearAxle.position.set(0, this.wheelRadius, 1.0);
    this.group.add(rearAxle);

    // Ground Contact Shadow (high performance baked ambient shadow under chassis)
    const shadowGeo = new THREE.PlaneGeometry(1.45, 2.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.set(0, 0.005, 0.45);
    this.group.add(contactShadow);

    // ================= LIGHTING & TAILLIGHTS =================
    // 5. Headlights at Front Cowl (Z = -0.79, Y = 0.65, X = ±0.28)
    const createHeadlight = (x: number) => {
      const spot = new THREE.SpotLight(0xf8fafc, 5.0, 50, Math.PI / 5.5, 0.35, 1.2);
      spot.position.set(x, 0.65, -0.79);
      spot.target.position.set(x, 0.1, -25);
      this.chassisGroup.add(spot);
      this.chassisGroup.add(spot.target);

      // Physical headlight lens
      const lensGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16);
      lensGeo.rotateX(Math.PI / 2);
      const lensMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.set(x, 0.65, -0.80);
      this.chassisGroup.add(lens);

      return spot;
    };

    this.leftHeadlight = createHeadlight(-0.28);
    this.rightHeadlight = createHeadlight(0.28);

    // 6. Taillights at Rear Back Panel (Z = +1.432, Y = 0.74, X = ±0.48)
    this.brakeLightsMaterial = new THREE.MeshBasicMaterial({ color: 0x7f1d1d });
    const tailGeo = new THREE.BoxGeometry(0.16, 0.07, 0.04);

    const leftTail = new THREE.Mesh(tailGeo, this.brakeLightsMaterial);
    leftTail.position.set(-0.48, 0.74, 1.44);
    this.chassisGroup.add(leftTail);

    const rightTail = new THREE.Mesh(tailGeo, this.brakeLightsMaterial);
    rightTail.position.set(0.48, 0.74, 1.44);
    this.chassisGroup.add(rightTail);

    // Rear window on back panel
    const rearWinGeo = new THREE.PlaneGeometry(0.72, 0.32);
    const rearWinMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const rearWindow = new THREE.Mesh(rearWinGeo, rearWinMat);
    rearWindow.position.set(0, 1.25, 1.436);
    this.chassisGroup.add(rearWindow);

    // Rear bumper & license plate
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6 });
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.04), bumperMat);
    bumper.position.set(0, 0.38, 1.44);
    this.chassisGroup.add(bumper);

    // 7. Initial Procedural Body (Accurately bounded to exact same dimensions)
    this.buildProceduralBody();

    // 8. Load official Autoware CAD Mesh
    this.loadAutowareObj();
  }

  private buildProceduralBody() {
    // High-visibility metallic paint material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Rich electric navy/blue
      roughness: 0.25,
      metalness: 0.65,
    });
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Dark canopy roof
      roughness: 0.4,
      metalness: 0.3,
    });
    const windshieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.75,
      transparent: true,
      opacity: 0.8,
    });

    // Lower cabin body: spans from Z = +1.432 (rear) to Z = -0.40 (cowl)
    // Center Z = (1.432 - 0.40) / 2 = 0.516, Length = 1.832, Width = 1.15, Height = 0.55
    const lowerBodyGeo = new THREE.BoxGeometry(1.15, 0.55, 1.832);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
    lowerBody.position.set(0, 0.55, 0.516);
    lowerBody.name = 'procedural_chassis';
    this.chassisGroup.add(lowerBody);

    // Front Nose / Cowl: spans from Z = -0.40 to Z = -0.79
    // Sloped nose narrowing to front wheel
    const noseGeo = new THREE.BoxGeometry(0.70, 0.45, 0.42);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    nose.position.set(0, 0.52, -0.60);
    nose.name = 'procedural_nose';
    this.chassisGroup.add(nose);

    // Front Apron mudguard
    const mudGeo = new THREE.BoxGeometry(0.24, 0.18, 0.22);
    const mud = new THREE.Mesh(mudGeo, canopyMat);
    mud.position.set(0, 0.38, -0.80);
    mud.name = 'procedural_mud';
    this.chassisGroup.add(mud);

    // Cabin Canopy Roof: Z = +1.432 to Z = -0.40 at Y = 1.65
    const roofGeo = new THREE.BoxGeometry(1.10, 0.08, 1.75);
    const roof = new THREE.Mesh(roofGeo, canopyMat);
    roof.position.set(0, 1.65, 0.52);
    roof.name = 'procedural_roof';
    this.chassisGroup.add(roof);

    // Windshield: sloping from (Z = -0.40, Y = 1.65) to (Z = -0.65, Y = 0.85)
    const windshieldGeo = new THREE.PlaneGeometry(0.85, 0.85);
    const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
    windshield.position.set(0, 1.25, -0.52);
    windshield.rotation.x = 0.32;
    windshield.name = 'procedural_windshield';
    this.chassisGroup.add(windshield);
  }

  private loadAutowareObj() {
    const loader = new OBJLoader();
    loader.load(
      '/models/etrike_body.obj',
      (obj) => {
        // Remove procedural fallback body once OBJ is loaded
        const toRemove = this.chassisGroup.children.filter((c) =>
          c.name.startsWith('procedural_')
        );
        toRemove.forEach((c) => this.chassisGroup.remove(c));

        // High quality electric vehicle metallic paint material
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: 0x1d4ed8, // Vibrant royal/electric blue
          roughness: 0.25,
          metalness: 0.7,
        });

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = bodyMaterial;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        // Exact ROS-to-Three.js transformation:
        // ROS: +X forward, +Y left, +Z up
        // Three.js: -Z forward, -X left (+X right), +Y up
        // Matrix mapping: x_three = -y_ros, y_three = z_ros, z_three = 1.0 - x_ros
        const transformMatrix = new THREE.Matrix4().set(
           0, -1,  0, 0,
           0,  0,  1, 0,
          -1,  0,  0, 1.0,
           0,  0,  0, 1
        );
        obj.applyMatrix4(transformMatrix);

        this.chassisGroup.add(obj);
      },
      undefined,
      (err) => {
        console.warn('[TuktukVehicle] Using procedural geometry. OBJ load notice:', err);
      }
    );
  }

  public update(
    speedKmh: number,
    steerDeg: number,
    yawRateMrad: number,
    brakeKpa: number,
    dt: number
  ) {
    const speedMs = (speedKmh * 1000) / 3600;

    // 1. Wheel spin rotation based on forward distance
    const angularDelta = (speedMs * dt) / this.wheelRadius;
    this.wheelRotation -= angularDelta;
    this.frontWheelMesh.rotation.x = this.wheelRotation;
    this.rearLeftWheelMesh.rotation.x = this.wheelRotation;
    this.rearRightWheelMesh.rotation.x = this.wheelRotation;

    // 2. Front wheel steering angle (smooth interpolation)
    const targetSteerRad = -(steerDeg * Math.PI) / 180;
    this.currentSteerAngle += (targetSteerRad - this.currentSteerAngle) * Math.min(dt * 15, 1);
    this.frontWheelPivot.rotation.y = this.currentSteerAngle;

    // 3. Chassis Roll dynamics (three-wheeler banks into lateral acceleration)
    const lateralAcc = speedMs * (yawRateMrad / 1000);
    const targetRoll = Math.max(Math.min(-lateralAcc * 0.04, 0.08), -0.08);
    this.currentRoll += (targetRoll - this.currentRoll) * Math.min(dt * 10, 1);
    this.chassisGroup.rotation.z = this.currentRoll;

    // 4. Chassis Pitch dynamics (brake dive & acceleration squat)
    const isBraking = brakeKpa > 20;
    const targetPitch = isBraking ? Math.min((brakeKpa / 1500) * 0.04, 0.05) : 0;
    this.currentPitch += (targetPitch - this.currentPitch) * Math.min(dt * 12, 1);
    this.chassisGroup.rotation.x = this.currentPitch;

    // 5. Brake Lights intensity
    if (isBraking) {
      this.brakeLightsMaterial.color.setHex(0xf43f5e); // Bright luminous red
    } else {
      this.brakeLightsMaterial.color.setHex(0x500724); // Dim running red
    }
  }
}
