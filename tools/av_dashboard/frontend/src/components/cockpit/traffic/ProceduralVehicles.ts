import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from './materials';

export function createCarMesh(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  const car = new THREE.Group();

  // 1. Lower chassis body
  const lowerBodyGeo = new THREE.BoxGeometry(1.85, 0.52, 4.3);
  const lowerBody = new THREE.Mesh(lowerBodyGeo, mats.carPaintMat);
  lowerBody.position.set(0, 0.52, 0);
  car.add(lowerBody);

  // 2. Sloping Hood / Nose
  const hoodGeo = new THREE.BoxGeometry(1.8, 0.28, 1.4);
  const hood = new THREE.Mesh(hoodGeo, mats.carPaintMat);
  hood.position.set(0, 0.62, -1.4);
  hood.rotation.x = 0.08;
  car.add(hood);

  // 3. Curved Glass Canopy / Greenhouse
  const cabinGeo = new THREE.BoxGeometry(1.5, 0.52, 2.3);
  const cabin = new THREE.Mesh(cabinGeo, mats.carGlassMat);
  cabin.position.set(0, 0.98, -0.15);
  car.add(cabin);

  // 4. Wheels with aerodynamic rims
  for (const [wx, wz] of [
    [0.96, -1.3],
    [-0.96, -1.3],
    [0.96, 1.3],
    [-0.96, 1.3],
  ]) {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(wx, 0.34, wz);
    const tire = new THREE.Mesh(geos.wheelTireGeo, mats.wheelTireMat);
    wheelGroup.add(tire);
    const rim = new THREE.Mesh(geos.wheelRimGeo, mats.wheelRimMat);
    wheelGroup.add(rim);
    car.add(wheelGroup);
  }

  // 5. Front LED Lightbar
  const hlGeo = new THREE.BoxGeometry(1.6, 0.08, 0.05);
  const hl = new THREE.Mesh(hlGeo, mats.headlightMat);
  hl.position.set(0, 0.55, -2.16);
  car.add(hl);

  // 6. Rear LED Taillight Bar
  const tlGeo = new THREE.BoxGeometry(1.6, 0.08, 0.05);
  const tl = new THREE.Mesh(tlGeo, mats.taillightMat);
  tl.position.set(0, 0.65, 2.16);
  car.add(tl);

  // 7. Ground Contact Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.1, 4.6);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, mats.shadowMat);
  shadow.position.set(0, 0.02, 0);
  car.add(shadow);

  return car;
}

export function createTruckMesh(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  const truck = new THREE.Group();

  // Body cargo box
  const bodyGeo = new THREE.BoxGeometry(2.3, 2.3, 6.4);
  const body = new THREE.Mesh(bodyGeo, mats.truckPaintMat);
  body.position.set(0, 1.5, 0.4);
  truck.add(body);

  // Front aerodynamic cab
  const cabGeo = new THREE.BoxGeometry(2.2, 1.6, 1.8);
  const cab = new THREE.Mesh(cabGeo, mats.truckPaintMat);
  cab.position.set(0, 1.15, -2.9);
  truck.add(cab);

  // Windshield
  const glassGeo = new THREE.BoxGeometry(2.1, 0.75, 0.6);
  const glass = new THREE.Mesh(glassGeo, mats.carGlassMat);
  glass.position.set(0, 1.45, -3.45);
  truck.add(glass);

  // 4 Heavy wheels
  for (const [wx, wz] of [
    [1.2, -2.8],
    [-1.2, -2.8],
    [1.2, 2.2],
    [-1.2, 2.2],
  ]) {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(wx, 0.46, wz);
    wheelGroup.scale.setScalar(1.35);
    const tire = new THREE.Mesh(geos.wheelTireGeo, mats.wheelTireMat);
    wheelGroup.add(tire);
    const rim = new THREE.Mesh(geos.wheelRimGeo, mats.wheelRimMat);
    wheelGroup.add(rim);
    truck.add(wheelGroup);
  }

  // Taillights
  const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.05), mats.taillightMat);
  tlL.position.set(0.85, 0.8, 3.61);
  truck.add(tlL);
  const tlR = tlL.clone();
  tlR.position.x = -0.85;
  truck.add(tlR);

  // Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.6, 7.0);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, mats.shadowMat);
  shadow.position.set(0, 0.02, 0);
  truck.add(shadow);

  return truck;
}

export function createCyclistMesh(mats: TrafficMaterials, geos: TrafficGeometries): THREE.Group {
  const two = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.4, metalness: 0.6 });

  // Wheels
  const wF = new THREE.Mesh(geos.wheelTireGeo, mats.wheelTireMat);
  wF.position.set(0, 0.34, -0.75);
  wF.scale.set(0.9, 0.5, 0.9);
  two.add(wF);
  const wR = wF.clone();
  wR.position.z = 0.75;
  two.add(wR);

  // Frame
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.4), frameMat);
  frame.position.set(0, 0.6, 0);
  two.add(frame);

  // Rider
  const torso = new THREE.Mesh(geos.pedChestGeo, mats.pedMat);
  torso.position.set(0, 1.1, -0.05);
  torso.rotation.x = 0.25;
  torso.scale.setScalar(0.85);
  two.add(torso);

  const head = new THREE.Mesh(geos.pedHeadGeo, mats.pedMat);
  head.position.set(0, 1.48, -0.15);
  head.scale.setScalar(0.85);
  two.add(head);

  return two;
}
