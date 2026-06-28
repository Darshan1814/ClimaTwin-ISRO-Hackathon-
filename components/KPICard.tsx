'use client';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: string;
  accentColor?: string;
}

export default function KPICard({
  label,
  value,
  unit = '',
  trend,
  trendValue,
  icon,
  accentColor,
}: KPICardProps) {
  return (
    <div className="kpi-card" style={accentColor ? { borderLeftColor: accentColor } : undefined}>
      <div className="kpi-label">
        {icon && <span style={{ marginRight: '0.25rem' }}>{icon}</span>}
        {label}
      </div>
      <div className="kpi-value" style={accentColor ? { color: accentColor } : undefined}>
        {value}
        {unit && <span style={{ fontSize: '0.85rem', opacity: 0.7, marginLeft: '0.15rem' }}>{unit}</span>}
      </div>
      {trend && (
        <div className={`kpi-trend ${trend}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          {trendValue && <span>{trendValue}</span>}
        </div>
      )}
    </div>
  );
}
