import * as THREE from 'three';

export class RoadEnvironment {
  public group: THREE.Group;
  private roadMesh: THREE.Mesh;
  private groundPlaneMesh: THREE.Mesh;
  private laneDashes: THREE.InstancedMesh;
  private boundaryLines: THREE.LineSegments;
  private pathRibbonMesh: THREE.Mesh;
  private pathGeometry: THREE.PlaneGeometry;

  // 3D Trees (Instanced for maximum GPU performance)
  private treeTrunkMesh: THREE.InstancedMesh;
  private treeFoliageMesh: THREE.InstancedMesh;
  private treeCount = 40; // 20 left, 20 right
  private treeData: { x: number; baseZ: number; scale: number; rotY: number }[] = [];

  // Street Lamp Posts
  private lampPostMesh: THREE.InstancedMesh;
  private lampHeadMesh: THREE.InstancedMesh;
  private lampCount = 16; // 8 left, 8 right

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
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x030303 });
    this.groundPlaneMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundPlaneMesh.position.set(0, -0.02, -40);
    this.group.add(this.groundPlaneMesh);

    // 2. Asphalt Road Plane
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.roadLength, 1, 1);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x0c0c0c });
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
      color: 0x27272a,
      transparent: true,
      opacity: 0.85,
    });
    this.boundaryLines = new THREE.LineSegments(boundaryGeo, boundaryMat);
    this.group.add(this.boundaryLines);

    // 4. Center Dashed White Lines (Instanced)
    const dashGeo = new THREE.PlaneGeometry(0.2, 2.5);
    dashGeo.rotateX(-Math.PI / 2);
    const dashMat = new THREE.MeshBasicMaterial({
      color: 0xe4e4e7,
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

    // 5. 3D Trees (Instanced Trunks & Polygonal Foliage)
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.32, 2.4, 6);
    trunkGeo.translate(0, 1.2, 0);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x292524, // Deep wood brown
      roughness: 0.9,
    });
    this.treeTrunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, this.treeCount);

    const foliageGeo = new THREE.ConeGeometry(1.8, 3.6, 7);
    foliageGeo.translate(0, 3.8, 0);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x14532d, // Rich forest emerald
      roughness: 0.7,
      flatShading: true,
    });
    this.treeFoliageMesh = new THREE.InstancedMesh(foliageGeo, foliageMat, this.treeCount);

    // Generate random tree positions along shoulders
    for (let i = 0; i < this.treeCount; i++) {
      const isLeft = i < this.treeCount / 2;
      const sideIndex = isLeft ? i : i - this.treeCount / 2;
      const zStep = 160 / (this.treeCount / 2);
      const baseZ = 20 - sideIndex * zStep;
      const xOffset = (Math.sin(i * 9.7) * 2.5);
      const x = isLeft ? -13.5 - Math.abs(xOffset) : 13.5 + Math.abs(xOffset);
      const scale = 0.85 + ((i % 5) * 0.12);
      const rotY = (i * 1.3) % (Math.PI * 2);

      this.treeData.push({ x, baseZ, scale, rotY });
    }
    this.group.add(this.treeTrunkMesh);
    this.group.add(this.treeFoliageMesh);

    // 6. Street Lamp Posts (Instanced)
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 5.2, 6);
    poleGeo.translate(0, 2.6, 0);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      roughness: 0.4,
      metalness: 0.8,
    });
    this.lampPostMesh = new THREE.InstancedMesh(poleGeo, poleMat, this.lampCount);

    const lampHeadGeo = new THREE.BoxGeometry(0.35, 0.12, 0.6);
    lampHeadGeo.translate(0, 5.15, 0);
    const lampHeadMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe, // Luminous cool white/cyan LED glow
    });
    this.lampHeadMesh = new THREE.InstancedMesh(lampHeadGeo, lampHeadMat, this.lampCount);

    this.group.add(this.lampPostMesh);
    this.group.add(this.lampHeadMesh);

    // 7. Autonomous Planned Path Ribbon (Tesla FSD Style)
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

    // 2. Scroll 3D Trees with vehicle speed
    const treeLoopLength = 160.0;
    const treeDummy = new THREE.Object3D();

    for (let i = 0; i < this.treeCount; i++) {
      const t = this.treeData[i];
      let currentZ = ((t.baseZ + this.roadOffset) % treeLoopLength);
      if (currentZ > 20) currentZ -= treeLoopLength;

      treeDummy.position.set(t.x, 0, currentZ);
      treeDummy.rotation.y = t.rotY;
      treeDummy.scale.set(t.scale, t.scale, t.scale);
      treeDummy.updateMatrix();

      this.treeTrunkMesh.setMatrixAt(i, treeDummy.matrix);
      this.treeFoliageMesh.setMatrixAt(i, treeDummy.matrix);
    }
    this.treeTrunkMesh.instanceMatrix.needsUpdate = true;
    this.treeFoliageMesh.instanceMatrix.needsUpdate = true;

    // 3. Scroll Street Lamp Posts
    const lampSpacing = 20.0;
    const lampLoopLength = this.lampCount * 0.5 * lampSpacing;
    const lampDummy = new THREE.Object3D();

    for (let i = 0; i < this.lampCount; i++) {
      const isLeft = i < this.lampCount / 2;
      const idx = isLeft ? i : i - this.lampCount / 2;
      let currentZ = ((20 - idx * lampSpacing + this.roadOffset) % lampLoopLength);
      if (currentZ > 20) currentZ -= lampLoopLength;

      const x = isLeft ? -halfWidth - 0.4 : halfWidth + 0.4;
      lampDummy.position.set(x, 0, currentZ);
      lampDummy.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      lampDummy.scale.set(1, 1, 1);
      lampDummy.updateMatrix();

      this.lampPostMesh.setMatrixAt(i, lampDummy.matrix);
      this.lampHeadMesh.setMatrixAt(i, lampDummy.matrix);
    }
    this.lampPostMesh.instanceMatrix.needsUpdate = true;
    this.lampHeadMesh.instanceMatrix.needsUpdate = true;

    // 4. Update Autonomy Path Ribbon Curvature (Tesla FSD Style)
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
      pos.setXYZ(vIdx, curveX - halfRibbonWidth, 0.02, z);
      pos.setXYZ(vIdx + 1, curveX + halfRibbonWidth, 0.02, z);
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
}
