import React, { useState, useEffect } from 'react';
import { useCanStore } from '../../store/canStore';
import { PerceptionObject } from '../../types/can';
import {
  Radio,
  ShieldAlert,
  Compass,
  Layers,
  Activity,
  Maximize2,
  Minimize2,
  Crosshair,
  User,
  Car,
  Truck,
  AlertTriangle,
  Zap,
} from 'lucide-react';

const CLASS_CONFIG: Record<
  string,
  { color: string; label: string; icon: React.FC<{ className?: string }> }
> = {
  PEDESTRIAN: { color: '#f59e0b', label: 'PEDESTRIAN', icon: User },
  CAR: { color: '#38bdf8', label: 'VEHICLE', icon: Car },
  TRUCK: { color: '#60a5fa', label: 'TRUCK', icon: Truck },
  BUS: { color: '#818cf8', label: 'BUS', icon: Truck },
  MOTORCYCLE: { color: '#34d399', label: 'MOTO', icon: AlertTriangle },
  BICYCLE: { color: '#34d399', label: 'BIKE', icon: AlertTriangle },
  CONE: { color: '#f97316', label: 'CONE', icon: AlertTriangle },
  BOX: { color: '#fb923c', label: 'OBSTACLE', icon: AlertTriangle },
  UNKNOWN: { color: '#9ca3af', label: 'OBJECT', icon: AlertTriangle },
};

