import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill browser FileReader for Node.js
if (typeof FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      }).catch((err) => {
        if (this.onerror) this.onerror(err);
      });
    }
  };
}

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/models/pedestrian_smpl.glb');

console.log(`Generating SMPL-derived rigged humanoid model -> ${outputPath}`);

// 1. Materials
const smplGreyMat = new THREE.MeshStandardMaterial({
  name: 'SMPL_SlateGrey_PBR',
  color: 0x94a3b8, // Neutral slate-400 PBR
  roughness: 0.45,
  metalness: 0.15,
});

const jointMat = new THREE.MeshStandardMaterial({
  name: 'SMPL_AccentJoint_PBR',
  color: 0x64748b, // Neutral slate-500 for joints and accents
  roughness: 0.50,
  metalness: 0.20,
});

const visorMat = new THREE.MeshStandardMaterial({
  name: 'SMPL_CyanVisor_PBR',
  color: 0x38bdf8, // Sky-400 sensor visor
  roughness: 0.20,
  metalness: 0.80,
  emissive: 0x0284c7,
  emissiveIntensity: 0.4,
});

// 2. Anatomical SMPL Humanoid Hierarchy
const smplRoot = new THREE.Group();
smplRoot.name = 'SMPL_Humanoid';

// Pelvis / Hips (Root bone)
const hips = new THREE.Group();
hips.name = 'Hips';
hips.position.set(0, 0.86, 0);
smplRoot.add(hips);

// Pelvis mesh
const pelvisGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.16, 16);
const pelvisMesh = new THREE.Mesh(pelvisGeo, smplGreyMat);
pelvisMesh.name = 'Pelvis_Mesh';
hips.add(pelvisMesh);

// Spine
const spine = new THREE.Group();
spine.name = 'Spine';
spine.position.set(0, 0.12, 0);
hips.add(spine);

const abdomenGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.16, 16);
const abdomenMesh = new THREE.Mesh(abdomenGeo, smplGreyMat);
abdomenMesh.name = 'Abdomen_Mesh';
abdomenMesh.position.set(0, 0.08, 0);
spine.add(abdomenMesh);

// Chest
const chest = new THREE.Group();
chest.name = 'Chest';
chest.position.set(0, 0.16, 0);
spine.add(chest);

const chestGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.22, 16);
const chestMesh = new THREE.Mesh(chestGeo, smplGreyMat);
chestMesh.name = 'Chest_Mesh';
chestMesh.position.set(0, 0.11, 0);
chestMesh.scale.set(1.2, 1.0, 0.8); // Athletic chest contouring
chest.add(chestMesh);

// Neck
const neck = new THREE.Group();
neck.name = 'Neck';
neck.position.set(0, 0.22, 0);
chest.add(neck);

const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.08, 12);
const neckMesh = new THREE.Mesh(neckGeo, jointMat);
neckMesh.name = 'Neck_Mesh';
neckMesh.position.set(0, 0.04, 0);
neck.add(neckMesh);

// Head + Sensor Visor
const head = new THREE.Group();
head.name = 'Head';
head.position.set(0, 0.08, 0);
neck.add(head);

const headGeo = new THREE.SphereGeometry(0.105, 16, 16);
headGeo.scale(0.88, 1.15, 1.0); // Natural skull shape
const headMesh = new THREE.Mesh(headGeo, smplGreyMat);
headMesh.name = 'Head_Mesh';
headMesh.position.set(0, 0.08, 0);
head.add(headMesh);

const visorGeo = new THREE.BoxGeometry(0.13, 0.035, 0.05);
const visorMesh = new THREE.Mesh(visorGeo, visorMat);
visorMesh.name = 'Visor_Mesh';
visorMesh.position.set(0, 0.08, -0.09);
head.add(visorMesh);

// --- Left Arm ---
const leftShoulder = new THREE.Group();
leftShoulder.name = 'LeftShoulder';
leftShoulder.position.set(-0.21, 0.18, 0);
chest.add(leftShoulder);

const shoulderLMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), jointMat);
shoulderLMesh.name = 'ShoulderL_Mesh';
leftShoulder.add(shoulderLMesh);

const leftArm = new THREE.Group();
leftArm.name = 'LeftArm';
leftArm.position.set(0, 0, 0);
leftShoulder.add(leftArm);

const upperArmLGeo = new THREE.CylinderGeometry(0.05, 0.042, 0.26, 12);
const upperArmLMesh = new THREE.Mesh(upperArmLGeo, smplGreyMat);
upperArmLMesh.name = 'UpperArmL_Mesh';
upperArmLMesh.position.set(0, -0.13, 0);
leftArm.add(upperArmLMesh);

const leftForeArm = new THREE.Group();
leftForeArm.name = 'LeftForeArm';
leftForeArm.position.set(0, -0.26, 0);
leftArm.add(leftForeArm);

const elbowLMesh = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), jointMat);
elbowLMesh.name = 'ElbowL_Mesh';
leftForeArm.add(elbowLMesh);

const foreArmLGeo = new THREE.CylinderGeometry(0.042, 0.035, 0.24, 12);
const foreArmLMesh = new THREE.Mesh(foreArmLGeo, smplGreyMat);
foreArmLMesh.name = 'ForeArmL_Mesh';
foreArmLMesh.position.set(0, -0.12, 0);
leftForeArm.add(foreArmLMesh);

const leftHand = new THREE.Group();
leftHand.name = 'LeftHand';
leftHand.position.set(0, -0.24, 0);
leftForeArm.add(leftHand);

const handLGeo = new THREE.SphereGeometry(0.04, 10, 10);
handLGeo.scale(0.8, 1.2, 0.5);
const handLMesh = new THREE.Mesh(handLGeo, jointMat);
handLMesh.name = 'HandL_Mesh';
handLMesh.position.set(0, -0.03, 0);
leftHand.add(handLMesh);

// --- Right Arm ---
const rightShoulder = new THREE.Group();
rightShoulder.name = 'RightShoulder';
rightShoulder.position.set(0.21, 0.18, 0);
chest.add(rightShoulder);

const shoulderRMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), jointMat);
shoulderRMesh.name = 'ShoulderR_Mesh';
rightShoulder.add(shoulderRMesh);

const rightArm = new THREE.Group();
rightArm.name = 'RightArm';
rightArm.position.set(0, 0, 0);
rightShoulder.add(rightArm);

const upperArmRGeo = new THREE.CylinderGeometry(0.05, 0.042, 0.26, 12);
const upperArmRMesh = new THREE.Mesh(upperArmRGeo, smplGreyMat);
upperArmRMesh.name = 'UpperArmR_Mesh';
upperArmRMesh.position.set(0, -0.13, 0);
rightArm.add(upperArmRMesh);

const rightForeArm = new THREE.Group();
rightForeArm.name = 'RightForeArm';
rightForeArm.position.set(0, -0.26, 0);
rightArm.add(rightForeArm);

const elbowRMesh = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), jointMat);
elbowRMesh.name = 'ElbowR_Mesh';
rightForeArm.add(elbowRMesh);

const foreArmRGeo = new THREE.CylinderGeometry(0.042, 0.035, 0.24, 12);
const foreArmRMesh = new THREE.Mesh(foreArmRGeo, smplGreyMat);
foreArmRMesh.name = 'ForeArmR_Mesh';
foreArmRMesh.position.set(0, -0.12, 0);
rightForeArm.add(foreArmRMesh);

const rightHand = new THREE.Group();
rightHand.name = 'RightHand';
rightHand.position.set(0, -0.24, 0);
rightForeArm.add(rightHand);

const handRGeo = new THREE.SphereGeometry(0.04, 10, 10);
handRGeo.scale(0.8, 1.2, 0.5);
const handRMesh = new THREE.Mesh(handRGeo, jointMat);
handRMesh.name = 'HandR_Mesh';
handRMesh.position.set(0, -0.03, 0);
rightHand.add(handRMesh);

