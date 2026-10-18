import path from 'path';
import { fileURLToPath } from 'url';
import { THREE } from '../common/three_loader.js';
import { exportGlb } from '../common/exporter_utils.js';
import { createSmplMaterials, buildLimb } from './smpl_builder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'pedestrian_smpl.glb');

console.log(`[Pedestrian] Generating Refined SMPL Humanoid Mesh + 3D RTMPose-s Rig -> ${outputPath}`);

const { smplSkinMat, smplAccentMat, visorMat, jointMats } = createSmplMaterials();
const smplRoot = new THREE.Group();
smplRoot.name = 'SMPL_Humanoid';

// Root Bone: Hips / Pelvis
const hips = new THREE.Group();
hips.name = 'Hips';
hips.position.set(0, 0.86, 0);
smplRoot.add(hips);

const pelvisGeo = new THREE.CapsuleGeometry(0.118, 0.14, 16, 20);
pelvisGeo.scale(1.14, 1.0, 0.90);
hips.add(buildLimb('Pelvis_Mesh', pelvisGeo, smplSkinMat));

// Spine / Abdomen
const spine = new THREE.Group();
spine.name = 'Spine';
spine.position.set(0, 0.08, 0);
hips.add(spine);

const abdomenGeo = new THREE.CapsuleGeometry(0.105, 0.16, 16, 20);
abdomenGeo.scale(1.10, 1.0, 0.86);
spine.add(buildLimb('Abdomen_Mesh', abdomenGeo, smplSkinMat, [0, 0.08, 0]));

// Chest
const chest = new THREE.Group();
chest.name = 'Chest';
chest.position.set(0, 0.26, 0);
spine.add(chest);

const chestGeo = new THREE.CapsuleGeometry(0.125, 0.22, 16, 20);
chestGeo.scale(1.26, 1.0, 0.86);
chest.add(buildLimb('Chest_Mesh', chestGeo, smplSkinMat));

// Neck & Head
const neck = new THREE.Group();
neck.name = 'Neck';
neck.position.set(0, 0.42, 0);
spine.add(neck);
neck.add(buildLimb('Neck_Mesh', new THREE.CylinderGeometry(0.048, 0.062, 0.09, 16), smplAccentMat));

const head = new THREE.Group();
head.name = 'Head';
head.position.set(0, 0.54, 0);
spine.add(head);

const headGeo = new THREE.SphereGeometry(0.105, 24, 24);
headGeo.scale(0.85, 1.16, 1.02);
head.add(buildLimb('Head_Mesh', headGeo, smplSkinMat));
head.add(buildLimb('Visor_Mesh', new THREE.BoxGeometry(0.13, 0.035, 0.06), visorMat, [0, 0.01, -0.09]));

// --- Arms ---
const upperArmGeo = new THREE.CapsuleGeometry(0.040, 0.24, 12, 16);
const foreArmGeo = new THREE.CapsuleGeometry(0.032, 0.22, 12, 16);
const handGeo = new THREE.BoxGeometry(0.026, 0.08, 0.065);

function buildArm(side, xPos) {
  const arm = new THREE.Group();
  arm.name = `${side}Arm`;
  arm.position.set(xPos, 0.36, 0);
  spine.add(arm);
  arm.add(buildLimb(`UpperArm${side[0]}_Mesh`, upperArmGeo, smplSkinMat, [0, -0.12, 0]));

  const foreArm = new THREE.Group();
  foreArm.name = `${side}ForeArm`;
  foreArm.position.set(0, -0.24, 0);
  arm.add(foreArm);
  foreArm.add(buildLimb(`ForeArm${side[0]}_Mesh`, foreArmGeo, smplSkinMat, [0, -0.11, 0]));
  foreArm.add(buildLimb(`Hand${side[0]}_Mesh`, handGeo, smplAccentMat, [0, -0.24, 0]));
  return { arm, foreArm };
}

const leftArmSystem = buildArm('Left', -0.19);
const rightArmSystem = buildArm('Right', 0.19);

