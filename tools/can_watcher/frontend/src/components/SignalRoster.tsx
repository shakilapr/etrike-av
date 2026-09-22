import React from 'react';
import { useCanStore } from '../store/canStore';
import { MessageDef, SignalDef } from '../types/can';

export const SignalRoster: React.FC = () => {
  const {
    catalog,
    selectedCanId,
    framesById,
    hoveredSignal,
    setHoveredSignal,
  } = useCanStore();

  const selectedMsg = catalog.find((m: MessageDef) => m.id === selectedCanId);
  const currentFrame = framesById[selectedCanId];
  const signals = selectedMsg?.signals || [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950/90 overflow-hidden">
      {/* Header */}
      <div className="h-8 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between select-none shrink-0">
        <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">
          DECODED SIGNALS ({signals.length})
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          Bi-Directional Bit Matrix Mapping
        </span>
      </div>

      {/* Signal List Table Header */}
      <div className="h-7 bg-slate-900/40 border-b border-slate-800/80 px-3 flex items-center text-[9px] font-mono font-semibold uppercase text-slate-500 select-none shrink-0">
        <div className="w-4"></div>
        <div className="w-44">SIGNAL NAME</div>
        <div className="w-32 text-right pr-2">PHYSICAL VALUE</div>
        <div className="w-20 text-right pr-2">RAW</div>
        <div className="w-24">BIT RANGE</div>
        <div className="w-16">ENDIAN</div>
        <div className="flex-1">FORMULA / RANGE</div>
      </div>

      {/* Signal Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {signals.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs font-mono text-slate-500">
            No signals mapped for this message key
          </div>
        ) : (
          signals.map((sig: SignalDef) => {
            const isHovered = hoveredSignal === sig.name;
            const liveData = currentFrame?.signals ? currentFrame.signals[sig.name] : null;

            let formattedValue = '—';
            if (liveData && liveData.value !== undefined) {
              if (typeof liveData.value === 'number') {
                formattedValue = Number.isInteger(liveData.value)
                  ? liveData.value.toString()
                  : liveData.value.toFixed(2);
              } else {
                formattedValue = String(liveData.value);
              }
            }

            const rawDisplay = liveData && liveData.raw !== undefined
              ? `0x${liveData.raw.toString(16).toUpperCase()}`
              : '—';

            return (
              <div
                key={sig.name}
                onMouseEnter={() => setHoveredSignal(sig.name)}
                onMouseLeave={() => setHoveredSignal(null)}
                className={`flex items-center px-3 py-1.5 text-xs font-mono transition-colors cursor-default ${
                  isHovered
                    ? 'bg-slate-800/80 text-slate-100'
                    : 'hover:bg-slate-900/50 text-slate-300'
                }`}
              >
                {/* Color Dot */}
                <div className="w-4 flex items-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
                    style={{ backgroundColor: sig.color }}
                  />
                </div>

                {/* Signal Name */}
                <div className="w-44 truncate pr-2 font-medium" title={sig.name}>
                  <span className={isHovered ? 'text-cyan-300 font-bold' : 'text-slate-200'}>
                    {sig.name}
                  </span>
                  {sig.comment && (
                    <span className="block text-[9px] text-slate-500 truncate">
                      {sig.comment}
                    </span>
                  )}
                </div>

                {/* Physical Value + Unit */}
                <div className="w-32 text-right pr-2">
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {formattedValue}
                  </span>
                  {sig.unit && (
                    <span className="ml-1 text-[10px] text-slate-400 font-normal">
                      {sig.unit}
                    </span>
                  )}
                </div>

                {/* Raw Value */}
                <div className="w-20 text-right pr-2 text-slate-400 text-[11px] tabular-nums">
                  {rawDisplay}
                </div>

                {/* Bit Range */}
                <div className="w-24 text-[10px] text-slate-400">
                  <span>
                    B{sig.byte}:b{sig.bit}
                  </span>
                  <span className="text-slate-500 text-[9px] ml-1">
                    ({sig.bits}b)
                  </span>
                </div>

                {/* Endian & Sign */}
                <div className="w-16 text-[9px] text-slate-500 uppercase">
                  {sig.endian === 'big' ? 'BE' : 'LE'}{' '}
                  {sig.signed ? 'S' : 'U'}
                </div>

                {/* Formula & Range */}
                <div className="flex-1 text-[10px] text-slate-400 truncate">
                  <span className="text-slate-500">
                    &times;{sig.scale} + {sig.offset}
                  </span>
                  {sig.min_val !== null && sig.max_val !== null && (
                    <span className="ml-2 text-slate-600 text-[9px]">
                      [{sig.min_val}, {sig.max_val}]
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
