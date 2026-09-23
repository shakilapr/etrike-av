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
  ChevronLeft,
  ChevronRight,
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
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-mono">
      {/* ================= TOP ZONE (CRITICAL PRIMARY SIGHTLINE) ================= */}
      <div className="flex items-start justify-between relative">
        {/* Top-Left: Peripheral Left Turn (ISO 56px) & Safety State */}
        <div className="flex items-center gap-4">
          {/* Left Turn Indicator - 56px high-visibility circle */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${
              isTurnLeft || isHazard
                ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse'
                : 'bg-[#080808]/85 text-neutral-700 border-neutral-800'
            }`}
            title="Left Turn Indicator (Peripheral Field)"
          >
            <ChevronLeft className="w-8 h-8 stroke-[3]" />
          </div>

          {/* Safety Status Pill - Ergonomic touch-height pill */}
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-xl transition-all ${
              isEstop
                ? 'bg-rose-950/90 text-rose-200 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.7)] animate-pulse'
                : 'bg-[#080808]/85 text-emerald-400 border-emerald-500/50 shadow-lg'
            }`}
          >
            {isEstop ? (
              <>
                <AlertOctagon className="w-5 h-5 text-rose-400 fill-current animate-bounce" />
                <span className="text-sm font-black uppercase tracking-wider">E-STOP ACTIVE</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold uppercase tracking-wider">SAFETY OK</span>
              </>
            )}
          </div>
        </div>

        {/* Top-Center: Speedometer & Autonomy State (Primary Driving Glance) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
          {/* Autonomy Badge & Target Cruise Speed */}
          <div className="flex items-center gap-3 mb-1.5">
            {/* Target Cruise Speed Pill */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080808]/90 border border-neutral-700/80 text-sm shadow-md"
              title="Target Commanded Cruise Speed"
            >
              <span className="text-xs uppercase text-neutral-400 font-bold tracking-wider">CRUISE</span>
              <span className="font-black tabular-nums text-white text-base">
                {targetSpeedVal.toFixed(0)}
              </span>
            </div>

            {/* Mode & Autosteer Pill */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1 rounded-full border transition-all ${
                isAuto
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.6)]'
                  : 'bg-[#080808]/90 text-neutral-400 border-neutral-800'
              }`}
            >
              <Layers className={`w-4 h-4 ${isAuto ? 'animate-pulse text-cyan-300' : 'text-neutral-500'}`} />
              <span className="text-xs font-black uppercase tracking-wider">
                {isAuto ? 'AUTOWARE AUTO' : 'MANUAL'}
              </span>
            </div>
          </div>

          {/* Primary Speedometer Digits (Automotive Glance Sizing: 80-96px) */}
          <div className="flex items-baseline gap-2 drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
            <span className="text-7xl lg:text-8xl font-black text-white tracking-tight tabular-nums font-mono leading-none">
              {speedVal.toFixed(0)}
            </span>
            <span className="text-base lg:text-lg font-black text-neutral-400 uppercase tracking-widest">
              {speedUnit}
            </span>
          </div>
        </div>

        {/* Top-Right: Peripheral High Beam & Right Turn (ISO 56px) */}
        <div className="flex items-center gap-4">
          {/* High Beam Indicator */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
              isHighBeam
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]'
                : 'bg-[#080808]/85 text-neutral-700 border-neutral-800'
            }`}
            title="High Beam Headlights"
          >
            <Zap className="w-6 h-6 fill-current" />
          </div>

          {/* Right Turn Indicator */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-150 ${
              isTurnRight || isHazard
                ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.95)] animate-pulse'
                : 'bg-[#080808]/85 text-neutral-700 border-neutral-800'
            }`}
            title="Right Turn Indicator (Peripheral Field)"
          >
            <ChevronRight className="w-8 h-8 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* ================= MIDDLE INSTRUMENT PODS ================= */}
      <div className="flex justify-between items-center px-2">
        {/* Left Wing: Chassis & Steering Dynamics (Ergonomic 336px width) */}
        <div className="w-80 lg:w-84 bg-[#080808]/85 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-5 space-y-4 pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-xs uppercase font-black text-neutral-400 tracking-wider">
              CHASSIS DYNAMICS
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 font-bold">
              3-WHEELER
            </span>
          </div>

          {/* Steering Angle with Bi-Directional High-Contrast Bar */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-sm font-semibold text-neutral-300">Steering</span>
              <span className="text-2xl font-black tabular-nums text-emerald-400">
                {steerActual > 0 ? `+${steerActual.toFixed(1)}°` : `${steerActual.toFixed(1)}°`}
              </span>
            </div>
            {/* 16px Solid Gauge Bar with Center Detent */}
            <div className="h-4 bg-neutral-950 rounded-full relative overflow-hidden border border-neutral-700/80 shadow-inner">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-400 -translate-x-1/2 z-10" />
              {/* Target Command Marker */}
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-cyan-300 -translate-x-1/2 z-20 shadow-[0_0_8px_rgba(6,182,212,1)]"
                style={{ left: `${50 + (steerCmd / 45) * 50}%` }}
                title={`Commanded Steer: ${steerCmd.toFixed(1)}°`}
              />
              {/* Actual Steer Fill */}
              <div
                className="h-full bg-emerald-400 transition-all duration-75 absolute top-0"
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

          {/* Yaw Rate */}
          <div className="flex justify-between items-baseline pt-1 border-t border-neutral-900">
            <span className="text-sm font-semibold text-neutral-300">Yaw Rate</span>
            <div>
              <span className="text-2xl font-black text-white tabular-nums">
                {yawRate}
              </span>
              <span className="text-xs text-neutral-400 ml-1.5 font-bold">mrad/s</span>
            </div>
          </div>

          {/* Hydraulic Brake Bar (14px thickness) */}
          <div className="pt-1 border-t border-neutral-900">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-sm font-semibold text-neutral-300">Hydraulic Brake</span>
              <span
                className={`text-2xl font-black tabular-nums ${
                  brakePressure > 50 ? 'text-rose-400' : 'text-neutral-200'
                }`}
              >
                {brakePressure} <span className="text-xs font-normal text-neutral-400">kPa</span>
              </span>
            </div>
            <div className="h-3.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-700/80 shadow-inner">
              <div
                className={`h-full transition-all duration-75 ${
                  brakePressure > 100
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                    : 'bg-neutral-600'
                }`}
                style={{ width: `${brakePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Wing: Powertrain, Power Demand & Bus Telemetry */}
        <div className="w-80 lg:w-84 bg-[#080808]/85 backdrop-blur-xl border border-neutral-800/90 rounded-2xl p-5 space-y-4 pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-xs uppercase font-black text-neutral-400 tracking-wider">
              POWERTRAIN & BUS
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-bold">
              ACTIVE
            </span>
          </div>

          {/* Motor RPM & Demand Bar */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-sm font-semibold text-neutral-300">Electric Motor</span>
              <span className="text-2xl font-black tabular-nums text-cyan-300">
                {motorRpm.toLocaleString()} <span className="text-xs font-normal text-neutral-400">RPM</span>
              </span>
            </div>
            {/* 16px Throttle Power Bar */}
            <div className="h-4 bg-neutral-950 rounded-full overflow-hidden border border-neutral-700/80 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-75 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                style={{ width: `${throttlePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-400 mt-1 font-mono">
              <span>IDLE</span>
              <span className="text-neutral-300">{throttlePercent}% DEMAND</span>
              <span>PEAK</span>
            </div>
          </div>

          {/* CAN Bus Update Rate */}
          <div className="flex justify-between items-baseline pt-1 border-t border-neutral-900">
            <span className="text-sm font-semibold text-neutral-300">Bus Rate</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-2xl font-black text-emerald-400 tabular-nums">28.0 Hz</span>
            </div>
          </div>

          {/* Total Frames */}
          <div className="flex justify-between items-baseline pt-1 border-t border-neutral-900">
            <span className="text-sm font-semibold text-neutral-300">CAN Telemetry Frames</span>
            <span className="text-base font-bold text-neutral-200 tabular-nums">
              {totalFrames.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM CONSOLE (TRANSMISSION & CONTROLS) ================= */}
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

        {/* Bottom-Center: PRND Transmission Selector (48px glowing gear pills) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center">
          {/* PRND Pills */}
          <div className="flex items-center gap-3 bg-[#080808]/95 backdrop-blur-xl border border-neutral-800/95 px-4 py-2 rounded-2xl shadow-2xl mb-2 pointer-events-auto">
            {['P', 'R', 'N', 'D', 'S'].map((gearLetter) => {
              const isSelected = telemetry.gear === gearLetter;
              return (
                <div
                  key={gearLetter}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl font-black transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-black shadow-[0_0_18px_rgba(6,182,212,0.9)] scale-110 border-2 border-cyan-300'
                      : 'text-neutral-500 hover:text-neutral-300 bg-neutral-900/60'
                  }`}
                >
                  {gearLetter}
                </div>
              );
            })}
          </div>

          {/* Autoware Subtitle */}
          <span className="text-xs text-neutral-300 uppercase tracking-widest font-bold">
            {isAuto ? 'AUTOWARE UNIVERSE • AUTONOMOUS DRIVE' : 'MANUAL DRIVE OVERRIDE'}
          </span>
        </div>

        {/* Bottom-Right: Speed Unit Switcher & Return to CAN Monitor (44px touch targets) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Units Switcher */}
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

          {/* Quick return to CAN Monitor */}
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
    </div>
  );
};
