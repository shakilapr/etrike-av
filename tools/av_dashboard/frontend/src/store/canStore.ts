import { create } from 'zustand';
import { FrameSnapshot, MessageDef, TelemetrySummary, PerceptionObject, TrajectoryPoint, RosStatus, HumanPosesPayload, MhrHumanPayload } from '../types/can';

// Single shared cockpit stream socket. Guards against duplicate connections
// (React StrictMode double-invokes the App effect in development).
let streamSocket: WebSocket | null = null;

interface CanState {
  catalog: MessageDef[];
  contractsSource: string;
  framesById: Record<number, FrameSnapshot>;
  selectedCanId: number;
  hoveredSignal: string | null;
  telemetry: TelemetrySummary;
  perceptionObjects: PerceptionObject[];
  plannedTrajectory: TrajectoryPoint[];
  rosStatus: RosStatus;
  humanPoses: HumanPosesPayload | null;
  mhrHuman: MhrHumanPayload | null;
  totalFrames: number;
  uptimeSec: number;
  isConnected: boolean;
  isPaused: boolean;
  filterAccess: 'all' | 'rx' | 'tx';
  filterBus: 'all' | 'high' | 'low';
  searchQuery: string;
  zoomLevel: number;
  zoomToast: string | null;
  activeView: 'monitor' | 'cockpit' | 'radar';
  cameraMode: 'chase' | 'cabin' | 'orbit';
  speedUnit: 'km/h' | 'mph';
  demoPedestrian: boolean;

  // Actions
  setActiveView: (view: 'monitor' | 'cockpit' | 'radar') => void;
  toggleActiveView: () => void;
  setCameraMode: (mode: 'chase' | 'cabin' | 'orbit') => void;
  setSpeedUnit: (unit: 'km/h' | 'mph') => void;
  toggleDemoPedestrian: () => void;
  setCatalog: (catalog: MessageDef[], source: string) => void;
  selectMessage: (canId: number) => void;
  setHoveredSignal: (sigName: string | null) => void;
  togglePause: () => void;
  setFilterAccess: (filter: 'all' | 'rx' | 'tx') => void;
  setFilterBus: (bus: 'all' | 'high' | 'low') => void;
  setSearchQuery: (query: string) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  setZoomToast: (toast: string | null) => void;
  initWebSocket: () => void;
}

