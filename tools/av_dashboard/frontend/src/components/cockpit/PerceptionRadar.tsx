import React from 'react';
import { useCanStore } from '../../store/canStore';
import { PerceptionObject } from '../../types/can';

const RANGE_M = 40; // radar half-extent in meters
const VIEW = 200; // SVG viewport size (px)
const CENTER = VIEW / 2;
const SCALE = CENTER / RANGE_M;

// Class -> letter glyph so status is never communicated by color alone.
const CLASS_GLYPH: Record<string, string> = {
  CAR: 'C',
  TRUCK: 'T',
  BUS: 'B',
  MOTORCYCLE: 'M',
  BICYCLE: 'b',
  PEDESTRIAN: 'P',
  BOX: 'X',
  CLUSTER: 'L',
  OBSTACLE: 'O',
  UNKNOWN: '?',
};

const CLASS_COLOR: Record<string, string> = {
  CAR: '#38bdf8',
  TRUCK: '#60a5fa',
  BUS: '#818cf8',
  MOTORCYCLE: '#34d399',
  BICYCLE: '#34d399',
  PEDESTRIAN: '#f59e0b',
  BOX: '#d97706',
  CLUSTER: '#06b6d4',
  OBSTACLE: '#06b6d4',
  UNKNOWN: '#06b6d4',
};

export const PerceptionRadar: React.FC = () => {
  const perceptionObjects = useCanStore((s) => s.perceptionObjects);
  const rosStatus = useCanStore((s) => s.rosStatus);

  const poseOk = rosStatus.pose_ok !== false;
  const objects: PerceptionObject[] = poseOk ? perceptionObjects : [];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-[200px] h-[200px] bg-[#050505]/90 border border-neutral-800/90 rounded-2xl shadow-2xl overflow-hidden">
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="w-full h-full">
          {/* Range rings */}
          {[10, 20, 30, 40].map((r) => (
            <circle
              key={r}
              cx={CENTER}
              cy={CENTER}
              r={r * SCALE}
              fill="none"
              stroke="#1f2937"
              strokeWidth={1}
            />
          ))}
          {/* Crosshair axes */}
          <line x1={CENTER} y1={4} x2={CENTER} y2={VIEW - 4} stroke="#1f2937" strokeWidth={1} />
          <line x1={4} y1={CENTER} x2={VIEW - 4} y2={CENTER} stroke="#1f2937" strokeWidth={1} />

          {/* Ego vehicle marker (always centered, forward = up) */}
          <polygon
            points={`${CENTER},${CENTER - 8} ${CENTER - 5},${CENTER + 4} ${CENTER + 5},${CENTER + 4}`}
            fill="#06b6d4"
          />
          <text x={CENTER} y={CENTER + 18} fill="#155e75" fontSize={9} textAnchor="middle" fontFamily="monospace">
            EGO
          </text>

          {/* Perception objects */}
          {objects.map((obj, i) => {
            if (Math.abs(obj.z) > RANGE_M + 10 || Math.abs(obj.x) > RANGE_M + 10) return null;
            const px = CENTER + obj.x * SCALE;
            const py = CENTER + obj.z * SCALE;
            if (px < 6 || px > VIEW - 6 || py < 6 || py > VIEW - 6) return null;
            const resolvedLabel = (obj.label === 'UNKNOWN' || (obj.label as string) === 'BOX') ? 'CLUSTER' : obj.label;
            const color = CLASS_COLOR[resolvedLabel] ?? CLASS_COLOR.UNKNOWN;
            const glyph = CLASS_GLYPH[resolvedLabel] ?? '?';
            const isPed = resolvedLabel === 'PEDESTRIAN';
            return (
              <g key={`${obj.id}-${i}`}>
                <circle
                  cx={px}
                  cy={py}
                  r={isPed ? 8 : 7}
                  fill={color}
                  fillOpacity={0.22}
                  stroke={color}
                  strokeWidth={isPed ? 2 : 1.5}
                />
                <text
                  x={px}
                  y={py + 3.5}
                  fill={color}
                  fontSize={9}
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {glyph}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Range label */}
        <span className="absolute top-1 left-2 text-[9px] font-mono text-neutral-500">
          {RANGE_M}m
        </span>
        <span className="absolute top-1 right-2 text-[9px] font-mono text-neutral-500">FWD</span>
      </div>

      {/* Legend (glyph + name) */}
      <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-neutral-400">
        <span className="flex items-center gap-1">
          <span style={{ color: CLASS_COLOR.PEDESTRIAN }}>P</span> PED
        </span>
        <span className="flex items-center gap-1">
          <span style={{ color: CLASS_COLOR.CAR }}>C</span> CAR
        </span>
        <span className="flex items-center gap-1">
          <span style={{ color: CLASS_COLOR.TRUCK }}>T</span> TRUCK
        </span>
        <span className="flex items-center gap-1">
          <span style={{ color: CLASS_COLOR.BICYCLE }}>b</span> BIKE
        </span>
      </div>
    </div>
  );
};
