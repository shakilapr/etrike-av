import React, { useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { TelemetrySidebar } from './components/TelemetrySidebar';
import { CanDirectoryTable } from './components/CanDirectoryTable';
import { BitMatrix64 } from './components/BitMatrix64';
import { SignalRoster } from './components/SignalRoster';
import { useCanStore } from './store/canStore';

export const App: React.FC = () => {
  const { initWebSocket, setCatalog, togglePause } = useCanStore();

  // Load catalog metadata on mount and start websocket stream
  useEffect(() => {
    // 1. Fetch initial contract catalog from REST API
    const isDev = window.location.port === '5173';
    const apiBase = isDev ? 'http://127.0.0.1:8000' : '';

    fetch(`${apiBase}/api/v1/catalog`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.messages) {
          setCatalog(data.messages, data.source || 'YAML Contracts');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch CAN catalog:', err);
      });

    // 2. Initialize WebSocket stream
    initWebSocket();

    // 3. Global hotkeys (Space to pause/freeze stream)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initWebSocket, setCatalog, togglePause]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none antialiased">
      {/* Topbar */}
      <Topbar />

      {/* Main Cockpit Layout: 3 Panes */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Pane: Gauges & ISO 2575 Telltales */}
        <TelemetrySidebar />

        {/* Center Pane: Virtualized CAN Directory Table */}
        <CanDirectoryTable />

        {/* Right Pane: 64-bit Payload Matrix & Signal Roster */}
        <div className="w-[520px] flex flex-col min-h-0 border-l border-slate-800 shrink-0 bg-slate-950">
          <BitMatrix64 />
          <SignalRoster />
        </div>
      </div>
    </div>
  );
};
