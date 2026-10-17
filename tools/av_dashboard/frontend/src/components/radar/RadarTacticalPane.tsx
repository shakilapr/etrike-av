import React from 'react';
import { ShieldAlert, Crosshair, Radio, Zap } from 'lucide-react';
import { CLASS_CONFIG, ProcessedRadarObject } from './radarConfig';
import { RosStatus } from '../../types/can';

interface RadarTacticalPaneProps {
  objects: ProcessedRadarObject[];
  nearestThreat: ProcessedRadarObject | null;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  rangeM: number;
  rosStatus: RosStatus;
}

export const RadarTacticalPane: React.FC<RadarTacticalPaneProps> = ({
  objects,
  nearestThreat,
  selectedId,
  setSelectedId,
  rangeM,
  rosStatus,
}) => {
  return (
    <div className="w-[420px] shrink-0 h-full flex flex-col bg-black/95 p-4 overflow-hidden">
      {/* Threat Overview Banner */}
      <div className="mb-4 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Proximity Safety Assessment
          </span>
          <span
            className={`text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase ${
              nearestThreat && nearestThreat.dist < 2.0
                ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                : nearestThreat && nearestThreat.dist < 4.5
                ? 'bg-amber-950 text-amber-400 border border-amber-700'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
            }`}
          >
            {nearestThreat && nearestThreat.dist < 2.0
              ? 'CRITICAL PROXIMITY'
              : nearestThreat && nearestThreat.dist < 4.5
              ? 'CAUTION WATCH'
              : 'SURROUND CLEAR'}
          </span>
        </div>

        {nearestThreat ? (
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="bg-black/60 p-2 rounded border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">CLOSEST</span>
              <span className="text-base font-bold text-white">
                {nearestThreat.dist.toFixed(2)} m
              </span>
            </div>
            <div className="bg-black/60 p-2 rounded border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">BEARING</span>
              <span className="text-base font-bold text-cyan-400">
                {nearestThreat.bearingDeg}°
              </span>
            </div>
            <div className="bg-black/60 p-2 rounded border border-neutral-800">
              <span className="text-[10px] text-neutral-500 block">TYPE</span>
              <span className="text-base font-bold text-amber-400">
                {nearestThreat.resolvedLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-xs font-mono text-neutral-500">
            No obstacles currently within {rangeM}m sensor range.
          </div>
        )}
      </div>

      {/* Live Detected Objects Roster */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          Detected Actors ({objects.length})
        </span>
        <span className="text-[10px] font-mono text-neutral-500">Sorted by proximity</span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1">
        {objects.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-neutral-800 text-neutral-500 font-mono text-xs">
            <Radio className="w-8 h-8 mb-2 opacity-30 text-emerald-500" />
            <span>Awaiting sensor cluster targets...</span>
            <span className="text-[10px] text-neutral-600 mt-1">
              Walk near the stationary E-Trike to see live tracking.
            </span>
          </div>
        ) : (
          objects.map((obj, i) => {
            const cfg = CLASS_CONFIG[obj.resolvedLabel] || CLASS_CONFIG.UNKNOWN;
            const Icon = cfg.icon;
            const targetKey = String(obj.id ?? i);
            const isSelected = selectedId === targetKey;
            const isCrit = obj.dist < 2.5;

            return (
              <div
                key={targetKey}
                onClick={() => setSelectedId(isSelected ? null : targetKey)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer font-mono ${
                  isSelected
                    ? 'bg-neutral-800/90 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : isCrit
                    ? 'bg-red-950/20 border-red-800/60 hover:bg-red-950/40'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-black"
                      style={{ backgroundColor: cfg.color }}
                    >
                      <Icon className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="text-xs font-bold text-white">
                      {cfg.label} #{i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black ${
                        isCrit ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {obj.dist.toFixed(2)} m
                    </span>
                    <span className="text-[10px] text-neutral-500">{obj.bearingDeg}°</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] text-neutral-400 bg-black/40 p-1.5 rounded">
                  <div>
                    <span className="text-neutral-600 block">X (LAT)</span>
                    <span className="text-neutral-200">
                      {obj.x > 0 ? `+${obj.x.toFixed(2)}` : obj.x.toFixed(2)}m
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block">Z (LON)</span>
                    <span className="text-neutral-200">
                      {obj.lon > 0 ? `+${obj.lon.toFixed(2)}` : obj.lon.toFixed(2)}m
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block">DIM (W×L)</span>
                    <span className="text-neutral-200">
                      {(obj.dy || 0.5).toFixed(1)}×{(obj.dx || 0.5).toFixed(1)}m
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block">SPEED</span>
                    <span className="text-neutral-200">{obj.speed_kmh || 0} km/h</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Hardware & Fusion Pipeline Diagnostic Card */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 font-mono text-[11px] space-y-1.5 text-neutral-400">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Sensor Fusion Pipeline
          </span>
          <span className="text-emerald-400 text-[10px] uppercase">ALL NODES OK</span>
        </div>
        <div className="flex items-center justify-between bg-neutral-900/40 px-2 py-1 rounded">
          <span>Hesai XT32M2X LiDAR</span>
          <span className="text-emerald-400 font-bold">10.0 Hz • UDP 2368</span>
        </div>
        <div className="flex items-center justify-between bg-neutral-900/40 px-2 py-1 rounded">
          <span>Kinect v2 Front Camera</span>
          <span className="text-emerald-400 font-bold">ACTIVE • 500396543042</span>
        </div>
        <div className="flex items-center justify-between bg-neutral-900/40 px-2 py-1 rounded">
          <span>Bench 3D Perception</span>
          <span className="text-cyan-400 font-bold">
            {rosStatus.hz.toFixed(1)} Hz • base_link
          </span>
        </div>
      </div>
    </div>
  );
};