export const RadarView: React.FC = () => {
  const { perceptionObjects, rosStatus, telemetry } = useCanStore();
  const [rangeM, setRangeM] = useState<number>(25);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sweepAngle, setSweepAngle] = useState<number>(0);

  // Smooth rotating radar sweep animation
  useEffect(() => {
    let animId: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setSweepAngle((a) => (a + dt * 140) % 360);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const poseOk = rosStatus.pose_ok !== false;
  const rawObjects: PerceptionObject[] = poseOk ? perceptionObjects : [];

  // Sort objects by distance from vehicle
  const objects = [...rawObjects]
    .filter((obj) => obj.label !== 'UNKNOWN' && (obj.label as string) !== 'BOX')
    .map((obj) => {
      // Three.js coords: x is lateral (right is +), z is longitudinal (forward is -)
      const lat = obj.x;
      const lon = -obj.z; // In vehicle frame, forward is positive
      const dist = Math.hypot(lat, lon);
      const bearingRad = Math.atan2(lat, lon);
      let bearingDeg = Math.round((bearingRad * 180) / Math.PI);
      if (bearingDeg < 0) bearingDeg += 360;

      const isCone =
        (obj.label as string) === 'CONE' ||
        ((obj.label === 'UNKNOWN' || obj.label === 'BOX') &&
          Math.max(obj.dx || 0, obj.dy || 0, obj.dz || 0) <= 0.85);

      const resolvedLabel = isCone ? 'CONE' : obj.label;

      return {
        ...obj,
        lat,
        lon,
        dist,
        bearingDeg,
        resolvedLabel,
      };
    })
    .sort((a, b) => a.dist - b.dist);

  const nearestThreat = objects.length > 0 ? objects[0] : null;

  // SVG Radar Scope Coordinates
  const SVG_SIZE = 640;
  const CENTER = SVG_SIZE / 2;
  const RADIUS = CENTER - 32;
  const scale = RADIUS / rangeM;

  return (
    <div className="flex-1 flex min-h-0 w-full h-full bg-[#030712] text-neutral-100 select-none overflow-hidden font-sans">
      {/* Left / Center: Giant 360° Circular Radar Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative border-r border-neutral-800/80 bg-radial from-neutral-900/40 via-black to-black p-4">
        {/* Radar Header Controls */}
        <div className="flex items-center justify-between shrink-0 mb-2 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white tracking-wide">
                  360° PERCEPTION RADAR
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                  LIVE BENCH MODE
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                1 LiDAR (Hesai XT32M2X) • 1 Camera (Kinect v2) • 3D Clustering & FOV Fusion
              </span>
            </div>
          </div>

          {/* Range Selector Pills */}
          <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-neutral-800 rounded-lg p-1 text-xs font-mono">
            <span className="text-[10px] text-neutral-500 uppercase px-2 font-bold">Range:</span>
            {[15, 25, 40].map((r) => (
              <button
                key={r}
                onClick={() => setRangeM(r)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  rangeM === r
                    ? 'bg-emerald-600 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {r}m
              </button>
            ))}
          </div>
        </div>

        {/* Central Circular Radar Graphic */}
        <div className="flex-1 flex items-center justify-center relative min-h-0">
          <svg
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="max-h-full max-w-full aspect-square drop-shadow-2xl"
          >
            <defs>
              {/* Radar background gradient */}
              <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#022c22" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#064e3b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
              </radialGradient>

              {/* Sweeping radar beam gradient */}
              <linearGradient id="sweepGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.45" />
              </linearGradient>

              {/* Glow filter for targets */}
              <filter id="targetGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Radar Scope Disk */}
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#radarBg)" stroke="#065f46" strokeWidth={1.5} />

            {/* Concentric Range Rings */}
            {[0.25, 0.5, 0.75, 1.0].map((frac) => {
              const ringR = RADIUS * frac;
              const ringDist = (rangeM * frac).toFixed(0);
              return (
                <g key={frac}>
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ringR}
                    fill="none"
                    stroke="#047857"
                    strokeWidth={0.8}
                    strokeDasharray={frac === 1 ? undefined : '3 5'}
                    strokeOpacity={frac === 1 ? 0.7 : 0.35}
                  />
                  {/* Range labels along forward and right axes */}
                  <text
                    x={CENTER + 6}
                    y={CENTER - ringR + 12}
                    fill="#10b981"
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight="bold"
                    opacity={0.8}
                  >
                    {ringDist}m
                  </text>
                  <text
                    x={CENTER + ringR - 22}
                    y={CENTER - 6}
                    fill="#10b981"
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight="bold"
                    opacity={0.6}
                  >
                    {ringDist}m
                  </text>
                </g>
              );
            })}

            {/* 30-Degree Radial Spokes */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const x2 = CENTER + RADIUS * Math.cos(rad);
              const y2 = CENTER + RADIUS * Math.sin(rad);
              const isMajor = deg % 90 === 0;
              return (
                <g key={deg}>
                  <line
                    x1={CENTER}
                    y1={CENTER}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#059669' : '#047857'}
                    strokeWidth={isMajor ? 1.2 : 0.6}
                    strokeOpacity={isMajor ? 0.6 : 0.25}
                  />
                  {/* Compass Angle Text */}
                  <text
                    x={CENTER + (RADIUS + 16) * Math.cos(rad)}
                    y={CENTER + (RADIUS + 16) * Math.sin(rad) + 4}
                    fill={isMajor ? '#34d399' : '#059669'}
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {deg === 0 ? '0° FWD' : deg === 90 ? '90° R' : deg === 180 ? '180°' : deg === 270 ? '270° L' : `${deg}°`}
                  </text>
                </g>
              );
            })}

            {/* Kinect Camera 70° Forward Field of View Arc */}
            <path
              d={`M ${CENTER} ${CENTER} L ${CENTER + RADIUS * Math.sin((35 * Math.PI) / 180)} ${CENTER - RADIUS * Math.cos((35 * Math.PI) / 180)} A ${RADIUS} ${RADIUS} 0 0 0 ${CENTER - RADIUS * Math.sin((35 * Math.PI) / 180)} ${CENTER - RADIUS * Math.cos((35 * Math.PI) / 180)} Z`}
              fill="#06b6d4"
              fillOpacity={0.06}
              stroke="#06b6d4"
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />

            {/* Sweeping Radar Beam */}
            <g transform={`rotate(${sweepAngle} ${CENTER} ${CENTER})`}>
              <path
                d={`M ${CENTER} ${CENTER} L ${CENTER + RADIUS} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER + RADIUS * Math.cos((38 * Math.PI) / 180)} ${CENTER + RADIUS * Math.sin((38 * Math.PI) / 180)} Z`}
                fill="url(#sweepGradient)"
              />
              <line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER + RADIUS}
                y2={CENTER}
                stroke="#6ee7b7"
                strokeWidth={1.8}
                opacity={0.8}
              />
            </g>

            {/* Ego Vehicle Centered Marker (E-Trike) */}
            <g transform={`translate(${CENTER}, ${CENTER})`}>
              {/* Vehicle Body Representation */}
              <rect x={-8} y={-14} width={16} height={28} rx={4} fill="#0284c7" stroke="#38bdf8" strokeWidth={1.5} />
              {/* Front Wheel / Fork */}
              <circle cx={0} cy={-16} r={3} fill="#38bdf8" />
              {/* Heading arrow */}
              <polygon points="0,-24 -5,-16 5,-16" fill="#38bdf8" />
              <text x={0} y={24} fill="#0284c7" fontSize={9} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                EGO E-TRIKE
              </text>
            </g>

            {/* Live Plotted Detected Objects */}
            {objects.map((obj, idx) => {
              // Convert Three.js coords:
              // x = lateral (right is positive), z = longitudinal (forward is negative)
              // In SVG: X is right (CENTER + obj.x * scale), Y is forward (CENTER + obj.z * scale)
              const px = CENTER + obj.x * scale;
              const py = CENTER + obj.z * scale;

              // Bounds check against outer perimeter
              const distFromCenter = Math.hypot(px - CENTER, py - CENTER);
              if (distFromCenter > RADIUS + 10) return null;

              const cfg = CLASS_CONFIG[obj.resolvedLabel] || CLASS_CONFIG.UNKNOWN;
              const isDanger = obj.dist < 2.5;
              const isPed = obj.resolvedLabel === 'PEDESTRIAN';
              const targetKey = String(obj.id ?? idx);
              const isSelected = selectedId === targetKey;

              return (
                <g
                  key={targetKey}
                  className="cursor-pointer transition-all duration-150"
                  onClick={() => setSelectedId(isSelected ? null : targetKey)}
                  filter="url(#targetGlow)"
                >
                  {/* Proximity Warning Ring */}
                  {isDanger && (
                    <circle
                      cx={px}
                      cy={py}
                      r={20}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      className="animate-ping"
                      opacity={0.8}
                    />
                  )}

                  {/* Target Symbol Outer Ring */}
                  <circle
                    cx={px}
                    cy={py}
                    r={isSelected ? 16 : isPed ? 12 : 10}
                    fill={cfg.color}
                    fillOpacity={isSelected ? 0.35 : 0.18}
                    stroke={isSelected ? '#ffffff' : cfg.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />

                  {/* Centered Point Core */}
                  <circle cx={px} cy={py} r={3} fill={isSelected ? '#ffffff' : cfg.color} />

                  {/* Heading Vector (if available) */}
                  {obj.yaw !== undefined && (
                    <line
                      x1={px}
                      y1={py}
                      x2={px + 18 * Math.sin(obj.yaw)}
                      y2={py - 18 * Math.cos(obj.yaw)}
                      stroke={cfg.color}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Distance & Tag Floating Label */}
                  <g transform={`translate(${px + 12}, ${py - 12})`}>
                    <rect
                      x={-2}
                      y={-10}
                      width={52}
                      height={15}
                      rx={3}
                      fill="#09090b"
                      fillOpacity={0.85}
                      stroke={cfg.color}
                      strokeWidth={0.8}
                    />
                    <text
                      x={2}
                      y={1}
                      fill={cfg.color}
                      fontSize={9}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {obj.dist.toFixed(1)}m • {cfg.label.slice(0, 3)}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Overlay Corner Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 font-mono text-[11px] text-neutral-400 bg-black/60 p-2.5 rounded-lg border border-neutral-800 backdrop-blur">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AUTOWARE BENCH RADAR
            </span>
            <span>FRAME: <strong className="text-white">base_link</strong></span>
            <span>RATE: <strong className="text-cyan-400">{rosStatus.hz.toFixed(1)} Hz</strong></span>
            <span>OBJECTS: <strong className="text-white">{objects.length}</strong></span>
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-3 font-mono text-[10px] text-neutral-400 bg-black/60 px-3 py-1.5 rounded-lg border border-neutral-800 backdrop-blur">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Pedestrian
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> Car / Vehicle
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /> Traffic Cone
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" /> Truck / Bus
            </span>
          </div>
        </div>
      </div>

      {/* Right Pane: Tactical Actor Inspection & Threat Roster */}
      <div className="w-[420px] shrink-0 h-full flex flex-col bg-black/95 p-4 overflow-hidden">
        {/* Threat Overview Banner */}
        <div className="mb-4 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Proximity Safety Assessment
            </span>
            <span
              className={`text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase ${
                nearestThreat && nearestThreat.dist < 2.0
                  ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                  : nearestThreat && nearestThreat.dist < 4.5
                  ? 'bg-amber-950 text-amber-400 border border-amber-700'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
              }`}
            >
              {nearestThreat && nearestThreat.dist < 2.0
                ? 'CRITICAL PROXIMITY'
                : nearestThreat && nearestThreat.dist < 4.5
                ? 'CAUTION WATCH'
                : 'SURROUND CLEAR'}
            </span>
          </div>

          {nearestThreat ? (
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="bg-black/60 p-2 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">CLOSEST</span>
                <span className="text-base font-bold text-white">
                  {nearestThreat.dist.toFixed(2)} m
                </span>
              </div>
              <div className="bg-black/60 p-2 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">BEARING</span>
                <span className="text-base font-bold text-cyan-400">
                  {nearestThreat.bearingDeg}°
                </span>
              </div>
              <div className="bg-black/60 p-2 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">TYPE</span>
                <span className="text-base font-bold text-amber-400">
                  {nearestThreat.resolvedLabel}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs font-mono text-neutral-500">
              No obstacles currently within {rangeM}m sensor range.
            </div>
          )}
        </div>

        {/* Live Detected Objects Roster */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            Detected Actors ({objects.length})
          </span>
          <span className="text-[10px] font-mono text-neutral-500">Sorted by proximity</span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1">
          {objects.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-neutral-800 text-neutral-500 font-mono text-xs">
              <Radio className="w-8 h-8 mb-2 opacity-30 text-emerald-500" />
              <span>Awaiting sensor cluster targets...</span>
              <span className="text-[10px] text-neutral-600 mt-1">
                Walk near the stationary E-Trike to see live tracking.
              </span>
            </div>
          ) : (
            objects.map((obj, i) => {
              const cfg = CLASS_CONFIG[obj.resolvedLabel] || CLASS_CONFIG.UNKNOWN;
              const Icon = cfg.icon;
              const targetKey = String(obj.id ?? i);
              const isSelected = selectedId === targetKey;
              const isCrit = obj.dist < 2.5;

              return (
                <div
                  key={targetKey}
                  onClick={() => setSelectedId(isSelected ? null : targetKey)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-neutral-800/90 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : isCrit
                      ? 'bg-red-950/20 border-red-800/60 hover:bg-red-950/40'
                      : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-black"
                        style={{ backgroundColor: cfg.color }}
                      >
                        <Icon className="w-3.5 h-3.5 text-black" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        {cfg.label} #{i + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black ${
                          isCrit ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {obj.dist.toFixed(2)} m
                      </span>
                      <span className="text-[10px] text-neutral-500">{obj.bearingDeg}°</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[10px] text-neutral-400 bg-black/40 p-1.5 rounded">
                    <div>
                      <span className="text-neutral-600 block">X (LAT)</span>
                      <span className="text-neutral-200">
                        {obj.x > 0 ? `+${obj.x.toFixed(2)}` : obj.x.toFixed(2)}m
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block">Z (LON)</span>
                      <span className="text-neutral-200">
                        {obj.lon > 0 ? `+${obj.lon.toFixed(2)}` : obj.lon.toFixed(2)}m
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block">DIM (W×L)</span>
                      <span className="text-neutral-200">
                        {(obj.dy || 0.5).toFixed(1)}×{(obj.dx || 0.5).toFixed(1)}m
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600 block">SPEED</span>
                      <span className="text-neutral-200">{obj.speed_kmh || 0} km/h</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Hardware & Fusion Pipeline Diagnostic Card */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 font-mono text-[11px] space-y-1.5 text-neutral-400">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Sensor Fusion Pipeline
            </span>
            <span className="text-emerald-400 text-[10px] uppercase">ALL NODES OK</span>
          </div>
          <div className="flex items-center justify-between bg-neutral-900/40 px-2 py-1 rounded">
            <span>Hesai XT32M2X LiDAR</span>
            <span className="text-emerald-400 font-bold">10.0 Hz • UDP 2368</span>
          </div>
          <div className="flex items-center justify-between bg-neutral-900/40 px-2 py-1 rounded">
            <span>Kinect v2 Front Camera</span>
            <span className="text-emerald-400 font-bold">ACTIVE • 500396543042</span>
          </div>
          <div className="flex items-center justify-between bg-neutral-900/40 px-2 py-1 rounded">
            <span>Bench 3D Perception</span>
            <span className="text-cyan-400 font-bold">
              {rosStatus.hz.toFixed(1)} Hz • base_link
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
