import * as THREE from 'three';

export function createWheel(radius: number, width: number): THREE.Group {
  const wheel = new THREE.Group();

  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.1,
  });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.castShadow = true;
  tire.receiveShadow = true;
  wheel.add(tire);

  const rimGeo = new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, width + 0.005, 16);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    roughness: 0.2,
    metalness: 0.85,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  wheel.add(rim);

  return wheel;
}

export function createHeadlightPair(parent: THREE.Group): { left: THREE.SpotLight; right: THREE.SpotLight } {
  const left = new THREE.SpotLight(0xffffff, 4, 30, Math.PI / 6, 0.4, 1.2);
  left.position.set(-0.25, 0.6, -0.8);
  left.target.position.set(-0.25, 0, -10);
  parent.add(left);
  parent.add(left.target);

  const right = new THREE.SpotLight(0xffffff, 4, 30, Math.PI / 6, 0.4, 1.2);
  right.position.set(0.25, 0.6, -0.8);
  right.target.position.set(0.25, 0, -10);
  parent.add(right);
  parent.add(right.target);

  return { left, right };
}
