import React from 'react';
import { useCanStore } from '../store/canStore';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const TelemetrySidebar: React.FC = () => {
  const telemetry = useCanStore((state) => state.telemetry);

  // Speedometer calculation (0 to 50 km/h)
  const maxSpeed = 50;
  const speedActClamped = Math.min(Math.max(telemetry.speed_act_kmh, 0), maxSpeed);
  const speedCmdClamped = Math.min(Math.max(telemetry.speed_cmd_kmh, 0), maxSpeed);
  // Speed arc angles: from -135deg to +45deg (total 180deg)
  const speedActAngle = -135 + (speedActClamped / maxSpeed) * 180;
  const speedCmdAngle = -135 + (speedCmdClamped / maxSpeed) * 180;

  // Steering calculation (-45 to +45 deg)
  const maxSteer = 45;
  const steerActClamped = Math.min(Math.max(telemetry.steer_act_deg, -maxSteer), maxSteer);
  const steerCmdClamped = Math.min(Math.max(telemetry.steer_cmd_deg, -maxSteer), maxSteer);
  // -90deg is straight up (0 deg steer). Range: -135deg (-45 steer) to -45deg (+45 steer)
  const steerActAngle = -90 + (steerActClamped / maxSteer) * 45;
  const steerCmdAngle = -90 + (steerCmdClamped / maxSteer) * 45;

  // Brake pressure (0 to 1500 kPa)
  const maxBrake = 1500;
  const brakeActPercent = Math.min(Math.max((telemetry.brake_act_kpa / maxBrake) * 100, 0), 100);
  const brakeCmdPercent = Math.min(Math.max((telemetry.brake_cmd_kpa / maxBrake) * 100, 0), 100);

  const gears = ['P', 'R', 'N', 'D', 'S'];

  return (
    <aside className="w-72 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-3 select-none overflow-y-auto shrink-0">
      {/* Top Section: Mode & ESTOP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
            Cockpit State
          </span>
          {telemetry.estop ? (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse">
              <ShieldAlert className="w-3 h-3" /> ESTOP ACTIVE
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SAFETY OK
            </span>
          )}
        </div>

        {/* Driving Mode Banner */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
            <span className="block text-[9px] uppercase font-mono text-slate-500">Mode</span>
            <span
              className={`text-xs font-mono font-bold ${
                telemetry.mode === 'AUTONOMOUS'
                  ? 'text-cyan-400'
                  : telemetry.mode === 'EMERGENCY'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {telemetry.mode}
            </span>
          </div>

          <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
            <span className="block text-[9px] uppercase font-mono text-slate-500">Gear</span>
            <div className="flex items-center gap-1 mt-0.5">
              {gears.map((g) => (
                <span
                  key={g}
                  className={`text-[11px] font-mono font-bold px-1 rounded ${
                    telemetry.gear === g
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/50'
                      : 'text-slate-600'
                  }`}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ISO 2575 Lighting Telltales */}
        <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-slate-400">ISO 2575 Telltales</span>
            <div className="flex items-center gap-2 text-[9px] font-mono">
              <span className="text-cyan-400">■ CMD</span>
              <span className="text-emerald-400">■ ACT</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {/* Left Turn */}
            <div
              className={`p-1.5 rounded border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.left
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm shadow-emerald-500/30'
                  : telemetry.lights_cmd.left
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800'
              }`}
              title="Left Turn Indicator"
            >
              <span className="text-sm font-black">⮜</span>
              <span className="text-[8px] font-mono mt-0.5">LEFT</span>
            </div>

            {/* Right Turn */}
            <div
              className={`p-1.5 rounded border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.right
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm shadow-emerald-500/30'
                  : telemetry.lights_cmd.right
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800'
              }`}
              title="Right Turn Indicator"
            >
              <span className="text-sm font-black">⮞</span>
              <span className="text-[8px] font-mono mt-0.5">RGHT</span>
            </div>

            {/* Hazard */}
            <div
              className={`p-1.5 rounded border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.hazard
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
                  : telemetry.lights_cmd.hazard
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800'
              }`}
              title="Hazard Warning Lights"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[8px] font-mono mt-0.5">HAZD</span>
            </div>

            {/* Headlights */}
            <div
              className={`p-1.5 rounded border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.headlight
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm shadow-emerald-500/30'
                  : telemetry.lights_cmd.headlight
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800'
              }`}
              title="Headlights / Dipped Beam"
            >
              <span className="text-xs font-black">🔆</span>
              <span className="text-[8px] font-mono mt-0.5">BEAM</span>
            </div>

            {/* Brake Lamp */}
            <div
              className={`p-1.5 rounded border flex flex-col items-center justify-center transition-all ${
                telemetry.lights_act.brake
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-sm shadow-rose-500/30'
                  : telemetry.lights_cmd.brake
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800'
              }`}
              title="Brake Stop Lamp"
            >
              <span className="text-xs font-black">STOP</span>
              <span className="text-[8px] font-mono mt-0.5">BRK</span>
            </div>
          </div>
        </div>

        {/* Gauge 1: Speedometer (Dual Arc Commanded vs Feedback) */}
        <div className="bg-slate-950/80 p-3 rounded border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>SPEEDOMETER</span>
            <span>0 - 50 km/h</span>
          </div>

          <div className="relative flex flex-col items-center justify-center py-2">
            <svg viewBox="0 0 160 95" className="w-44 overflow-visible">
              {/* Dial Background Track */}
              <path
                d="M 20 85 A 60 60 0 0 1 140 85"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Commanded Speed Arc Indicator */}
              <line
                x1="80"
                y1="85"
                x2={80 + 56 * Math.cos((speedCmdAngle * Math.PI) / 180)}
                y2={85 + 56 * Math.sin((speedCmdAngle * Math.PI) / 180)}
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeDasharray="3 2"
              />
              {/* Actual Speed Needle */}
              <line
                x1="80"
                y1="85"
                x2={80 + 54 * Math.cos((speedActAngle * Math.PI) / 180)}
                y2={85 + 54 * Math.sin((speedActAngle * Math.PI) / 180)}
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="80" cy="85" r="4" fill="#10b981" />
            </svg>

            {/* Digital Readout */}
            <div className="text-center mt-[-10px]">
              <div className="text-2xl font-mono font-extrabold text-emerald-400 tracking-tight tabular-nums">
                {telemetry.speed_act_kmh.toFixed(1)}
              </div>
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-2">
                <span>km/h</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400">CMD: {telemetry.speed_cmd_kmh.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gauge 2: Steering Arc (-45° to +45°) */}
        <div className="bg-slate-950/80 p-3 rounded border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>STEERING ANGLE</span>
            <span>±45.0°</span>
          </div>

          <div className="relative flex flex-col items-center justify-center py-1">
            <svg viewBox="0 0 160 70" className="w-40 overflow-visible">
              {/* Center line */}
              <line x1="80" y1="20" x2="80" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              {/* Arc background */}
              <path
                d="M 38 60 A 60 60 0 0 1 122 60"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Commanded angle pointer */}
              <line
                x1="80"
                y1="60"
                x2={80 + 52 * Math.cos((steerCmdAngle * Math.PI) / 180)}
                y2={60 + 52 * Math.sin((steerCmdAngle * Math.PI) / 180)}
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeDasharray="2 2"
              />
              {/* Actual angle needle */}
              <line
                x1="80"
                y1="60"
                x2={80 + 50 * Math.cos((steerActAngle * Math.PI) / 180)}
                y2={60 + 50 * Math.sin((steerActAngle * Math.PI) / 180)}
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="80" cy="60" r="3.5" fill="#10b981" />
            </svg>

            {/* Readout */}
            <div className="text-center mt-[-4px]">
              <div className="text-xl font-mono font-bold text-emerald-400 tabular-nums">
                {telemetry.steer_act_deg > 0 ? `+${telemetry.steer_act_deg.toFixed(1)}` : telemetry.steer_act_deg.toFixed(1)}°
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                CMD: <span className="text-cyan-400">{telemetry.steer_cmd_deg.toFixed(1)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gauge 3: Brake Pressure Meter */}
        <div className="bg-slate-950/80 p-3 rounded border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
            <span>HYDRAULIC BRAKE</span>
            <span>0 - 1500 kPa</span>
          </div>

          <div className="space-y-2">
            {/* Act Bar */}
            <div>
              <div className="flex justify-between text-[9px] font-mono mb-0.5 text-slate-400">
                <span className="text-emerald-400 font-semibold">FEEDBACK</span>
                <span className="text-slate-200 tabular-nums font-mono">{telemetry.brake_act_kpa.toFixed(0)} kPa</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-100"
                  style={{ width: `${brakeActPercent}%` }}
                />
              </div>
            </div>

            {/* Cmd Bar */}
            <div>
              <div className="flex justify-between text-[9px] font-mono mb-0.5 text-slate-400">
                <span className="text-cyan-400 font-semibold">COMMAND</span>
                <span className="text-slate-300 tabular-nums font-mono">{telemetry.brake_cmd_kpa.toFixed(0)} kPa</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-100"
                  style={{ width: `${brakeCmdPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 text-[9px] font-mono text-slate-500 text-center space-y-0.5">
        <div>E-Trike Autoware CAN Bridge</div>
        <div className="text-slate-600">Passive Non-Intrusive Sniffer</div>
      </div>
    </aside>
  );
};
