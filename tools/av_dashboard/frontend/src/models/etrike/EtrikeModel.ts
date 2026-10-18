import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { createWheel, createHeadlightPair } from './EtrikeParts';

export class EtrikeModel {
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

    // Front Wheel with Steering Pivot (Z = -1.0m, Y = wheelRadius, X = 0.0)
    this.frontWheelPivot = new THREE.Group();
    this.frontWheelPivot.position.set(0, this.wheelRadius, -1.0);
    this.frontWheelMesh = createWheel(this.wheelRadius, this.wheelWidth) as unknown as THREE.Mesh;
    this.frontWheelPivot.add(this.frontWheelMesh);
    this.group.add(this.frontWheelPivot);

    // Rear Wheels (X = ±0.575m, Z = +1.0m, Y = wheelRadius)
    this.rearLeftWheelMesh = createWheel(this.wheelRadius, this.wheelWidth) as unknown as THREE.Mesh;
    this.rearLeftWheelMesh.position.set(-0.575, this.wheelRadius, 1.0);
    this.group.add(this.rearLeftWheelMesh);

    this.rearRightWheelMesh = createWheel(this.wheelRadius, this.wheelWidth) as unknown as THREE.Mesh;
    this.rearRightWheelMesh.position.set(0.575, this.wheelRadius, 1.0);
    this.group.add(this.rearRightWheelMesh);

    // Rear Axle Beam
    const axleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.6, roughness: 0.4 });
    const axleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.15, 12);
    axleGeo.rotateZ(Math.PI / 2);
    const rearAxle = new THREE.Mesh(axleGeo, axleMat);
    rearAxle.position.set(0, this.wheelRadius, 1.0);
    this.group.add(rearAxle);

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(1.45, 2.6);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.set(0, 0.005, 0.45);
    this.group.add(contactShadow);

    // Headlights
    const headlights = createHeadlightPair(this.chassisGroup);
    this.leftHeadlight = headlights.left;
    this.rightHeadlight = headlights.right;

    // Taillights
    this.brakeLightsMaterial = new THREE.MeshBasicMaterial({ color: 0x500724 });
    const createTaillight = (x: number) => {
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.02), this.brakeLightsMaterial);
      tl.position.set(x, 0.62, 1.435);
      this.chassisGroup.add(tl);
    };
    createTaillight(-0.48);
    createTaillight(0.48);

    this.buildProceduralBody();
    this.loadAutowareObj();
  }

  private buildProceduralBody() {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.25, metalness: 0.65 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.3 });
    const windshieldMat = new THREE.MeshPhysicalMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.2, transmission: 0.75, transparent: true, opacity: 0.8 });

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.55, 1.832), bodyMat);
    lowerBody.position.set(0, 0.55, 0.516);
    lowerBody.name = 'procedural_chassis';
    this.chassisGroup.add(lowerBody);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.45, 0.42), bodyMat);
    nose.position.set(0, 0.52, -0.60);
    nose.name = 'procedural_nose';
    this.chassisGroup.add(nose);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.08, 1.75), canopyMat);
    roof.position.set(0, 1.65, 0.52);
    roof.name = 'procedural_roof';
    this.chassisGroup.add(roof);

    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), windshieldMat);
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
        const toRemove = this.chassisGroup.children.filter((c) => c.name.startsWith('procedural_'));
        toRemove.forEach((c) => this.chassisGroup.remove(c));
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.25, metalness: 0.7 });

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = bodyMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        obj.name = 'autoware_mesh';
        this.chassisGroup.add(obj);
      },
      undefined,
      (err) => {
        console.warn('Could not load /models/etrike_body.obj, using procedural vehicle:', err);
      }
    );
  }

  public update(
    speedKmh: number,
    steerAngleDeg: number,
    arg3: number,
    arg4: number,
    arg5?: number
  ) {
    const brakePressureKpa = arg5 !== undefined ? arg4 : arg3;
    const dt = arg5 !== undefined ? arg5 : arg4;

    const speedMs = (speedKmh * 1000) / 3600;
    const distanceTraveled = speedMs * dt;
    const deltaAngle = distanceTraveled / this.wheelRadius;
    this.wheelRotation -= deltaAngle;

    this.frontWheelMesh.rotation.x = this.wheelRotation;
    this.rearLeftWheelMesh.rotation.x = this.wheelRotation;
    this.rearRightWheelMesh.rotation.x = this.wheelRotation;

    const targetSteerRad = -(steerAngleDeg * Math.PI) / 180;
    this.currentSteerAngle = THREE.MathUtils.lerp(this.currentSteerAngle, targetSteerRad, 1 - Math.exp(-dt * 20));
    this.frontWheelPivot.rotation.y = this.currentSteerAngle;

    const latAccel = (speedMs * speedMs) / 3.0;
    const targetRoll = Math.sign(steerAngleDeg) * Math.min(latAccel * 0.015, 0.08);
    this.currentRoll = THREE.MathUtils.lerp(this.currentRoll, targetRoll, 1 - Math.exp(-dt * 10));

    const targetPitch = brakePressureKpa > 200 ? -Math.min((brakePressureKpa / 5000) * 0.04, 0.04) : 0;
    this.currentPitch = THREE.MathUtils.lerp(this.currentPitch, targetPitch, 1 - Math.exp(-dt * 15));

    this.chassisGroup.rotation.z = this.currentRoll;
    this.chassisGroup.rotation.x = this.currentPitch;

    if (brakePressureKpa > 100) {
      this.brakeLightsMaterial.color.setHex(0xff0044);
    } else {
      this.brakeLightsMaterial.color.setHex(0x500724);
    }
  }

  public setHeadlights(on: boolean) {
    this.leftHeadlight.intensity = on ? 4 : 0;
    this.rightHeadlight.intensity = on ? 4 : 0;
  }

  public dispose() {
    this.group.traverse((child) => {
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
}
