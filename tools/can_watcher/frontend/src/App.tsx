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

    // 3. Global hotkeys (Space to pause, Ctrl +/-/0 to zoom)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to toggle pause
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePause();
        return;
      }

      // Zoom Hotkeys: Ctrl + Plus / Ctrl + Minus / Ctrl + 0
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+' || e.code === 'Equal' || e.code === 'NumpadAdd') {
          e.preventDefault();
          useCanStore.getState().setZoomLevel((z) => z + 0.1);
        } else if (e.key === '-' || e.key === '_' || e.code === 'Minus' || e.code === 'NumpadSubtract') {
          e.preventDefault();
          useCanStore.getState().setZoomLevel((z) => z - 0.1);
        } else if (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0') {
          e.preventDefault();
          useCanStore.getState().setZoomLevel(1.0);
        }
      }
    };

    // 4. Ctrl + MouseWheel Zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        useCanStore.getState().setZoomLevel((z) => z + delta);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [initWebSocket, setCatalog, togglePause]);

  const { zoomLevel, zoomToast, setZoomToast } = useCanStore();

  // Clear zoom toast after 1.5s
  useEffect(() => {
    if (zoomToast) {
      const timer = setTimeout(() => setZoomToast(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [zoomToast, setZoomToast]);

  return (
    <div
      className="flex flex-col h-screen w-screen bg-black text-neutral-100 overflow-hidden font-sans select-none antialiased relative"
      style={{ zoom: zoomLevel } as React.CSSProperties}
    >
      {/* Topbar */}
      <Topbar />

      {/* Main Cockpit Layout: 3 Panes */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Pane: Gauges & ISO 2575 Telltales */}
        <TelemetrySidebar />

        {/* Center Pane: Virtualized CAN Directory Table */}
        <CanDirectoryTable />

        {/* Right Pane: 64-bit Payload Matrix & Signal Roster */}
        <div className="w-[520px] flex flex-col min-h-0 border-l border-neutral-800 shrink-0 bg-black">
          <BitMatrix64 />
          <SignalRoster />
        </div>
      </div>

      {/* Floating Zoom Indicator Toast */}
      {zoomToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0d0d0d] text-cyan-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-neutral-700 shadow-2xl flex items-center gap-2 pointer-events-none backdrop-blur animate-fade-in">
          <span className="font-bold">Scale: {zoomToast}</span>
          <span className="text-[10px] text-neutral-400 font-sans">(Ctrl+0 resets)</span>
        </div>
      )}
    </div>
  );
};
