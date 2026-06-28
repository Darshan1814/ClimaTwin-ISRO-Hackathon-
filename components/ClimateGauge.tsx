'use client';

interface ClimateGaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit?: string;
  size?: number;
}

export default function ClimateGauge({
  value,
  min,
  max,
  label,
  unit = '°C',
  size = 140,
}: ClimateGaugeProps) {
  const range = max - min;
  const normalized = Math.max(0, Math.min(1, (value - min) / range));
  const angle = -135 + normalized * 270; // Gauge arc from -135° to +135°
  const radius = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;

  // Create arc path
  const startAngle = -135 * (Math.PI / 180);
  const endAngle = (angle) * (Math.PI / 180);
  const fullEndAngle = 135 * (Math.PI / 180);

  const bgArc = describeArc(cx, cy, radius, -135, 135);
  const valueArc = describeArc(cx, cy, radius, -135, angle);

  // Color based on position (cold blue → warm red)
  const color = normalized < 0.33
    ? `hsl(${200 - normalized * 3 * 40}, 80%, 55%)`
    : normalized < 0.66
    ? `hsl(${160 - (normalized - 0.33) * 3 * 120}, 80%, 50%)`
    : `hsl(${40 - (normalized - 0.66) * 3 * 40}, 85%, 50%)`;

  return (
    <div className="gauge-container">
      <svg width={size} height={size * 0.75} viewBox={`0 ${size * 0.1} ${size} ${size * 0.7}`}>
        {/* Background arc */}
        <path
          d={bgArc}
          fill="none"
          stroke="rgba(100,100,100,0.2)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={valueArc}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        {/* Min label */}
        <text
          x={cx - radius - 5}
          y={cy + 15}
          textAnchor="end"
          fontSize="8"
          fill="var(--text-secondary)"
        >
          {min}
        </text>
        {/* Max label */}
        <text
          x={cx + radius + 5}
          y={cy + 15}
          textAnchor="start"
          fontSize="8"
          fill="var(--text-secondary)"
        >
          {max}
        </text>
        {/* Needle dot */}
        <circle
          cx={cx + radius * Math.cos(endAngle)}
          cy={cy + radius * Math.sin(endAngle)}
          r="4"
          fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="gauge-value" style={{ marginTop: '-0.75rem' }}>
        {value.toFixed(1)}{unit}
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

function describeArc(cx: number, cy: number, radius: number, startAngleDeg: number, endAngleDeg: number): string {
  const startRad = startAngleDeg * Math.PI / 180;
  const endRad = endAngleDeg * Math.PI / 180;
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
}
