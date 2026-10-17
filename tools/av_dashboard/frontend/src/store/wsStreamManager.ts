import { CanState } from './canStore';

// Single shared cockpit stream socket. Guards against duplicate connections
// (React StrictMode double-invokes the App effect in development).
let streamSocket: WebSocket | null = null;

export function createWebSocketStream(
  set: (partial: Partial<CanState> | ((state: CanState) => Partial<CanState>)) => void,
  get: () => CanState
) {
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
          // Freeze CAN message list / packet inspector ONLY when paused.
          // Safety telemetry, ROS status, perception, and trajectory must NEVER freeze!
          if (!get().isPaused && data.frames && Array.isArray(data.frames)) {
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
}
