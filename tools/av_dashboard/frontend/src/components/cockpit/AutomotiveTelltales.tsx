import React from 'react';
import {
  EcuTempTelltale,
  CanBusTelltale,
  HighBeamTelltale,
  HazardTelltale,
  TelltaleProps,
} from './AdvancedTelltales';

export { EcuTempTelltale, CanBusTelltale, HighBeamTelltale, HazardTelltale };
export type { TelltaleProps };

/**
 * ISO 2575 #01: Parking Brake Telltale ((P))
 */
export const ParkTelltale: React.FC<TelltaleProps> = ({ active, title = 'Parking Brake Active' }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
      active
        ? 'bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)]'
        : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
    }`}
    title={title}
  >
    <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
      <path d="M 6.5 10.5 A 11 11 0 0 0 6.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 25.5 10.5 A 11 11 0 0 1 25.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.0" />
      <path d="M 14 11.5 L 17 11.5 C 18.5 11.5 19.5 12.3 19.5 13.8 C 19.5 15.3 18.5 16.1 17 16.1 L 15.6 16.1 L 15.6 20.5 L 14 20.5 Z M 15.6 14.7 L 16.8 14.7 C 17.5 14.7 18 14.4 18 13.8 C 18 13.2 17.5 12.9 16.8 12.9 L 15.6 12.9 Z" />
    </svg>
  </div>
);

/**
 * ISO 2575 #02: Hydraulic Brake System / Malfunction ((!))
 */
export const BrakeTelltale: React.FC<TelltaleProps> = ({ active, title = 'Brake System Active' }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
      active
        ? 'bg-rose-950/80 border-rose-500 text-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.8)]'
        : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
    }`}
    title={title}
  >
    <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
      <path d="M 6.5 10.5 A 11 11 0 0 0 6.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 25.5 10.5 A 11 11 0 0 1 25.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.0" />
      <rect x="15" y="11.5" width="2" height="5" rx="0.5" />
      <circle cx="16" cy="19" r="1.1" />
    </svg>
  </div>
);

/**
 * Automotive Auto Brake Hold: (HOLD)
 */
export const HoldTelltale: React.FC<TelltaleProps> = ({ active, title = 'Brake Hold Active' }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
      active
        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]'
        : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
    }`}
    title={title}
  >
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-black tracking-tight leading-none">HOLD</span>
    </div>
  </div>
);

/**
 * EV Propulsion Ready: READY
 */
export const ReadyTelltale: React.FC<TelltaleProps> = ({ active, title = 'Electric Propulsion Ready' }) => (
  <div
    className={`px-2.5 h-9 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 border ${
      active
        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]'
        : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
    }`}
    title={title}
  >
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-700'}`} />
    <span className="text-[11px] font-black tracking-wider leading-none">READY</span>
  </div>
);

/**
 * ISO 2575 #28: Electric Power Steering (EPS) / Steering Fault
 */
export const EpsTelltale: React.FC<TelltaleProps & { fault?: boolean }> = ({
  active,
  fault = false,
  title = 'Electric Power Steering System',
}) => {
  const isWarning = active || fault;
  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
        isWarning
          ? 'bg-amber-950/80 border-amber-500 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.8)] animate-pulse'
          : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
      }`}
      title={title}
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.0">
        <circle cx="16" cy="16" r="10" />
        <circle cx="16" cy="16" r="2.5" fill="currentColor" />
        <line x1="6" y1="16" x2="13.5" y2="16" strokeWidth="2.2" />
        <line x1="26" y1="16" x2="18.5" y2="16" strokeWidth="2.2" />
        <line x1="16" y1="18.5" x2="16" y2="26" strokeWidth="2.2" />
        {isWarning && (
          <path d="M 23 8 L 23 11 M 23 13 L 23 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};

/**
 * Emergency Stop Telltale: ESTOP
 */
export const EstopTelltale: React.FC<TelltaleProps> = ({ active, title = 'Emergency Stop Active' }) => (
  <div
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 border ${
      active
        ? 'bg-rose-950/90 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.9)] animate-pulse'
        : 'bg-neutral-950/50 border-neutral-900 text-neutral-800'
    }`}
    title={title}
  >
    <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
      <polygon points="10,4 22,4 28,10 28,22 22,28 10,28 4,22 4,10" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <rect x="15" y="9" width="2" height="8" rx="0.5" />
      <circle cx="16" cy="20.5" r="1.3" />
    </svg>
  </div>
);
