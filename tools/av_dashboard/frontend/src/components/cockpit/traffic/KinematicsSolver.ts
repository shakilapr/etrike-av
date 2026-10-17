import * as THREE from 'three';
import { Actor } from './types';
import { HumanPoseItem } from '../../../types/can';

export function solveKinematics(actor: Actor, matchedPose: HumanPoseItem): void {
  actor.isSeated = Boolean(matchedPose.is_seated);
  actor.postureText = matchedPose.posture || (actor.isSeated ? 'SEATED' : 'STANDING');
  if (typeof (matchedPose as any).yaw === 'number') {
    actor.targetYaw = (matchedPose as any).yaw;
  }
  const k3d = matchedPose.keypoints_3d;
  const kpts = matchedPose.keypoints;

  if (k3d && k3d.left_shoulder && k3d.right_shoulder) {
    actor.hasLivePose = true;
    const yaw = actor.targetYaw;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);

    const toBodyFrame = (dx_b: number, dy_b: number, dz_b: number) => {
      const fwd = dx_b * cosY + dy_b * sinY;
      const lat = -dx_b * sinY + dy_b * cosY;
      const up = dz_b;
      return { fwd, lat, up };
    };

    // Left Arm 3D Kinematics
    if (k3d.left_elbow) {
      const upper_dx = k3d.left_elbow.x - k3d.left_shoulder.x;
      const upper_dy = k3d.left_elbow.y - k3d.left_shoulder.y;
      const upper_dz = k3d.left_elbow.z - k3d.left_shoulder.z;
      const upper = toBodyFrame(upper_dx, upper_dy, upper_dz);

      const armPitchL = Math.atan2(upper.fwd, Math.max(0.06, -upper.up));
      actor.poseTarget.pitchL = THREE.MathUtils.clamp(armPitchL, -0.6, 1.6);

      const armRollL = Math.atan2(upper.lat, Math.max(0.06, -upper.up));
      actor.poseTarget.rollL = THREE.MathUtils.clamp(armRollL, -0.4, 1.8);

      if (k3d.left_wrist) {
        const fore_dx = k3d.left_wrist.x - k3d.left_elbow.x;
        const fore_dy = k3d.left_wrist.y - k3d.left_elbow.y;
        const fore_dz = k3d.left_wrist.z - k3d.left_elbow.z;
        const dot = upper_dx * fore_dx + upper_dy * fore_dy + upper_dz * fore_dz;
        const magUpper = Math.hypot(upper_dx, upper_dy, upper_dz);
        const magFore = Math.hypot(fore_dx, fore_dy, fore_dz);
        if (magUpper > 0.05 && magFore > 0.05) {
          const cosElbow = THREE.MathUtils.clamp(dot / (magUpper * magFore), -1, 1);
          actor.poseTarget.elbowL = Math.acos(cosElbow);
        }
      }
    }

    // Right Arm 3D Kinematics
    if (k3d.right_elbow) {
      const upper_dx = k3d.right_elbow.x - k3d.right_shoulder.x;
      const upper_dy = k3d.right_elbow.y - k3d.right_shoulder.y;
      const upper_dz = k3d.right_elbow.z - k3d.right_shoulder.z;
      const upper = toBodyFrame(upper_dx, upper_dy, upper_dz);

      const armPitchR = Math.atan2(upper.fwd, Math.max(0.06, -upper.up));
      actor.poseTarget.pitchR = THREE.MathUtils.clamp(armPitchR, -0.6, 1.6);

      const armRollR = Math.atan2(-upper.lat, Math.max(0.06, -upper.up));
      actor.poseTarget.rollR = THREE.MathUtils.clamp(armRollR, -0.4, 1.8);

      if (k3d.right_wrist) {
        const fore_dx = k3d.right_wrist.x - k3d.right_elbow.x;
        const fore_dy = k3d.right_wrist.y - k3d.right_elbow.y;
        const fore_dz = k3d.right_wrist.z - k3d.right_elbow.z;
        const dotR = upper_dx * fore_dx + upper_dy * fore_dy + upper_dz * fore_dz;
        const magUpperR = Math.hypot(upper_dx, upper_dy, upper_dz);
        const magForeR = Math.hypot(fore_dx, fore_dy, fore_dz);
        if (magUpperR > 0.05 && magForeR > 0.05) {
          const cosElbowR = THREE.MathUtils.clamp(dotR / (magUpperR * magForeR), -1, 1);
          actor.poseTarget.elbowR = Math.acos(cosElbowR);
        }
      }
    }

    // Torso Roll
    const sh_dz = k3d.left_shoulder.z - k3d.right_shoulder.z;
    const sh_dxy = Math.hypot(k3d.left_shoulder.x - k3d.right_shoulder.x, k3d.left_shoulder.y - k3d.right_shoulder.y);
    actor.poseTarget.torsoRoll = THREE.MathUtils.clamp(Math.atan2(sh_dz, Math.max(0.15, sh_dxy)), -0.25, 0.25);

    // Head Yaw
    if (k3d.nose) {
      const midShX = (k3d.left_shoulder.x + k3d.right_shoulder.x) / 2;
      const midShY = (k3d.left_shoulder.y + k3d.right_shoulder.y) / 2;
      const noseBody = toBodyFrame(k3d.nose.x - midShX, k3d.nose.y - midShY, 0);
      actor.poseTarget.headYaw = THREE.MathUtils.clamp(Math.atan2(noseBody.lat, Math.max(0.08, noseBody.fwd)), -0.65, 0.65);
    }
  } else if (kpts && kpts.left_shoulder && kpts.right_shoulder) {
    actor.hasLivePose = true;
    const isFacingCamera = (kpts.left_shoulder.x > kpts.right_shoulder.x);
    const armSign = isFacingCamera ? 1.0 : -1.0;

    // Left Arm
    if (kpts.left_elbow) {
      const dxl = (kpts.left_elbow.x - kpts.left_shoulder.x) * armSign;
      const dyl = kpts.left_elbow.y - kpts.left_shoulder.y;
      const isLeftRaised = kpts.left_wrist && (kpts.left_wrist.y < kpts.left_elbow.y - 15 || kpts.left_wrist.y < kpts.left_shoulder.y + 15);

      if (isLeftRaised) {
        const rawRollL = Math.atan2(dxl, Math.max(0.1, dyl));
        actor.poseTarget.rollL = THREE.MathUtils.clamp(rawRollL * 0.7, -0.3, 1.6);
        actor.poseTarget.pitchL = 0.0;
        if (kpts.left_wrist) {
          const dxw = kpts.left_wrist.x - kpts.left_elbow.x;
          const dyw = kpts.left_wrist.y - kpts.left_elbow.y;
          const dot = dxl * dxw + dyl * dyw;
          const mag1 = Math.hypot(dxl, dyl);
          const mag2 = Math.hypot(dxw, dyw);
          if (mag1 > 3 && mag2 > 3) {
            const cosA = THREE.MathUtils.clamp(dot / (mag1 * mag2), -1, 1);
            actor.poseTarget.elbowL = Math.acos(cosA);
          }
        }
      } else {
        actor.poseTarget.rollL = 0.0;
        actor.poseTarget.pitchL = 0.0;
        actor.poseTarget.elbowL = 0.0;
      }
    }

    // Right Arm
    if (kpts.right_elbow) {
      const dxr = (kpts.right_elbow.x - kpts.right_shoulder.x) * armSign;
      const dyr = kpts.right_elbow.y - kpts.right_shoulder.y;
      const isRightRaised = kpts.right_wrist && (kpts.right_wrist.y < kpts.right_elbow.y - 15 || kpts.right_wrist.y < kpts.right_shoulder.y + 15);

      if (isRightRaised) {
        const rawRollR = Math.atan2(-dxr, Math.max(0.1, dyr));
        actor.poseTarget.rollR = THREE.MathUtils.clamp(rawRollR * 0.7, -0.3, 1.6);
        actor.poseTarget.pitchR = 0.0;
        if (kpts.right_wrist) {
          const dxwr = kpts.right_wrist.x - kpts.right_elbow.x;
          const dywr = kpts.right_wrist.y - kpts.right_elbow.y;
          const dotR = dxr * dxwr + dyr * dywr;
          const mag1R = Math.hypot(dxr, dyr);
          const mag2R = Math.hypot(dxwr, dywr);
          if (mag1R > 3 && mag2R > 3) {
            const cosAR = THREE.MathUtils.clamp(dotR / (mag1R * mag2R), -1, 1);
            actor.poseTarget.elbowR = Math.acos(cosAR);
          }
        }
      } else {
        actor.poseTarget.rollR = 0.0;
        actor.poseTarget.pitchR = 0.0;
        actor.poseTarget.elbowR = 0.0;
      }
    }

    // Torso roll
    const dshX = kpts.left_shoulder.x - kpts.right_shoulder.x;
    const dshY = kpts.left_shoulder.y - kpts.right_shoulder.y;
    actor.poseTarget.torsoRoll = THREE.MathUtils.clamp(Math.atan2(dshY, Math.max(10, Math.abs(dshX))) * 0.4, -0.20, 0.20);

    // Head yaw
    if (kpts.nose) {
      const midShX = (kpts.left_shoulder.x + kpts.right_shoulder.x) / 2;
      const dHeadX = kpts.nose.x - midShX;
      actor.poseTarget.headYaw = THREE.MathUtils.clamp(-dHeadX * 0.015, -0.6, 0.6);
    }
  } else {
    actor.hasLivePose = false;
  }
}
