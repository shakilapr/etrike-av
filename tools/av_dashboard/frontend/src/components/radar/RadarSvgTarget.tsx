import React from 'react';
import { CLASS_CONFIG, ProcessedRadarObject } from './radarConfig';

interface RadarSvgTargetProps {
  obj: ProcessedRadarObject;
  scale: number;
  center: number;
  radius: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const RadarSvgTarget: React.FC<RadarSvgTargetProps> = ({
  obj,
  scale,
  center,
  radius,
  isSelected,
  onSelect,
}) => {
  const px = center + obj.x * scale;
  const py = center + obj.z * scale;
  const distFromCenter = Math.hypot(px - center, py - center);
  if (distFromCenter > radius + 10) return null;

  const cfg = CLASS_CONFIG[obj.resolvedLabel] || CLASS_CONFIG.UNKNOWN;
  const isDanger = obj.dist < 2.5;
  const isPed = obj.resolvedLabel === 'PEDESTRIAN';

  return (
    <g
      className="cursor-pointer transition-all duration-150"
      onClick={onSelect}
      filter="url(#targetGlow)"
    >
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
      <circle
        cx={px}
        cy={py}
        r={isSelected ? 16 : isPed ? 12 : 10}
        fill={cfg.color}
        fillOpacity={isSelected ? 0.35 : 0.18}
        stroke={isSelected ? '#ffffff' : cfg.color}
        strokeWidth={isSelected ? 2.5 : 1.5}
      />
      <circle cx={px} cy={py} r={3} fill={isSelected ? '#ffffff' : cfg.color} />
      {obj.yaw !== undefined && (
        <line
          x1={px}
          y1={py}
          x2={px - 18 * Math.sin(obj.yaw)}
          y2={py - 18 * Math.cos(obj.yaw)}
          stroke={cfg.color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )}
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
};
