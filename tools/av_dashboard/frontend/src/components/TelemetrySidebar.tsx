import React from 'react';
import { useCanStore } from '../store/canStore';
import { ShieldAlert, AlertTriangle, Lightbulb } from 'lucide-react';

export const TelemetrySidebar: React.FC = () => {
  const telemetry = useCanStore((state) => state.telemetry);

  // Speedometer calculation (0 to 15 km/h for E-Trike)
  const maxSpeed = 15;
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

  // Brake pressure (0 to 5000 kPa per brk.yaml)
  const maxBrake = 5000;
  const brakeActPercent = Math.min(Math.max((telemetry.brake_act_kpa / maxBrake) * 100, 0), 100);
  const brakeCmdPercent = Math.min(Math.max((telemetry.brake_cmd_kpa / maxBrake) * 100, 0), 100);

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

        {/* Gauge 1: Speedometer (Dual Arc Commanded vs Feedback) */}
        <div className="bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1">
            <span>SPEEDOMETER</span>
            <span className="text-neutral-400">0 - 50 km/h</span>
          </div>

          <div className="relative flex flex-col items-center justify-center py-1">
            <svg viewBox="0 0 160 92" className="w-44 overflow-visible">
              {/* Dial Track Background */}
              <path
                d="M 20 85 A 60 60 0 0 1 140 85"
                fill="none"
                stroke="#262626"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Dial Graduation Ticks (0, 10, 20, 30, 40, 50) */}
              {[0, 10, 20, 30, 40, 50].map((v) => {
                const angle = -135 + (v / 50) * 180;
                const rad = (angle * Math.PI) / 180;
                const x1 = 80 + 53 * Math.cos(rad);
                const y1 = 85 + 53 * Math.sin(rad);
                const x2 = 80 + 60 * Math.cos(rad);
                const y2 = 85 + 60 * Math.sin(rad);
                return (
                  <line
                    key={v}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#525252"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Commanded Speed Pointer (Cyan dashed line) */}
              <line
                x1="80"
                y1="85"
                x2={80 + 58 * Math.cos((speedCmdAngle * Math.PI) / 180)}
                y2={85 + 58 * Math.sin((speedCmdAngle * Math.PI) / 180)}
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              {/* Actual Speed Needle (Emerald solid with glow) */}
              <line
                x1="80"
                y1="85"
                x2={80 + 54 * Math.cos((speedActAngle * Math.PI) / 180)}
                y2={85 + 54 * Math.sin((speedActAngle * Math.PI) / 180)}
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="80" cy="85" r="5" fill="#10b981" />
              <circle cx="80" cy="85" r="2.5" fill="#000000" />
            </svg>

            {/* Digital Readout */}
            <div className="text-center mt-[-6px]">
              <div className="text-3xl font-mono font-black text-emerald-400 tracking-tight tabular-nums drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                {telemetry.speed_act_kmh.toFixed(1)}
              </div>
              <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-2 mt-0.5">
                <span className="font-semibold text-neutral-300">km/h</span>
                <span className="text-neutral-600">|</span>
                <span className="text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700">
                  CMD: {telemetry.speed_cmd_kmh.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gauge 2: Steering Arc (-45° to +45°) */}
        <div className="bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-1">
            <span>STEERING ANGLE</span>
            <span className="text-neutral-400">&plusmn;45.0&deg;</span>
          </div>

          <div className="relative flex flex-col items-center justify-center py-1">
            <svg viewBox="0 0 160 70" className="w-44 overflow-visible">
              {/* Neutral Center reference line */}
              <line x1="80" y1="16" x2="80" y2="60" stroke="#525252" strokeWidth="1" strokeDasharray="2 2" />
              {/* Arc background */}
              <path
                d="M 38 60 A 60 60 0 0 1 122 60"
                fill="none"
                stroke="#262626"
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
                strokeDasharray="3 2"
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
              <circle cx="80" cy="60" r="4" fill="#10b981" />
            </svg>

            {/* Readout */}
            <div className="text-center mt-[-4px]">
              <div className="text-2xl font-mono font-black text-emerald-400 tabular-nums drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">
                {telemetry.steer_act_deg > 0 ? `+${telemetry.steer_act_deg.toFixed(1)}` : telemetry.steer_act_deg.toFixed(1)}&deg;
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                CMD:{' '}
                <span className="text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700">
                  {telemetry.steer_cmd_deg.toFixed(1)}&deg;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gauge 3: Brake Pressure Meter */}
        <div className="bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-2">
            <span>HYDRAULIC BRAKE</span>
            <span className="text-neutral-400">0 - 1500 kPa</span>
          </div>

          <div className="space-y-2">
            {/* Feedback Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-neutral-300">
                <span className="text-emerald-400 font-bold">FEEDBACK</span>
                <span className="text-neutral-100 tabular-nums font-bold">{telemetry.brake_act_kpa.toFixed(0)} kPa</span>
              </div>
              <div className="w-full h-2.5 bg-[#141414] rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  style={{ width: `${brakeActPercent}%` }}
                />
              </div>
            </div>

            {/* Command Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-neutral-300">
                <span className="text-cyan-400 font-bold">COMMAND</span>
                <span className="text-neutral-200 tabular-nums font-bold">{telemetry.brake_cmd_kpa.toFixed(0)} kPa</span>
              </div>
              <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                  style={{ width: `${brakeCmdPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 text-center space-y-0.5">
        <div className="font-semibold text-neutral-300">e-trike av • telemetry</div>
        <div className="text-neutral-500">seer engineering monitor</div>
      </div>
    </aside>
  );
};
