import React, { useState, useEffect } from 'react';
import { useCanStore } from '../../store/canStore';
import { PerceptionObject } from '../../types/can';
import { Radio } from 'lucide-react';
import { ProcessedRadarObject } from './radarConfig';
import { RadarGridRings } from './RadarGridRings';
import { RadarTacticalPane } from './RadarTacticalPane';
import { RadarSvgTarget } from './RadarSvgTarget';

export const RadarView: React.FC = () => {
  const { perceptionObjects, rosStatus } = useCanStore();
  const [rangeM, setRangeM] = useState<number>(25);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sweepAngle, setSweepAngle] = useState<number>(0);

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

  const objects: ProcessedRadarObject[] = [...rawObjects]
    .map((obj) => {
      const lat = obj.x;
      const lon = -obj.z;
      const dist = Math.hypot(lat, lon);
      const bearingRad = Math.atan2(lat, lon);
      let bearingDeg = Math.round((bearingRad * 180) / Math.PI);
      if (bearingDeg < 0) bearingDeg += 360;

      const lbl = String(obj.label);
      const isCone =
        lbl === 'CONE' ||
        ((lbl === 'UNKNOWN' || lbl === 'BOX' || lbl === 'CLUSTER') &&
          Math.max(obj.dx || 0, obj.dy || 0, obj.dz || 0) <= 0.85);

      const resolvedLabel = isCone
        ? 'CONE'
        : (lbl === 'UNKNOWN' || lbl === 'BOX' || lbl === 'CLUSTER' ? 'CLUSTER' : lbl);

      return { ...obj, lat, lon, dist, bearingDeg, resolvedLabel };
    })
    .sort((a, b) => a.dist - b.dist);

  const nearestThreat = objects.length > 0 ? objects[0] : null;

  const SVG_SIZE = 640;
  const CENTER = SVG_SIZE / 2;
  const RADIUS = CENTER - 32;
  const scale = RADIUS / rangeM;

  return (
    <div className="flex-1 flex min-h-0 w-full h-full bg-[#030712] text-neutral-100 select-none overflow-hidden font-sans">
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
          <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="max-h-full max-w-full aspect-square drop-shadow-2xl">
            <defs>
              <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#022c22" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#064e3b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
              </radialGradient>
              <linearGradient id="sweepGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.45" />
              </linearGradient>
              <filter id="targetGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#radarBg)" stroke="#065f46" strokeWidth={1.5} />

            <RadarGridRings
              center={CENTER}
              radius={RADIUS}
              rangeM={rangeM}
              sweepAngle={sweepAngle}
            />

            {objects.map((obj, idx) => {
              const targetKey = String(obj.id ?? idx);
              const isSelected = selectedId === targetKey;
              return (
                <RadarSvgTarget
                  key={targetKey}
                  obj={obj}
                  scale={scale}
                  center={CENTER}
                  radius={RADIUS}
                  isSelected={isSelected}
                  onSelect={() => setSelectedId(isSelected ? null : targetKey)}
                />
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

      <RadarTacticalPane
        objects={objects}
        nearestThreat={nearestThreat}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        rangeM={rangeM}
        rosStatus={rosStatus}
      />
    </div>
  );
};
