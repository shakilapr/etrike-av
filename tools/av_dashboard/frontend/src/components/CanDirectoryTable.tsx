import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCanStore } from '../store/canStore';
import { MessageDef } from '../types/can';
import { CanDirectoryRow } from './can/CanDirectoryRow';

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
      if (filterBus !== 'all') {
        const hasBus = Array.isArray(msg.buses)
          ? msg.buses.some((b) => b.toLowerCase() === filterBus)
          : msg.bus.toLowerCase().includes(filterBus);
        if (!hasBus) {
          return false;
        }
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
      return <span className="text-[8px] text-neutral-600 ml-1">⇅</span>;
    }
    return (
      <span className="text-[9px] text-cyan-400 font-bold ml-1">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-black border-r border-neutral-800 h-full overflow-hidden">
      {/* Directory Table Header */}
      <div className="h-8 bg-[#0a0a0a] border-b border-neutral-800 px-3 flex items-center text-[10px] font-mono font-bold uppercase text-neutral-400 select-none shrink-0 tracking-wider">
        <div
          onClick={() => handleHeaderClick('access')}
          className="w-12 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors"
          title="Sort by Access (TX/RX)"
        >
          <span>ACC</span>
          {renderSortIndicator('access')}
        </div>
        <div
          onClick={() => handleHeaderClick('id')}
          className="w-20 shrink-0 cursor-pointer hover:text-cyan-300 flex items-center transition-colors"
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
          className="w-14 shrink-0 text-center cursor-pointer hover:text-cyan-300 flex items-center justify-center transition-colors"
          title="Sort by CAN Bus"
        >
          <span>BUS</span>
          {renderSortIndicator('bus')}
        </div>
        <div
          onClick={() => handleHeaderClick('cycle_ms')}
          className="w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors"
          title="Sort by Cycle Time (ms)"
        >
          <span>CYC</span>
          {renderSortIndicator('cycle_ms')}
        </div>
        <div
          onClick={() => handleHeaderClick('rate')}
          className="w-14 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors"
          title="Sort by Live Frequency (Hz)"
        >
          <span>RATE</span>
          {renderSortIndicator('rate')}
        </div>
        <div
          onClick={() => handleHeaderClick('count')}
          className="w-16 shrink-0 text-right cursor-pointer hover:text-cyan-300 flex items-center justify-end transition-colors"
          title="Sort by Total Frame Count"
        >
          <span>COUNT</span>
          {renderSortIndicator('count')}
        </div>
        <div className="w-52 shrink-0 pl-3">DATA PAYLOAD (HEX)</div>
      </div>

      {/* Virtualized Rows */}
      <div ref={parentRef} className="flex-1 overflow-y-auto min-h-0 divide-y divide-neutral-900">
        {sortedMessages.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs font-mono text-neutral-500">
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

              return (
                <CanDirectoryRow
                  key={msg.id}
                  msg={msg}
                  frame={frame}
                  isSelected={isSelected}
                  onSelect={() => selectMessage(msg.id)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Directory Footer */}
      <div className="h-6 bg-[#0a0a0a] border-t border-neutral-800 px-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 select-none shrink-0">
        <span>
          Showing <strong className="text-neutral-200">{filteredMessages.length}</strong> of{' '}
          <strong className="text-neutral-200">{catalog.length}</strong> messages
        </span>
        <span className="text-neutral-500">Click a message row to inspect payload matrix</span>
      </div>
    </div>
  );
};
