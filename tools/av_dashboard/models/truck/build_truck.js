import path from 'path';
import { fileURLToPath } from 'url';
import { THREE } from '../common/three_loader.js';
import { exportGlb } from '../common/exporter_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'truck.glb');

console.log(`[Truck] Building 3D Truck/Bus model -> ${outputPath}`);

const root = new THREE.Group();
root.name = 'Truck_Bus';

// Materials
const paintMat = new THREE.MeshStandardMaterial({ name: 'Truck_Paint', color: 0x64748b, roughness: 0.35, metalness: 0.45 });
const glassMat = new THREE.MeshStandardMaterial({ name: 'Truck_Glass', color: 0x090d16, roughness: 0.10, metalness: 0.85, transparent: true, opacity: 0.92 });
const tireMat = new THREE.MeshStandardMaterial({ name: 'Truck_Tire', color: 0x18181b, roughness: 0.85, metalness: 0.10 });
const rimMat = new THREE.MeshStandardMaterial({ name: 'Truck_Rim', color: 0xd4d4d8, roughness: 0.20, metalness: 0.85 });
const tlMat = new THREE.MeshBasicMaterial({ name: 'Truck_Taillight', color: 0xef4444 });

// 1. Body cargo box
const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.3, 6.4), paintMat);
body.position.set(0, 1.5, 0.4);
body.name = 'Cargo_Box';
root.add(body);

// 2. Front aerodynamic cab
const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 1.8), paintMat);
cab.position.set(0, 1.15, -2.9);
cab.name = 'Driver_Cab';
root.add(cab);

// 3. Windshield
const glass = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.75, 0.6), glassMat);
glass.position.set(0, 1.45, -3.45);
glass.name = 'Windshield';
root.add(glass);

// 4. Heavy wheels
const wheelTireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16);
wheelTireGeo.rotateZ(Math.PI / 2);
const wheelRimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.23, 16);
wheelRimGeo.rotateZ(Math.PI / 2);

for (const [wx, wz, wName] of [
  [1.2, -2.8, 'Wheel_Front_R'],
  [-1.2, -2.8, 'Wheel_Front_L'],
  [1.2, 2.2, 'Wheel_Rear_R'],
  [-1.2, 2.2, 'Wheel_Rear_L'],
]) {
  const wheelGroup = new THREE.Group();
  wheelGroup.name = wName;
  wheelGroup.position.set(wx, 0.46, wz);
  wheelGroup.scale.setScalar(1.35);
  wheelGroup.add(new THREE.Mesh(wheelTireGeo, tireMat));
  wheelGroup.add(new THREE.Mesh(wheelRimGeo, rimMat));
  root.add(wheelGroup);
}

// 5. Taillights
const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.05), tlMat);
tlL.position.set(0.85, 0.8, 3.61);
root.add(tlL);

const tlR = tlL.clone();
tlR.position.x = -0.85;
root.add(tlR);

exportGlb(root, outputPath, 'Truck Bus', 'truck.glb');
