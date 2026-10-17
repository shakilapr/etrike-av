import React from 'react';
import { MessageDef, FrameSnapshot } from '../../types/can';

interface CanDirectoryRowProps {
  msg: MessageDef;
  frame?: FrameSnapshot;
  isSelected: boolean;
  onSelect: () => void;
  style: React.CSSProperties;
}

export const CanDirectoryRow: React.FC<CanDirectoryRowProps> = ({
  msg,
  frame,
  isSelected,
  onSelect,
  style,
}) => {
  let hexBytes: string[] = [];
  if (frame && frame.data_hex) {
    if (frame.data_hex.includes(' ')) {
      hexBytes = frame.data_hex.trim().split(/\s+/);
    } else {
      hexBytes = frame.data_hex.match(/.{1,2}/g) || [];
    }
  }

  // Pad to 8 slots
  const paddedBytes = Array.from({ length: 8 }, (_, i) => {
    if (i < hexBytes.length) {
      return hexBytes[i].padStart(2, '0').toUpperCase();
    }
    return '--';
  });

  return (
    <div
      onClick={onSelect}
      style={style}
      className={`flex items-center px-3 text-xs font-mono cursor-pointer transition-colors border-l-4 ${
        isSelected
          ? 'bg-[#141414] text-white border-l-cyan-400 font-medium'
          : 'hover:bg-[#0f0f0f] text-neutral-300 border-l-transparent'
      }`}
    >
      {/* Access Badge */}
      <div className="w-12 shrink-0 text-center">
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            msg.access === 'RX'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          {msg.access}
        </span>
      </div>

      {/* CAN ID (Hex & Dec) */}
      <div className="w-20 shrink-0 flex flex-col justify-center">
        <span className="font-bold text-neutral-100 tracking-wide">{msg.id_hex}</span>
        <span className="text-[10px] text-neutral-500">#{msg.id}</span>
      </div>

      {/* Message Key & Topology */}
      <div className="flex-1 min-w-[140px] truncate pr-2">
        <div className="truncate font-bold text-neutral-100" title={msg.name}>
          {msg.key}
        </div>
        <div className="text-[10px] text-neutral-500 truncate">
          {msg.sender} &rarr; {msg.receivers?.join(', ') || 'ALL'}
        </div>
      </div>

      {/* Bus */}
      <div className="w-14 shrink-0 text-center">
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
            msg.bus.toLowerCase() === 'high'
              ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60'
              : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
          }`}
        >
          {msg.bus.toUpperCase()}
        </span>
      </div>

      {/* Cycle Time */}
      <div className="w-14 shrink-0 text-right text-neutral-300 text-[11px] tabular-nums font-semibold">
        {msg.cycle_ms ? `${msg.cycle_ms}ms` : '—'}
      </div>

      {/* Live Rate */}
      <div className="w-14 shrink-0 text-right tabular-nums text-[11px]">
        {frame && frame.rate_hz > 0 ? (
          <span className="text-emerald-400 font-bold">
            {frame.rate_hz.toFixed(1)} <span className="text-[9px] text-neutral-500 font-normal">Hz</span>
          </span>
        ) : (
          <span className="text-neutral-600">0.0</span>
        )}
      </div>

      {/* Count */}
      <div className="w-16 shrink-0 text-right tabular-nums text-neutral-400 text-[11px] font-medium">
        {frame ? frame.count.toLocaleString() : '0'}
      </div>

      {/* 8 Hex Bytes */}
      <div className="w-52 shrink-0 pl-3 flex items-center gap-1 font-mono text-[11px]">
        {paddedBytes.map((byte, idx) => (
          <span
            key={idx}
            className={`px-1 py-0.5 rounded text-center min-w-[20px] ${
              byte === '--'
                ? 'text-neutral-700 bg-neutral-950'
                : isSelected
                ? 'text-cyan-200 font-bold bg-cyan-950 border border-cyan-800'
                : 'text-neutral-200 bg-[#121212] font-semibold border border-neutral-800'
            }`}
          >
            {byte}
          </span>
        ))}
      </div>
    </div>
  );
};
