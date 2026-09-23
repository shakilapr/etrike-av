import React from 'react';

interface TelltaleProps {
  active: boolean;
  className?: string;
  title?: string;
  color?: string; // custom color if needed
}

/**
 * ISO 2575 #01: Parking Brake Telltale ((P))
 * Red circular disc with letter P flanked by curved brake shoe arcs.
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
      {/* Left brake shoe arc */}
      <path d="M 6.5 10.5 A 11 11 0 0 0 6.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Right brake shoe arc */}
      <path d="M 25.5 10.5 A 11 11 0 0 1 25.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Center circle */}
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.0" />
      {/* Letter P */}
      <path d="M 14 11.5 L 17 11.5 C 18.5 11.5 19.5 12.3 19.5 13.8 C 19.5 15.3 18.5 16.1 17 16.1 L 15.6 16.1 L 15.6 20.5 L 14 20.5 Z M 15.6 14.7 L 16.8 14.7 C 17.5 14.7 18 14.4 18 13.8 C 18 13.2 17.5 12.9 16.8 12.9 L 15.6 12.9 Z" />
    </svg>
  </div>
);

/**
 * ISO 2575 #02: Hydraulic Brake System / Malfunction ((!))
 * Red circular disc with exclamation mark flanked by curved brake shoe arcs.
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
      {/* Left brake shoe arc */}
      <path d="M 6.5 10.5 A 11 11 0 0 0 6.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Right brake shoe arc */}
      <path d="M 25.5 10.5 A 11 11 0 0 1 25.5 21.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Center circle */}
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.0" />
      {/* Exclamation mark */}
      <rect x="15" y="11.5" width="2" height="5" rx="0.5" />
      <circle cx="16" cy="19" r="1.1" />
    </svg>
  </div>
);

/**
 * Automotive Auto Brake Hold: (HOLD)
 * Green circle with letter HOLD for automatic hill/standstill hold.
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
 * Authentic electric vehicle drive-ready telltale.
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
 * Amber steering wheel with exclamation mark.
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
        {/* Outer steering rim */}
        <circle cx="16" cy="16" r="10" />
        {/* Hub */}
        <circle cx="16" cy="16" r="2.5" fill="currentColor" />
        {/* Spokes */}
        <line x1="6" y1="16" x2="13.5" y2="16" strokeWidth="2.2" />
        <line x1="26" y1="16" x2="18.5" y2="16" strokeWidth="2.2" />
        <line x1="16" y1="18.5" x2="16" y2="26" strokeWidth="2.2" />
        {/* Exclamation point inside right upper quadrant */}
        {isWarning && (
          <path d="M 23 8 L 23 11 M 23 13 L 23 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};

/**
 * Emergency Stop Telltale: ESTOP
 * Red emergency octagon with center stop slash.
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
      {/* Octagon */}
      <polygon points="10,4 22,4 28,10 28,22 22,28 10,28 4,22 4,10" fill="none" stroke="currentColor" strokeWidth="2.2" />
      {/* E-Stop exclamation / lightning core */}
      <rect x="15" y="9" width="2" height="8" rx="0.5" />
      <circle cx="16" cy="20.5" r="1.3" />
    </svg>
  </div>
);

/**
 * ECU / Actuator Thermal Warning Telltale: TEMP
 * Thermometer with waves for ECU temperatures.
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
        {/* Thermometer stem and bulb */}
        <path d="M 13 8 C 13 6.9 13.9 6 15 6 C 16.1 6 17 6.9 17 8 L 17 18.2 C 18.2 19 19 20.4 19 22 C 19 24.2 17.2 26 15 26 C 12.8 26 11 24.2 11 22 C 11 20.4 11.8 19 13 18.2 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        {/* Mercury fill */}
        <circle cx="15" cy="22" r="2.8" />
        <rect x="14" y="12" width="2" height="7" rx="0.5" />
        {/* Tick marks */}
        <line x1="19" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1.8" />
        <line x1="19" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </div>
  );
};

/**
 * CAN Bus / OBD Controller Telltale: CAN
 * Controller diagnostic symbol indicating bus health and error counters.
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
 * Blue headlamp with horizontal light rays.
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
      {/* D-shaped headlamp lens */}
      <path d="M 18 8 A 8 8 0 0 1 18 24 L 14 24 C 11.8 24 10 22.2 10 20 L 10 12 C 10 9.8 11.8 8 14 8 Z" />
      {/* Horizontal light rays */}
      <line x1="21" y1="10" x2="28" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Hazard Warning Flasher: Double Triangle
 * Red nested triangles flashing with hazard state.
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
      {/* Outer triangle */}
      <polygon points="16,5 29,27 3,27" strokeWidth="2.2" strokeLinejoin="round" />
      {/* Inner triangle */}
      <polygon points="16,11 24,24 8,24" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  </div>
);
