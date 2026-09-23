import React from 'react';
import { useCanStore } from '../../store/canStore';
import {
  ShieldCheck,
  AlertOctagon,
  Eye,
  Camera,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';

export const CockpitHud: React.FC = () => {
  const {
    telemetry,
    totalFrames,
    cameraMode,
    setCameraMode,
    speedUnit,
    setSpeedUnit,
    toggleActiveView,
    framesById,
  } = useCanStore();

  // Speed calculation
  const speedVal = speedUnit === 'mph'
    ? telemetry.speed_act_kmh * 0.621371
    : telemetry.speed_act_kmh;
  const targetSpeedVal = speedUnit === 'mph'
    ? telemetry.speed_cmd_kmh * 0.621371
    : telemetry.speed_cmd_kmh;

  const isAuto = telemetry.mode === 'AUTONOMOUS' || telemetry.mode === 'AUTO';
  const isEstop = telemetry.estop;

  // Turn signals (ISO telltales from telemetry)
  const isTurnLeft = telemetry.lights_act.left;
  const isTurnRight = telemetry.lights_act.right;
  const isHighBeam = telemetry.lights_act.headlight;
  const isHazard = telemetry.lights_act.hazard;

  // Steering & Stability values
  const steerActual = telemetry.steer_act_deg;
  const steerCmd = telemetry.steer_cmd_deg;
  const brakePressure = telemetry.brake_act_kpa;
  const brakePercent = Math.min((brakePressure / 1500) * 100, 100);

  // Yaw rate from motion report frame or computed
  const yawRateSignal = framesById[0x121]?.signals?.['yaw_rate_mrad_s']?.value;
  const yawRate = typeof yawRateSignal === 'number'
    ? yawRateSignal
    : Math.round(-steerActual * telemetry.speed_act_kmh * 0.28);

  // Motor / Powertrain estimate
  const motorRpm = Math.round(telemetry.speed_act_kmh * 110);
  const throttlePercent = Math.min(Math.round((telemetry.speed_act_kmh / 45) * 100), 100);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 select-none font-mono">
      {/* ================= TOP ZONE ================= */}
      <div className="flex items-start justify-between relative">
        {/* Top-Left: Peripheral Left Turn & Safety State */}
        <div className="flex items-center gap-3">
          {/* Left Turn Indicator */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              isTurnLeft || isHazard
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse'
                : 'bg-[#0a0a0a]/80 text-neutral-600 border-neutral-800'
            }`}
          >
            <span className="text-base font-black">&larr;</span>
          </div>

          {/* Safety Status Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all ${
              isEstop
                ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-[#0a0a0a]/80 text-emerald-400 border-emerald-500/40'
            }`}
          >
            {isEstop ? (
              <>
                <AlertOctagon className="w-4 h-4 text-rose-400 fill-current" />
                <span className="text-xs font-bold uppercase tracking-wider">E-STOP ACTIVE</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">SAFETY OK</span>
              </>
            )}
          </div>
        </div>

        {/* Top-Center Primary Sightline: Speed & Autonomy State */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
          {/* Autonomy Badge & Target Speed */}
          <div className="flex items-center gap-2.5 mb-1">
            {/* Target Speed Circle */}
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0a0a0a]/80 border border-neutral-800 text-[11px] text-neutral-300"
              title="Target Commanded Cruise Speed"
            >
              <span className="text-[9px] uppercase text-neutral-500 font-bold">MAX</span>
              <span className="font-bold tabular-nums text-neutral-100">
                {targetSpeedVal.toFixed(0)}
              </span>
            </div>

            {/* Autosteer Wheel Icon */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                isAuto
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'bg-[#0a0a0a]/80 text-neutral-500 border-neutral-800'
              }`}
              title={isAuto ? 'Autoware Autonomous Drive Engaged' : 'Manual Override'}
            >
              <Layers className={`w-3.5 h-3.5 ${isAuto ? 'animate-pulse' : ''}`} />
            </div>

            {/* Mode Pill */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                isAuto
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
              }`}
            >
              {telemetry.mode}
            </span>
          </div>

          {/* Primary Speedometer Digits */}
          <div className="flex items-baseline gap-1.5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <span className="text-5xl font-black text-white tracking-tight tabular-nums font-mono leading-none">
              {speedVal.toFixed(0)}
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {speedUnit}
            </span>
          </div>
        </div>

        {/* Top-Right: Peripheral High Beam & Right Turn */}
        <div className="flex items-center gap-3">
          {/* High Beam Indicator */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
              isHighBeam
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                : 'bg-[#0a0a0a]/80 text-neutral-600 border-neutral-800'
            }`}
            title="High Beam Headlights"
          >
            <Zap className="w-4 h-4 fill-current" />
          </div>

          {/* Right Turn Indicator */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              isTurnRight || isHazard
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse'
                : 'bg-[#0a0a0a]/80 text-neutral-600 border-neutral-800'
            }`}
          >
            <span className="text-base font-black">&rarr;</span>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE WINGS ================= */}
      <div className="flex justify-between items-center px-1">
        {/* Left Wing: Chassis & Stability Dynamics */}
        <div className="w-64 bg-[#0a0a0a]/75 backdrop-blur-md border border-neutral-800/80 rounded-xl p-3.5 space-y-3 pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              CHASSIS DYNAMICS
            </span>
            <span className="text-[9px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              3-WHEELER
            </span>
          </div>

          {/* Steering Angle */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-400">Steering</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {steerActual > 0 ? `+${steerActual.toFixed(1)}°` : `${steerActual.toFixed(1)}°`}
              </span>
            </div>
            {/* Centered Steering Bar (-45° to +45°) */}
            <div className="h-2 bg-neutral-900 rounded-full relative overflow-hidden border border-neutral-800">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-600 -translate-x-1/2 z-10" />
              <div
                className="h-full bg-emerald-400 transition-all duration-75 absolute top-0"
                style={{
                  left: steerActual < 0 ? `${50 + (steerActual / 45) * 50}%` : '50%',
                  width: `${(Math.abs(steerActual) / 45) * 50}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
              <span>-45°</span>
              <span className="text-neutral-400">CMD: {steerCmd.toFixed(1)}°</span>
              <span>+45°</span>
            </div>
          </div>

          {/* Yaw Rate */}
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-xs text-neutral-400">Yaw Rate</span>
            <div>
              <span className="text-sm font-bold text-neutral-200 tabular-nums">
                {yawRate}
              </span>
              <span className="text-[10px] text-neutral-500 ml-1">mrad/s</span>
            </div>
          </div>

          {/* Hydraulic Brake Bar */}
          <div className="pt-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-400">Hydraulic Brake</span>
              <span
                className={`font-bold tabular-nums ${
                  brakePressure > 50 ? 'text-rose-400' : 'text-neutral-400'
                }`}
              >
                {brakePressure} <span className="text-[10px] font-normal">kPa</span>
              </span>
            </div>
            <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div
                className={`h-full transition-all duration-75 ${
                  brakePressure > 100 ? 'bg-rose-500' : 'bg-neutral-600'
                }`}
                style={{ width: `${brakePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Wing: Powertrain & Bus Health */}
        <div className="w-64 bg-[#0a0a0a]/75 backdrop-blur-md border border-neutral-800/80 rounded-xl p-3.5 space-y-3 pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              POWERTRAIN & BUS
            </span>
            <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
              ACTIVE
            </span>
          </div>

          {/* Motor RPM */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-400">Electric Motor</span>
              <span className="text-cyan-300 font-bold tabular-nums">
                {motorRpm.toLocaleString()} <span className="text-[10px] text-neutral-500">RPM</span>
              </span>
            </div>
            <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-75"
                style={{ width: `${throttlePercent}%` }}
              />
            </div>
          </div>

          {/* CAN Bus Update Rate */}
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-xs text-neutral-400">Bus Rate</span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="text-sm font-bold text-emerald-400 tabular-nums">28.0 Hz</span>
            </div>
          </div>

          {/* Total Frames */}
          <div className="flex justify-between items-baseline pt-1 border-t border-neutral-900">
            <span className="text-xs text-neutral-400">Telemetry Frames</span>
            <span className="text-xs text-neutral-200 font-semibold tabular-nums">
              {totalFrames.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="flex items-end justify-between relative px-1">
        {/* Bottom-Left: Camera Presets */}
        <div className="flex items-center gap-1.5 bg-[#0a0a0a]/80 backdrop-blur-md border border-neutral-800/80 p-1 rounded-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-neutral-400 ml-1 mr-0.5" />
          {(['chase', 'cabin', 'orbit'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setCameraMode(mode)}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                cameraMode === mode
                  ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {mode === 'orbit' ? '360°' : mode}
            </button>
          ))}
        </div>

        {/* Bottom-Center: PRND Selector & System Status */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center">
          {/* PRND Pills */}
          <div className="flex items-center gap-2 bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-800/90 px-3.5 py-1.5 rounded-xl shadow-2xl mb-1.5 pointer-events-auto">
            {['P', 'R', 'N', 'D', 'S'].map((gearLetter) => {
              const isSelected = telemetry.gear === gearLetter;
              return (
                <span
                  key={gearLetter}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-110'
                      : 'text-neutral-500'
                  }`}
                >
                  {gearLetter}
                </span>
              );
            })}
          </div>

          {/* Autoware Subtitle */}
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
            {isAuto ? 'AUTOWARE UNIVERSE • AUTONOMOUS DRIVE' : 'MANUAL DRIVE OVERRIDE'}
          </span>
        </div>

        {/* Bottom-Right: Speed Unit & Monitor Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Units Switcher */}
          <div className="flex bg-[#0a0a0a]/80 backdrop-blur-md border border-neutral-800/80 p-0.5 rounded-lg text-[10px]">
            <button
              onClick={() => setSpeedUnit('km/h')}
              className={`px-2 py-0.5 rounded transition-all font-bold ${
                speedUnit === 'km/h' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              KM/H
            </button>
            <button
              onClick={() => setSpeedUnit('mph')}
              className={`px-2 py-0.5 rounded transition-all font-bold ${
                speedUnit === 'mph' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              MPH
            </button>
          </div>

          {/* Quick return to CAN Monitor */}
          <button
            onClick={toggleActiveView}
            className="flex items-center gap-1.5 bg-[#0a0a0a]/90 hover:bg-neutral-900 text-neutral-300 border border-neutral-800/90 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-md"
            title="Switch back to CAN Bus Engineering Monitor (Tab)"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>CAN MONITOR</span>
            <span className="text-[9px] text-neutral-500 bg-neutral-950 px-1 py-0.5 rounded border border-neutral-800">
              Tab
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
