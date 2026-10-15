import React from 'react';
import { useCanStore } from '../../store/canStore';

interface SensorTriadIndicatorProps {
  size?: string;
  className?: string;
}

export const SensorTriadIndicator: React.FC<SensorTriadIndicatorProps> = ({
  className = '',
}) => {
  const rosStatus = useCanStore((s) => s.rosStatus);
  const bench = rosStatus.bench_perception;

  // Determine physical sensor states
  const camOnline = Boolean(bench?.camera_online || (bench?.camera_hz && bench.camera_hz > 0));
  const camHz = bench?.camera_hz ?? (camOnline ? 14.0 : 0.0);

  const lidarOnline = Boolean(bench?.lidar_online || (bench?.lidar_hz && bench.lidar_hz > 0));
  const lidarHz = bench?.lidar_hz ?? (lidarOnline ? 10.0 : 0.0);

  // Operating Mode: COMBINED, CAMERA_ONLY, LIDAR_ONLY, or OFFLINE
  const isCombined = camOnline && lidarOnline;
  const activeMode: 'COMBINED' | 'CAMERA_ONLY' | 'LIDAR_ONLY' | 'OFFLINE' = isCombined
    ? 'COMBINED'
    : camOnline
    ? 'CAMERA_ONLY'
    : lidarOnline
    ? 'LIDAR_ONLY'
    : 'OFFLINE';

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-1 bg-[#0a0a0a] border border-neutral-800 rounded font-mono text-[11px] select-none ${className}`}
    >
      {/* 1. Camera Status */}
      <div
        className="flex items-center gap-1.5"
        title={camOnline ? `Kinect v2 Color: ${camHz.toFixed(1)} Hz` : 'Camera Disconnected'}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            camOnline ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'bg-neutral-600'
          }`}
        />
        <span className={camOnline ? 'text-neutral-200 font-semibold' : 'text-neutral-500'}>
          CAM
        </span>
        {camOnline && (
          <span className="text-neutral-400 text-[10px] tabular-nums font-normal">
            {camHz.toFixed(0)}Hz
          </span>
        )}
      </div>

      <span className="text-neutral-700">|</span>

      {/* 2. LiDAR Status */}
      <div
        className="flex items-center gap-1.5"
        title={lidarOnline ? `Hesai XT32: ${lidarHz.toFixed(1)} Hz` : 'LiDAR Disconnected / Link Down (eno1)'}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            lidarOnline ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-neutral-600'
          }`}
        />
        <span className={lidarOnline ? 'text-neutral-200 font-semibold' : 'text-neutral-500'}>
          LIDAR
        </span>
        {lidarOnline && (
          <span className="text-neutral-400 text-[10px] tabular-nums font-normal">
            {lidarHz.toFixed(0)}Hz
          </span>
        )}
      </div>

      <span className="text-neutral-700">|</span>

      {/* 3. Operational Mode */}
      <div
        className="flex items-center gap-1.5"
        title={`Perception Operating Mode: ${activeMode}`}
      >
        <span className="text-neutral-500 text-[10px] font-normal uppercase">MODE:</span>
        <span
          className={`font-bold ${
            activeMode === 'COMBINED'
              ? 'text-cyan-400'
              : activeMode === 'CAMERA_ONLY'
              ? 'text-sky-300'
              : activeMode === 'LIDAR_ONLY'
              ? 'text-emerald-400'
              : 'text-neutral-600'
          }`}
        >
          {activeMode === 'COMBINED'
            ? 'FUSION'
            : activeMode === 'CAMERA_ONLY'
            ? 'CAM'
            : activeMode === 'LIDAR_ONLY'
            ? 'LIDAR'
            : 'OFFLINE'}
        </span>
      </div>
    </div>
  );
};
