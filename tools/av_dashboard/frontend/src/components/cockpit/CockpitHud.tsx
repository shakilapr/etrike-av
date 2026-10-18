import React from 'react';
import { useCanStore } from '../../store/canStore';
import { HudTopHorizon } from './hud/HudTopHorizon';
import { HudChassisDynamics } from './hud/HudChassisDynamics';
import { HudPowertrainBus } from './hud/HudPowertrainBus';
import { HudBottomControls } from './hud/HudBottomControls';
import { HudVisibilityToggles } from './hud/HudVisibilityToggles';

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
    showTukTuk,
    showSpeed,
    showSkeletons,
    showPointCloud,
    toggleShowTukTuk,
    toggleShowSpeed,
    toggleShowSkeletons,
    toggleShowPointCloud,
  } = useCanStore();

  const speedVal = speedUnit === 'mph'
    ? telemetry.speed_act_kmh * 0.621371
    : telemetry.speed_act_kmh;

  const isAuto = telemetry.mode === 'AUTONOMOUS' || telemetry.mode === 'AUTO';
  const isEstop = telemetry.estop || telemetry.mode === 'ESTOP';

  const isTurnLeft = telemetry.lights_act.left;
  const isTurnRight = telemetry.lights_act.right;
  const isHighBeam = telemetry.lights_act.headlight;
  const isHazard = telemetry.lights_act.hazard;
  const isBrakeLight = telemetry.lights_act.brake;

  const steerActual = telemetry.steer_act_deg;
  const steerCmd = telemetry.steer_cmd_deg;
  const brakePressure = telemetry.brake_act_kpa;
  const brakePercent = Math.min((brakePressure / 5000) * 100, 100);

  const steerDiagFrame = framesById[0x310]?.signals;
  const steerFault = Boolean(steerDiagFrame?.['fault']?.value);
  const steerCurrent = typeof steerDiagFrame?.['motor_current']?.value === 'number'
    ? steerDiagFrame['motor_current'].value
    : null;
  const steerTemp = typeof steerDiagFrame?.['ecu_temp']?.value === 'number'
    ? steerDiagFrame['ecu_temp'].value
    : null;

  const brakeDiagFrame = framesById[0x311]?.signals;
  const brakeFault = Boolean(brakeDiagFrame?.['fault']?.value);
  const brakeTemp = typeof brakeDiagFrame?.['ecu_temp']?.value === 'number'
    ? brakeDiagFrame['ecu_temp'].value
    : null;

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

  const busRateHz = typeof telemetry.bus_rate_hz === 'number' ? telemetry.bus_rate_hz : 0.0;
  const canConnected = Boolean(telemetry.can_connected);
  const telemetrySource = telemetry.telemetry_source ?? 'OFFLINE';

  const isPark = telemetry.gear === 'P';
  const isBraking = brakePressure > 100 || isBrakeLight;
  const isHold = isPark || (Math.abs(telemetry.speed_act_kmh) < 0.1 && brakePressure > 2500 && (telemetry.gear === 'N' || isEstop));
  const isReady = isConnected && (canConnected || rosStatus.active) && !isEstop;
  const isEpsWarning = steerFault || (framesById[0x310] !== undefined && Math.abs(steerCmd - steerActual) > 5.0);
  const maxEcuTemp = Math.max(steerTemp ?? 0, brakeTemp ?? 0);

  const yawRate121 = framesById[0x121]?.signals?.['yaw_rate_mrad_s']?.value;
  const yawRate300 = framesById[0x300]?.signals?.['yaw_rate_mrad_s']?.value;
  const yawRate = typeof yawRate121 === 'number'
    ? Math.round(yawRate121)
    : typeof yawRate300 === 'number'
    ? Math.round(yawRate300)
    : typeof rosStatus.ego_yaw_rate_mrad_s === 'number'
    ? Math.round(rosStatus.ego_yaw_rate_mrad_s)
    : 0;

  const motorRpm = typeof telemetry.motor_rpm === 'number' ? telemetry.motor_rpm : null;
  const throttlePercent = typeof telemetry.throttle_pct === 'number'
    ? Math.min(Math.max(Math.round(telemetry.throttle_pct), 0), 100)
    : Math.min(Math.round((Math.abs(telemetry.speed_cmd_kmh) / 10.8) * 100), 100);

  const corridorThreats = perceptionObjects
    .map((o) => ({ obj: o, dist: -o.z }))
    .filter((e) => e.dist > 0 && e.dist < 25 && Math.abs(e.obj.x) < 3.0)
    .sort((a, b) => a.dist - b.dist);
  const nearestThreat = corridorThreats[0];
  const threatIsPed = nearestThreat?.obj.label === 'PEDESTRIAN';
  const showThreat = Boolean(nearestThreat && nearestThreat.dist < (threatIsPed ? 12 : 8));

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
      <div
        className="fixed inset-x-0 bottom-0 pointer-events-none transition-all duration-100 ease-out z-10"
        style={{
          height: `${Math.min(16 + (brakePercent * 0.40), 55)}%`,
          background: 'linear-gradient(to top, rgba(225, 29, 72, 0.45) 0%, rgba(136, 19, 55, 0.18) 55%, rgba(0, 0, 0, 0) 100%)',
          opacity: isBraking ? Math.min(0.25 + (brakePercent / 100) * 0.75, 1.0) : 0,
        }}
      />

      {isEstop && (
        <div className="fixed inset-0 pointer-events-none z-20 animate-[pulse_1.2s_ease-in-out_infinite] bg-rose-950/25 border-8 border-rose-600/80 shadow-[inset_0_0_100px_rgba(225,29,72,0.65)]" />
      )}

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-mono z-30">
        <HudTopHorizon
          isTurnLeft={isTurnLeft}
          isTurnRight={isTurnRight}
          isHazard={isHazard}
          isPark={isPark}
          isBraking={isBraking}
          brakeFault={brakeFault}
          isHold={isHold}
          isReady={isReady}
          gear={telemetry.gear}
          showSpeed={showSpeed}
          busRateHz={busRateHz}
          speedVal={speedVal}
          speedUnit={speedUnit}
          isEpsWarning={isEpsWarning}
          steerFault={steerFault}
          isEstop={isEstop}
          maxEcuTemp={maxEcuTemp}
          isConnected={isConnected}
          mcpBusOff={mcpBusOff}
          mcpTec={mcpTec}
          mcpRec={mcpRec}
          isHighBeam={isHighBeam}
        />

        <div className="flex justify-between items-center px-4">
          <HudChassisDynamics
            steerActual={steerActual}
            steerCmd={steerCmd}
            steerCurrent={steerCurrent}
            steerTemp={steerTemp}
            yawRate={yawRate}
            brakePressure={brakePressure}
            brakePercent={brakePercent}
            brakeTemp={brakeTemp}
            brakeFault={brakeFault}
            hasBrakeFrame={framesById[0x311] !== undefined}
          />

          <HudPowertrainBus
            telemetrySource={telemetrySource}
            motorRpm={motorRpm}
            throttlePercent={throttlePercent}
            canInterface={telemetry.can_interface}
            busRateHz={busRateHz}
            hasRtDiag={hasRtDiag}
            mcpTec={mcpTec}
            mcpRec={mcpRec}
            mcpBusOff={mcpBusOff}
            canConnected={canConnected}
            totalFrames={totalFrames}
          />
        </div>

        <HudBottomControls
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
          showThreat={showThreat}
          nearestThreat={nearestThreat}
          threatIsPed={threatIsPed}
          isAuto={isAuto}
          rosDot={rosDot}
          rosStatus={rosStatus}
          rosPoseOk={rosPoseOk}
          rosStatusText={rosStatusText}
          speedUnit={speedUnit}
          setSpeedUnit={setSpeedUnit}
          toggleActiveView={toggleActiveView}
        />

        <HudVisibilityToggles
          showTukTuk={showTukTuk}
          showSpeed={showSpeed}
          showSkeletons={showSkeletons}
          showPointCloud={showPointCloud}
          toggleShowTukTuk={toggleShowTukTuk}
          toggleShowSpeed={toggleShowSpeed}
          toggleShowSkeletons={toggleShowSkeletons}
          toggleShowPointCloud={toggleShowPointCloud}
        />
      </div>
    </>
  );
};
