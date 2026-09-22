import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCanStore } from '../store/canStore';
import { MessageDef } from '../types/can';

export type SortColumn = 'access' | 'id' | 'name' | 'bus' | 'cycle_ms' | 'rate' | 'count';
export type SortDirection = 'asc' | 'desc';

export const CanDirectoryTable: React.FC = () => {
  const {
    catalog,
    framesById,
    selectedCanId,
    selectMessage,
    filterAccess,
    filterBus,
    searchQuery,
  } = useCanStore();

  const parentRef = useRef<HTMLDivElement>(null);
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('id');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');

  const handleHeaderClick = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(col);
      setSortDirection(col === 'rate' || col === 'count' ? 'desc' : 'asc');
    }
  };

  // Filter messages based on search and button filters
  const filteredMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return catalog.filter((msg: MessageDef) => {
      // Access filter
      if (filterAccess !== 'all' && msg.access.toLowerCase() !== filterAccess) {
        return false;
      }
      // Bus filter
      if (filterBus !== 'all' && msg.bus.toLowerCase() !== filterBus) {
        return false;
      }
      // Search query
      if (query) {
        const idHex = msg.id_hex.toLowerCase();
        const idDec = msg.id.toString();
        const key = msg.key.toLowerCase();
        const name = msg.name.toLowerCase();
        if (!idHex.includes(query) && !idDec.includes(query) && !key.includes(query) && !name.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [catalog, filterAccess, filterBus, searchQuery]);

  // Sort messages
  const sortedMessages = useMemo(() => {
    const list = [...filteredMessages];
    const dir = sortDirection === 'asc' ? 1 : -1;

    list.sort((a, b) => {
      switch (sortColumn) {
        case 'id':
          return (a.id - b.id) * dir;
        case 'name':
          return (a.name || a.key).localeCompare(b.name || b.key) * dir;
        case 'access':
          return a.access.localeCompare(b.access) * dir;
        case 'bus':
          return a.bus.localeCompare(b.bus) * dir;
        case 'cycle_ms':
          return (a.cycle_ms - b.cycle_ms) * dir;
        case 'rate': {
          const rA = framesById[a.id]?.rate_hz || 0;
          const rB = framesById[b.id]?.rate_hz || 0;
          return (rA - rB) * dir;
        }
        case 'count': {
          const cA = framesById[a.id]?.count || 0;
          const cB = framesById[b.id]?.count || 0;
          return (cA - cB) * dir;
        }
        default:
          return 0;
      }
    });

    return list;
  }, [filteredMessages, sortColumn, sortDirection, framesById]);

  const rowVirtualizer = useVirtualizer({
    count: sortedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const renderSortIndicator = (col: SortColumn) => {
    if (sortColumn !== col) {
      return <span className="text-[8px] text-slate-600 ml-1">⇅</span>;
    }
    return (
      <span className="text-[9px] text-cyan-400 font-bold ml-1">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-950 border-r border-slate-800 h-full overflow-hidden">
      {/* Directory Table Header */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-slate-300 select-none shrink-0 tracking-wider">
        <div
          onClick={() => handleHeaderClick('access')}
          className="w-12 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors"
          title="Sort by Access (TX/RX)"
        >
          <span>ACC</span>
          {renderSortIndicator('access')}
        </div>
        <div
          onClick={() => handleHeaderClick('id')}
          className="w-20 cursor-pointer hover:text-cyan-300 flex items-center transition-colors"
          title="Sort by CAN Identifier"
        >
          <span>CAN ID</span>
          {renderSortIndicator('id')}
        </div>
        <div
          onClick={() => handleHeaderClick('name')}
          className="flex-1 min-w-[140px] cursor-pointer hover:text-cyan-300 flex items-center transition-colors"
          title="Sort by Message Name"
        >
          <span>MESSAGE NAME</span>
          {renderSortIndicator('name')}
        </div>
        <div
          onClick={() => handleHeaderClick('bus')}
          className="w-14 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors"
          title="Sort by CAN Bus"
        >
          <span>BUS</span>
          {renderSortIndicator('bus')}
        </div>
        <div
          onClick={() => handleHeaderClick('cycle_ms')}
          className="w-14 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors"
          title="Sort by Cycle Time (ms)"
        >
          <span>CYC</span>
          {renderSortIndicator('cycle_ms')}
        </div>
        <div
          onClick={() => handleHeaderClick('rate')}
          className="w-14 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors"
          title="Sort by Live Frequency (Hz)"
        >
          <span>RATE</span>
          {renderSortIndicator('rate')}
        </div>
        <div
          onClick={() => handleHeaderClick('count')}
          className="w-16 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors"
          title="Sort by Total Frame Count"
        >
          <span>COUNT</span>
          {renderSortIndicator('count')}
        </div>
        <div className="w-52 pl-3">DATA PAYLOAD (HEX)</div>
      </div>

      {/* Virtualized Rows */}
      <div ref={parentRef} className="flex-1 overflow-y-auto min-h-0 divide-y divide-slate-800/40">
        {sortedMessages.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs font-mono text-slate-400">
            No CAN messages match the current filter
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const msg = sortedMessages[virtualRow.index];
              const frame = framesById[msg.id];
              const isSelected = msg.id === selectedCanId;

              // Parse payload hex bytes safely with 2-character padding
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
                  key={msg.id}
                  onClick={() => selectMessage(msg.id)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`flex items-center px-3 text-xs font-mono cursor-pointer transition-colors border-l-4 ${
                    isSelected
                      ? 'bg-cyan-950/60 text-slate-100 border-l-cyan-400 font-medium shadow-inner'
                      : 'hover:bg-slate-900/70 text-slate-300 border-l-transparent'
                  }`}
                >
                  {/* Access Badge */}
                  <div className="w-12 text-center">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        msg.access === 'RX'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {msg.access}
                    </span>
                  </div>

                  {/* CAN ID (Hex & Dec) */}
                  <div className="w-20 flex flex-col justify-center">
                    <span className="font-bold text-slate-100 tracking-wide">{msg.id_hex}</span>
                    <span className="text-[10px] text-slate-400">#{msg.id}</span>
                  </div>

                  {/* Message Key & Topology */}
                  <div className="flex-1 min-w-[140px] truncate pr-2">
                    <div className="truncate font-bold text-slate-100" title={msg.name}>
                      {msg.key}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {msg.sender} &rarr; {msg.receivers?.join(', ') || 'ALL'}
                    </div>
                  </div>

                  {/* Bus */}
                  <div className="w-14 text-center">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        msg.bus.toLowerCase() === 'high'
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {msg.bus.toUpperCase()}
                    </span>
                  </div>

                  {/* Cycle Time */}
                  <div className="w-14 text-right text-slate-300 text-[11px] tabular-nums font-semibold">
                    {msg.cycle_ms ? `${msg.cycle_ms}ms` : '—'}
                  </div>

                  {/* Live Rate */}
                  <div className="w-14 text-right tabular-nums text-[11px]">
                    {frame && frame.rate_hz > 0 ? (
                      <span className="text-emerald-400 font-bold">
                        {frame.rate_hz.toFixed(1)} <span className="text-[9px] text-slate-400 font-normal">Hz</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">0.0</span>
                    )}
                  </div>

                  {/* Count */}
                  <div className="w-16 text-right tabular-nums text-slate-300 text-[11px] font-medium">
                    {frame ? frame.count.toLocaleString() : '0'}
                  </div>

                  {/* 8 Hex Bytes */}
                  <div className="w-52 pl-3 flex items-center gap-1 font-mono text-[11px]">
                    {paddedBytes.map((byte, idx) => (
                      <span
                        key={idx}
                        className={`px-1 py-0.5 rounded text-center min-w-[20px] ${
                          byte === '--'
                            ? 'text-slate-600 bg-slate-900/40'
                            : isSelected
                            ? 'text-cyan-200 font-bold bg-cyan-900/60 ring-1 ring-cyan-500/40'
                            : 'text-slate-200 bg-slate-900 font-semibold border border-slate-800'
                        }`}
                      >
                        {byte}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Directory Footer */}
      <div className="h-6 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none shrink-0">
        <span>
          Showing <strong className="text-slate-200">{filteredMessages.length}</strong> of{' '}
          <strong className="text-slate-200">{catalog.length}</strong> messages
        </span>
        <span className="text-slate-400">Click a message row to inspect payload matrix</span>
      </div>
    </div>
  );
};
