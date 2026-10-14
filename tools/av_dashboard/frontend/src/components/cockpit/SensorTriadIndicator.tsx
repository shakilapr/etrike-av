import React from 'react';
import { useCanStore } from '../../store/canStore';
import { Camera, Radio, Layers } from 'lucide-react';

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
    <div className={`flex items-center gap-1.5 font-mono select-none ${className}`}>
      {/* 1. Camera Status */}
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors ${
          camOnline
            ? 'bg-neutral-900/90 text-cyan-400 border-cyan-800/80'
            : 'bg-neutral-950/80 text-neutral-600 border-neutral-800'
        }`}
        title={camOnline ? `Camera Active: ${camHz.toFixed(1)} FPS` : 'Camera Disconnected'}
      >
        <Camera className="w-3.5 h-3.5 shrink-0" />
        <span>CAM</span>
        {camOnline && <span className="text-[9px] text-cyan-300 font-normal">{camHz.toFixed(0)}fps</span>}
      </div>

      {/* 2. LiDAR Status */}
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors ${
          lidarOnline
            ? 'bg-neutral-900/90 text-emerald-400 border-emerald-800/80'
            : 'bg-neutral-950/80 text-neutral-600 border-neutral-800'
        }`}
        title={lidarOnline ? `LiDAR Active: ${lidarHz.toFixed(1)} Hz` : 'LiDAR Disconnected / Link Down (eno1)'}
      >
        <Radio className="w-3.5 h-3.5 shrink-0" />
        <span>LIDAR</span>
        {lidarOnline && <span className="text-[9px] text-emerald-300 font-normal">{lidarHz.toFixed(0)}Hz</span>}
      </div>

      {/* 3. Fusion Mode */}
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors ${
          activeMode === 'COMBINED'
            ? 'bg-neutral-900/90 text-purple-300 border-purple-800/80'
            : activeMode === 'CAMERA_ONLY'
            ? 'bg-neutral-900/90 text-cyan-400 border-neutral-800'
            : activeMode === 'LIDAR_ONLY'
            ? 'bg-neutral-900/90 text-emerald-400 border-neutral-800'
            : 'bg-neutral-950/80 text-neutral-600 border-neutral-800'
        }`}
        title={`Active Perception Mode: ${activeMode}`}
      >
        <Layers className="w-3.5 h-3.5 shrink-0" />
        <span>
          {activeMode === 'COMBINED'
            ? 'FUSED'
            : activeMode === 'CAMERA_ONLY'
            ? 'CAM ONLY'
            : activeMode === 'LIDAR_ONLY'
            ? 'LIDAR ONLY'
            : 'OFFLINE'}
        </span>
      </div>
    </div>
  );
};