export const useCanStore = create<CanState>((set, get) => ({
  catalog: [],
  contractsSource: 'Loading...',
  framesById: {},
  selectedCanId: 0x121,
  hoveredSignal: null,
  telemetry: {
    mode: 'MANUAL',
    estop: false,
    estop_reason: 0,
    gear: 'N',
    speed_cmd_kmh: 0.0,
    speed_act_kmh: 0.0,
    steer_cmd_deg: 0.0,
    steer_act_deg: 0.0,
    brake_cmd_kpa: 0.0,
    brake_act_kpa: 0.0,
    lights_cmd: { left: false, right: false, hazard: false, headlight: false, brake: false },
    lights_act: { left: false, right: false, hazard: false, headlight: false, brake: false },
  },
  perceptionObjects: [],
  plannedTrajectory: [],
  rosStatus: {
    active: false,
    hz: 0,
    tracked_count: 0,
    object_count: 0,
    source: null,
    pose_ok: false,
    frame_id: '',
    has_ego_pose: false,
    class_counts: {},
    bridge_available: false,
    subscribed: {},
    last_error: null,
  },
  humanPoses: null,
  mhrHuman: null,
  totalFrames: 0,
  uptimeSec: 0,
  isConnected: false,
  isPaused: false,
  filterAccess: 'all',
  filterBus: 'all',
  searchQuery: '',
  zoomLevel: (() => {
    try {
      const s = localStorage.getItem('can_watcher_zoom');
      return s ? Math.min(Math.max(parseFloat(s), 0.6), 1.8) : 1.0;
    } catch {
      return 1.0;
    }
  })(),
  zoomToast: null,
  activeView: 'cockpit',
  cameraMode: 'chase',
  speedUnit: 'km/h',
  demoPedestrian: true,

  toggleDemoPedestrian: () => set((s) => ({ demoPedestrian: !s.demoPedestrian })),
  setActiveView: (activeView) => {
    try {
      localStorage.setItem('av_dashboard_active_view', activeView);
    } catch {}
    set({ activeView });
  },
  toggleActiveView: () => {
    const cur = get().activeView;
    const next = cur === 'monitor' ? 'cockpit' : cur === 'cockpit' ? 'radar' : 'monitor';
    try {
      localStorage.setItem('av_dashboard_active_view', next);
    } catch {}
    set({ activeView: next });
  },
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setSpeedUnit: (speedUnit) => set({ speedUnit }),

  setCatalog: (catalog, source) => {
    set({
      catalog,
      contractsSource: source,
      selectedCanId: catalog.length > 0 && !catalog.some((m) => m.id === get().selectedCanId)
        ? catalog[0].id
        : get().selectedCanId,
    });
  },

  selectMessage: (canId) => set({ selectedCanId: canId }),
  setHoveredSignal: (sigName) => set({ hoveredSignal: sigName }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setFilterAccess: (filterAccess) => set({ filterAccess }),
  setFilterBus: (filterBus) => set({ filterBus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setZoomLevel: (updater) => {
    set((state) => {
      const current = state.zoomLevel;
      const next = typeof updater === 'function' ? updater(current) : updater;
      const clamped = Math.round(Math.min(Math.max(next, 0.6), 1.8) * 100) / 100;
      try {
        localStorage.setItem('can_watcher_zoom', String(clamped));
      } catch {}
      return { zoomLevel: clamped, zoomToast: `${Math.round(clamped * 100)}%` };
    });
  },
  setZoomToast: (zoomToast) => set({ zoomToast }),

  initWebSocket: () => {
    // Idempotent: never open a second stream socket while one is live.
    if (streamSocket && streamSocket.readyState <= WebSocket.OPEN) {
      return;
    }

    const isDev = window.location.port === '5173';
    const host = isDev ? '127.0.0.1:8080' : window.location.host;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${host}/ws/v1/stream`;

    let ws: WebSocket | null = null;
    let reconnectTimer: any = null;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);
        streamSocket = ws;

        ws.onopen = () => {
          set({ isConnected: true });
        };

        ws.onmessage = (event) => {
          if (get().isPaused) return;
          try {
            const data = JSON.parse(event.data);
            const updates: Partial<CanState> = {};

            if (data.total_frames !== undefined) {
              updates.totalFrames = data.total_frames;
            }
            if (data.uptime_sec !== undefined) {
              updates.uptimeSec = data.uptime_sec;
            }
            if (data.telemetry) {
              updates.telemetry = data.telemetry;
            }
            if (data.frames && Array.isArray(data.frames)) {
              const currentFrames = { ...get().framesById };
              for (const f of data.frames) {
                currentFrames[f.id] = f;
              }
              updates.framesById = currentFrames;
            }
            if (data.perception_objects && Array.isArray(data.perception_objects)) {
              updates.perceptionObjects = data.perception_objects;
            }
            if (data.planned_trajectory && Array.isArray(data.planned_trajectory)) {
              updates.plannedTrajectory = data.planned_trajectory;
            }
            if (data.ros_status) {
              updates.rosStatus = data.ros_status;
              if (data.ros_status.human_poses) {
                updates.humanPoses = data.ros_status.human_poses;
              }
            }
            if (data.human_poses) {
              updates.humanPoses = data.human_poses;
            }
            if (data.mhr_human) {
              updates.mhrHuman = data.mhr_human;
            }

            set(updates);
          } catch (err) {
            console.error('[WS] Parse error:', err);
          }
        };

        ws.onclose = () => {
          set({ isConnected: false });
          clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(connect, 1500);
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch (err) {
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connect, 1500);
      }
    };

    connect();
  },
}));
