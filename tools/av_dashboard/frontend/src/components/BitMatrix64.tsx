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
  const dlc = selectedMsg?.dlc ?? 8;

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
        let owner: string | null = null;
        let color: string | null = null;
        for (const sig of signals) {
          const bitIndex = byte * 8 + bit;
          const sigStart = sig.byte * 8 + sig.bit;
          const sigEnd = sigStart + sig.bits;
          if (bitIndex >= sigStart && bitIndex < sigEnd) {
            owner = sig.name;
            color = sig.color;
            break;
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

  // Parse raw bytes cleanly
  let rawHexList: string[] = [];
  if (currentFrame && currentFrame.data_hex) {
    if (currentFrame.data_hex.includes(' ')) {
      rawHexList = currentFrame.data_hex.trim().split(/\s+/);
    } else {
      rawHexList = currentFrame.data_hex.match(/.{1,2}/g) || [];
    }
  }

  return (
    <div className="bg-black border-b border-neutral-800 p-3 select-none shrink-0">
      {/* Selected Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-cyan-400 font-mono tracking-wide">
            {selectedMsg?.id_hex || '0x000'}
          </span>
          <span className="text-sm font-bold text-neutral-100 font-mono">
            {selectedMsg?.key || 'SELECT A MESSAGE'}
          </span>
          {selectedMsg && (
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                selectedMsg.access === 'RX'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {selectedMsg.access}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-300">
          <div>
            Rate:{' '}
            <span className="text-emerald-400 font-bold tabular-nums">
              {currentFrame?.rate_hz ? `${currentFrame.rate_hz.toFixed(1)} Hz` : '0.0 Hz'}
            </span>
          </div>
          <div className="text-neutral-700">|</div>
          <div>
            DLC: <span className="text-neutral-100 font-bold">{dlc}</span>
          </div>
          <div className="text-neutral-700">|</div>
          <div>
            Count:{' '}
            <span className="text-neutral-100 font-bold tabular-nums">
              {currentFrame?.count.toLocaleString() || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Bit Matrix Title & Orientation Guide */}
      <div className="flex items-center justify-between mt-2.5 mb-1.5 text-[10px] font-mono">
        <div className="font-bold text-neutral-300 tracking-wider">64-BIT PAYLOAD MATRIX (8 BYTES &times; 8 BITS)</div>
        <div className="flex items-center gap-1.5 text-neutral-500 font-semibold">
          <span>&larr; MSB (Bit 7)</span>
          <span>&bull;</span>
          <span>LSB (Bit 0) &rarr;</span>
        </div>
      </div>

      {/* 8x8 Grid */}
      <div className="bg-[#080808] p-2.5 rounded-lg border border-neutral-800">
        {/* Column Headers: Bit 7 down to Bit 0 */}
        <div className="grid grid-cols-[68px_repeat(8,1fr)] gap-1 mb-1 text-center font-mono text-[10px] text-neutral-500 font-bold">
          <div className="text-left text-neutral-500 pl-1">BYTE</div>
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
            const rawByteHex = (rawHexList[byteIdx] || '00').padStart(2, '0').toUpperCase();
            const isBeyondDlc = byteIdx >= dlc;

            return (
              <div
                key={byteIdx}
                className={`grid grid-cols-[68px_repeat(8,1fr)] gap-1 items-center font-mono transition-opacity ${
                  isBeyondDlc ? 'opacity-35' : 'opacity-100'
                }`}
              >
                {/* Byte Label & Hex Value */}
                <div
                  className={`flex items-center justify-between text-[10px] px-1.5 py-1 rounded border font-semibold ${
                    isBeyondDlc
                      ? 'bg-neutral-950 text-neutral-600 border-neutral-900'
                      : 'bg-[#0f0f0f] text-neutral-300 border-neutral-800'
                  }`}
                  title={isBeyondDlc ? `Byte ${byteIdx} is beyond DLC ${dlc} (Padding)` : `Byte ${byteIdx}: 0x${rawByteHex}`}
                >
                  <span className="text-neutral-500 text-[9px] font-mono">B{byteIdx}</span>
                  <span className="text-cyan-300 font-bold text-[11px] font-mono">{rawByteHex}</span>
                </div>

                {/* 8 Bits */}
                {rowCells.map((cell) => {
                  const isHovered = !isBeyondDlc && !!hoveredSignal && cell.owner === hoveredSignal;
                  const hasOwner = !!cell.owner && !isBeyondDlc;
                  const cellColor = cell.color || '#262626';

                  return (
                    <div
                      key={cell.bit}
                      onMouseEnter={() => !isBeyondDlc && cell.owner && setHoveredSignal(cell.owner)}
                      onMouseLeave={() => setHoveredSignal(null)}
                      style={{
                        backgroundColor: isHovered
                          ? `${cellColor}ee`
                          : hasOwner
                          ? `${cellColor}40`
                          : '#0c0c0c',
                        borderColor: isHovered
                          ? '#ffffff'
                          : hasOwner
                          ? `${cellColor}cc`
                          : '#1c1c1c',
                      }}
                      className={`h-7 rounded flex items-center justify-center text-xs font-mono transition-all border cursor-pointer select-none tabular-nums ${
                        cell.val === 1
                          ? 'text-white font-black drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]'
                          : 'text-neutral-400 font-bold'
                      } ${isHovered ? 'scale-110 shadow-lg shadow-cyan-500/30 z-10 ring-2 ring-white' : ''}`}
                      title={
                        isBeyondDlc
                          ? `Byte ${cell.byte}, Bit ${cell.bit} [Beyond DLC ${dlc}]`
                          : cell.owner
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
      <div className="mt-2 h-6 flex items-center justify-between text-[11px] font-mono px-1">
        {hoveredSignal ? (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Highlighted Signal:</span>
            <span className="font-bold text-cyan-300 bg-[#141414] px-2 py-0.5 rounded border border-cyan-800">
              {hoveredSignal}
            </span>
          </div>
        ) : (
          <span className="text-neutral-500">
            Hover any bit or signal below to inspect bit-field mapping
          </span>
        )}
      </div>
    </div>
  );
};
