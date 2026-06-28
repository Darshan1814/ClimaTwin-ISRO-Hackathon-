'use client';

import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMode } from '@/lib/mode-context';
import { ClimateDataPoint, generateClimateData } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';

interface ChartProps {
  type: 'rainfall' | 'tempAnomaly' | 'monsoonProgress';
  data: ClimateDataPoint[];
}

export default function RechartsCharts({ type, data }: ChartProps) {
  const { isOperational } = useMode();

  const colors = {
    primary: isOperational ? '#00D4FF' : '#2563EB',
    secondary: isOperational ? '#7C3AED' : '#7C3AED',
    alert: isOperational ? '#FF4D4D' : '#DC2626',
    green: isOperational ? '#00FF88' : '#16A34A',
    grid: isOperational ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    text: isOperational ? '#94A3B8' : '#64748B',
  };

  // Rainfall chart data
  const rainfallChartData = useMemo(() => {
    if (type !== 'rainfall') return [];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayData = INDIA_STATES.slice(0, 10).map((s, idx) => generateClimateData(s, dateStr, idx));
      const avg = dayData.reduce((s, dp) => s + dp.rainfall_mm, 0) / dayData.length;
      return {
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        rainfall: Math.round(avg * 10) / 10,
      };
    });
  }, [type]);

  // Temp anomaly chart data
  const anomalyData = useMemo(() => {
    if (type !== 'tempAnomaly') return [];
    return data.slice(0, 12).map(d => ({
      state: d.stateId,
      anomaly: Math.round((d.max_temp_c - (INDIA_STATES.find(s => s.id === d.stateId)?.avgMaxTemp || 30)) * 10) / 10,
    }));
  }, [data, type]);

  if (type === 'rainfall') {
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={rainfallChartData}>
            <defs>
              <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey="day" tick={{ fill: colors.text, fontSize: 11 }} axisLine={{ stroke: colors.grid }} />
            <YAxis tick={{ fill: colors.text, fontSize: 11 }} axisLine={{ stroke: colors.grid }} />
            <Tooltip
              contentStyle={{
                background: isOperational ? 'rgba(0,0,0,0.9)' : '#fff',
                border: `1px solid ${colors.primary}`,
                borderRadius: '6px',
                color: isOperational ? '#E2E8F0' : '#1E293B',
                fontSize: '0.8rem',
              }}
            />
            <Area type="monotone" dataKey="rainfall" stroke={colors.primary} fill="url(#rainfallGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'tempAnomaly') {
    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={anomalyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey="state" tick={{ fill: colors.text, fontSize: 10 }} axisLine={{ stroke: colors.grid }} />
            <YAxis tick={{ fill: colors.text, fontSize: 11 }} axisLine={{ stroke: colors.grid }} />
            <Tooltip
              contentStyle={{
                background: isOperational ? 'rgba(0,0,0,0.9)' : '#fff',
                border: `1px solid ${colors.primary}`,
                borderRadius: '6px',
                color: isOperational ? '#E2E8F0' : '#1E293B',
                fontSize: '0.8rem',
              }}
            />
            <Bar dataKey="anomaly" radius={[4, 4, 0, 0]}>
              {anomalyData.map((entry, i) => (
                <Cell key={i} fill={entry.anomaly > 0 ? colors.alert : colors.primary} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'monsoonProgress') {
    const zones = ['North', 'South', 'East', 'West', 'Central', 'NE'];
    const progressData = zones.map((zone, i) => ({
      zone,
      progress: Math.round(50 + Math.sin(i * 1.5) * 25 + Math.random() * 10),
    }));

    return (
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={progressData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: colors.text, fontSize: 11 }} axisLine={{ stroke: colors.grid }} />
            <YAxis type="category" dataKey="zone" tick={{ fill: colors.text, fontSize: 11 }} axisLine={{ stroke: colors.grid }} width={55} />
            <Tooltip
              contentStyle={{
                background: isOperational ? 'rgba(0,0,0,0.9)' : '#fff',
                border: `1px solid ${colors.primary}`,
                borderRadius: '6px',
                color: isOperational ? '#E2E8F0' : '#1E293B',
                fontSize: '0.8rem',
              }}
            />
            <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
              {progressData.map((entry, i) => (
                <Cell key={i} fill={entry.progress > 80 ? colors.green : entry.progress > 50 ? colors.primary : colors.alert} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
