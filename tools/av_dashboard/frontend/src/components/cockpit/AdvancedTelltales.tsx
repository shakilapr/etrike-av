import React from 'react';

export interface TelltaleProps {
  active: boolean;
  className?: string;
  title?: string;
  color?: string;
}

/**
 * ECU / Actuator Thermal Warning Telltale: TEMP
 */
export const EcuTempTelltale: React.FC<TelltaleProps & { temp: number }> = ({
  active,
  temp,
  title = 'ECU / Actuator Temperature',
}) => {
  const isHigh = temp > 75;
  const isWarm = temp > 60 || active;
  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
        isHigh
          ? 'bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)] animate-pulse'
          : isWarm
          ? 'bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)]'
          : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
      }`}
      title={`${title}: ${temp}°C`}
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
        <path d="M 13 8 C 13 6.9 13.9 6 15 6 C 16.1 6 17 6.9 17 8 L 17 18.2 C 18.2 19 19 20.4 19 22 C 19 24.2 17.2 26 15 26 C 12.8 26 11 24.2 11 22 C 11 20.4 11.8 19 13 18.2 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="15" cy="22" r="2.8" />
        <rect x="14" y="12" width="2" height="7" rx="0.5" />
        <line x1="19" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.8" />
        <line x1="19" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </div>
  );
};

/**
 * CAN Bus / OBD Controller Telltale: CAN
 */
export const CanBusTelltale: React.FC<TelltaleProps & { busOff?: boolean; errorCount?: number }> = ({
  active,
  busOff = false,
  errorCount = 0,
  title = 'CAN Controller Health',
}) => {
  const isErr = busOff || errorCount > 96;
  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
        busOff
          ? 'bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)] animate-pulse'
          : isErr
          ? 'bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)]'
          : active
          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
          : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
      }`}
      title={`${title}: ${busOff ? 'BUS OFF' : isErr ? `Errors: ${errorCount}` : 'OK'}`}
    >
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black tracking-tighter leading-none">CAN</span>
        <span className="text-[7px] font-mono leading-none mt-0.5 font-bold">
          {busOff ? 'OFF' : 'BUS'}
        </span>
      </div>
    </div>
  );
};

/**
 * ISO 2575 #03: High Beam Headlight Telltale
 */
export const HighBeamTelltale: React.FC<TelltaleProps> = ({ active, title = 'High Beam Headlights' }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
      active
        ? 'bg-blue-950/80 border-blue-500 text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]'
        : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
    }`}
    title={title}
  >
    <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
      <path d="M 18 8 A 8 8 0 0 1 18 24 L 14 24 C 11.8 24 10 22.2 10 20 L 10 12 C 10 9.8 11.8 8 14 8 Z" />
      <line x1="21" y1="10" x2="28" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Hazard Warning Flasher: Double Triangle
 */
export const HazardTelltale: React.FC<TelltaleProps> = ({ active, title = 'Hazard Warning Flashers' }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
      active
        ? 'bg-rose-950/90 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse'
        : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
    }`}
    title={title}
  >
    <svg viewBox="0 0 32 32" className="w-6 h-6 fill-none" stroke="currentColor">
      <polygon points="16,5 29,27 3,27" strokeWidth="2.2" strokeLinejoin="round" />
      <polygon points="16,11 24,24 8,24" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  </div>
);
