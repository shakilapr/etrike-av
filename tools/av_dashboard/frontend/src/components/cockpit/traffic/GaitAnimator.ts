import * as THREE from 'three';
import { Actor } from './types';

export function animateActorGait(
  actor: Actor,
  animTime: number,
  step: number
): void {
  if (!actor.limbs || !actor.meshes['PEDESTRIAN']?.visible) return;

  const targetBlend = actor.isSeated ? 1.0 : 0.0;
  actor.seatedBlend = THREE.MathUtils.lerp(actor.seatedBlend, targetBlend, 1 - Math.exp(-step * 10));
  const sb = actor.seatedBlend;

  const rotLerp = 1 - Math.exp(-step * 14);
  actor.poseCurrent.rollL = THREE.MathUtils.lerp(actor.poseCurrent.rollL, actor.poseTarget.rollL, rotLerp);
  actor.poseCurrent.pitchL = THREE.MathUtils.lerp(actor.poseCurrent.pitchL || 0, actor.poseTarget.pitchL || 0, rotLerp);
  actor.poseCurrent.elbowL = THREE.MathUtils.lerp(actor.poseCurrent.elbowL, actor.poseTarget.elbowL, rotLerp);
  actor.poseCurrent.rollR = THREE.MathUtils.lerp(actor.poseCurrent.rollR, actor.poseTarget.rollR, rotLerp);
  actor.poseCurrent.pitchR = THREE.MathUtils.lerp(actor.poseCurrent.pitchR || 0, actor.poseTarget.pitchR || 0, rotLerp);
  actor.poseCurrent.elbowR = THREE.MathUtils.lerp(actor.poseCurrent.elbowR, actor.poseTarget.elbowR, rotLerp);
  actor.poseCurrent.torsoRoll = THREE.MathUtils.lerp(actor.poseCurrent.torsoRoll, actor.poseTarget.torsoRoll, rotLerp);
  actor.poseCurrent.headYaw = THREE.MathUtils.lerp(actor.poseCurrent.headYaw, actor.poseTarget.headYaw, rotLerp);

  // 1. Direct 25-Bone Articulation on Rigged SMPL Model
  if (actor.smplBones) {
    const b = actor.smplBones;
    if (actor.proceduralMesh) actor.proceduralMesh.visible = false;
    if (actor.humanObjMesh) {
      if (actor.smplMesh) actor.smplMesh.visible = false;
      actor.humanObjMesh.visible = true;
    }

    if (b['m_avg_Pelvis']) {
      b['m_avg_Pelvis'].position.y = 97.27 - 36 * sb;
      b['m_avg_Pelvis'].position.z = 2.86 - 5 * sb;
      b['m_avg_Pelvis'].rotation.x = 0.08 * sb;
    }

    const walkWeight = Math.max(0, 1.0 - sb);
    const walkFreq = 5.2;
    const walkPhase = animTime * walkFreq + actor.animSeed;
    const walkAngle = Math.sin(walkPhase) * 0.42 * walkWeight;
    const armAngle = Math.sin(walkPhase) * 0.35 * walkWeight;
    const kneeFlexL = Math.max(0, -walkAngle * 0.75) * walkWeight;
    const kneeFlexR = Math.max(0, walkAngle * 0.75) * walkWeight;

    const seatedHip = -1.45 * sb;
    const seatedKnee = 1.45 * sb;
    const seatedAnkle = -0.15 * sb;
    if (b['m_avg_L_Hip']) b['m_avg_L_Hip'].rotation.x = seatedHip - walkAngle * 0.7;
    if (b['m_avg_R_Hip']) b['m_avg_R_Hip'].rotation.x = seatedHip + walkAngle * 0.7;
    if (b['m_avg_L_Knee']) b['m_avg_L_Knee'].rotation.x = seatedKnee + kneeFlexL;
    if (b['m_avg_R_Knee']) b['m_avg_R_Knee'].rotation.x = seatedKnee + kneeFlexR;
    if (b['m_avg_L_Ankle']) b['m_avg_L_Ankle'].rotation.x = seatedAnkle;
    if (b['m_avg_R_Ankle']) b['m_avg_R_Ankle'].rotation.x = seatedAnkle;

    const seatedArmPitch = -0.45 * sb;
    const seatedElbowFlex = 1.35 * sb;

    if (actor.hasLivePose) {
      if (b['m_avg_L_Shoulder']) {
        b['m_avg_L_Shoulder'].rotation.z = -1.25 + actor.poseCurrent.rollL;
        b['m_avg_L_Shoulder'].rotation.x = seatedArmPitch + actor.poseCurrent.pitchL;
      }
      if (b['m_avg_R_Shoulder']) {
        b['m_avg_R_Shoulder'].rotation.z = 1.25 - actor.poseCurrent.rollR;
        b['m_avg_R_Shoulder'].rotation.x = seatedArmPitch + actor.poseCurrent.pitchR;
      }
      if (b['m_avg_L_Elbow']) {
        b['m_avg_L_Elbow'].rotation.y = 0.25 + seatedElbowFlex + actor.poseCurrent.elbowL * 0.6;
      }
      if (b['m_avg_R_Elbow']) {
        b['m_avg_R_Elbow'].rotation.y = -0.25 - seatedElbowFlex - actor.poseCurrent.elbowR * 0.6;
      }
    } else {
      if (b['m_avg_L_Shoulder']) {
        b['m_avg_L_Shoulder'].rotation.z = -1.25;
        b['m_avg_L_Shoulder'].rotation.x = seatedArmPitch + armAngle * 0.5;
      }
      if (b['m_avg_R_Shoulder']) {
        b['m_avg_R_Shoulder'].rotation.z = 1.25;
        b['m_avg_R_Shoulder'].rotation.x = seatedArmPitch - armAngle * 0.5;
      }
      if (b['m_avg_L_Elbow']) {
        b['m_avg_L_Elbow'].rotation.y = 0.25 + seatedElbowFlex;
      }
      if (b['m_avg_R_Elbow']) {
        b['m_avg_R_Elbow'].rotation.y = -0.25 - seatedElbowFlex;
      }
    }

    if (b['m_avg_Head']) b['m_avg_Head'].rotation.y = actor.poseCurrent.headYaw;
    if (b['m_avg_Spine3']) b['m_avg_Spine3'].rotation.z = -actor.poseCurrent.torsoRoll;
  } else {
    // Fallback procedural capsule articulation
    if (actor.proceduralMesh) actor.proceduralMesh.visible = !actor.humanObjMesh;
    if (actor.humanObjMesh) actor.humanObjMesh.visible = true;
    actor.limbs.hips.position.y = 0.86 - 0.34 * sb;
    actor.limbs.hips.rotation.x = 0.08 * sb;

    const seatedHip = 1.48 * sb;
    const seatedKnee = -1.40 * sb;
    const seatedArm = -0.55 * sb;
    const seatedElbow = 0.75 * sb;

    if (actor.limbs.spine) actor.limbs.spine.rotation.z = -actor.poseCurrent.torsoRoll;
    if (actor.limbs.head) actor.limbs.head.rotation.y = actor.poseCurrent.headYaw;

    const walkWeight = Math.max(0, 1.0 - sb);
    const walkFreq = 5.2;
    const walkPhase = animTime * walkFreq + actor.animSeed;
    const walkAngle = Math.sin(walkPhase) * 0.42 * walkWeight;
    const armAngle = Math.sin(walkPhase) * 0.35 * walkWeight;
    const kneeFlexL = Math.max(0, -walkAngle * 0.75) * walkWeight;
    const kneeFlexR = Math.max(0, walkAngle * 0.75) * walkWeight;

    actor.limbs.legL.rotation.x = seatedHip + walkAngle;
    actor.limbs.kneeL.rotation.x = seatedKnee - kneeFlexL;
    actor.limbs.legR.rotation.x = seatedHip - walkAngle;
    actor.limbs.kneeR.rotation.x = seatedKnee - kneeFlexR;

    if (actor.hasLivePose) {
      actor.limbs.armL.rotation.z = -actor.poseCurrent.rollL;
      actor.limbs.armL.rotation.x = seatedArm + actor.poseCurrent.pitchL;
      actor.limbs.elbowL.rotation.x = Math.max(seatedElbow, actor.poseCurrent.elbowL);

      actor.limbs.armR.rotation.z = actor.poseCurrent.rollR;
      actor.limbs.armR.rotation.x = seatedArm + actor.poseCurrent.pitchR;
      actor.limbs.elbowR.rotation.x = Math.max(seatedElbow, actor.poseCurrent.elbowR);
    } else {
      actor.limbs.armL.rotation.z = 0;
      actor.limbs.armL.rotation.x = seatedArm - armAngle;
      actor.limbs.elbowL.rotation.x = seatedElbow + (0.2 + Math.abs(armAngle) * 0.3) * walkWeight;

      actor.limbs.armR.rotation.z = 0;
      actor.limbs.armR.rotation.x = seatedArm + armAngle;
      actor.limbs.elbowR.rotation.x = seatedElbow + (0.2 + Math.abs(armAngle) * 0.3) * walkWeight;
    }
  }
}
