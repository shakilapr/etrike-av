import * as THREE from 'three';
import { PerceptionObject, HumanPosesPayload, MhrHumanPayload } from '../../types/can';
import { MhrHuman } from './MhrHuman';
import { Actor } from './traffic/types';
import { createTrafficMaterials, createTrafficGeometries, TrafficMaterials, TrafficGeometries } from './traffic/materials';
import { loadHumanModelTemplate, loadSmplTemplate, upgradeActorHumanMesh, upgradeActorToSmpl } from './traffic/HumanModelLoader';
import { buildActor, applyClassGeometry, disposeActor } from './traffic/ActorPool';
import { solveKinematics } from './traffic/KinematicsSolver';
import { animateActorGait } from './traffic/GaitAnimator';
import { updateRTMPoseSkeleton } from './traffic/SkeletonRig';
import { preparePerceptionObjects } from './traffic/PerceptionCorrelator';

export type { Actor, ActorLimbs, KinematicState } from './traffic/types';
export { SKELETON_PAIRS, CLASS_COLORS } from './traffic/types';

export class SurroundingTraffic {
  public group: THREE.Group;
  private actors: Map<string, Actor> = new Map();
  private animTime = 0;
  private smplTemplate: THREE.Group | null = null;
  private humanModelTemplate: THREE.Group | null = null;
  private mhr: MhrHuman;
  private mats: TrafficMaterials;
  private geos: TrafficGeometries;

  constructor() {
    this.group = new THREE.Group();
    this.mhr = new MhrHuman();
    this.group.add(this.mhr.group);

    this.mats = createTrafficMaterials();
    this.geos = createTrafficGeometries();

    loadHumanModelTemplate(this.mats, (template) => {
      this.humanModelTemplate = template;
      for (const actor of this.actors.values()) {
        if (actor.currentLabel === 'PEDESTRIAN') {
          upgradeActorHumanMesh(actor, this.humanModelTemplate, this.mats);
        }
      }
    });

    loadSmplTemplate((template) => {
      this.smplTemplate = template;
      for (const actor of this.actors.values()) {
        if (actor.currentLabel === 'PEDESTRIAN') {
          upgradeActorToSmpl(actor, this.smplTemplate, this.humanModelTemplate, this.mats, this.geos);
        }
      }
    });
  }

