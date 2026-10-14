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

console.log(`Generating Refined SMPL Humanoid Mesh + 3D RTMPose-s Rig -> ${outputPath}`);

// -------------------------------------------------------------
// 1. Digital Twin SMPL Shaders & RTMPose-s Palette
// -------------------------------------------------------------
const smplSkinMat = new THREE.MeshStandardMaterial({
  name: 'SMPL_Skin_DigitalTwin',
  color: 0x334155, // Slate-700 digital twin humanoid silhouette
  roughness: 0.65,
  metalness: 0.10,
  transparent: true,
  opacity: 0.82,
});

const smplAccentMat = new THREE.MeshStandardMaterial({
  name: 'SMPL_Accent_SlateDark',
  color: 0x1e293b, // Slate-800 darker accent tone
  roughness: 0.75,
  metalness: 0.10,
  transparent: true,
  opacity: 0.88,
});

const visorMat = new THREE.MeshStandardMaterial({
  name: 'SMPL_Visor_CyanGlow',
  color: 0x38bdf8,
  roughness: 0.15,
  metalness: 0.85,
  emissive: 0x0284c7,
  emissiveIntensity: 1.5,
});

// RTMPose-s 17-Keypoint Glowing Emissive Materials
const jointCyanMat = new THREE.MeshBasicMaterial({ name: 'RTMPose_Cyan', color: 0x06b6d4 });
const jointSkyMat = new THREE.MeshBasicMaterial({ name: 'RTMPose_Sky', color: 0x38bdf8 });
const jointVioletMat = new THREE.MeshBasicMaterial({ name: 'RTMPose_Violet', color: 0xc084fc });
const jointEmeraldMat = new THREE.MeshBasicMaterial({ name: 'RTMPose_Emerald', color: 0x10b981 });
const jointAmberMat = new THREE.MeshBasicMaterial({ name: 'RTMPose_Amber', color: 0xf59e0b });
const jointOrangeMat = new THREE.MeshBasicMaterial({ name: 'RTMPose_Orange', color: 0xf97316 });

// -------------------------------------------------------------
// 2. Assemble Articulated SMPL Skeleton Hierarchy
// -------------------------------------------------------------
const smplRoot = new THREE.Group();
smplRoot.name = 'SMPL_Humanoid';

// Root Bone: Hips / Pelvis (y = 0.86m)
const hips = new THREE.Group();
hips.name = 'Hips';
hips.position.set(0, 0.86, 0);
smplRoot.add(hips);

const pelvisGeo = new THREE.CapsuleGeometry(0.118, 0.14, 16, 20);
pelvisGeo.scale(1.14, 1.0, 0.90);
const pelvisMesh = new THREE.Mesh(pelvisGeo, smplSkinMat);
pelvisMesh.name = 'Pelvis_Mesh';
pelvisMesh.castShadow = true;
pelvisMesh.receiveShadow = true;
hips.add(pelvisMesh);

// Spine / Abdomen
const spine = new THREE.Group();
spine.name = 'Spine';
spine.position.set(0, 0.08, 0);
hips.add(spine);

const abdomenGeo = new THREE.CapsuleGeometry(0.105, 0.16, 16, 20);
abdomenGeo.scale(1.10, 1.0, 0.86);
const abdomenMesh = new THREE.Mesh(abdomenGeo, smplSkinMat);
abdomenMesh.name = 'Abdomen_Mesh';
abdomenMesh.position.set(0, 0.08, 0);
abdomenMesh.castShadow = true;
spine.add(abdomenMesh);

// Chest / Thorax (V-taper)
const chest = new THREE.Group();
chest.name = 'Chest';
chest.position.set(0, 0.26, 0);
spine.add(chest);

const chestGeo = new THREE.CapsuleGeometry(0.125, 0.22, 16, 20);
chestGeo.scale(1.26, 1.0, 0.86);
const chestMesh = new THREE.Mesh(chestGeo, smplSkinMat);
chestMesh.name = 'Chest_Mesh';
chestMesh.castShadow = true;
chest.add(chestMesh);

// Neck
const neck = new THREE.Group();
neck.name = 'Neck';
neck.position.set(0, 0.42, 0);
spine.add(neck);

const neckGeo = new THREE.CylinderGeometry(0.048, 0.062, 0.09, 16);
const neckMesh = new THREE.Mesh(neckGeo, smplAccentMat);
neckMesh.name = 'Neck_Mesh';
neck.add(neckMesh);

// Head & Cybernetic Visor
const head = new THREE.Group();
head.name = 'Head';
head.position.set(0, 0.54, 0);
spine.add(head);

