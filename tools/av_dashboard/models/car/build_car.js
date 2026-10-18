import path from 'path';
import { fileURLToPath } from 'url';
import { THREE } from '../common/three_loader.js';
import { exportGlb } from '../common/exporter_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'car.glb');

console.log(`[Car] Building 3D Sedan Car model -> ${outputPath}`);

const root = new THREE.Group();
root.name = 'Sedan_Car';

// Materials
const paintMat = new THREE.MeshStandardMaterial({ name: 'Car_Paint_Slate', color: 0x94a3b8, roughness: 0.25, metalness: 0.55 });
const glassMat = new THREE.MeshStandardMaterial({ name: 'Car_Glass_Dark', color: 0x090d16, roughness: 0.10, metalness: 0.85, transparent: true, opacity: 0.92 });
const tireMat = new THREE.MeshStandardMaterial({ name: 'Car_Tire', color: 0x18181b, roughness: 0.85, metalness: 0.10 });
const rimMat = new THREE.MeshStandardMaterial({ name: 'Car_Rim', color: 0xd4d4d8, roughness: 0.20, metalness: 0.85 });
const hlMat = new THREE.MeshBasicMaterial({ name: 'Car_Headlight', color: 0xffffff });
const tlMat = new THREE.MeshBasicMaterial({ name: 'Car_Taillight', color: 0xef4444 });

// 1. Lower chassis body (aerodynamic slab)
const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.52, 4.3), paintMat);
lowerBody.position.set(0, 0.52, 0);
lowerBody.name = 'Body_Lower';
root.add(lowerBody);

// 2. Sloping Hood / Nose
const hood = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.28, 1.4), paintMat);
hood.position.set(0, 0.62, -1.4);
hood.rotation.x = 0.08;
hood.name = 'Body_Hood';
root.add(hood);

// 3. Curved Glass Canopy / Greenhouse
const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 2.3), glassMat);
cabin.position.set(0, 0.98, -0.15);
cabin.name = 'Body_Cabin';
root.add(cabin);

// 4. Wheels with aerodynamic rims
const wheelTireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16);
wheelTireGeo.rotateZ(Math.PI / 2);
const wheelRimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.23, 16);
wheelRimGeo.rotateZ(Math.PI / 2);

for (const [wx, wz, wName] of [
  [0.96, -1.3, 'Wheel_Front_R'],
  [-0.96, -1.3, 'Wheel_Front_L'],
  [0.96, 1.3, 'Wheel_Rear_R'],
  [-0.96, 1.3, 'Wheel_Rear_L'],
]) {
  const wheelGroup = new THREE.Group();
  wheelGroup.name = wName;
  wheelGroup.position.set(wx, 0.34, wz);
  wheelGroup.add(new THREE.Mesh(wheelTireGeo, tireMat));
  wheelGroup.add(new THREE.Mesh(wheelRimGeo, rimMat));
  root.add(wheelGroup);
}

// 5. Front LED Lightbar
const hl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.05), hlMat);
hl.position.set(0, 0.55, -2.16);
hl.name = 'Headlight_Bar';
root.add(hl);

// 6. Rear LED Taillight Bar
const tl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.05), tlMat);
tl.position.set(0, 0.65, 2.16);
tl.name = 'Taillight_Bar';
root.add(tl);

exportGlb(root, outputPath, 'Sedan Car', 'car.glb');
