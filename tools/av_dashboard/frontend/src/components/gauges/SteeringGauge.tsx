import React from 'react';

interface SteeringGaugeProps {
  steerActDeg: number;
  steerCmdDeg: number;
}

export const SteeringGauge: React.FC<SteeringGaugeProps> = ({
  steerActDeg,
  steerCmdDeg,
}) => {
  const maxSteer = 45;
  const steerActClamped = Math.min(Math.max(steerActDeg, -maxSteer), maxSteer);
  const steerCmdClamped = Math.min(Math.max(steerCmdDeg, -maxSteer), maxSteer);
  const steerActAngle = -90 + (steerActClamped / maxSteer) * 45;
  const steerCmdAngle = -90 + (steerCmdClamped / maxSteer) * 45;

  return (
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
            {steerActDeg > 0 ? `+${steerActDeg.toFixed(1)}` : steerActDeg.toFixed(1)}&deg;
          </div>
          <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
            CMD:{' '}
            <span className="text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700">
              {steerCmdDeg.toFixed(1)}&deg;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