// --- Legs ---
const thighGeo = new THREE.CapsuleGeometry(0.060, 0.36, 12, 18);
const shinGeo = new THREE.CapsuleGeometry(0.044, 0.34, 12, 18);
const footGeo = new THREE.BoxGeometry(0.075, 0.05, 0.22);

function buildLeg(side, xPos) {
  const upLeg = new THREE.Group();
  upLeg.name = `${side}UpLeg`;
  upLeg.position.set(xPos, -0.05, 0);
  hips.add(upLeg);
  upLeg.add(buildLimb(`Thigh${side[0]}_Mesh`, thighGeo, smplSkinMat, [0, -0.18, 0]));

  const leg = new THREE.Group();
  leg.name = `${side}Leg`;
  leg.position.set(0, -0.36, 0);
  upLeg.add(leg);
  leg.add(buildLimb(`Calf${side[0]}_Mesh`, shinGeo, smplSkinMat, [0, -0.17, 0]));
  leg.add(buildLimb(`Foot${side[0]}_Mesh`, footGeo, smplAccentMat, [0, -0.35, 0.04]));
  return { upLeg, leg };
}

const leftLegSystem = buildLeg('Left', -0.095);
const rightLegSystem = buildLeg('Right', 0.095);

// Attach 17-Keypoint RTMPose-s Glowing Beacons
const jointDefs = [
  { name: 'Kpt_0_Nose', parent: head, pos: [0, 0.06, -0.12], mat: jointMats.cyan },
  { name: 'Kpt_1_EyeL', parent: head, pos: [-0.035, 0.08, -0.10], mat: jointMats.sky },
  { name: 'Kpt_2_EyeR', parent: head, pos: [0.035, 0.08, -0.10], mat: jointMats.sky },
  { name: 'Kpt_3_EarL', parent: head, pos: [-0.085, 0.06, -0.02], mat: jointMats.violet },
  { name: 'Kpt_4_EarR', parent: head, pos: [0.085, 0.06, -0.02], mat: jointMats.violet },
  { name: 'Kpt_5_ShoulderL', parent: leftArmSystem.arm, pos: [0, 0, 0], mat: jointMats.cyan },
  { name: 'Kpt_6_ShoulderR', parent: rightArmSystem.arm, pos: [0, 0, 0], mat: jointMats.cyan },
  { name: 'Kpt_7_ElbowL', parent: leftArmSystem.foreArm, pos: [0, 0, 0], mat: jointMats.sky },
  { name: 'Kpt_8_ElbowR', parent: rightArmSystem.foreArm, pos: [0, 0, 0], mat: jointMats.sky },
  { name: 'Kpt_9_WristL', parent: leftArmSystem.foreArm, pos: [0, -0.22, 0], mat: jointMats.emerald },
  { name: 'Kpt_10_WristR', parent: rightArmSystem.foreArm, pos: [0, -0.22, 0], mat: jointMats.emerald },
  { name: 'Kpt_11_HipL', parent: leftLegSystem.upLeg, pos: [0, 0, 0], mat: jointMats.emerald },
  { name: 'Kpt_12_HipR', parent: rightLegSystem.upLeg, pos: [0, 0, 0], mat: jointMats.emerald },
  { name: 'Kpt_13_KneeL', parent: leftLegSystem.leg, pos: [0, 0, 0], mat: jointMats.amber },
  { name: 'Kpt_14_KneeR', parent: rightLegSystem.leg, pos: [0, 0, 0], mat: jointMats.amber },
  { name: 'Kpt_15_AnkleL', parent: leftLegSystem.leg, pos: [0, -0.35, 0], mat: jointMats.orange },
  { name: 'Kpt_16_AnkleR', parent: rightLegSystem.leg, pos: [0, -0.35, 0], mat: jointMats.orange },
];

const jointSphereGeo = new THREE.SphereGeometry(0.038, 12, 12);
jointDefs.forEach((def) => {
  const jMesh = new THREE.Mesh(jointSphereGeo, def.mat);
  jMesh.name = def.name;
  jMesh.position.set(...def.pos);
  def.parent.add(jMesh);
});

exportGlb(smplRoot, outputPath, 'Pedestrian SMPL + RTMPose', 'pedestrian_smpl.glb');
