import React from 'react';
import { useCanStore } from '../store/canStore';
import { MessageDef, SignalDef } from '../types/can';

// Helper to infer unit from naming convention if not explicitly in contract
function inferUnit(sigName: string, definedUnit: string): string {
  if (definedUnit && definedUnit.trim().length > 0) {
    return definedUnit;
  }
  const lower = sigName.toLowerCase();
  if (lower.endsWith('_mmps')) return 'mm/s';
  if (lower.endsWith('_mrad_s')) return 'mrad/s';
  if (lower.endsWith('_kpa')) return 'kPa';
  if (lower.endsWith('_deg')) return 'deg';
  if (lower.endsWith('_kmh')) return 'km/h';
  if (lower.endsWith('_mv')) return 'mV';
  if (lower.endsWith('_ma')) return 'mA';
  if (lower.endsWith('_c')) return '°C';
  if (lower.endsWith('_pct') || lower.endsWith('_percent')) return '%';
  if (lower.endsWith('_count') || lower.endsWith('_counter')) return 'cnt';
  if (lower.startsWith('light_') || lower.endsWith('_ok') || lower.endsWith('_valid') || lower.endsWith('_active')) return 'flag';
  return '';
}

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

  // Keyboard arrow navigation between signals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack keys when user is typing in inputs or search
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
        return;
      }

      if (signals.length === 0) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = signals.findIndex((s) => s.name === hoveredSignal);
        let nextIndex = 0;

        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % signals.length;
        } else if (e.key === 'ArrowUp') {
          nextIndex = currentIndex <= 0 ? signals.length - 1 : currentIndex - 1;
        }

        const nextSig = signals[nextIndex];
        if (nextSig) {
          setHoveredSignal(nextSig.name);
          const el = document.getElementById(`signal-row-${nextSig.name}`);
          if (el) {
            el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      } else if (e.key === 'Escape') {
        setHoveredSignal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [signals, hoveredSignal, setHoveredSignal]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black overflow-hidden">
      {/* Header */}
      <div className="h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase text-neutral-300 tracking-wider">
            DECODED SIGNALS ({signals.length})
          </span>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60 font-medium">
            [↑/↓] Select • [Esc] Clear
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 font-medium">
          Bi-Directional Bit Matrix Mapping
        </span>
      </div>

      {/* Signal List Table Header */}
      <div className="h-7 bg-[#0a0a0a]/90 border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0">
        <div className="w-5"></div>
        <div className="w-40">SIGNAL NAME</div>
        <div className="w-28 text-right pr-2">PHYS VALUE</div>
        <div className="w-16 text-right pr-2">RAW</div>
        <div className="w-24">BIT RANGE</div>
        <div className="w-14">ENDIAN</div>
        <div className="flex-1 pl-1 whitespace-nowrap">SCALE / RANGE</div>
      </div>


      {/* Signal Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-900 bg-black">
        {signals.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-xs font-mono text-neutral-500">
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

            // Proper two's complement hex formatting for negative raw values
            let rawDisplay = '—';
            if (liveData && liveData.raw !== undefined) {
              const rawVal = Number(liveData.raw);
              if (sig.signed && rawVal < 0) {
                const mask = (1 << sig.bits) - 1;
                rawDisplay = `0x${((rawVal & mask) >>> 0).toString(16).toUpperCase()}`;
              } else {
                rawDisplay = `0x${rawVal.toString(16).toUpperCase()}`;
              }
            }

            const unit = inferUnit(sig.name, sig.unit);

            return (
              <div
                key={sig.name}
                id={`signal-row-${sig.name}`}
                onClick={() => setHoveredSignal(isHovered ? null : sig.name)}
                onMouseEnter={() => setHoveredSignal(sig.name)}
                onMouseLeave={() => setHoveredSignal(null)}
                className={`flex items-center px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-[#141414] text-white ring-1 ring-cyan-500/50 border-l-4 border-cyan-400'
                    : 'hover:bg-[#0d0d0d] text-neutral-300 border-l-4 border-transparent'
                }`}
              >
                {/* Color Dot */}
                <div className="w-5 flex items-center">
                  <span
                    className={`w-3 h-3 rounded-full inline-block shrink-0 shadow-sm transition-transform ${
                      isHovered ? 'scale-125 ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: sig.color }}
                  />
                </div>

                {/* Signal Name */}
                <div className="w-40 truncate pr-2 font-medium" title={sig.name}>
                  <span className={isHovered ? 'text-cyan-300 font-bold' : 'text-neutral-200 font-semibold'}>
                    {sig.name}
                  </span>
                  {sig.comment && (
                    <span className="block text-[9px] text-neutral-500 truncate font-normal">
                      {sig.comment}
                    </span>
                  )}
                </div>

                {/* Physical Value + Unit */}
                <div className="w-28 text-right pr-2">
                  <span className="text-emerald-400 font-black tabular-nums text-[13px]">
                    {formattedValue}
                  </span>
                  {unit && (
                    <span className="ml-1 text-[10px] text-neutral-500 font-medium">
                      {unit}
                    </span>
                  )}
                </div>

                {/* Raw Value */}
                <div className="w-16 text-right pr-2 text-neutral-300 text-[11px] tabular-nums font-semibold">
                  {rawDisplay}
                </div>

                {/* Bit Range */}
                <div className="w-24 text-[10px] text-neutral-300">
                  <span className="font-bold">
                    B{sig.byte}:b{sig.bit}
                  </span>
                  <span className="text-neutral-500 text-[9px] ml-1">
                    ({sig.bits}b)
                  </span>
                </div>

                {/* Endian & Sign */}
                <div className="w-14 text-[10px] text-neutral-400 uppercase font-semibold">
                  <span className={sig.endian === 'big' ? 'text-purple-300' : 'text-blue-300'}>
                    {sig.endian === 'big' ? 'BE' : 'LE'}
                  </span>{' '}
                  <span className={sig.signed ? 'text-amber-300' : 'text-emerald-300'}>
                    {sig.signed ? 'S' : 'U'}
                  </span>
                </div>


                {/* Formula & Range */}
                <div className="flex-1 text-[10px] text-neutral-300 truncate pl-1">
                  {sig.scale === 1 && sig.offset === 0 ? (
                    <span className="text-neutral-500">1:1</span>
                  ) : (
                    <span className="text-neutral-300">
                      &times;{sig.scale} + {sig.offset}
                    </span>
                  )}
                  {sig.min_val !== null && sig.max_val !== null && (
                    <span className="ml-2 text-neutral-500 text-[9px]">
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
