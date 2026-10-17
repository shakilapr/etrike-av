import * as THREE from 'three';

export class RoadEnvironment {
  public group: THREE.Group;
  private roadMesh: THREE.Mesh;
  private groundPlaneMesh: THREE.Mesh;
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

    // 1. Surrounding Dark Ground / Terrain Plane (Extends beyond road)
    const groundGeo = new THREE.PlaneGeometry(160, this.roadLength, 1, 1);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x020412 });
    this.groundPlaneMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundPlaneMesh.position.set(0, -0.02, -40);
    this.group.add(this.groundPlaneMesh);

    // 2. Asphalt Road Plane
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.roadLength, 1, 1);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x060b16 });
    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.position.set(0, -0.01, -40);
    this.group.add(this.roadMesh);

    // 3. Road Side Curbs & Lane Markings (Line Segments)
    const boundaryPoints: THREE.Vector3[] = [];
    const halfWidth = this.roadWidth / 2;
    // Outer road borders
    boundaryPoints.push(new THREE.Vector3(-halfWidth, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(-halfWidth, 0.01, -140));
    boundaryPoints.push(new THREE.Vector3(halfWidth, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(halfWidth, 0.01, -140));
    // Inner lane borders
    boundaryPoints.push(new THREE.Vector3(-halfWidth / 2, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(-halfWidth / 2, 0.01, -140));
    boundaryPoints.push(new THREE.Vector3(halfWidth / 2, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(halfWidth / 2, 0.01, -140));
    // Sidewalk outer borders
    boundaryPoints.push(new THREE.Vector3(-halfWidth - 3.5, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(-halfWidth - 3.5, 0.01, -140));
    boundaryPoints.push(new THREE.Vector3(halfWidth + 3.5, 0.01, 20));
    boundaryPoints.push(new THREE.Vector3(halfWidth + 3.5, 0.01, -140));

    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryMat = new THREE.LineBasicMaterial({
      color: 0x3f3f46,
      transparent: true,
      opacity: 0.9,
    });
    this.boundaryLines = new THREE.LineSegments(boundaryGeo, boundaryMat);
    this.group.add(this.boundaryLines);

    // 4. Center Dashed White Lines (Instanced)
    const dashGeo = new THREE.PlaneGeometry(0.2, 2.5);
    dashGeo.rotateX(-Math.PI / 2);
    const dashMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.9,
    });
    this.laneDashes = new THREE.InstancedMesh(dashGeo, dashMat, this.dashCount * 2);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.dashCount; i++) {
      const zPos = 20 - i * this.dashSpacing;
      // Lane 1 divider
      dummy.position.set(-halfWidth / 4, 0.015, zPos);
      dummy.updateMatrix();
      this.laneDashes.setMatrixAt(i, dummy.matrix);

      // Lane 2 divider
      dummy.position.set(halfWidth / 4, 0.015, zPos);
      dummy.updateMatrix();
      this.laneDashes.setMatrixAt(this.dashCount + i, dummy.matrix);
    }
    this.laneDashes.instanceMatrix.needsUpdate = true;
    this.group.add(this.laneDashes);

    // 5. Autonomous Planned Path Ribbon (Vehicle Trajectory Corridor)
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

  public update(
    speedKmh: number,
    steerDeg: number,
    isAutoMode: boolean,
    plannedTrajectory: { x: number; y: number; z: number }[] | undefined,
    dt: number
  ) {
    const speedMs = (speedKmh * 1000) / 3600;

    // 1. Scroll Lane Dashes backward
    this.roadOffset += speedMs * dt;
    const moduloOffset = this.roadOffset % this.dashSpacing;

    const dummy = new THREE.Object3D();
    const halfWidth = this.roadWidth / 2;

    for (let i = 0; i < this.dashCount; i++) {
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

    // 2. Update Autonomy Path Ribbon
    const pos = this.pathGeometry.attributes.position;
    const halfRibbonWidth = 0.7;
    const segments = 32;
    this.pathPulseOffset += dt * 2.5;

    if (plannedTrajectory && plannedTrajectory.length >= 3) {
      // Use real Autoware Universe trajectory waypoints with tangent-normal extrusion
      const trajLen = plannedTrajectory.length;
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const ptIdx = Math.min(Math.floor(t * (trajLen - 1)), trajLen - 1);
        const nextIdx = Math.min(ptIdx + 1, trajLen - 1);
        const pt = plannedTrajectory[ptIdx];
        const nextPt = plannedTrajectory[nextIdx];

        let dx = nextPt.x - pt.x;
        let dz = nextPt.z - pt.z;
        if (ptIdx === nextIdx && ptIdx > 0) {
          const prevPt = plannedTrajectory[ptIdx - 1];
          dx = pt.x - prevPt.x;
          dz = pt.z - prevPt.z;
        }
        const len = Math.hypot(dx, dz);
        const nx = len > 0.001 ? -dz / len : 1.0;
        const nz = len > 0.001 ? dx / len : 0.0;

        const vIdx = j * 2;
        pos.setXYZ(vIdx, pt.x - halfRibbonWidth * nx, 0.02, pt.z - halfRibbonWidth * nz);
        pos.setXYZ(vIdx + 1, pt.x + halfRibbonWidth * nx, 0.02, pt.z + halfRibbonWidth * nz);
      }
    } else {
      // Kinematic bicycle model curvature fallback with normal extrusion
      const L = 2.0; // Wheelbase
      const steerRad = (steerDeg * Math.PI) / 180;
      const length = 32.0;

      if (Math.abs(steerRad) < 0.001) {
        // Straight-line path
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const z = -t * length;
          const vIdx = j * 2;
          pos.setXYZ(vIdx, -halfRibbonWidth, 0.02, z);
          pos.setXYZ(vIdx + 1, halfRibbonWidth, 0.02, z);
        }
      } else {
        const R = L / Math.tan(steerRad);
        const kappa = 1.0 / R;

        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const s = t * length;
          const theta = s * kappa;

          // Kinematic arc starting at (0, 0, 0) heading forward (-Z)
          const curveX = -R * (1.0 - Math.cos(theta));
          const curveZ = -R * Math.sin(theta);

          // Unit normal perpendicular to tangent: t = (-sin(theta), -cos(theta)) => n = (cos(theta), -sin(theta))
          const nx = Math.cos(theta);
          const nz = -Math.sin(theta);

          const vIdx = j * 2;
          pos.setXYZ(vIdx, curveX - halfRibbonWidth * nx, 0.02, curveZ - halfRibbonWidth * nz);
          pos.setXYZ(vIdx + 1, curveX + halfRibbonWidth * nx, 0.02, curveZ + halfRibbonWidth * nz);
        }
      }
    }
    pos.needsUpdate = true;

    const mat = this.pathRibbonMesh.material as THREE.MeshBasicMaterial;
    if (isAutoMode) {
      mat.color.setHex(0x06b6d4); // Vibrant Cyan
      mat.opacity = 0.45 + Math.sin(this.pathPulseOffset) * 0.15;
    } else {
      mat.color.setHex(0x3f3f46); // Neutral Dark Zinc
      mat.opacity = 0.25;
    }
  }

  public dispose(): void {
    this.group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) (mat as THREE.Material).dispose();
    });
  }
}
