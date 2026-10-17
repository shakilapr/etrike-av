import React from 'react';

interface SpeedometerGaugeProps {
  speedActKmh: number;
  speedCmdKmh: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  speedActKmh,
  speedCmdKmh,
}) => {
  const maxSpeed = 15;
  const speedActClamped = Math.min(Math.max(speedActKmh, 0), maxSpeed);
  const speedCmdClamped = Math.min(Math.max(speedCmdKmh, 0), maxSpeed);
  const speedActAngle = -135 + (speedActClamped / maxSpeed) * 180;
  const speedCmdAngle = -135 + (speedCmdClamped / maxSpeed) * 180;

  return (
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
            {speedActKmh.toFixed(1)}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-2 mt-0.5">
            <span className="font-semibold text-neutral-300">km/h</span>
            <span className="text-neutral-600">|</span>
            <span className="text-cyan-300 font-bold bg-[#141414] px-1.5 py-0.5 rounded border border-neutral-700">
              CMD: {speedCmdKmh.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
