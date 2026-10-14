import { useEffect, useRef, useState } from 'react';
import { LidarPointCloud } from './LidarPointCloud';

export interface LidarStreamState {
  connected: boolean;
  hz: number;
  pointCount: number;
}

export function useLidarStream(lidarPointCloud: LidarPointCloud | null): LidarStreamState {
  const [state, setState] = useState<LidarStreamState>({
    connected: false,
    hz: 0,
    pointCount: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const frameTimesRef = useRef<number[]>([]);
  const pointCloudRef = useRef<LidarPointCloud | null>(lidarPointCloud);

  useEffect(() => {
    pointCloudRef.current = lidarPointCloud;
  }, [lidarPointCloud]);

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isDisposed = false;

    const connect = () => {
      if (isDisposed) return;

      const isDev = window.location.port === '5173';
      const wsHost = isDev ? '127.0.0.1:8080' : window.location.host;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${wsHost}/ws/lidar`;

      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        if (isDisposed) return;
        setState((prev) => ({ ...prev, connected: true }));
      };

      ws.onmessage = (event: MessageEvent) => {
        if (isDisposed || !(event.data instanceof ArrayBuffer)) return;

        const count = pointCloudRef.current?.updateFromBuffer(event.data) || 0;

        // Hz estimation
        const now = performance.now();
        const times = frameTimesRef.current;
        times.push(now);
        while (times.length > 0 && times[0] < now - 1000) {
          times.shift();
        }

        setState({
          connected: true,
          hz: times.length,
          pointCount: count,
        });
      };

      ws.onerror = () => {
        // Handled in onclose
      };

      ws.onclose = () => {
        if (isDisposed) return;
        setState((prev) => ({ ...prev, connected: false, hz: 0 }));
        reconnectTimeout = setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      isDisposed = true;
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return state;
}
