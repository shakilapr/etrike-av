import React from 'react';
import { useCanStore } from '../store/canStore';
import { Play, Pause, Activity, Wifi, WifiOff, Search, Database, Eye } from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    totalFrames,
    isConnected,
    isPaused,
    contractsSource,
    filterAccess,
    filterBus,
    searchQuery,
    togglePause,
    setFilterAccess,
    setFilterBus,
    setSearchQuery,
    catalog,
    zoomLevel,
    setZoomLevel,
    activeView,
    setActiveView,
  } = useCanStore();

  const contractsDisplay = contractsSource.includes('contracts')
    ? 'contracts/*.yaml'
    : contractsSource;

  return (
    <header className="h-12 bg-black border-b border-neutral-800 px-4 flex items-center justify-between select-none shrink-0 z-20">
      {/* Title & View Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-baseline gap-2 shrink-0 whitespace-nowrap">
          <span className="text-base font-black tracking-tight text-white font-mono lowercase">seer</span>
          <span className="text-[11px] text-neutral-400 font-mono font-medium lowercase whitespace-nowrap">e-trike av</span>
        </div>

        <div className="h-4 w-px bg-neutral-800 mx-1" />

        {/* View Switcher: CAN MONITOR vs 3D COCKPIT */}
        <div className="flex bg-[#0a0a0a] border border-neutral-800 rounded p-0.5 text-[10px] font-mono shrink-0">
          <button
            onClick={() => setActiveView('monitor')}
            className={`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${
              activeView === 'monitor'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="CAN Bus Engineering Directory & Bit Matrix (Tab)"
          >
            <Database className="w-3 h-3" />
            <span>CAN MONITOR</span>
          </button>
          <button
            onClick={() => setActiveView('cockpit')}
            className={`px-2.5 py-1 rounded transition-all font-bold uppercase flex items-center gap-1.5 ${
              activeView === 'cockpit'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="3D Autonomous Driving Cockpit (Tab)"
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>3D COCKPIT</span>
          </button>
        </div>

        <div className="h-4 w-px bg-neutral-800 mx-1" />

        {/* Database & Contracts info badge with tooltip */}
        <div
          className="hidden lg:flex items-center gap-2 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800"
          title={`Full Contracts Source: ${contractsSource}`}
        >
          <Database className="w-3 h-3 text-cyan-400" />
          <span className="text-neutral-400">source:</span>
          <span className="text-neutral-200 font-medium">{contractsDisplay}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-emerald-400 font-bold">{catalog.length}</span>
          <span className="text-neutral-400">ids</span>
        </div>
      </div>

      {/* Center Controls: Search & Filters (Only when in CAN Monitor view) */}
      {activeView === 'monitor' ? (
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-52 xl:w-72">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID (0x121) or Name..."
              className="w-full h-7 pl-8 pr-3 text-xs bg-[#0a0a0a] text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Access Filter (ALL / RX / TX) */}
          <div className="flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono">
            {(['all', 'rx', 'tx'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterAccess(mode)}
                className={`px-2 py-0.5 rounded transition-all font-semibold uppercase ${
                  filterAccess === mode
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Bus Filter (ALL / HIGH / LOW) */}
          <div className="flex rounded bg-[#0a0a0a] p-0.5 border border-neutral-800 text-[10px] font-mono">
            {(['all', 'high', 'low'] as const).map((bus) => (
              <button
                key={bus}
                onClick={() => setFilterBus(bus)}
                className={`px-2 py-0.5 rounded transition-all font-semibold uppercase ${
                  filterBus === bus
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {bus}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40 font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            AUTOWARE 3D DIGITAL TWIN
          </span>
        </div>
      )}

      {/* Right Controls: Stream Stats & Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Pause/Resume Button */}
        <button
          onClick={togglePause}
          className={`h-7 px-2.5 rounded flex items-center gap-1.5 text-[11px] font-mono font-semibold transition-all ${
            isPaused
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
              : 'bg-[#0a0a0a] hover:bg-neutral-900 text-neutral-300 border border-neutral-800'
          }`}
          title="Pause or resume live UI updates (Spacebar)"
        >
          {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
          <span>{isPaused ? 'RESUME' : 'FREEZE'}</span>
        </button>

        {/* Zoom Controls (Ctrl + / Ctrl -) */}
        <div
          className="flex items-center rounded bg-[#0a0a0a] border border-neutral-800 text-[10px] font-mono p-0.5"
          title="UI Scale Zoom (Ctrl+ / Ctrl- / Ctrl+0)"
        >
          <button
            onClick={() => setZoomLevel((z) => z - 0.1)}
            className="w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold"
            title="Zoom Out (Ctrl -)"
          >
            –
          </button>
          <button
            onClick={() => setZoomLevel(1.0)}
            className="px-1.5 h-5 flex items-center justify-center rounded text-neutral-300 hover:text-cyan-300 text-[10px] font-bold transition-colors"
            title="Reset Zoom to 100% (Ctrl 0)"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={() => setZoomLevel((z) => z + 0.1)}
            className="w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors font-bold"
            title="Zoom In (Ctrl +)"
          >
            +
          </button>
        </div>

        {/* Frame Counter */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono bg-[#0a0a0a] px-2.5 py-1 rounded border border-neutral-800">
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span className="text-neutral-400">frames:</span>
          <span className="text-neutral-100 font-bold tabular-nums">
            {totalFrames.toLocaleString()}
          </span>
        </div>

        {/* Connection Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono font-bold border ${
            isConnected
              ? 'bg-[#0a0a0a] text-emerald-400 border-neutral-800'
              : 'bg-rose-950/40 text-rose-400 border-rose-800/60'
          }`}
        >
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>LIVE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-rose-400" />
              <span>DISCONNECTED</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
