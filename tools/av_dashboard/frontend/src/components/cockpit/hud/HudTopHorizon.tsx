import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
} from '../AutomotiveTelltales';

interface HudTopHorizonProps {
  isTurnLeft: boolean;
  isTurnRight: boolean;
  isHazard: boolean;
  isPark: boolean;
  isBraking: boolean;
  brakeFault: boolean;
  isHold: boolean;
  isReady: boolean;
  gear: string;
  showSpeed: boolean;
  busRateHz: number;
  speedVal: number;
  speedUnit: string;
  isEpsWarning: boolean;
  steerFault: boolean;
  isEstop: boolean;
  maxEcuTemp: number;
  isConnected: boolean;
  mcpBusOff: boolean;
  mcpTec: number;
  mcpRec: number;
  isHighBeam: boolean;
}

export const HudTopHorizon: React.FC<HudTopHorizonProps> = ({
  isTurnLeft,
  isTurnRight,
  isHazard,
  isPark,
  isBraking,
  brakeFault,
  isHold,
  isReady,
  gear,
  showSpeed,
  busRateHz,
  speedVal,
  speedUnit,
  isEpsWarning,
  steerFault,
  isEstop,
  maxEcuTemp,
  isConnected,
  mcpBusOff,
  mcpTec,
  mcpRec,
  isHighBeam,
}) => {
  return (
    <div className="flex items-start justify-between relative">
      {/* Top-Left: Peripheral Left Turn (56px) & ISO Telltales Cluster */}
      <div className="flex items-center gap-3">
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

        <div className="flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl">
          <ParkTelltale active={isPark} />
          <BrakeTelltale active={isBraking || brakeFault} />
          <HoldTelltale active={isHold} />
          <ReadyTelltale active={isReady} />
        </div>
      </div>

      {/* Top-Center Primary Horizon: PRND Transmission & Speedometer */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
        <div className="flex items-center gap-2 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 px-3 py-1 rounded-xl shadow-xl mb-1 pointer-events-auto">
          {['P', 'R', 'N', 'D', 'S'].map((gearLetter) => {
            const isSelected = gear === gearLetter;
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

        {showSpeed && (
          <div className="flex flex-col items-center drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
            <div className="flex items-baseline gap-2">
              <span className={`text-7xl lg:text-8xl font-black tracking-tight tabular-nums font-mono leading-none ${
                busRateHz > 0 ? 'text-white' : 'text-neutral-500'
              }`}>
                {busRateHz > 0 ? speedVal.toFixed(0) : '--'}
              </span>
              <span className="text-base lg:text-lg font-black text-neutral-400 uppercase tracking-widest">
                {speedUnit}
              </span>
            </div>
            {busRateHz === 0 && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500/90 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded mt-1">
                CAN TELEMETRY OFFLINE
              </span>
            )}
          </div>
        )}
      </div>

      {/* Top-Right: ISO Telltales Cluster & Peripheral Right Turn (56px) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-1 rounded-xl shadow-xl">
          <EpsTelltale active={isEpsWarning} fault={steerFault} />
          <EstopTelltale active={isEstop} />
          <EcuTempTelltale active={maxEcuTemp > 60} temp={maxEcuTemp} />
          <CanBusTelltale active={isConnected && !mcpBusOff} busOff={mcpBusOff} errorCount={mcpTec + mcpRec} />
          <HighBeamTelltale active={isHighBeam} />
          <HazardTelltale active={isHazard} />
        </div>

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
  );
};
