import * as THREE from 'three';

export function createWheel(wheelRadius: number, wheelWidth: number): THREE.Group {
  const wheelGroup = new THREE.Group();
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
    color: 0x06b6d4,
    roughness: 0.3,
    metalness: 0.7,
  });

  const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 28);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, tireMaterial);
  tire.castShadow = true;
  tire.receiveShadow = true;

  const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.62, wheelRadius * 0.62, wheelWidth * 1.04, 20);
  rimGeo.rotateZ(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, rimMaterial);

  const hubGeo = new THREE.CylinderGeometry(wheelRadius * 0.22, wheelRadius * 0.22, wheelWidth * 1.08, 16);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, hubCapMaterial);

  wheelGroup.add(tire);
  wheelGroup.add(rim);
  wheelGroup.add(hub);
  return wheelGroup;
}

export function createHeadlightPair(parent: THREE.Group): { left: THREE.SpotLight; right: THREE.SpotLight } {
  const createOne = (x: number) => {
    const spot = new THREE.SpotLight(0xf8fafc, 5.0, 50, Math.PI / 5.5, 0.35, 1.2);
    spot.position.set(x, 0.65, -0.79);
    spot.target.position.set(x, 0.1, -25);
    parent.add(spot);
    parent.add(spot.target);
    const flareMat = new THREE.MeshBasicMaterial({ color: 0xecfeff, transparent: true, opacity: 0.85 });
    const flare = new THREE.Mesh(new THREE.CircleGeometry(0.065, 16), flareMat);
    flare.position.set(x, 0.65, -0.80);
    parent.add(flare);
    return spot;
  };
  return {
    left: createOne(-0.28),
    right: createOne(0.28),
  };
}
