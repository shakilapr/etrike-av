import React from 'react';

interface HudChassisDynamicsProps {
  steerActual: number;
  steerCmd: number;
  steerCurrent: number | null;
  steerTemp: number | null;
  yawRate: number;
  brakePressure: number;
  brakePercent: number;
  brakeTemp: number | null;
  brakeFault: boolean;
  hasBrakeFrame: boolean;
}

export const HudChassisDynamics: React.FC<HudChassisDynamicsProps> = ({
  steerActual,
  steerCmd,
  steerCurrent,
  steerTemp,
  yawRate,
  brakePressure,
  brakePercent,
  brakeTemp,
  brakeFault,
  hasBrakeFrame,
}) => {
  return (
    <div className="w-72 lg:w-80 space-y-3 pointer-events-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1.5">
        <span className="text-xs uppercase font-black text-neutral-400 tracking-wider">
          CHASSIS DYNAMICS
        </span>
        <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60 font-bold">
          3-WHEELER
        </span>
      </div>

      {/* Steering Angle with Floating Bi-Directional Light-Tube Bar */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-semibold text-neutral-300">Steering</span>
          <span className="text-2xl font-black tabular-nums text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
            {steerActual > 0 ? `+${steerActual.toFixed(1)}°` : `${steerActual.toFixed(1)}°`}
          </span>
        </div>
        <div className="h-3.5 bg-neutral-900/90 rounded-full relative overflow-hidden border border-neutral-700/60 shadow-inner">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-300 -translate-x-1/2 z-10" />
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-cyan-300 -translate-x-1/2 z-20 shadow-[0_0_8px_rgba(6,182,212,1)]"
            style={{ left: `${50 + (steerCmd / 45) * 50}%` }}
            title={`Commanded Steer: ${steerCmd.toFixed(1)}°`}
          />
          <div
            className="h-full bg-emerald-400 transition-all duration-75 absolute top-0 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            style={{
              left: steerActual < 0 ? `${50 + (steerActual / 45) * 50}%` : '50%',
              width: `${(Math.abs(steerActual) / 45) * 50}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-400 mt-1 font-mono">
          <span>-45°</span>
          <span className="text-cyan-400 font-bold">CMD: {steerCmd.toFixed(1)}°</span>
          <span>+45°</span>
        </div>
      </div>

      {/* Steering Actuator Diagnostics */}
      <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-900/80 font-mono">
        <span className="text-neutral-400">
          EPS Current: <span className="text-cyan-300 font-bold">{steerCurrent !== null ? `${steerCurrent}A` : '--'}</span>
        </span>
        <span className="text-neutral-400">
          ECU: <span className="text-amber-300 font-bold">{steerTemp !== null ? `${steerTemp}°C` : '--'}</span>
        </span>
      </div>

      {/* Yaw Rate */}
      <div className="flex justify-between items-baseline pt-0.5">
        <span className="text-sm font-semibold text-neutral-300">Yaw Rate</span>
        <div>
          <span className="text-2xl font-black text-white tabular-nums">
            {yawRate}
          </span>
          <span className="text-xs text-neutral-400 ml-1.5 font-bold">mrad/s</span>
        </div>
      </div>

      {/* Hydraulic Brake Bar */}
      <div className="pt-0.5 border-t border-neutral-900/80">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-semibold text-neutral-300">Hydraulic Brake</span>
          <span
            className={`text-2xl font-black tabular-nums ${
              brakePressure > 50 ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]' : 'text-neutral-200'
            }`}
          >
            {brakePressure} <span className="text-xs font-normal text-neutral-400">kPa</span>
          </span>
        </div>
        <div className="h-3 bg-neutral-900/90 rounded-full overflow-hidden border border-neutral-700/60 shadow-inner">
          <div
            className={`h-full transition-all duration-75 ${
              brakePressure > 100
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.9)]'
                : 'bg-neutral-600'
            }`}
            style={{ width: `${brakePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-400 mt-1 font-mono">
          <span>Brake ECU: <span className="text-neutral-300">{brakeTemp !== null ? `${brakeTemp}°C` : '--'}</span></span>
          <span className={brakeFault ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
            {brakeFault ? 'BRAKE FAULT' : hasBrakeFrame ? 'NORMAL' : 'NO 0x311'}
          </span>
        </div>
      </div>
    </div>
  );
};