const headGeo = new THREE.SphereGeometry(0.105, 24, 24);
headGeo.scale(0.85, 1.16, 1.02);
const headMesh = new THREE.Mesh(headGeo, smplSkinMat);
headMesh.name = 'Head_Mesh';
headMesh.castShadow = true;
head.add(headMesh);

const visorGeo = new THREE.BoxGeometry(0.13, 0.035, 0.06);
const visorMesh = new THREE.Mesh(visorGeo, visorMat);
visorMesh.name = 'Visor_Mesh';
visorMesh.position.set(0, 0.01, -0.09);
head.add(visorMesh);

// --- Left Arm System ---
const leftArm = new THREE.Group();
leftArm.name = 'LeftArm';
leftArm.position.set(-0.19, 0.36, 0);
spine.add(leftArm);

const upperArmGeo = new THREE.CapsuleGeometry(0.040, 0.24, 12, 16);
const armLMesh = new THREE.Mesh(upperArmGeo, smplSkinMat);
armLMesh.name = 'UpperArmL_Mesh';
armLMesh.position.set(0, -0.12, 0);
armLMesh.castShadow = true;
leftArm.add(armLMesh);

const leftForeArm = new THREE.Group();
leftForeArm.name = 'LeftForeArm';
leftForeArm.position.set(0, -0.24, 0);
leftArm.add(leftForeArm);

const foreArmGeo = new THREE.CapsuleGeometry(0.032, 0.22, 12, 16);
const foreArmLMesh = new THREE.Mesh(foreArmGeo, smplSkinMat);
foreArmLMesh.name = 'ForeArmL_Mesh';
foreArmLMesh.position.set(0, -0.11, 0);
foreArmLMesh.castShadow = true;
leftForeArm.add(foreArmLMesh);

const handGeo = new THREE.BoxGeometry(0.026, 0.08, 0.065);
const handLMesh = new THREE.Mesh(handGeo, smplAccentMat);
handLMesh.name = 'HandL_Mesh';
handLMesh.position.set(0, -0.24, 0);
leftForeArm.add(handLMesh);

// --- Right Arm System ---
const rightArm = new THREE.Group();
rightArm.name = 'RightArm';
rightArm.position.set(0.19, 0.36, 0);
spine.add(rightArm);

const armRMesh = new THREE.Mesh(upperArmGeo, smplSkinMat);
armRMesh.name = 'UpperArmR_Mesh';
armRMesh.position.set(0, -0.12, 0);
armRMesh.castShadow = true;
rightArm.add(armRMesh);

const rightForeArm = new THREE.Group();
rightForeArm.name = 'RightForeArm';
rightForeArm.position.set(0, -0.24, 0);
rightArm.add(rightForeArm);

const foreArmRMesh = new THREE.Mesh(foreArmGeo, smplSkinMat);
foreArmRMesh.name = 'ForeArmR_Mesh';
foreArmRMesh.position.set(0, -0.11, 0);
foreArmRMesh.castShadow = true;
rightForeArm.add(foreArmRMesh);

const handRMesh = new THREE.Mesh(handGeo, smplAccentMat);
handRMesh.name = 'HandR_Mesh';
handRMesh.position.set(0, -0.24, 0);
rightForeArm.add(handRMesh);

// --- Left Leg System ---
const leftUpLeg = new THREE.Group();
leftUpLeg.name = 'LeftUpLeg';
leftUpLeg.position.set(-0.095, -0.05, 0);
hips.add(leftUpLeg);

const thighGeo = new THREE.CapsuleGeometry(0.060, 0.36, 12, 18);
const thighLMesh = new THREE.Mesh(thighGeo, smplSkinMat);
thighLMesh.name = 'ThighL_Mesh';
thighLMesh.position.set(0, -0.18, 0);
thighLMesh.castShadow = true;
leftUpLeg.add(thighLMesh);

const leftLeg = new THREE.Group();
leftLeg.name = 'LeftLeg';
leftLeg.position.set(0, -0.36, 0);
leftUpLeg.add(leftLeg);

const shinGeo = new THREE.CapsuleGeometry(0.044, 0.34, 12, 18);
const shinLMesh = new THREE.Mesh(shinGeo, smplSkinMat);
shinLMesh.name = 'CalfL_Mesh';
shinLMesh.position.set(0, -0.17, 0);
shinLMesh.castShadow = true;
leftLeg.add(shinLMesh);

const footGeo = new THREE.BoxGeometry(0.075, 0.05, 0.22);
const footLMesh = new THREE.Mesh(footGeo, smplAccentMat);
footLMesh.name = 'FootL_Mesh';
footLMesh.position.set(0, -0.35, 0.04);
footLMesh.castShadow = true;
leftLeg.add(footLMesh);

