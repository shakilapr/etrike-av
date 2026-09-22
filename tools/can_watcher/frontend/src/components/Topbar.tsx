import React from 'react';
import { useCanStore } from '../store/canStore';
import { Play, Pause, Activity, Wifi, WifiOff, Search, Database } from 'lucide-react';

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
  } = useCanStore();

  return (
    <header className="h-14 bg-slate-900/95 border-b border-slate-800 px-4 flex items-center justify-between select-none shrink-0 z-20">
      {/* Title & Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-black text-white text-sm shadow-md shadow-cyan-500/20">
            CB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">CANByte Watcher</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                E-Trike AV
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Live Payload Matrix & Telemetry
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-2" />

        {/* Database & Contracts info */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Source:</span>
          <span className="text-slate-300 font-medium truncate max-w-[220px]" title={contractsSource}>
            {contractsSource}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-semibold">{catalog.length}</span>
          <span className="text-slate-500">IDs</span>
        </div>
      </div>

      {/* Center Controls: Search & Filters */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative w-48 xl:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID (0x121) or Name..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-slate-950 text-slate-200 placeholder-slate-500 border border-slate-800 rounded focus:outline-none focus:border-cyan-500 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              ×
            </button>
          )}
        </div>

        {/* Access Filter (ALL / RX / TX) */}
        <div className="flex rounded bg-slate-950 p-0.5 border border-slate-800 text-[11px] font-mono">
          {(['all', 'rx', 'tx'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterAccess(mode)}
              className={`px-2.5 py-1 rounded transition-all font-semibold uppercase ${
                filterAccess === mode
                  ? mode === 'rx'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : mode === 'tx'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Bus Filter (ALL / HIGH / LOW) */}
        <div className="flex rounded bg-slate-950 p-0.5 border border-slate-800 text-[11px] font-mono">
          {(['all', 'high', 'low'] as const).map((bus) => (
            <button
              key={bus}
              onClick={() => setFilterBus(bus)}
              className={`px-2 py-1 rounded transition-all font-semibold uppercase ${
                filterBus === bus ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {bus}
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls: Stream Stats & Actions */}
      <div className="flex items-center gap-3">
        {/* Pause/Resume Button */}
        <button
          onClick={togglePause}
          className={`h-8 px-3 rounded flex items-center gap-1.5 text-xs font-mono font-medium transition-all ${
            isPaused
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
          title="Pause or resume live UI updates (Space)"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isPaused ? 'RESUME' : 'FREEZE'}</span>
        </button>

        {/* Frame Counter */}
        <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">Frames:</span>
          <span className="text-slate-100 font-bold tabular-nums">
            {totalFrames.toLocaleString()}
          </span>
        </div>

        {/* Connection Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border ${
            isConnected
              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/80'
              : 'bg-rose-950/50 text-rose-400 border-rose-800/80'
          }`}
        >
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span>DISCONNECTED</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
