import React from 'react';

interface RadarGridRingsProps {
  center: number;
  radius: number;
  rangeM: number;
  sweepAngle: number;
}

export const RadarGridRings: React.FC<RadarGridRingsProps> = ({
  center,
  radius,
  rangeM,
  sweepAngle,
}) => {
  return (
    <>
      {/* Concentric Range Rings */}
      {[0.25, 0.5, 0.75, 1.0].map((frac) => {
        const ringR = radius * frac;
        const ringDist = (rangeM * frac).toFixed(0);
        return (
          <g key={frac}>
            <circle
              cx={center}
              cy={center}
              r={ringR}
              fill="none"
              stroke="#047857"
              strokeWidth={0.8}
              strokeDasharray={frac === 1 ? undefined : '3 5'}
              strokeOpacity={frac === 1 ? 0.7 : 0.35}
            />
            {/* Range labels along forward and right axes */}
            <text
              x={center + 6}
              y={center - ringR + 12}
              fill="#10b981"
              fontSize={10}
              fontFamily="monospace"
              fontWeight="bold"
              opacity={0.8}
            >
              {ringDist}m
            </text>
            <text
              x={center + ringR - 22}
              y={center - 6}
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
        const x2 = center + radius * Math.cos(rad);
        const y2 = center + radius * Math.sin(rad);
        const isMajor = deg % 90 === 0;
        return (
          <g key={deg}>
            <line
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={isMajor ? '#059669' : '#047857'}
              strokeWidth={isMajor ? 1.2 : 0.6}
              strokeOpacity={isMajor ? 0.6 : 0.25}
            />
            {/* Compass Angle Text */}
            <text
              x={center + (radius + 16) * Math.cos(rad)}
              y={center + (radius + 16) * Math.sin(rad) + 4}
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
        d={`M ${center} ${center} L ${center + radius * Math.sin((35 * Math.PI) / 180)} ${center - radius * Math.cos((35 * Math.PI) / 180)} A ${radius} ${radius} 0 0 0 ${center - radius * Math.sin((35 * Math.PI) / 180)} ${center - radius * Math.cos((35 * Math.PI) / 180)} Z`}
        fill="#06b6d4"
        fillOpacity={0.06}
        stroke="#06b6d4"
        strokeWidth={1}
        strokeDasharray="4 4"
        strokeOpacity={0.4}
      />

      {/* Sweeping Radar Beam */}
      <g transform={`rotate(${sweepAngle} ${center} ${center})`}>
        <path
          d={`M ${center} ${center} L ${center + radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos((38 * Math.PI) / 180)} ${center + radius * Math.sin((38 * Math.PI) / 180)} Z`}
          fill="url(#sweepGradient)"
        />
        <line
          x1={center}
          y1={center}
          x2={center + radius}
          y2={center}
          stroke="#6ee7b7"
          strokeWidth={1.8}
          opacity={0.8}
        />
      </g>

      {/* Ego Vehicle Centered Marker (E-Trike) */}
      <g transform={`translate(${center}, ${center})`}>
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
    </>
  );
};
