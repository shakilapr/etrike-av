import React from 'react';
import { useCanStore } from '../../store/canStore';
import { Camera, Radio, Layers } from 'lucide-react';

interface SensorTriadIndicatorProps {
  size?: 'compact' | 'hud';
  className?: string;
}

export const SensorTriadIndicator: React.FC<SensorTriadIndicatorProps> = ({
  size = 'hud',
  className = '',
}) => {
  const rosStatus = useCanStore((s) => s.rosStatus);
  const bench = rosStatus.bench_perception;

  // Determine physical sensor states
  const camOnline = Boolean(bench?.camera_online || (bench?.camera_hz && bench.camera_hz > 0));
  const camHz = bench?.camera_hz ?? (camOnline ? 14.0 : 0.0);

  const lidarOnline = Boolean(bench?.lidar_online || (bench?.lidar_hz && bench.lidar_hz > 0));
  const lidarHz = bench?.lidar_hz ?? (lidarOnline ? 10.0 : 0.0);

  // Operating Mode: CAMERA_ONLY, LIDAR_ONLY, COMBINED, or OFFLINE
  const isCombined = camOnline && lidarOnline;
  const activeMode: 'COMBINED' | 'CAMERA_ONLY' | 'LIDAR_ONLY' | 'OFFLINE' = isCombined
    ? 'COMBINED'
    : camOnline
    ? 'CAMERA_ONLY'
    : lidarOnline
    ? 'LIDAR_ONLY'
    : 'OFFLINE';

  if (size === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 font-mono select-none ${className}`}>
        {/* 1. Camera Icon */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
            camOnline
              ? 'bg-cyan-950/40 text-cyan-300 border-cyan-700/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
              : 'bg-neutral-900/60 text-neutral-500 border-neutral-800'
          }`}
          title={camOnline ? `Camera Active (${camHz.toFixed(1)} FPS)` : 'Camera Disconnected / Offline'}
        >
          <Camera className={`w-3 h-3 ${camOnline ? 'text-cyan-400 animate-pulse' : 'text-neutral-600'}`} />
          <span>CAM</span>
          {camOnline && <span className="text-[9px] text-cyan-400/80">{camHz.toFixed(0)}fps</span>}
        </div>

        {/* 2. LiDAR Icon */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
            lidarOnline
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              : 'bg-neutral-900/60 text-neutral-500 border-neutral-800'
          }`}
          title={lidarOnline ? `LiDAR Active (${lidarHz.toFixed(1)} Hz)` : 'LiDAR Disconnected / Link Down (eno1)'}
        >
          <Radio className={`w-3 h-3 ${lidarOnline ? 'text-emerald-400 animate-pulse' : 'text-neutral-600'}`} />
          <span>LIDAR</span>
          {lidarOnline && <span className="text-[9px] text-emerald-400/80">{lidarHz.toFixed(0)}Hz</span>}
        </div>

        {/* 3. Combined / Fusion Icon */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black border transition-all ${
            activeMode === 'COMBINED'
              ? 'bg-purple-950/60 text-purple-200 border-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.4)] animate-pulse'
              : activeMode === 'CAMERA_ONLY'
              ? 'bg-cyan-950/30 text-cyan-300 border-cyan-800/60'
              : activeMode === 'LIDAR_ONLY'
              ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/60'
              : 'bg-neutral-900/60 text-neutral-500 border-neutral-800'
          }`}
          title={`Active Sensing Pipeline: ${activeMode}`}
        >
          <Layers className={`w-3 h-3 ${activeMode === 'COMBINED' ? 'text-purple-300' : 'text-neutral-500'}`} />
          <span>
            {activeMode === 'COMBINED'
              ? 'COMBINED'
              : activeMode === 'CAMERA_ONLY'
              ? 'CAM ONLY'
              : activeMode === 'LIDAR_ONLY'
              ? 'LIDAR ONLY'
              : 'OFFLINE'}
          </span>
        </div>
      </div>
    );
  }

  // Primary Cockpit HUD Format (Glanceable Automotive Styling)
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 bg-[#080808]/95 backdrop-blur-xl rounded-2xl border border-neutral-800/90 shadow-2xl font-mono select-none ${className}`}
    >
      {/* 1. Camera Status Icon */}
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition-all ${
          camOnline
            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-600/70 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'bg-neutral-900/60 text-neutral-500 border-neutral-800/80'
        }`}
        title={camOnline ? `Camera Stream Online • ${camHz.toFixed(1)} FPS` : 'Camera Disconnected / Offline'}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            camOnline ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]' : 'bg-neutral-600'
          }`}
        />
        <Camera className={`w-4 h-4 ${camOnline ? 'text-cyan-400' : 'text-neutral-600'}`} />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[11px] font-black tracking-wider">CAMERA</span>
          <span className={`text-[9px] ${camOnline ? 'text-cyan-400/90 font-bold' : 'text-neutral-600'}`}>
            {camOnline ? `${camHz.toFixed(1)} FPS` : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* 2. LiDAR Status Icon */}
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition-all ${
          lidarOnline
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/70 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
            : 'bg-neutral-900/60 text-neutral-500 border-neutral-800/80'
        }`}
        title={
          lidarOnline
            ? `LiDAR Stream Online • ${lidarHz.toFixed(1)} Hz (UDP 2368)`
            : 'LiDAR Link Down • Waiting for Ethernet Carrier (eno1)'
        }
      >
        <div
          className={`w-2 h-2 rounded-full ${
            lidarOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-neutral-600'
          }`}
        />
        <Radio className={`w-4 h-4 ${lidarOnline ? 'text-emerald-400' : 'text-neutral-600'}`} />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[11px] font-black tracking-wider">LIDAR</span>
          <span className={`text-[9px] ${lidarOnline ? 'text-emerald-400/90 font-bold' : 'text-neutral-600'}`}>
            {lidarOnline ? `${lidarHz.toFixed(1)} HZ` : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* 3. Combined / Fusion Pipeline Icon */}
      <div
        className={`flex items-center gap-2 px-3.5 py-1 rounded-xl border transition-all ${
          activeMode === 'COMBINED'
            ? 'bg-purple-950/70 text-purple-200 border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.5)] animate-pulse'
            : activeMode === 'CAMERA_ONLY'
            ? 'bg-cyan-950/30 text-cyan-300 border-cyan-700/60'
            : activeMode === 'LIDAR_ONLY'
            ? 'bg-emerald-950/30 text-emerald-300 border-emerald-700/60'
            : 'bg-neutral-900/60 text-neutral-500 border-neutral-800/80'
        }`}
        title={`Perception Operating Mode: ${activeMode}`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            activeMode === 'COMBINED'
              ? 'bg-purple-400 animate-ping shadow-[0_0_10px_#c084fc]'
              : activeMode === 'CAMERA_ONLY'
              ? 'bg-cyan-400'
              : activeMode === 'LIDAR_ONLY'
              ? 'bg-emerald-400'
              : 'bg-neutral-600'
          }`}
        />
        <Layers
          className={`w-4 h-4 ${
            activeMode === 'COMBINED'
              ? 'text-purple-300 animate-bounce'
              : activeMode === 'CAMERA_ONLY'
              ? 'text-cyan-400'
              : activeMode === 'LIDAR_ONLY'
              ? 'text-emerald-400'
              : 'text-neutral-600'
          }`}
        />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[11px] font-black tracking-wider">
            {activeMode === 'COMBINED'
              ? 'COMBINED'
              : activeMode === 'CAMERA_ONLY'
              ? 'CAM ONLY'
              : activeMode === 'LIDAR_ONLY'
              ? 'LIDAR ONLY'
              : 'SENSORS OFF'}
          </span>
          <span
            className={`text-[9px] font-bold ${
              activeMode === 'COMBINED'
                ? 'text-purple-300'
                : activeMode === 'CAMERA_ONLY'
                ? 'text-cyan-400/90'
                : activeMode === 'LIDAR_ONLY'
                ? 'text-emerald-400/90'
                : 'text-neutral-600'
            }`}
          >
            {activeMode === 'COMBINED'
              ? 'FUSED PIPELINE'
              : activeMode === 'CAMERA_ONLY'
              ? 'VISION ADAS'
              : activeMode === 'LIDAR_ONLY'
              ? '360° CLUSTERS'
              : 'STANDBY'}
          </span>
        </div>
      </div>
    </div>
  );
};
