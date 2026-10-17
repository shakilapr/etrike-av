import * as THREE from 'three';
import { TrafficMaterials, TrafficGeometries } from './materials';
import { Actor } from './types';
import { PerceptionObject } from '../../../types/can';
import { createPedestrianMesh } from './PedestrianMesh';
import { createRTMPoseSkeletonOverlay } from './SkeletonRig';
import { createConeMesh, createObstacleMesh, createClusterMesh } from './ProceduralObstacles';
import { createCarMesh, createTruckMesh, createCyclistMesh } from './ProceduralVehicles';
import { createDistanceBadge } from './DistanceBadge';
import { applySemanticThemeToActor } from './HumanModelLoader';

export function resolveActiveModel(obj: PerceptionObject): string | null {
  const lbl = String(obj.label);
  if (lbl === 'PEDESTRIAN') return 'PEDESTRIAN';
  if (lbl === 'CAR') return 'CAR';
  if (lbl === 'TRUCK' || lbl === 'BUS') return 'TRUCK';
  if (lbl === 'BICYCLE' || lbl === 'MOTORCYCLE') return 'BICYCLE';
  if (lbl === 'CONE') return 'CONE';
  if (lbl === 'CLUSTER' || lbl === 'UNKNOWN' || lbl === 'OBSTACLE' || lbl === 'BOX') return 'CLUSTER';
  return null;
}

export function applyClassGeometry(actor: Actor, obj: PerceptionObject): void {
  const targetModel = resolveActiveModel(obj);
  if (!targetModel) {
    for (const [key, mesh] of Object.entries(actor.meshes)) {
      if (key.startsWith('__')) continue;
      mesh.visible = false;
    }
    return;
  }

  for (const [key, mesh] of Object.entries(actor.meshes)) {
    if (key.startsWith('__')) continue;
    mesh.visible = key === targetModel;
  }

  actor.currentLabel = obj.label;
  const active = actor.meshes[targetModel];
  if (!active) return;

  const width = obj.dy && obj.dy > 0 ? obj.dy : 1.8;
  const length = obj.dx && obj.dx > 0 ? obj.dx : 4.0;
  const height = obj.dz && obj.dz > 0 ? obj.dz : 1.5;

  if (targetModel === 'PEDESTRIAN') {
    if (actor.skeletonGroup) actor.skeletonGroup.visible = true;
    const hScale = Math.min(Math.max(height / 1.75, 0.8), 1.25);
    active.scale.set(hScale, hScale, hScale);
  } else {
    if (actor.skeletonGroup) actor.skeletonGroup.visible = false;
    if (targetModel === 'CLUSTER') {
      const w = Math.max(width || 1.0, 0.4);
      const l = Math.max(length || 1.0, 0.4);
      const h = Math.max(height || 1.0, 0.4);
      active.scale.set(w, h, l);
    } else if (targetModel === 'CONE') {
      const coneScale = Math.min(Math.max((width + length) / 1.0, 0.8), 1.4);
      active.scale.set(coneScale, coneScale, coneScale);
    } else if (targetModel === 'CAR') {
      active.scale.set(Math.max(width / 1.85, 0.8), Math.max(height / 1.45, 0.8), Math.max(length / 4.3, 0.8));
    }
  }
}

export function buildActor(
  obj: PerceptionObject,
  seedIndex: number,
  mats: TrafficMaterials,
  geos: TrafficGeometries,
  humanModelTemplate: THREE.Group | null,
  smplTemplate: THREE.Group | null,
  trafficGroup: THREE.Group
): Actor {
  const group = new THREE.Group();

  const { mesh: pedMesh, limbs, smplMesh, smplBones, proceduralMesh, humanObjMesh, pedBox, pedEdges, pedRing } =
    createPedestrianMesh(mats, geos, humanModelTemplate, smplTemplate);
  const { group: skelGroup, joints: skelJoints, bones: skelBones } = createRTMPoseSkeletonOverlay(mats, geos);
  pedMesh.add(skelGroup);

  const meshes: Record<string, THREE.Object3D> = {
    PEDESTRIAN: pedMesh,
    CONE: createConeMesh(mats, geos),
    CAR: createCarMesh(mats, geos),
    TRUCK: createTruckMesh(mats, geos),
    BUS: createTruckMesh(mats, geos),
    BICYCLE: createCyclistMesh(mats, geos),
    MOTORCYCLE: createCyclistMesh(mats, geos),
    CLUSTER: createClusterMesh(),
  };

  for (const mesh of Object.values(meshes)) {
    group.add(mesh);
  }

  const distBadge = createDistanceBadge();
  distBadge.visible = false;
  group.add(distBadge);
  meshes['__dist'] = distBadge;

  trafficGroup.add(group);
  const actor: Actor = {
    group,
    meshes,
    currentLabel: obj.label,
    lastSeen: 0,
    targetPos: new THREE.Vector3(),
    targetYaw: 0,
    limbs,
    animSeed: seedIndex * 1.618,
    isSeated: false,
    seatedBlend: 0,
    hasLivePose: false,
    postureText: 'STANDING',
    poseTarget: { rollL: 0, pitchL: 0, elbowL: 0, rollR: 0, pitchR: 0, elbowR: 0, torsoRoll: 0, headYaw: 0 },
    poseCurrent: { rollL: 0, pitchL: 0, elbowL: 0, rollR: 0, pitchR: 0, elbowR: 0, torsoRoll: 0, headYaw: 0 },
    skeletonGroup: skelGroup,
    skeletonJoints: skelJoints,
    skeletonBones: skelBones,
    smplMesh,
    smplBones,
    proceduralMesh,
    humanObjMesh,
    pedBoxMesh: pedBox,
    pedEdgesMesh: pedEdges,
    pedRingMesh: pedRing,
    sensorProvenance: obj.sensor || (obj.fused ? 'fused' : 'fused'),
  };

  if (obj.label === 'PEDESTRIAN') {
    applySemanticThemeToActor(actor, actor.sensorProvenance || 'fused', mats);
  }

  return actor;
}

export function disposeActor(actor: Actor): void {
  actor.group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
    if (child.userData && child.userData.texture) {
      (child.userData.texture as THREE.Texture).dispose();
    }
  });
}
