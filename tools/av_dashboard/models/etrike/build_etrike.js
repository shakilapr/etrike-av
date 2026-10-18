import path from 'path';
import { fileURLToPath } from 'url';
import { THREE } from '../common/three_loader.js';
import { exportGlb } from '../common/exporter_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'etrike.glb');

console.log(`[ETrike] Building 3D E-Trike model -> ${outputPath}`);

const root = new THREE.Group();
root.name = 'E_Trike_Vehicle';

// Materials
const bodyMat = new THREE.MeshStandardMaterial({ name: 'Chassis_Blue', color: 0x1d4ed8, roughness: 0.25, metalness: 0.70 });
const canopyMat = new THREE.MeshStandardMaterial({ name: 'Canopy_Dark', color: 0x18181b, roughness: 0.40, metalness: 0.30 });
const glassMat = new THREE.MeshStandardMaterial({ name: 'Windshield_Glass', color: 0x0f172a, roughness: 0.10, metalness: 0.85, transparent: true, opacity: 0.80 });
const tireMat = new THREE.MeshStandardMaterial({ name: 'Tire_Rubber', color: 0x18181b, roughness: 0.85, metalness: 0.10 });
const rimMat = new THREE.MeshStandardMaterial({ name: 'Wheel_Rim', color: 0xd4d4d8, roughness: 0.20, metalness: 0.85 });
const axleMat = new THREE.MeshStandardMaterial({ name: 'Axle_Steel', color: 0x27272a, roughness: 0.40, metalness: 0.60 });
const headlightMat = new THREE.MeshBasicMaterial({ name: 'Headlight_White', color: 0xffffff });
const taillightMat = new THREE.MeshBasicMaterial({ name: 'Taillight_Red', color: 0xef4444 });

// 1. Lower chassis body
const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.55, 1.832), bodyMat);
lowerBody.position.set(0, 0.55, 0.516);
lowerBody.name = 'Chassis_Lower';
root.add(lowerBody);

// 2. Nose
const nose = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.45, 0.42), bodyMat);
nose.position.set(0, 0.52, -0.60);
nose.name = 'Chassis_Nose';
root.add(nose);

// 3. Roof / Canopy
const roof = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.08, 1.75), canopyMat);
roof.position.set(0, 1.65, 0.52);
roof.name = 'Canopy_Roof';
root.add(roof);

// 4. Windshield
const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.04), glassMat);
windshield.position.set(0, 1.25, -0.52);
windshield.rotation.x = 0.32;
windshield.name = 'Windshield';
root.add(windshield);

// 5. Wheels Factory
function createWheelMesh(name) {
  const wheel = new THREE.Group();
  wheel.name = name;

  const tireGeo = new THREE.CylinderGeometry(0.203, 0.203, 0.102, 20);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, tireMat);
  wheel.add(tire);

  const rimGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.106, 16);
  rimGeo.rotateZ(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, rimMat);
  wheel.add(rim);

  return wheel;
}

// Front Wheel
const frontWheel = createWheelMesh('Wheel_Front');
frontWheel.position.set(0, 0.203, -1.0);
root.add(frontWheel);

// Rear Left Wheel
const rearLWheel = createWheelMesh('Wheel_Rear_L');
rearLWheel.position.set(-0.575, 0.203, 1.0);
root.add(rearLWheel);

// Rear Right Wheel
const rearRWheel = createWheelMesh('Wheel_Rear_R');
rearRWheel.position.set(0.575, 0.203, 1.0);
root.add(rearRWheel);

// Rear Axle
const axleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.15, 12);
axleGeo.rotateZ(Math.PI / 2);
const rearAxle = new THREE.Mesh(axleGeo, axleMat);
rearAxle.position.set(0, 0.203, 1.0);
rearAxle.name = 'Axle_Rear';
root.add(rearAxle);

// Headlights
const hlGeo = new THREE.BoxGeometry(0.14, 0.07, 0.02);
const hlL = new THREE.Mesh(hlGeo, headlightMat);
hlL.position.set(-0.25, 0.58, -0.81);
root.add(hlL);

const hlR = new THREE.Mesh(hlGeo, headlightMat);
hlR.position.set(0.25, 0.58, -0.81);
root.add(hlR);

// Taillights
const tlGeo = new THREE.BoxGeometry(0.16, 0.08, 0.02);
const tlL = new THREE.Mesh(tlGeo, taillightMat);
tlL.position.set(-0.48, 0.62, 1.435);
root.add(tlL);

const tlR = new THREE.Mesh(tlGeo, taillightMat);
tlR.position.set(0.48, 0.62, 1.435);
root.add(tlR);

exportGlb(root, outputPath, 'E-Trike Vehicle', 'etrike.glb');
