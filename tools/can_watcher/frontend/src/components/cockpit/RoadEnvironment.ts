import * as THREE from 'three';

export class RoadEnvironment {
  public group: THREE.Group;
  private roadMesh: THREE.Mesh;
  private laneDashes: THREE.InstancedMesh;
  private boundaryLines: THREE.LineSegments;
  private pathRibbonMesh: THREE.Mesh;
  private pathGeometry: THREE.PlaneGeometry;

  private dashCount = 30;
  private dashSpacing = 6.0; // meters between dashes
  private roadLength = 180;
  private roadWidth = 14;
  private roadOffset = 0;
  private pathPulseOffset = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Asphalt Road Plane
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.roadLength, 1, 1);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.95,
      metalness: 0.05,
    });
    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.position.set(0, -0.01, -40);
    this.roadMesh.receiveShadow = true;
    this.group.add(this.roadMesh);

    // 2. Road Side Curbs / Boundaries (Glowing faint lines)
    const boundaryPoints: THREE.Vector3[] = [];
    const halfWidth = this.roadWidth / 2;
    // Left boundary
    boundaryPoints.push(new THREE.Vector3(-halfWidth, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(-halfWidth, 0.01, -120));
    // Right boundary
    boundaryPoints.push(new THREE.Vector3(halfWidth, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(halfWidth, 0.01, -120));
    // Inner lane lines (left & right)
    boundaryPoints.push(new THREE.Vector3(-halfWidth / 2, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(-halfWidth / 2, 0.01, -120));
    boundaryPoints.push(new THREE.Vector3(halfWidth / 2, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(halfWidth / 2, 0.01, -120));

    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryMat = new THREE.LineBasicMaterial({
      color: 0x27272a, // Subtle neutral gray
      transparent: true,
      opacity: 0.8,
    });
    this.boundaryLines = new THREE.LineSegments(boundaryGeo, boundaryMat);
    this.group.add(this.boundaryLines);

    // 3. Center Dashed White Lines (Instanced for high performance)
    const dashGeo = new THREE.PlaneGeometry(0.2, 2.5);
    dashGeo.rotateX(-Math.PI / 2);
    const dashMat = new THREE.MeshBasicMaterial({
      color: 0xe4e4e7,
      transparent: true,
      opacity: 0.85,
    });
    this.laneDashes = new THREE.InstancedMesh(dashGeo, dashMat, this.dashCount * 2);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.dashCount; i++) {
      const zPos = 20 - i * this.dashSpacing;
      // Lane 1 divider (left-center)
      dummy.position.set(-halfWidth / 4, 0.015, zPos);
      dummy.updateMatrix();
      this.laneDashes.setMatrixAt(i, dummy.matrix);

      // Lane 2 divider (right-center)
      dummy.position.set(halfWidth / 4, 0.015, zPos);
      dummy.updateMatrix();
      this.laneDashes.setMatrixAt(this.dashCount + i, dummy.matrix);
    }
    this.laneDashes.instanceMatrix.needsUpdate = true;
    this.group.add(this.laneDashes);

    // 4. Autonomous Planned Path Ribbon (Tesla FSD Style)
    // Dynamic curved ribbon extending ahead of the tuktuk
    const segments = 32;
    this.pathGeometry = new THREE.PlaneGeometry(1.4, 32, 1, segments);
    this.pathGeometry.rotateX(-Math.PI / 2);

    const pathMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan glow
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.pathRibbonMesh = new THREE.Mesh(this.pathGeometry, pathMat);
    this.pathRibbonMesh.position.set(0, 0.02, 0);
    this.group.add(this.pathRibbonMesh);
  }

  public update(speedKmh: number, steerDeg: number, isAutoMode: boolean, dt: number) {
    const speedMs = (speedKmh * 1000) / 3600;

    // 1. Scroll Lane Dashes backward to simulate forward motion
    this.roadOffset += speedMs * dt;
    const moduloOffset = this.roadOffset % this.dashSpacing;

    const dummy = new THREE.Object3D();
    const halfWidth = this.roadWidth / 2;

    for (let i = 0; i < this.dashCount; i++) {
      // Loop z position from +20 to -160
      const baseZ = 20 - i * this.dashSpacing + moduloOffset;

      // Left-center dash
      dummy.position.set(-halfWidth / 4, 0.015, baseZ);
      dummy.updateMatrix();
      this.laneDashes.setMatrixAt(i, dummy.matrix);

      // Right-center dash
      dummy.position.set(halfWidth / 4, 0.015, baseZ);
      dummy.updateMatrix();
      this.laneDashes.setMatrixAt(this.dashCount + i, dummy.matrix);
    }
    this.laneDashes.instanceMatrix.needsUpdate = true;

    // 2. Update Autonomy Path Ribbon Curvature (Tesla FSD Style)
    // Curved trajectory equation: x(z) = -0.5 * kappa * z^2
    const L = 2.0; // Wheelbase
    const steerRad = (steerDeg * Math.PI) / 180;
    const kappa = Math.tan(steerRad) / L; // Curvature

    const pos = this.pathGeometry.attributes.position;
    const halfRibbonWidth = 0.7;
    const length = 32.0;
    const segments = 32;

    this.pathPulseOffset += dt * 2.5;

    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const z = -t * length; // -Z is forward
      const curveX = -0.45 * kappa * z * z; // Lateral offset

      const vIdx = j * 2;
      // Left vertex
      pos.setXYZ(vIdx, curveX - halfRibbonWidth, 0.02, z);
      // Right vertex
      pos.setXYZ(vIdx + 1, curveX + halfRibbonWidth, 0.02, z);
    }
    pos.needsUpdate = true;

    // Pulse opacity when in AUTO mode, dimmer in MANUAL
    const mat = this.pathRibbonMesh.material as THREE.MeshBasicMaterial;
    if (isAutoMode) {
      mat.color.setHex(0x06b6d4); // Vibrant Cyan
      mat.opacity = 0.45 + Math.sin(this.pathPulseOffset) * 0.15;
    } else {
      mat.color.setHex(0x3f3f46); // Neutral Dark Zinc
      mat.opacity = 0.25;
    }
  }
}