  public update(
    _egoSpeedKmh: number,
    perceptionList: PerceptionObject[] | undefined,
    _rosActive: boolean,
    dt: number,
    humanPoses?: HumanPosesPayload | null,
    demoPedestrian: boolean = false,
    mhrHuman?: MhrHumanPayload | null,
    showSkeletons: boolean = true
  ): void {
    const now = performance.now() / 1000;
    const step = Math.min(dt > 0 ? dt : 0.016, 0.1);
    this.animTime += step;

    const { effectiveList, effectivePoses } = preparePerceptionObjects(
      perceptionList,
      humanPoses,
      demoPedestrian,
      this.animTime
    );

    const poses = effectivePoses;
    const seen = new Set<string>();
    const usedPoseIds = new Set<string>();

    if (effectiveList && effectiveList.length > 0) {
      effectiveList.forEach((obj, index) => {
        if (obj.label === 'UNKNOWN' || (obj.label as string) === 'BOX') return;
        const key = String(obj.id || `anon-${index}`);
        seen.add(key);

        const targetY = obj.label === 'PEDESTRIAN' ? 0.0 : (obj.y || 0);
        let actor = this.actors.get(key);
        if (!actor) {
          actor = buildActor(obj, index, this.mats, this.geos, this.humanModelTemplate, this.smplTemplate, this.group);
          actor.group.position.set(obj.x, targetY, obj.z);
          actor.group.rotation.y = obj.yaw || 0;
          this.actors.set(key, actor);
        }

        actor.lastSeen = now;
        actor.group.visible = true;
        actor.targetPos.set(obj.x, targetY, obj.z);
        actor.targetYaw = obj.yaw || 0;
        applyClassGeometry(actor, obj);

        if (obj.label === 'PEDESTRIAN' && poses && poses.length > 0) {
          let matchedPose = poses.find((p) => !usedPoseIds.has(p.id) && p.id === String(obj.id));
          if (!matchedPose && poses.length === 1 && !usedPoseIds.has(poses[0].id)) {
            matchedPose = poses[0];
          }
          if (!matchedPose) {
            let bestDist = Infinity;
            for (const p of poses) {
              if (usedPoseIds.has(p.id)) continue;
              const d = Math.hypot(obj.x - p.y_base, obj.z - (1.0 - p.x_base));
              if (d < 4.0 && d < bestDist) {
                bestDist = d;
                matchedPose = p;
              }
            }
          }
          if (matchedPose) {
            usedPoseIds.add(matchedPose.id);
            actor.lastPoseItem = matchedPose;
            solveKinematics(actor, matchedPose);
          }
        }
      });
    }

    const posLerp = 1 - Math.exp(-step * 12);
    const yawLerp = 1 - Math.exp(-step * 10);

    for (const [key, actor] of this.actors) {
      if (!seen.has(key)) {
        let closeToOtherVisible = false;
        for (const [otherKey, otherActor] of this.actors) {
          if (otherKey !== key && seen.has(otherKey) && otherActor.group.visible) {
            if (actor.group.position.distanceTo(otherActor.group.position) < 2.0) {
              closeToOtherVisible = true;
              break;
            }
          }
        }
        if (closeToOtherVisible || now - actor.lastSeen > 0.15) {
          actor.group.visible = false;
          continue;
        }
      }

      actor.group.position.lerp(actor.targetPos, posLerp);
      const diff = actor.targetYaw - actor.group.rotation.y;
      const delta = Math.atan2(Math.sin(diff), Math.cos(diff));
      actor.group.rotation.y += delta * yawLerp;

      animateActorGait(actor, this.animTime, step);
      updateRTMPoseSkeleton(actor, showSkeletons);
    }

    if (this.actors.size > 64) {
      for (const [key, actor] of this.actors) {
        if (now - actor.lastSeen > 3.0) {
          this.group.remove(actor.group);
          disposeActor(actor);
          this.actors.delete(key);
        }
      }
    }

    const mhrActive = this.mhr.update(mhrHuman, (id) => {
      const actor = this.actors.get(id);
      if (actor && actor.group.visible) {
        return { position: actor.group.position, yaw: actor.group.rotation.y, visible: true };
      }
      const rawPoses = humanPoses?.poses;
      if (rawPoses) {
        const pose = rawPoses.find((p) => p.id === id);
        if (pose) {
          const threeX = (pose as any).y_base != null ? Number((pose as any).y_base) : 0;
          const threeZ = (pose as any).x_base != null ? 1.0 - Number((pose as any).x_base) : 1.0;
          const pos = new THREE.Vector3(threeX, 0, threeZ);
          const yaw = typeof (pose as any).yaw === 'number' ? -Number((pose as any).yaw) : 0;
          return { position: pos, yaw, visible: true };
        }
      }
      return null;
    });

    if (mhrActive.size > 0) {
      const mhrPositions = this.mhr.getActivePositions();
      for (const [key, actor] of this.actors) {
        const pedMesh = actor.meshes['PEDESTRIAN'];
        if (!pedMesh) continue;
        const isCovered = mhrActive.has(String(key)) || mhrPositions.some((mp) => mp.distanceTo(actor.group.position) < 2.0);
        if (isCovered) {
          pedMesh.visible = false;
          if (actor.skeletonGroup) actor.skeletonGroup.visible = false;
        }
      }
    }
  }

  public dispose(): void {
    for (const key of Array.from(this.actors.keys())) {
      const actor = this.actors.get(key);
      if (!actor) continue;
      this.group.remove(actor.group);
      disposeActor(actor);
      this.actors.delete(key);
    }
    this.mhr.dispose();
    this.geos.boneCylinderGeo.dispose();
    this.geos.shadowCircleGeo.dispose();
    this.geos.wheelTireGeo.dispose();
    this.geos.wheelRimGeo.dispose();
  }
}
