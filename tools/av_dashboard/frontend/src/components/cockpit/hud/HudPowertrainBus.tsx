import React from 'react';
import { Activity } from 'lucide-react';

interface HudPowertrainBusProps {
  telemetrySource: string;
  motorRpm: number | null;
  throttlePercent: number;
  canInterface?: string;
  busRateHz: number;
  hasRtDiag: boolean;
  mcpTec: number;
  mcpRec: number;
  mcpBusOff: boolean;
  canConnected: boolean;
  totalFrames: number;
}

export const HudPowertrainBus: React.FC<HudPowertrainBusProps> = ({
  telemetrySource,
  motorRpm,
  throttlePercent,
  canInterface,
  busRateHz,
  hasRtDiag,
  mcpTec,
  mcpRec,
  mcpBusOff,
  canConnected,
  totalFrames,
}) => {
  return (
    <div className="w-72 lg:w-80 space-y-3 pointer-events-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1.5">
        <span className="text-xs uppercase font-black text-neutral-400 tracking-wider">
          POWERTRAIN & BUS
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
            telemetrySource === 'ECU_FEEDBACK'
              ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
              : telemetrySource === 'BENCH_CMD' || telemetrySource === 'ROS_SIM'
              ? 'text-cyan-300 bg-cyan-950/40 border-cyan-800/60'
              : telemetrySource === 'SIMULATED'
              ? 'text-amber-300 bg-amber-950/40 border-amber-800/60'
              : 'text-neutral-400 bg-neutral-900/60 border-neutral-700/60'
          }`}
        >
          {telemetrySource === 'ECU_FEEDBACK'
            ? 'ECU LIVE'
            : telemetrySource === 'BENCH_CMD'
            ? 'BENCH CMD'
            : telemetrySource === 'ROS_SIM'
            ? 'ROS SIM'
            : telemetrySource === 'SIMULATED'
            ? 'DEMO SIM'
            : 'CAN OFFLINE'}
        </span>
      </div>

      {/* Motor RPM & Floating Throttle Power Bar */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-semibold text-neutral-300">Electric Motor</span>
          <span className="text-2xl font-black tabular-nums text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            {motorRpm !== null ? motorRpm.toLocaleString() : '--'}{' '}
            <span className="text-xs font-normal text-neutral-400">RPM</span>
          </span>
        </div>
        <div className="h-3.5 bg-neutral-900/90 rounded-full overflow-hidden border border-neutral-700/60 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-75 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${throttlePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-400 mt-1 font-mono">
          <span>IDLE</span>
          <span className="text-neutral-300 font-bold">{throttlePercent}% DEMAND</span>
          <span>PEAK</span>
        </div>
      </div>

      {/* CAN Bus Update Rate */}
      <div className="flex justify-between items-baseline pt-0.5 border-t border-neutral-900/80">
        <span className="text-sm font-semibold text-neutral-300">
          Bus Rate ({canInterface || 'can2'})
        </span>
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${busRateHz > 0 ? 'text-cyan-400 animate-pulse' : 'text-neutral-600'}`} />
          <span
            className={`text-2xl font-black tabular-nums ${
              busRateHz > 0
                ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                : 'text-neutral-500'
            }`}
          >
            {busRateHz.toFixed(1)} Hz
          </span>
        </div>
      </div>

      {/* CAN Controller Counters */}
      <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-900/80 font-mono">
        <span className="text-neutral-400">TEC: <span className="text-emerald-400 font-bold">{hasRtDiag ? mcpTec : '--'}</span></span>
        <span className="text-neutral-400">REC: <span className="text-emerald-400 font-bold">{hasRtDiag ? mcpRec : '--'}</span></span>
        <span
          className={
            mcpBusOff
              ? 'text-rose-400 font-bold'
              : canConnected
              ? 'text-emerald-400 font-bold'
              : 'text-neutral-500 font-bold'
          }
        >
          {mcpBusOff ? 'BUS OFF' : canConnected ? 'LINK UP' : 'WAITING'}
        </span>
      </div>

      {/* Total Frames */}
      <div className="flex justify-between items-baseline pt-0.5">
        <span className="text-sm font-semibold text-neutral-300">CAN Telemetry Frames</span>
        <span className="text-base font-bold text-neutral-200 tabular-nums">
          {totalFrames.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
