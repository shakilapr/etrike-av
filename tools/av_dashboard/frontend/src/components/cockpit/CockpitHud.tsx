import React from 'react';
import { useCanStore } from '../../store/canStore';
import {
  Eye,
  Camera,
  ExternalLink,
  Layers,
  Activity,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
} from 'lucide-react';
import {
  ParkTelltale,
  BrakeTelltale,
  HoldTelltale,
  ReadyTelltale,
  EpsTelltale,
  EstopTelltale,
  EcuTempTelltale,
  CanBusTelltale,
  HighBeamTelltale,
  HazardTelltale,
} from './AutomotiveTelltales';
import { SensorTriadIndicator } from './SensorTriadIndicator';

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
    isConnected,
    rosStatus,
    perceptionObjects,
    demoPedestrian,
    toggleDemoPedestrian,
  } = useCanStore();

  // Speed calculation
  const speedVal = speedUnit === 'mph'
    ? telemetry.speed_act_kmh * 0.621371
    : telemetry.speed_act_kmh;
  const targetSpeedVal = speedUnit === 'mph'
    ? telemetry.speed_cmd_kmh * 0.621371
    : telemetry.speed_cmd_kmh;

  const isAuto = telemetry.mode === 'AUTONOMOUS' || telemetry.mode === 'AUTO';
  const isEstop = telemetry.estop || telemetry.mode === 'ESTOP';

  // Turn signals & lights (ISO telltales from telemetry)
  const isTurnLeft = telemetry.lights_act.left;
  const isTurnRight = telemetry.lights_act.right;
  const isHighBeam = telemetry.lights_act.headlight;
  const isHazard = telemetry.lights_act.hazard;
  const isBrakeLight = telemetry.lights_act.brake;

  // Steering & Stability values
  const steerActual = telemetry.steer_act_deg;
  const steerCmd = telemetry.steer_cmd_deg;
  const brakePressure = telemetry.brake_act_kpa;
  const brakePercent = Math.min((brakePressure / 5000) * 100, 100);

  // Deep CAN Diagnostic Signals from contracts
  // 0x310 steer_diag
  const steerDiagFrame = framesById[0x310]?.signals;
  const steerFault = Boolean(steerDiagFrame?.['fault']?.value);
  const steerCurrent = typeof steerDiagFrame?.['motor_current']?.value === 'number'
    ? steerDiagFrame['motor_current'].value
    : null;
  const steerTemp = typeof steerDiagFrame?.['ecu_temp']?.value === 'number'
    ? steerDiagFrame['ecu_temp'].value
    : null;

  // 0x311 brake_diag
  const brakeDiagFrame = framesById[0x311]?.signals;
  const brakeFault = Boolean(brakeDiagFrame?.['fault']?.value);
  const brakeTemp = typeof brakeDiagFrame?.['ecu_temp']?.value === 'number'
    ? brakeDiagFrame['ecu_temp'].value
    : null;

  // 0x620 rt_diag_rpt & 0x600 sys_diag_rpt (CAN Controller Health)
  const rtDiagFrame = framesById[0x620]?.signals;
  const sysDiagFrame = framesById[0x600]?.signals;
  const hasRtDiag = Boolean(framesById[0x620] || framesById[0x600]);
  const mcpBusOff = Boolean(rtDiagFrame?.['mcp_bus_off']?.value);
  const mcpTec =
    typeof rtDiagFrame?.['mcp_tec']?.value === 'number'
      ? rtDiagFrame['mcp_tec'].value
      : typeof sysDiagFrame?.['tec']?.value === 'number'
      ? sysDiagFrame['tec'].value
      : 0;
  const mcpRec =
    typeof rtDiagFrame?.['mcp_rec']?.value === 'number'
      ? rtDiagFrame['mcp_rec'].value
      : typeof sysDiagFrame?.['rec']?.value === 'number'
      ? sysDiagFrame['rec'].value
      : 0;

  // CAN Bus link & source status
  const busRateHz = typeof telemetry.bus_rate_hz === 'number' ? telemetry.bus_rate_hz : 0.0;
  const canConnected = Boolean(telemetry.can_connected);
  const telemetrySource = telemetry.telemetry_source ?? 'OFFLINE';

  // Derived Vehicle States for Telltales
  const isPark = telemetry.gear === 'P';
  const isBraking = brakePressure > 100 || isBrakeLight;
  const isHold = telemetry.speed_act_kmh < 0.5 && brakePressure > 250;
  const isReady = isConnected && (canConnected || rosStatus.active) && !isEstop;
  const isEpsWarning = steerFault || (framesById[0x310] !== undefined && Math.abs(steerCmd - steerActual) > 5.0);
  const maxEcuTemp = Math.max(steerTemp ?? 0, brakeTemp ?? 0);

  // Yaw rate from motion report (0x121), host drive cmd (0x300), or ROS odometry
  const yawRate121 = framesById[0x121]?.signals?.['yaw_rate_mrad_s']?.value;
  const yawRate300 = framesById[0x300]?.signals?.['yaw_rate_mrad_s']?.value;
  const yawRate = typeof yawRate121 === 'number'
    ? Math.round(yawRate121)
    : typeof yawRate300 === 'number'
    ? Math.round(yawRate300)
    : typeof rosStatus.ego_yaw_rate_mrad_s === 'number'
    ? Math.round(rosStatus.ego_yaw_rate_mrad_s)
    : 0;

  // Motor / Powertrain from 0x206 & 0x120 (or commanded demand in bench mode)
  const motorRpm = typeof telemetry.motor_rpm === 'number' ? telemetry.motor_rpm : null;
  const throttlePercent = typeof telemetry.throttle_pct === 'number'
    ? Math.min(Math.max(Math.round(telemetry.throttle_pct), 0), 100)
    : Math.min(Math.round((Math.abs(telemetry.speed_cmd_kmh) / 10.8) * 100), 100);

  // Autoware perception: forward-corridor proximity watch (ahead = negative Z)
  const corridorThreats = perceptionObjects
    .map((o) => ({ obj: o, dist: -o.z }))
    .filter((e) => e.dist > 0 && e.dist < 25 && Math.abs(e.obj.x) < 3.0)
    .sort((a, b) => a.dist - b.dist);
  const nearestThreat = corridorThreats[0];
  const threatIsPed = nearestThreat?.obj.label === 'PEDESTRIAN';
  const showThreat = Boolean(nearestThreat && nearestThreat.dist < (threatIsPed ? 12 : 8));

  // Autoware link status wording — honest about why objects may be absent.
  const rosPoseOk = rosStatus.pose_ok !== false;
  let rosStatusText: string;
  let rosDot: string;
  if (!rosStatus.bridge_available) {
    rosStatusText = 'AUTOWARE BRIDGE UNAVAILABLE • rclpy NOT LOADED';
    rosDot = 'bg-neutral-600';
  } else if (rosStatus.source?.startsWith('bench_')) {
    const rawMode = rosStatus.source.replace('bench_', '').toUpperCase();
    if (rawMode === 'UNAVAILABLE') {
      rosStatusText = 'BENCH PERCEPTION • SENSORS UNAVAILABLE (DISCONNECTED)';
      rosDot = 'bg-rose-500 animate-pulse';
    } else {
      const modeLabel = rawMode === 'CAMERA_ONLY' ? 'CAMERA ONLY' : rawMode === 'LIDAR_ONLY' ? 'LIDAR ONLY' : 'CAMERA + LIDAR FUSED';
      rosStatusText = `BENCH PERCEPTION [${modeLabel}] • ${rosStatus.object_count ?? rosStatus.tracked_count} OBJECTS (${rosStatus.hz} Hz)`;
      rosDot = 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]';
    }
  } else if (!rosStatus.active) {
    rosStatusText = 'AUTOWARE UNIVERSE OFFLINE • WAITING FOR TOPICS';
    rosDot = 'bg-neutral-600';
  } else if (!rosPoseOk) {
    rosStatusText = 'AUTOWARE LIVE • WAITING FOR LOCALIZATION (ego pose)';
    rosDot = 'bg-amber-400 animate-pulse';
  } else {
    rosStatusText = `AUTOWARE UNIVERSE LIVE • ${rosStatus.object_count ?? rosStatus.tracked_count} OBJECTS (${rosStatus.hz} Hz)`;
    rosDot = 'bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]';
  }

  return (
    <>
      {/* ================= DYNAMIC BRAKING RED GRADIENT FLARE (FROM BELOW) ================= */}
      <div
        className="fixed inset-x-0 bottom-0 pointer-events-none transition-all duration-100 ease-out z-10"
        style={{
          height: `${Math.min(16 + (brakePercent * 0.40), 55)}%`,
          background: 'linear-gradient(to top, rgba(225, 29, 72, 0.45) 0%, rgba(136, 19, 55, 0.18) 55%, rgba(0, 0, 0, 0) 100%)',
          opacity: isBraking ? Math.min(0.25 + (brakePercent / 100) * 0.75, 1.0) : 0,
        }}
      />

      {/* ================= FULL-SCREEN E-STOP EMERGENCY PULSING STROBE ================= */}
      {isEstop && (
        <div className="fixed inset-0 pointer-events-none z-20 animate-[pulse_1.2s_ease-in-out_infinite] bg-rose-950/25 border-8 border-rose-600/80 shadow-[inset_0_0_100px_rgba(225,29,72,0.65)]" />
      )}

      {/* ================= MAIN COCKPIT HUD CONTAINER ================= */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-mono z-30">
        {/* ================= TOP ZONE (PRIMARY SIGHTLINE & ISO TELLTALES) ================= */}
        <div className="flex items-start justify-between relative">
          {/* Top-Left: Peripheral Left Turn (56px) & ISO Telltales Cluster */}
          <div className="flex items-center gap-3">
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

            {/* ISO 2575 Telltale Bank - Left Pod: PARK, BRAKE, HOLD, READY */}
            <div className="flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl">
              <ParkTelltale active={isPark} />
              <BrakeTelltale active={isBraking || brakeFault} />
              <HoldTelltale active={isHold} />
              <ReadyTelltale active={isReady} />
            </div>
          </div>

          {/* Top-Center Primary Horizon: PRND Transmission & Speedometer */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
            {/* PRND Transmission Selector */}
            <div className="flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 px-3 py-1 rounded-xl shadow-xl mb-1 pointer-events-auto">
              {['P', 'R', 'N', 'D', 'S'].map((gearLetter) => {
                const isSelected = telemetry.gear === gearLetter;
                return (
                  <div
                    key={gearLetter}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black shadow-[0_0_14px_rgba(6,182,212,0.9)] scale-110 border border-cyan-300'
                        : 'text-neutral-500 hover:text-neutral-400 bg-neutral-900/50'
                    }`}
                  >
                    {gearLetter}
                  </div>
                );
              })}
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

            {/* Sensor Triad Indicator: Camera, LiDAR, and Combined Status */}
            <SensorTriadIndicator size="hud" className="mt-2" />

            {/* ADAS Avatar & YOLO26x + RTMPose-s 17-Keypoint Engine Status Pill */}
            <div className="flex items-center gap-2 mt-1 px-3 py-0.5 bg-[#080808]/90 backdrop-blur-md rounded-full border border-cyan-500/40 text-[10px] font-mono shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
              <span className="text-cyan-300 font-bold">ADAS Avatar</span>
              <span className="text-neutral-500">•</span>
              <span className="text-emerald-300 font-bold">YOLO26x + RTMPose-s (17 Joints)</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">TensorRT FP16</span>
            </div>
          </div>

          {/* Top-Right: ISO Telltales Cluster & Peripheral Right Turn (56px) */}
          <div className="flex items-center gap-3">
            {/* ISO 2575 Telltale Bank - Right Pod: EPS, ESTOP, TEMP, CAN, HIGH BEAM, HAZARD */}
            <div className="flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl">
              <EpsTelltale active={isEpsWarning} fault={steerFault} />
              <EstopTelltale active={isEstop} />
              <EcuTempTelltale active={maxEcuTemp > 60} temp={maxEcuTemp} />
              <CanBusTelltale active={isConnected && !mcpBusOff} busOff={mcpBusOff} errorCount={mcpTec + mcpRec} />
              <HighBeamTelltale active={isHighBeam} />
              <HazardTelltale active={isHazard} />
            </div>

            {/* Right Turn Indicator - 56px */}
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

        {/* ================= MIDDLE INSTRUMENT PODS (FLOATING IN-SPACE HUD) ================= */}
        <div className="flex justify-between items-center px-4">
          {/* Left Wing: Chassis & Steering Dynamics (Floating HUD) */}
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
              {/* Floating Gauge Bar with Center Detent */}
              <div className="h-3.5 bg-neutral-900/90 rounded-full relative overflow-hidden border border-neutral-700/60 shadow-inner">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-300 -translate-x-1/2 z-10" />
                {/* Target Command Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-cyan-300 -translate-x-1/2 z-20 shadow-[0_0_8px_rgba(6,182,212,1)]"
                  style={{ left: `${50 + (steerCmd / 45) * 50}%` }}
                  title={`Commanded Steer: ${steerCmd.toFixed(1)}°`}
                />
                {/* Actual Steer Fill */}
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

            {/* Steering Actuator Diagnostics (Floating Telemetry Row) */}
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

            {/* Hydraulic Brake Bar (Floating Light-Tube) */}
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
                  {brakeFault ? 'BRAKE FAULT' : framesById[0x311] ? 'NORMAL' : 'NO 0x311'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Wing: Powertrain & CAN Bus Telemetry (Floating HUD) */}
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
              {/* Floating Throttle Tube */}
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
                Bus Rate ({telemetry.can_interface || 'can2'})
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

            {/* CAN Controller Counters (Floating Diagnostic Row) */}
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

            <div className="w-[1px] h-6 bg-neutral-800 my-auto" />

            {/* SMPL + RTMPose Demonstration Toggle */}
            <button
              onClick={toggleDemoPedestrian}
              className={`h-10 px-3 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                demoPedestrian
                  ? 'bg-cyan-500 text-black shadow-[0_0_14px_rgba(6,182,212,0.85)] border border-cyan-300'
                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/80'
              }`}
              title="Toggle interactive 3D Pedestrian Avatar & RTMPose-s 17-keypoint skeletal rig model"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{demoPedestrian ? 'PED RIG: ON' : 'PED RIG'}</span>
            </button>
          </div>

          {/* Bottom-Center: Autoware Perception Radar, Drive Mode & Link Status */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-1 flex flex-col items-center pointer-events-none gap-1">
            {/* Proximity warning banner (Symbol + Text + Colour) */}
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

            {/* Pop out dedicated Camera Window */}
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
    </>
  );
};