// --- Left Leg ---
const leftUpLeg = new THREE.Group();
leftUpLeg.name = 'LeftUpLeg';
leftUpLeg.position.set(-0.11, -0.08, 0);
hips.add(leftUpLeg);

const hipLMesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), jointMat);
hipLMesh.name = 'HipL_Mesh';
leftUpLeg.add(hipLMesh);

const thighLGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.40, 14);
const thighLMesh = new THREE.Mesh(thighLGeo, smplGreyMat);
thighLMesh.name = 'ThighL_Mesh';
thighLMesh.position.set(0, -0.20, 0);
leftUpLeg.add(thighLMesh);

const leftLeg = new THREE.Group();
leftLeg.name = 'LeftLeg';
leftLeg.position.set(0, -0.40, 0);
leftUpLeg.add(leftLeg);

const kneeLMesh = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 12), jointMat);
kneeLMesh.name = 'KneeL_Mesh';
leftLeg.add(kneeLMesh);

const shinLGeo = new THREE.CylinderGeometry(0.055, 0.042, 0.38, 14);
const shinLMesh = new THREE.Mesh(shinLGeo, smplGreyMat);
shinLMesh.name = 'ShinL_Mesh';
shinLMesh.position.set(0, -0.19, 0);
leftLeg.add(shinLMesh);

const leftFoot = new THREE.Group();
leftFoot.name = 'LeftFoot';
leftFoot.position.set(0, -0.38, 0);
leftLeg.add(leftFoot);

const footLGeo = new THREE.BoxGeometry(0.08, 0.065, 0.18);
const footLMesh = new THREE.Mesh(footLGeo, jointMat);
footLMesh.name = 'FootL_Mesh';
footLMesh.position.set(0, -0.02, 0.05);
leftFoot.add(footLMesh);

// --- Right Leg ---
const rightUpLeg = new THREE.Group();
rightUpLeg.name = 'RightUpLeg';
rightUpLeg.position.set(0.11, -0.08, 0);
hips.add(rightUpLeg);

const hipRMesh = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), jointMat);
hipRMesh.name = 'HipR_Mesh';
rightUpLeg.add(hipRMesh);

const thighRGeo = new THREE.CylinderGeometry(0.075, 0.055, 0.40, 14);
const thighRMesh = new THREE.Mesh(thighRGeo, smplGreyMat);
thighRMesh.name = 'ThighR_Mesh';
thighRMesh.position.set(0, -0.20, 0);
rightUpLeg.add(thighRMesh);

const rightLeg = new THREE.Group();
rightLeg.name = 'RightLeg';
rightLeg.position.set(0, -0.40, 0);
rightUpLeg.add(rightLeg);

const kneeRMesh = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 12), jointMat);
kneeRMesh.name = 'KneeR_Mesh';
rightLeg.add(kneeRMesh);

const shinRGeo = new THREE.CylinderGeometry(0.055, 0.042, 0.38, 14);
const shinRMesh = new THREE.Mesh(shinRGeo, smplGreyMat);
shinRMesh.name = 'ShinR_Mesh';
shinRMesh.position.set(0, -0.19, 0);
rightLeg.add(shinRMesh);

const rightFoot = new THREE.Group();
rightFoot.name = 'RightFoot';
rightFoot.position.set(0, -0.38, 0);
rightLeg.add(rightFoot);

const footRGeo = new THREE.BoxGeometry(0.08, 0.065, 0.18);
const footRMesh = new THREE.Mesh(footRGeo, jointMat);
footRMesh.name = 'FootR_Mesh';
footRMesh.position.set(0, -0.02, 0.05);
rightFoot.add(footRMesh);

// Export as binary GLB
const exporter = new GLTFExporter();
try {
  const glb = await exporter.parseAsync(smplRoot, { binary: true });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(glb));
  const stats = fs.statSync(outputPath);
  console.log(`[SUCCESS] Generated ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Export error:', err);
  process.exit(1);
}
