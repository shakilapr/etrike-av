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
}

export interface PerceptionObject {
  id: string | number;
  label: 'CAR' | 'TRUCK' | 'BUS' | 'PEDESTRIAN' | 'BICYCLE' | 'BOX' | 'UNKNOWN';
  x: number; // lateral position (meters, left is negative, right is positive)
  y: number; // vertical height (meters)
  z: number; // longitudinal position (meters ahead, forward is negative Z in Three.js)
  dx?: number; // length
  dy?: number; // height
  dz?: number; // width
  yaw?: number; // heading in radians
  speed_kmh?: number;
}
