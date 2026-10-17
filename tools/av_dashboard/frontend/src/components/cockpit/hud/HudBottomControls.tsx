import React from 'react';
import { Camera, ExternalLink, Eye, TriangleAlert } from 'lucide-react';
import { PerceptionObject } from '../../../types/can';

interface HudBottomControlsProps {
  cameraMode: 'chase' | 'cabin' | 'orbit';
  setCameraMode: (mode: 'chase' | 'cabin' | 'orbit') => void;
  showThreat: boolean;
  nearestThreat?: { obj: PerceptionObject; dist: number };
  threatIsPed: boolean;
  isAuto: boolean;
  rosDot: string;
  rosStatus: { active: boolean };
  rosPoseOk: boolean;
  rosStatusText: string;
  speedUnit: string;
  setSpeedUnit: (unit: 'km/h' | 'mph') => void;
  toggleActiveView: () => void;
}

export const HudBottomControls: React.FC<HudBottomControlsProps> = ({
  cameraMode,
  setCameraMode,
  showThreat,
  nearestThreat,
  threatIsPed,
  isAuto,
  rosDot,
  rosStatus,
  rosPoseOk,
  rosStatusText,
  speedUnit,
  setSpeedUnit,
  toggleActiveView,
}) => {
  return (
    <div className="flex items-end justify-between relative px-2">
      {/* Bottom-Left: Camera Presets (44px touch targets) */}
      <div className="flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1.5 rounded-xl pointer-events-auto shadow-xl">
        <Camera className="w-4 h-4 text-neutral-400 ml-1.5 mr-0.5" />
        {(['chase', 'cabin', 'orbit'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setCameraMode(mode)}
            className={`h-10 px-3.5 rounded-lg text-xs font-black uppercase transition-all ${
              cameraMode === mode
                ? 'bg-neutral-800 text-cyan-300 shadow-md border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {mode === 'orbit' ? '360°' : mode}
          </button>
        ))}
      </div>

      {/* Bottom-Center: Autoware Perception Radar, Drive Mode & Link Status */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1 flex flex-col items-center pointer-events-none gap-1">
        {showThreat && nearestThreat && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-black text-xs shadow-2xl animate-pulse ${
              threatIsPed
                ? 'bg-amber-950/90 border-amber-400 text-amber-300'
                : 'bg-rose-950/90 border-rose-400 text-rose-300'
            }`}
          >
            <TriangleAlert className="w-4 h-4" />
            <span>
              {threatIsPed ? 'PEDESTRIAN' : nearestThreat.obj.label} AHEAD • {nearestThreat.dist.toFixed(1)} m
              {nearestThreat.obj.x < -0.5 ? ' • LEFT' : nearestThreat.obj.x > 0.5 ? ' • RIGHT' : ''}
            </span>
          </div>
        )}

        <span className="text-[11px] text-neutral-300 uppercase tracking-widest font-black drop-shadow-md">
          {isAuto ? 'AUTONOMOUS DRIVING SYSTEM • DRIVE-BY-WIRE ACTIVE' : 'MANUAL DRIVE OVERRIDE'}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider">
          <div className={`w-2 h-2 rounded-full ${rosDot}`} />
          <span
            className={
              rosStatus.active && rosPoseOk
                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                : rosStatus.active
                ? 'text-amber-400'
                : 'text-neutral-500'
            }
          >
            {rosStatusText}
          </span>
        </div>
      </div>

      {/* Bottom-Right: Speed Unit Switcher & Return to CAN Monitor */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl text-xs">
          <button
            onClick={() => setSpeedUnit('km/h')}
            className={`h-9 px-3 rounded-lg transition-all font-black ${
              speedUnit === 'km/h' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            KM/H
          </button>
          <button
            onClick={() => setSpeedUnit('mph')}
            className={`h-9 px-3 rounded-lg transition-all font-black ${
              speedUnit === 'mph' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            MPH
          </button>
        </div>

        <button
          onClick={() => {
            window.open(
              '/camera',
              'ETrikeLiveCamera',
              'width=1024,height=640,menubar=no,toolbar=no,location=no,status=no'
            );
          }}
          className="flex items-center gap-2 bg-[#080808]/95 hover:bg-neutral-900 text-cyan-300 border border-cyan-500/40 px-3.5 h-11 rounded-xl text-xs font-black transition-all shadow-xl"
          title="Open Live Camera in a separate window"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>LIVE CAMERA</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </button>

        <button
          onClick={toggleActiveView}
          className="flex items-center gap-2 bg-[#080808]/95 hover:bg-neutral-900 text-neutral-200 border border-neutral-700/80 px-4 h-11 rounded-xl text-xs font-black transition-all shadow-xl"
          title="Switch back to CAN Bus Engineering Monitor (Tab)"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>CAN MONITOR</span>
          <span className="text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 font-bold">
            Tab
          </span>
        </button>
      </div>
    </div>
  );
};
