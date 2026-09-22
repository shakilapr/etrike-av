import React from 'react';
import { useCanStore } from '../store/canStore';
import { MessageDef, BitCell } from '../types/can';

export const BitMatrix64: React.FC = () => {
  const {
    catalog,
    selectedCanId,
    framesById,
    hoveredSignal,
    setHoveredSignal,
  } = useCanStore();

  const selectedMsg = catalog.find((m: MessageDef) => m.id === selectedCanId);
  const currentFrame = framesById[selectedCanId];

  // Organize bit cells into 8 rows (Byte 0 to Byte 7), each row having 8 bits (Bit 7 down to Bit 0)
  const bitCellsByByte: BitCell[][] = Array.from({ length: 8 }, () => []);

  if (currentFrame && currentFrame.bit_cells && currentFrame.bit_cells.length === 64) {
    for (const cell of currentFrame.bit_cells) {
      bitCellsByByte[cell.byte].push(cell);
    }
  } else {
    // Fallback if no frame yet received: fill with 0s and map owners from catalog signals
    const signals = selectedMsg?.signals || [];
    for (let byte = 0; byte < 8; byte++) {
      for (let bit = 0; bit < 8; bit++) {
        // Find owner signal if any
        let owner: string | null = null;
        let color: string | null = null;
        for (const sig of signals) {
          // Check if bit falls in this signal range
          if (sig.endian === 'big') {
            const sigStart = sig.byte * 8 + (7 - sig.bit);
            const sigEnd = sigStart + sig.bits;
            const bitIndex = byte * 8 + (7 - bit);
            if (bitIndex >= sigStart && bitIndex < sigEnd) {
              owner = sig.name;
              color = sig.color;
              break;
            }
          } else {
            const bitIndex = byte * 8 + bit;
            const sigStart = sig.byte * 8 + sig.bit;
            const sigEnd = sigStart + sig.bits;
            if (bitIndex >= sigStart && bitIndex < sigEnd) {
              owner = sig.name;
              color = sig.color;
              break;
            }
          }
        }

        bitCellsByByte[byte].push({
          index: byte * 8 + bit,
          byte,
          bit,
          val: 0,
          owner,
          color,
        });
      }
    }
  }

  // Ensure each byte row is ordered Bit 7 (MSB) to Bit 0 (LSB)
  for (let b = 0; b < 8; b++) {
    bitCellsByByte[b].sort((a, bCell) => bCell.bit - a.bit);
  }

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 p-3 select-none shrink-0">
      {/* Selected Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 font-mono">
            {selectedMsg?.id_hex || '0x000'}
          </span>
          <span className="text-xs font-bold text-slate-100 font-mono">
            {selectedMsg?.key || 'SELECT A MESSAGE'}
          </span>
          {selectedMsg && (
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                selectedMsg.access === 'RX'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}
            >
              {selectedMsg.access}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <div>
            Rate:{' '}
            <span className="text-emerald-400 font-semibold tabular-nums">
              {currentFrame?.rate_hz ? `${currentFrame.rate_hz.toFixed(1)} Hz` : '0.0 Hz'}
            </span>
          </div>
          <div className="text-slate-600">|</div>
          <div>
            DLC: <span className="text-slate-200">{selectedMsg?.dlc ?? 8}</span>
          </div>
          <div className="text-slate-600">|</div>
          <div>
            Count:{' '}
            <span className="text-slate-200 tabular-nums">
              {currentFrame?.count.toLocaleString() || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Bit Matrix Title & Orientation Guide */}
      <div className="flex items-center justify-between mt-2 mb-1 text-[10px] font-mono text-slate-400">
        <div className="font-semibold text-slate-300">64-BIT PAYLOAD MATRIX (8 BYTES × 8 BITS)</div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>&larr; MSB (Bit 7)</span>
          <span>&bull;</span>
          <span>LSB (Bit 0) &rarr;</span>
        </div>
      </div>

      {/* 8x8 Grid */}
      <div className="bg-slate-950 p-2 rounded border border-slate-800">
        {/* Column Headers: Bit 7 down to Bit 0 */}
        <div className="grid grid-cols-[50px_repeat(8,1fr)] gap-1 mb-1 text-center font-mono text-[9px] text-slate-500">
          <div className="text-left text-slate-600 pl-1">BYTE</div>
          <div>b7</div>
          <div>b6</div>
          <div>b5</div>
          <div>b4</div>
          <div>b3</div>
          <div>b2</div>
          <div>b1</div>
          <div>b0</div>
        </div>

        {/* 8 Byte Rows */}
        <div className="space-y-1">
          {bitCellsByByte.map((rowCells, byteIdx) => {
            const rawByteHex = currentFrame?.data_hex
              ? currentFrame.data_hex.substring(byteIdx * 2, byteIdx * 2 + 2)
              : '00';

            return (
              <div
                key={byteIdx}
                className="grid grid-cols-[50px_repeat(8,1fr)] gap-1 items-center font-mono"
              >
                {/* Byte Label & Hex Value */}
                <div className="flex items-center justify-between text-[10px] pl-1 pr-1 bg-slate-900/60 rounded py-0.5 border border-slate-800/80">
                  <span className="text-slate-400 text-[9px]">B{byteIdx}</span>
                  <span className="text-cyan-400 font-bold text-[10px]">{rawByteHex}</span>
                </div>

                {/* 8 Bits */}
                {rowCells.map((cell) => {
                  const isHovered = hoveredSignal && cell.owner === hoveredSignal;
                  const hasOwner = !!cell.owner;
                  const cellColor = cell.color || '#334155';

                  return (
                    <div
                      key={cell.bit}
                      onMouseEnter={() => cell.owner && setHoveredSignal(cell.owner)}
                      onMouseLeave={() => setHoveredSignal(null)}
                      style={{
                        backgroundColor: isHovered
                          ? `${cellColor}dd`
                          : hasOwner
                          ? `${cellColor}33`
                          : '#0f172a',
                        borderColor: isHovered
                          ? '#ffffff'
                          : hasOwner
                          ? `${cellColor}aa`
                          : '#1e293b',
                      }}
                      className={`h-6 rounded flex items-center justify-center text-xs font-bold transition-all border cursor-pointer select-none tabular-nums ${
                        cell.val === 1 ? 'text-slate-100' : 'text-slate-400'
                      } ${isHovered ? 'scale-105 shadow-md shadow-cyan-500/20 z-10' : ''}`}
                      title={
                        cell.owner
                          ? `Byte ${cell.byte}, Bit ${cell.bit} | Signal: ${cell.owner} | Val: ${cell.val}`
                          : `Byte ${cell.byte}, Bit ${cell.bit} | Unmapped | Val: ${cell.val}`
                      }
                    >
                      {cell.val}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Signal Hover Status Bar */}
      <div className="mt-2 h-5 flex items-center justify-between text-[10px] font-mono px-1">
        {hoveredSignal ? (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Highlighted Signal:</span>
            <span className="font-bold text-cyan-400">{hoveredSignal}</span>
          </div>
        ) : (
          <span className="text-slate-500">
            Hover any bit or signal below to trace owner bit-fields
          </span>
        )}
      </div>
    </div>
  );
};
