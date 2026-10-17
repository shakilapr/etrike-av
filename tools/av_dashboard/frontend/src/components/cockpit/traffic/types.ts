import * as THREE from 'three';
import { HumanPoseItem } from '../../../types/can';

export interface ActorLimbs {
  bodyRoot: THREE.Object3D;
  hips: THREE.Object3D;
  spine?: THREE.Object3D;
  chest?: THREE.Object3D;
  neck?: THREE.Object3D;
  head?: THREE.Object3D;
  armL: THREE.Object3D;
  elbowL: THREE.Object3D;
  armR: THREE.Object3D;
  elbowR: THREE.Object3D;
  legL: THREE.Object3D;
  kneeL: THREE.Object3D;
  legR: THREE.Object3D;
  kneeR: THREE.Object3D;
}

export interface KinematicState {
  rollL: number;
  pitchL: number;
  elbowL: number;
  rollR: number;
  pitchR: number;
  elbowR: number;
  torsoRoll: number;
  headYaw: number;
}

export const SKELETON_PAIRS: [number, number, number][] = [
  // Facial constellation (Sky & Violet)
  [0, 1, 0x38bdf8], // nose -> eyeL
  [0, 2, 0x38bdf8], // nose -> eyeR
  [1, 3, 0xc084fc], // eyeL -> earL
  [2, 4, 0xc084fc], // eyeR -> earR
  // Torso & Shoulders (Cyan & Sky)
  [5, 6, 0x06b6d4], // shoulderL -> shoulderR
  [5, 11, 0x06b6d4], // shoulderL -> hipL
  [6, 12, 0x06b6d4], // shoulderR -> hipR
  [11, 12, 0x10b981], // hipL -> hipR (Emerald)
  // Left Arm (Electric Sky)
  [5, 7, 0x22d3ee], // shoulderL -> elbowL
  [7, 9, 0x22d3ee], // elbowL -> wristL
  // Right Arm (Electric Sky)
  [6, 8, 0x22d3ee], // shoulderR -> elbowR
  [8, 10, 0x22d3ee], // elbowR -> wristR
  // Left Leg (Amber)
  [11, 13, 0xf59e0b], // hipL -> kneeL
  [13, 15, 0xf59e0b], // kneeL -> ankleL
  // Right Leg (Highway Orange)
  [12, 14, 0xf97316], // hipR -> kneeR
  [14, 16, 0xf97316], // kneeR -> ankleR
];

export interface Actor {
  group: THREE.Group;
  meshes: Record<string, THREE.Object3D>;
  currentLabel: string;
  lastSeen: number;
  targetPos: THREE.Vector3;
  targetYaw: number;
  limbs?: ActorLimbs;
  animSeed: number;
  isSeated: boolean;
  seatedBlend: number;
  hasLivePose: boolean;
  postureText: string;
  poseTarget: KinematicState;
  poseCurrent: KinematicState;
  skeletonGroup?: THREE.Group;
  skeletonJoints?: THREE.Mesh[];
  skeletonBones?: THREE.Mesh[];
  smplMesh?: THREE.Object3D;
  smplBones?: Record<string, THREE.Bone>;
  proceduralMesh?: THREE.Object3D;
  humanObjMesh?: THREE.Object3D;
  pedBoxMesh?: THREE.Mesh;
  pedEdgesMesh?: THREE.LineSegments;
  pedRingMesh?: THREE.Mesh;
  sensorProvenance?: string;
  lastPoseItem?: HumanPoseItem;
}

export const CLASS_COLORS: Record<string, number> = {
  CAR: 0x94a3b8,
  TRUCK: 0x64748b,
  BUS: 0x64748b,
  MOTORCYCLE: 0x34d399,
  BICYCLE: 0x34d399,
  PEDESTRIAN: 0x94a3b8, // SMPL slate-grey
  CONE: 0xf97316,
  BOX: 0xf97316,
  UNKNOWN: 0x9ca3af,
};
