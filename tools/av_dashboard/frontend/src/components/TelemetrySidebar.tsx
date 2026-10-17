import React from 'react';
import { useCanStore } from '../store/canStore';
import { ShieldAlert, AlertTriangle, Lightbulb } from 'lucide-react';
import { SpeedometerGauge } from './gauges/SpeedometerGauge';
import { SteeringGauge } from './gauges/SteeringGauge';
import { BrakeGauge } from './gauges/BrakeGauge';

export const TelemetrySidebar: React.FC = () => {
  const telemetry = useCanStore((state) => state.telemetry);
  const gears = ['P', 'R', 'N', 'D', 'S'];

  return (
    <aside className="w-72 bg-black border-r border-neutral-800 flex flex-col justify-between p-3 select-none overflow-y-auto shrink-0">
      {/* Top Section: Mode & ESTOP */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <span className="text-[11px] font-mono uppercase text-neutral-300 font-bold tracking-wider">
            Cockpit State
          </span>
          {telemetry.estop ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" /> ESTOP ACTIVE
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
              SAFETY OK
            </span>
          )}
        </div>

        {/* Driving Mode & Gear Banners */}
        <div className="grid grid-cols-2 gap-2">
          {/* Mode */}
          <div className="bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800">
            <span className="block text-[10px] uppercase font-mono text-neutral-400 font-medium">Mode</span>
            <span
              className={`text-xs font-mono font-black tracking-wide ${
                telemetry.mode === 'AUTONOMOUS' || telemetry.mode === 'AUTO'
                  ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]'
                  : telemetry.mode === 'EMERGENCY' || telemetry.mode === 'ESTOP'
                  ? 'text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]'
                  : 'text-amber-300'
              }`}
            >
              {telemetry.mode}
            </span>
          </div>

          {/* Gear Selector */}
          <div className="bg-[#0a0a0a] p-2 rounded-lg border border-neutral-800">
            <span className="block text-[10px] uppercase font-mono text-neutral-400 font-medium">Gear</span>
            <div className="flex items-center justify-between mt-1">
              {gears.map((g) => {
                const isActive = telemetry.gear === g;
                return (
                  <span
                    key={g}
                    className={`text-[11px] font-mono font-black px-1.5 py-0.5 rounded transition-all ${
                      isActive
                        ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/40'
                        : 'text-neutral-400 bg-neutral-900 border border-neutral-800'
                    }`}
                  >
                    {g}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* ISO 2575 Lighting Telltales */}
        <div className="bg-[#0a0a0a] p-2.5 rounded-lg border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-neutral-300 font-semibold tracking-wide">
              ISO 2575 Telltales
            </span>
            <div className="flex items-center gap-2 text-[9px] font-mono">
              <span className="text-cyan-400 font-bold">■ CMD</span>
              <span className="text-emerald-400 font-bold">■ ACT</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center">
            {/* Left Turn */}
            <div
              className={`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.left
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : telemetry.lights_cmd.left
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40'
                  : 'bg-[#121212] text-neutral-400 border-neutral-800'
              }`}
              title="Left Turn Indicator"
            >
              <span className="text-base font-black leading-none">⮜</span>
              <span className="text-[9px] font-mono font-semibold mt-1">LEFT</span>
            </div>

            {/* Right Turn */}
            <div
              className={`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.right
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : telemetry.lights_cmd.right
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40'
                  : 'bg-[#121212] text-neutral-400 border-neutral-800'
              }`}
              title="Right Turn Indicator"
            >
              <span className="text-base font-black leading-none">⮞</span>
              <span className="text-[9px] font-mono font-semibold mt-1">RGHT</span>
            </div>

            {/* Hazard */}
            <div
              className={`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.hazard
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse'
                  : telemetry.lights_cmd.hazard
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40'
                  : 'bg-[#121212] text-neutral-400 border-neutral-800'
              }`}
              title="Hazard Warning Lights"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono font-semibold mt-1">HAZD</span>
            </div>

            {/* Headlights */}
            <div
              className={`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.headlight
                  ? 'bg-sky-500/25 text-sky-300 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                  : telemetry.lights_cmd.headlight
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40'
                  : 'bg-[#121212] text-neutral-400 border-neutral-800'
              }`}
              title="Headlights / Dipped Beam"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono font-semibold mt-1">BEAM</span>
            </div>

            {/* Brake Lamp */}
            <div
              className={`p-1.5 rounded-md border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.brake
                  ? 'bg-rose-500/25 text-rose-300 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                  : telemetry.lights_cmd.brake
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/60 ring-1 ring-cyan-400/40'
                  : 'bg-[#121212] text-neutral-400 border-neutral-800'
              }`}
              title="Brake Stop Lamp"
            >
              <span className="text-[10px] font-black leading-none px-1 py-0.5 rounded bg-rose-950/60 border border-rose-800/80">
                STOP
              </span>
              <span className="text-[9px] font-mono font-semibold mt-0.5">BRK</span>
            </div>
          </div>
        </div>

        {/* Speedometer */}
        <SpeedometerGauge
          speedActKmh={telemetry.speed_act_kmh}
          speedCmdKmh={telemetry.speed_cmd_kmh}
        />

        {/* Steering Arc */}
        <SteeringGauge
          steerActDeg={telemetry.steer_act_deg}
          steerCmdDeg={telemetry.steer_cmd_deg}
        />

        {/* Hydraulic Brake */}
        <BrakeGauge
          brakeActKpa={telemetry.brake_act_kpa}
          brakeCmdKpa={telemetry.brake_cmd_kpa}
        />
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 text-center space-y-0.5">
        <div className="font-semibold text-neutral-300">e-trike av • telemetry</div>
        <div className="text-neutral-500">seer engineering monitor</div>
      </div>
    </aside>
  );
};
