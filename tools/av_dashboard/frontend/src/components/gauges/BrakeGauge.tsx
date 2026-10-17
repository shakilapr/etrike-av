import React from 'react';

interface BrakeGaugeProps {
  brakeActKpa: number;
  brakeCmdKpa: number;
}

export const BrakeGauge: React.FC<BrakeGaugeProps> = ({
  brakeActKpa,
  brakeCmdKpa,
}) => {
  const maxBrake = 5000;
  const brakeActPercent = Math.min(Math.max((brakeActKpa / maxBrake) * 100, 0), 100);
  const brakeCmdPercent = Math.min(Math.max((brakeCmdKpa / maxBrake) * 100, 0), 100);

  return (
    <div className="bg-[#0a0a0a] p-3 rounded-lg border border-neutral-800">
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300 font-semibold mb-2">
        <span>HYDRAULIC BRAKE</span>
        <span className="text-neutral-400">0 - 1500 kPa</span>
      </div>

      <div className="space-y-2">
        {/* Feedback Bar */}
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1 text-neutral-300">
            <span className="text-emerald-400 font-bold">FEEDBACK</span>
            <span className="text-neutral-100 tabular-nums font-bold">{brakeActKpa.toFixed(0)} kPa</span>
          </div>
          <div className="w-full h-2.5 bg-[#141414] rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{ width: `${brakeActPercent}%` }}
            />
          </div>
        </div>

        {/* Command Bar */}
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1 text-neutral-300">
            <span className="text-cyan-400 font-bold">COMMAND</span>
            <span className="text-neutral-200 tabular-nums font-bold">{brakeCmdKpa.toFixed(0)} kPa</span>
          </div>
          <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_6px_rgba(6,182,212,0.4)]"
              style={{ width: `${brakeCmdPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
