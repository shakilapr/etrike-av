import { create } from 'zustand';
import { FrameSnapshot, MessageDef, TelemetrySummary } from '../types/can';

interface CanState {
  catalog: MessageDef[];
  contractsSource: string;
  framesById: Record<number, FrameSnapshot>;
  selectedCanId: number;
  hoveredSignal: string | null;
  telemetry: TelemetrySummary;
  totalFrames: number;
  uptimeSec: number;
  isConnected: boolean;
  isPaused: boolean;
  filterAccess: 'all' | 'rx' | 'tx';
  filterBus: 'all' | 'high' | 'low';
  searchQuery: string;
  zoomLevel: number;
  zoomToast: string | null;
  activeView: 'monitor' | 'cockpit';
  cameraMode: 'chase' | 'cabin' | 'orbit';
  speedUnit: 'km/h' | 'mph';

  // Actions
  setActiveView: (view: 'monitor' | 'cockpit') => void;
  toggleActiveView: () => void;
  setCameraMode: (mode: 'chase' | 'cabin' | 'orbit') => void;
  setSpeedUnit: (unit: 'km/h' | 'mph') => void;
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
  activeView: (() => {
    try {
      const v = localStorage.getItem('seer_active_view');
      return v === 'cockpit' ? 'cockpit' : 'monitor';
    } catch {
      return 'monitor';
    }
  })(),
  cameraMode: 'chase',
  speedUnit: 'km/h',

  setActiveView: (activeView) => {
    try {
      localStorage.setItem('seer_active_view', activeView);
    } catch {}
    set({ activeView });
  },
  toggleActiveView: () => {
    const next = get().activeView === 'monitor' ? 'cockpit' : 'monitor';
    try {
      localStorage.setItem('seer_active_view', next);
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
    const isDev = window.location.port === '5173';
    const host = isDev ? '127.0.0.1:8000' : window.location.host;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${host}/ws/v1/stream`;

    let ws: WebSocket | null = null;
    let reconnectTimer: any = null;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

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
