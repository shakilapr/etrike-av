export interface SignalDef {
  name: string;
  byte: number;
  bit: number;
  bits: number;
  endian: 'little' | 'big';
  signed: boolean;
  scale: number;
  offset: number;
  min_val: number | null;
  max_val: number | null;
  unit: string;
  comment: string;
  color: string;
}

export interface MessageDef {
  key: string;
  name: string;
  dlc: number;
  id: number;
  id_hex: string;
  bus: string;
  buses?: string[];
  sender: string;
  receivers: string[];
  cycle_ms: number;
  access: 'RX' | 'TX';
  signals: SignalDef[];
}

export interface BitCell {
  index: number;
  byte: number;
  bit: number;
  val: number;
  owner: string | null;
  color: string | null;
}

export interface FrameSnapshot {
  id: number;
  id_hex: string;
  data_hex: string;
  dlc: number;
  count: number;
  rate_hz: number;
  timestamp: number;
  signals: Record<string, { raw: number; value: number | string; unit: string; color: string }>;
  bit_cells: BitCell[];
}

export interface TelemetrySummary {
  mode: string;
  estop: boolean;
  estop_reason: number;
  gear: string;
  gear_cmd?: string;
  gear_act?: string;
  speed_cmd_kmh: number;
  speed_act_kmh: number;
  steer_cmd_deg: number;
  steer_act_deg: number;
  brake_cmd_kpa: number;
  brake_act_kpa: number;
  lights_cmd: {
    left: boolean;
    right: boolean;
    hazard: boolean;
    headlight: boolean;
    brake: boolean;
  };
  lights_act: {
    left: boolean;
    right: boolean;
    hazard: boolean;
    headlight: boolean;
    brake: boolean;
  };
  motor_rpm?: number | null;
  throttle_pct?: number | null;
  bus_rate_hz?: number;
  can_connected?: boolean;
  is_simulated?: boolean;
  can_interface?: string;
  telemetry_source?: 'ECU_FEEDBACK' | 'BENCH_CMD' | 'ROS_SIM' | 'SIMULATED' | 'OFFLINE';
}

export interface PerceptionObject {
  id: string | number;
  label: 'CAR' | 'TRUCK' | 'BUS' | 'MOTORCYCLE' | 'PEDESTRIAN' | 'BICYCLE' | 'BOX' | 'CLUSTER' | 'OBSTACLE' | 'UNKNOWN' | string;
  x: number; // lateral position (meters, left is negative, right is positive)
  y: number; // vertical height (meters)
  z: number; // longitudinal position (meters ahead, forward is negative Z in Three.js)
  dx?: number; // length (REP-103 X)
  dy?: number; // width (REP-103 Y)
  dz?: number; // height (REP-103 Z)
  yaw?: number; // heading in radians
  speed_kmh?: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
}

export interface KeypointCoord {
  x: number;
  y: number;
}

export interface HumanPoseItem {
  id: string;
  x_base: number;
  y_base: number;
  z_base: number;
  posture: 'SEATED' | 'STANDING' | string;
  is_seated: boolean;
  confidence: number;
  keypoints?: Record<string, KeypointCoord>;
}

export interface HumanPosesPayload {
  timestamp?: number;
  count?: number;
  poses?: HumanPoseItem[];
}

export interface RosStatus {
  active: boolean;
  hz: number;
  tracked_count: number;
  object_count?: number;
  source?: 'tracking' | 'prediction' | 'detection' | null;
  pose_ok?: boolean;
  frame_id?: string;
  has_ego_pose?: boolean;
  ego_speed_kmh?: number;
  ego_yaw_rate_mrad_s?: number;
  class_counts?: Record<string, number>;
  bridge_available?: boolean;
  subscribed?: Record<string, boolean>;
  last_error?: string | null;
  bench_perception?: {
    mode?: 'CAMERA_ONLY' | 'LIDAR_ONLY' | 'COMBINED' | 'FUSED' | 'OFFLINE' | 'UNAVAILABLE' | string;
    object_count?: number;
    latency_ms?: number;
    camera_online?: boolean;
    lidar_online?: boolean;
    camera_connected?: boolean;
    lidar_connected?: boolean;
    camera_hz?: number;
    lidar_hz?: number;
    combined?: boolean;
    fusion_active?: boolean;
    timestamp?: number;
  };
  human_poses?: HumanPosesPayload;
}

