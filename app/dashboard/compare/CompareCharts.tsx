'use client';

import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMode } from '@/lib/mode-context';
import { ClimateDataPoint } from '@/lib/climate-data';

const COLORS = ['#00D4FF', '#7C3AED', '#00FF88', '#FF6B35'];

interface Props {
  type: 'bar' | 'radar';
  data: ClimateDataPoint[];
  variable: string;
}

export default function CompareCharts({ type, data, variable }: Props) {
  const { isOperational } = useMode();
  const c = {
    grid: isOperational ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    text: isOperational ? '#94A3B8' : '#64748B',
    bg: isOperational ? 'rgba(0,0,0,0.9)' : '#fff',
    fg: isOperational ? '#E2E8F0' : '#1E293B',
  };

  if (type === 'bar') {
    const getVal = (d: ClimateDataPoint) => {
      switch(variable) {
        case 'rainfall': return d.rainfall_mm;
        case 'temperature': return d.max_temp_c;
        case 'humidity': return d.humidity_pct;
        case 'drought': return d.drought_index * 100;
        default: return d.rainfall_mm;
      }
    };
    const chartData = data.map((d, i) => ({ name: d.stateId, value: getVal(d), fill: COLORS[i % COLORS.length] }));

    return (
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="name" tick={{ fill: c.text, fontSize: 11 }} />
            <YAxis tick={{ fill: c.text, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: c.bg, border: `1px solid ${COLORS[0]}`, borderRadius: '6px', color: c.fg }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Bar key={i} dataKey="value" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'radar') {
    const radarData = [
      { var: 'Rainfall', fullMark: 100 },
      { var: 'Temperature', fullMark: 100 },
      { var: 'Humidity', fullMark: 100 },
      { var: 'Wind', fullMark: 100 },
      { var: 'Cloud Cover', fullMark: 100 },
      { var: 'Drought', fullMark: 100 },
    ].map(v => {
      const point: Record<string, number | string> = { var: v.var };
      data.forEach((d, i) => {
        switch(v.var) {
          case 'Rainfall': point[d.stateId] = Math.min(100, d.rainfall_mm); break;
          case 'Temperature': point[d.stateId] = Math.min(100, d.max_temp_c * 2); break;
          case 'Humidity': point[d.stateId] = d.humidity_pct; break;
          case 'Wind': point[d.stateId] = Math.min(100, d.wind_speed_kmh * 2); break;
          case 'Cloud Cover': point[d.stateId] = d.cloud_cover_pct; break;
          case 'Drought': point[d.stateId] = d.drought_index * 100; break;
        }
      });
      return point;
    });

    return (
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <RadarChart data={radarData}>
            <PolarGrid stroke={c.grid} />
            <PolarAngleAxis dataKey="var" tick={{ fill: c.text, fontSize: 9 }} />
            <PolarRadiusAxis tick={{ fill: c.text, fontSize: 8 }} />
            {data.map((d, i) => (
              <Radar key={d.stateId} name={d.stateId} dataKey={d.stateId} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.15} strokeWidth={2} />
            ))}
            <Legend />
            <Tooltip contentStyle={{ background: c.bg, border: `1px solid ${COLORS[0]}`, borderRadius: '6px', color: c.fg, fontSize: '0.8rem' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
