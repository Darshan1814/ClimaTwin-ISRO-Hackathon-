'use client';

import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMode } from '@/lib/mode-context';
import { ClimateDataPoint, generateHistoricalData, generateClimateData } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';

interface ChartProps {
  type: 'vsNormal' | 'annual' | 'monsoonOnset' | 'hourly';
  data?: ClimateDataPoint[];
}

export default function RainfallCharts({ type, data = [] }: ChartProps) {
  const { isOperational } = useMode();
  const c = {
    primary: isOperational ? '#00D4FF' : '#2563EB',
    green: isOperational ? '#00FF88' : '#16A34A',
    red: isOperational ? '#FF4D4D' : '#DC2626',
    grid: isOperational ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    text: isOperational ? '#94A3B8' : '#64748B',
    bg: isOperational ? 'rgba(0,0,0,0.9)' : '#fff',
    fg: isOperational ? '#E2E8F0' : '#1E293B',
  };

  const tooltipStyle = { background: c.bg, border: `1px solid ${c.primary}`, borderRadius: '6px', color: c.fg, fontSize: '0.8rem' };

  if (type === 'vsNormal') {
    const chartData = data.slice(0, 10).map(d => {
      const st = INDIA_STATES.find(s => s.id === d.stateId);
      const normal = (st?.annualRainfall || 1000) / 365;
      return { state: d.stateId, actual: d.rainfall_mm, normal: Math.round(normal * 10) / 10 };
    });
    return (
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="state" tick={{ fill: c.text, fontSize: 9 }} />
            <YAxis tick={{ fill: c.text, fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="normal" fill="rgba(100,100,100,0.3)" radius={[2, 2, 0, 0]} name="Normal" />
            <Bar dataKey="actual" fill={c.primary} radius={[2, 2, 0, 0]} name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'annual') {
    const hist = generateHistoricalData('MH', 'rainfall', 30);
    const chartData = hist.years.map((y, i) => ({ year: y, rainfall: Math.round(hist.values[i]) }));
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="year" tick={{ fill: c.text, fontSize: 9 }} interval={4} />
            <YAxis tick={{ fill: c.text, fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="rainfall" stroke={c.primary} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'monsoonOnset') {
    const onsetData = [
      { state: 'Kerala', onset: 'Jun 1', day: 1 },
      { state: 'Karnataka', onset: 'Jun 5', day: 5 },
      { state: 'Goa', onset: 'Jun 7', day: 7 },
      { state: 'Maharashtra', onset: 'Jun 10', day: 10 },
      { state: 'Gujarat', onset: 'Jun 15', day: 15 },
      { state: 'MP', onset: 'Jun 18', day: 18 },
      { state: 'UP', onset: 'Jun 25', day: 25 },
      { state: 'Delhi', onset: 'Jul 1', day: 30 },
      { state: 'Punjab', onset: 'Jul 3', day: 33 },
      { state: 'Rajasthan', onset: 'Jul 8', day: 38 },
    ];
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={onsetData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis type="number" tick={{ fill: c.text, fontSize: 10 }} label={{ value: 'Days from Jun 1', fill: c.text, fontSize: 9, position: 'bottom' }} />
            <YAxis type="category" dataKey="state" tick={{ fill: c.text, fontSize: 9 }} width={70} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="day" fill={c.primary} radius={[0, 4, 4, 0]} name="Onset Day" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'hourly') {
    const hourlyData = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}:00`,
      rainfall: Math.max(0, Math.sin((h - 14) * 0.3) * 8 + Math.random() * 3),
    }));
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={c.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="hour" tick={{ fill: c.text, fontSize: 9 }} interval={3} />
            <YAxis tick={{ fill: c.text, fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="rainfall" stroke={c.primary} fill="url(#hourlyGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