// --- Right Leg System ---
const rightUpLeg = new THREE.Group();
rightUpLeg.name = 'RightUpLeg';
rightUpLeg.position.set(0.095, -0.05, 0);
hips.add(rightUpLeg);

const thighRMesh = new THREE.Mesh(thighGeo, smplSkinMat);
thighRMesh.name = 'ThighR_Mesh';
thighRMesh.position.set(0, -0.18, 0);
thighRMesh.castShadow = true;
rightUpLeg.add(thighRMesh);

const rightLeg = new THREE.Group();
rightLeg.name = 'RightLeg';
rightLeg.position.set(0, -0.36, 0);
rightUpLeg.add(rightLeg);

const shinRMesh = new THREE.Mesh(shinGeo, smplSkinMat);
shinRMesh.name = 'CalfR_Mesh';
shinRMesh.position.set(0, -0.17, 0);
shinRMesh.castShadow = true;
rightLeg.add(shinRMesh);

const footRMesh = new THREE.Mesh(footGeo, smplAccentMat);
footRMesh.name = 'FootR_Mesh';
footRMesh.position.set(0, -0.35, 0.04);
footRMesh.castShadow = true;
rightLeg.add(footRMesh);

// -------------------------------------------------------------
// 3. Attach 17-Keypoint RTMPose-s Glowing Beacons
// -------------------------------------------------------------
const jointDefs = [
  { name: 'Kpt_0_Nose', parent: head, pos: [0, 0.06, -0.12], mat: jointCyanMat },
  { name: 'Kpt_1_EyeL', parent: head, pos: [-0.035, 0.08, -0.10], mat: jointSkyMat },
  { name: 'Kpt_2_EyeR', parent: head, pos: [0.035, 0.08, -0.10], mat: jointSkyMat },
  { name: 'Kpt_3_EarL', parent: head, pos: [-0.085, 0.06, -0.02], mat: jointVioletMat },
  { name: 'Kpt_4_EarR', parent: head, pos: [0.085, 0.06, -0.02], mat: jointVioletMat },
  { name: 'Kpt_5_ShoulderL', parent: leftArm, pos: [0, 0, 0], mat: jointCyanMat },
  { name: 'Kpt_6_ShoulderR', parent: rightArm, pos: [0, 0, 0], mat: jointCyanMat },
  { name: 'Kpt_7_ElbowL', parent: leftForeArm, pos: [0, 0, 0], mat: jointSkyMat },
  { name: 'Kpt_8_ElbowR', parent: rightForeArm, pos: [0, 0, 0], mat: jointSkyMat },
  { name: 'Kpt_9_WristL', parent: leftForeArm, pos: [0, -0.22, 0], mat: jointEmeraldMat },
  { name: 'Kpt_10_WristR', parent: rightForeArm, pos: [0, -0.22, 0], mat: jointEmeraldMat },
  { name: 'Kpt_11_HipL', parent: leftUpLeg, pos: [0, 0, 0], mat: jointEmeraldMat },
  { name: 'Kpt_12_HipR', parent: rightUpLeg, pos: [0, 0, 0], mat: jointEmeraldMat },
  { name: 'Kpt_13_KneeL', parent: leftLeg, pos: [0, 0, 0], mat: jointAmberMat },
  { name: 'Kpt_14_KneeR', parent: rightLeg, pos: [0, 0, 0], mat: jointAmberMat },
  { name: 'Kpt_15_AnkleL', parent: leftLeg, pos: [0, -0.35, 0], mat: jointOrangeMat },
  { name: 'Kpt_16_AnkleR', parent: rightLeg, pos: [0, -0.35, 0], mat: jointOrangeMat },
];

const jointSphereGeo = new THREE.SphereGeometry(0.038, 12, 12);
jointDefs.forEach((def) => {
  const jMesh = new THREE.Mesh(jointSphereGeo, def.mat);
  jMesh.name = def.name;
  jMesh.position.set(...def.pos);
  def.parent.add(jMesh);
});

// -------------------------------------------------------------
// 4. Export to binary GLTF (.glb)
// -------------------------------------------------------------
const exporter = new GLTFExporter();
exporter.parse(
  smplRoot,
  (gltfData) => {
    const buffer = Buffer.from(gltfData);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully generated refined SMPL GLB asset: ${outputPath} (${buffer.length} bytes)`);
  },
  (err) => {
    console.error('Error generating SMPL model:', err);
    process.exit(1);
  },
  { binary: true }
);
