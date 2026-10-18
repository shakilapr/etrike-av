import path from 'path';
import { fileURLToPath } from 'url';
import { THREE } from '../common/three_loader.js';
import { exportGlb } from '../common/exporter_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'cyclist.glb');

console.log(`[Cyclist] Building 3D Cyclist/Motorcycle model -> ${outputPath}`);

const root = new THREE.Group();
root.name = 'Cyclist_TwoWheeler';

// Materials
const frameMat = new THREE.MeshStandardMaterial({ name: 'Bike_Frame', color: 0x34d399, roughness: 0.40, metalness: 0.60 });
const tireMat = new THREE.MeshStandardMaterial({ name: 'Bike_Tire', color: 0x18181b, roughness: 0.85, metalness: 0.10 });
const riderMat = new THREE.MeshStandardMaterial({ name: 'Rider_Suit', color: 0x475569, roughness: 0.55, metalness: 0.20 });

// 1. Front and Rear Wheels
const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.10, 16);
wheelGeo.rotateZ(Math.PI / 2);

const wF = new THREE.Mesh(wheelGeo, tireMat);
wF.position.set(0, 0.34, -0.75);
wF.name = 'Wheel_Front';
root.add(wF);

const wR = new THREE.Mesh(wheelGeo, tireMat);
wR.position.set(0, 0.34, 0.75);
wR.name = 'Wheel_Rear';
root.add(wR);

// 2. Tubular Frame
const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.4), frameMat);
frame.position.set(0, 0.6, 0);
frame.name = 'Chassis_Frame';
root.add(frame);

// 3. Stylized Rider Torso
const torsoGeo = new THREE.CapsuleGeometry(0.125, 0.22, 12, 16);
const torso = new THREE.Mesh(torsoGeo, riderMat);
torso.position.set(0, 1.1, -0.05);
torso.rotation.x = 0.25;
torso.name = 'Rider_Torso';
root.add(torso);

// 4. Rider Head
const headGeo = new THREE.SphereGeometry(0.105, 16, 16);
const head = new THREE.Mesh(headGeo, riderMat);
head.position.set(0, 1.48, -0.15);
head.name = 'Rider_Head';
root.add(head);

exportGlb(root, outputPath, 'Cyclist TwoWheeler', 'cyclist.glb');
