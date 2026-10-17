import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from './materials';
import { SKELETON_PAIRS, Actor } from './types';

export function createRTMPoseSkeletonOverlay(
  mats: TrafficMaterials,
  geos: TrafficGeometries
): { group: THREE.Group; joints: THREE.Mesh[]; bones: THREE.Mesh[] } {
  const group = new THREE.Group();
  group.name = 'RTMPose_17Keypoint_Rig';
  group.renderOrder = 150;

  const jointMatMap = [
    mats.jointCyanMat,   // 0: Nose
    mats.jointSkyMat,    // 1: EyeL
    mats.jointSkyMat,    // 2: EyeR
    mats.jointVioletMat, // 3: EarL
    mats.jointVioletMat, // 4: EarR
    mats.jointCyanMat,   // 5: ShoulderL
    mats.jointCyanMat,   // 6: ShoulderR
    mats.jointSkyMat,    // 7: ElbowL
    mats.jointSkyMat,    // 8: ElbowR
    mats.jointEmeraldMat,// 9: WristL
    mats.jointEmeraldMat,// 10: WristR
    mats.jointEmeraldMat,// 11: HipL
    mats.jointEmeraldMat,// 12: HipR
    mats.jointAmberMat,  // 13: KneeL
    mats.jointAmberMat,  // 14: KneeR
    mats.jointOrangeMat, // 15: AnkleL
    mats.jointOrangeMat, // 16: AnkleR
  ];

  const sphereGeo = new THREE.SphereGeometry(0.038, 12, 12);
  const joints: THREE.Mesh[] = [];

  for (let i = 0; i < 17; i++) {
    const jMesh = new THREE.Mesh(sphereGeo, jointMatMap[i] || mats.jointCyanMat);
    jMesh.name = `RTMPose_J_${i}`;
    jMesh.renderOrder = 155;
    group.add(jMesh);
    joints.push(jMesh);
  }

  const boneMatMap = [
    mats.boneSkyMat,     // 0: nose -> eyeL
    mats.boneSkyMat,     // 1: nose -> eyeR
    mats.boneVioletMat,  // 2: eyeL -> earL
    mats.boneVioletMat,  // 3: eyeR -> earR
    mats.boneCyanMat,    // 4: shoulderL -> shoulderR
    mats.boneCyanMat,    // 5: shoulderL -> hipL
    mats.boneCyanMat,    // 6: shoulderR -> hipR
    mats.boneEmeraldMat, // 7: hipL -> hipR
    mats.boneSkyMat,     // 8: shoulderL -> elbowL
    mats.boneSkyMat,     // 9: elbowL -> wristL
    mats.boneSkyMat,     // 10: shoulderR -> elbowR
    mats.boneSkyMat,     // 11: elbowR -> wristR
    mats.boneAmberMat,   // 12: hipL -> kneeL
    mats.boneAmberMat,   // 13: kneeL -> ankleL
    mats.boneOrangeMat,  // 14: hipR -> kneeR
    mats.boneOrangeMat,  // 15: kneeR -> ankleR
  ];

  const bones: THREE.Mesh[] = [];
  for (let i = 0; i < SKELETON_PAIRS.length; i++) {
    const bMesh = new THREE.Mesh(geos.boneCylinderGeo, boneMatMap[i] || mats.boneSkyMat);
    bMesh.name = `RTMPose_Bone_${i}`;
    bMesh.renderOrder = 150;
    bMesh.visible = false;
    group.add(bMesh);
    bones.push(bMesh);
  }

  return { group, joints, bones };
}

export function updateRTMPoseSkeleton(actor: Actor, showSkeletons: boolean): void {
  if (!actor.skeletonJoints || !actor.skeletonBones || !actor.skeletonGroup) return;
  actor.skeletonGroup.visible = showSkeletons;
  if (!showSkeletons) return;

  const k3d = actor.lastPoseItem?.keypoints_3d;
  const k3dOrder = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
  ];

  const localPositions: (THREE.Vector3 | null)[] = new Array(17).fill(null);

  if (k3d && actor.lastPoseItem) {
    const rootX = actor.lastPoseItem.x_base;
    const rootY = actor.lastPoseItem.y_base;
    const yaw = actor.lastPoseItem.yaw ?? actor.targetYaw;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);

    for (let k = 0; k < 17; k++) {
      const kp3 = k3d[k3dOrder[k]];
      if (kp3 && kp3.x !== undefined && kp3.y !== undefined && kp3.z !== undefined) {
        const rel_x = kp3.rel_x !== undefined ? kp3.rel_x : (kp3.x - rootX);
        const rel_y = kp3.rel_y !== undefined ? kp3.rel_y : (kp3.y - rootY);

        const fwd = rel_x * cosY + rel_y * sinY;
        const lat = -rel_x * sinY + rel_y * cosY;

        const lx = -lat;
        const ly = Math.max(0.04, kp3.z);
        const lz = -fwd;

        localPositions[k] = new THREE.Vector3(lx, ly, lz);
      }
    }
  }

  const fallbackLocal = [
    new THREE.Vector3(0.0, 1.58, -0.14),
    new THREE.Vector3(-0.035, 1.62, -0.10),
    new THREE.Vector3(0.035, 1.62, -0.10),
    new THREE.Vector3(-0.08, 1.61, -0.02),
    new THREE.Vector3(0.08, 1.61, -0.02),
    new THREE.Vector3(-0.19, 1.40, 0.0),
    new THREE.Vector3(0.19, 1.40, 0.0),
    new THREE.Vector3(-0.25, 1.15, 0.0),
    new THREE.Vector3(0.25, 1.15, 0.0),
    new THREE.Vector3(-0.28, 0.90, 0.0),
    new THREE.Vector3(0.28, 0.90, 0.0),
    new THREE.Vector3(-0.11, 0.86, 0.0),
    new THREE.Vector3(0.11, 0.86, 0.0),
    new THREE.Vector3(-0.11, 0.46, 0.0),
    new THREE.Vector3(0.11, 0.46, 0.0),
    new THREE.Vector3(-0.11, 0.08, 0.0),
    new THREE.Vector3(0.11, 0.08, 0.0),
  ];

  if (actor.isSeated) {
    fallbackLocal[11].y -= 0.35;
    fallbackLocal[12].y -= 0.35;
    fallbackLocal[13].y -= 0.35;
    fallbackLocal[13].z -= 0.38;
    fallbackLocal[14].y -= 0.35;
    fallbackLocal[14].z -= 0.38;
    fallbackLocal[15].z -= 0.38;
    fallbackLocal[16].z -= 0.38;
  }

  for (let k = 0; k < 17; k++) {
    const pos = localPositions[k] || fallbackLocal[k];
    actor.skeletonJoints[k].position.copy(pos);
  }

  for (let bIdx = 0; bIdx < SKELETON_PAIRS.length; bIdx++) {
    const [p1, p2] = SKELETON_PAIRS[bIdx];
    const pt1 = actor.skeletonJoints[p1].position;
    const pt2 = actor.skeletonJoints[p2].position;
    const bone = actor.skeletonBones[bIdx];
    if (!bone) continue;
    const dir = new THREE.Vector3().subVectors(pt2, pt1);
    const len = dir.length();
    if (len > 0.01) {
      bone.visible = true;
      bone.position.copy(pt1).addScaledVector(dir, 0.5);
      bone.scale.set(1, len, 1);
      bone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    } else {
      bone.visible = false;
    }
  }
}
