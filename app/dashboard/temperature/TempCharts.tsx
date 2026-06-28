'use client';

import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMode } from '@/lib/mode-context';
import { ClimateDataPoint, generateHistoricalData } from '@/lib/climate-data';

interface Props { type: 'trend' | 'diurnal' | 'lstComparison'; data?: ClimateDataPoint[]; }

export default function TempCharts({ type, data = [] }: Props) {
  const { isOperational } = useMode();
  const c = {
    primary: isOperational ? '#00D4FF' : '#2563EB',
    red: isOperational ? '#FF4D4D' : '#DC2626',
    orange: isOperational ? '#FF6B35' : '#EA580C',
    grid: isOperational ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    text: isOperational ? '#94A3B8' : '#64748B',
    bg: isOperational ? 'rgba(0,0,0,0.9)' : '#fff',
    fg: isOperational ? '#E2E8F0' : '#1E293B',
  };
  const ts = { background: c.bg, border: `1px solid ${c.primary}`, borderRadius: '6px', color: c.fg, fontSize: '0.8rem' };

  if (type === 'trend') {
    const hist = generateHistoricalData('DL', 'temperature', 30);
    const chartData = hist.years.map((y, i) => ({ year: y, temp: hist.values[i] }));
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="year" tick={{ fill: c.text, fontSize: 9 }} interval={4} />
            <YAxis tick={{ fill: c.text, fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip contentStyle={ts} />
            <Line type="monotone" dataKey="temp" stroke={c.red} strokeWidth={2} dot={false} name="Avg Max Temp (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'diurnal') {
    const seasons = ['Winter', 'Pre-Monsoon', 'Monsoon', 'Post-Monsoon'];
    const chartData = seasons.map((s, i) => ({
      season: s,
      range: [8, 14, 6, 10][i] + Math.random() * 2,
    }));
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="season" tick={{ fill: c.text, fontSize: 10 }} />
            <YAxis tick={{ fill: c.text, fontSize: 10 }} label={{ value: '°C', fill: c.text, fontSize: 10, angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={ts} />
            <Bar dataKey="range" fill={c.orange} radius={[4, 4, 0, 0]} name="Diurnal Range (°C)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'lstComparison') {
    const scatterData = data.slice(0, 20).map(d => ({
      ground: d.max_temp_c,
      insat: d.lst_insat,
    }));
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="ground" name="Ground (°C)" tick={{ fill: c.text, fontSize: 10 }} label={{ value: 'Ground °C', fill: c.text, fontSize: 9, position: 'bottom' }} />
            <YAxis dataKey="insat" name="INSAT LST (°C)" tick={{ fill: c.text, fontSize: 10 }} label={{ value: 'INSAT °C', fill: c.text, fontSize: 9, angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={ts} />
            <Scatter data={scatterData} fill={c.primary} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
