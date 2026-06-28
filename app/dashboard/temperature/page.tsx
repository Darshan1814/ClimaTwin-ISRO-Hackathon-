'use client';

import { useState, useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData } from '@/lib/climate-data';
import { INDIA_STATES, MAJOR_CITIES } from '@/lib/india-regions';
import IndiaMap from '@/components/IndiaMap';
import KPICard from '@/components/KPICard';
import ClimateGauge from '@/components/ClimateGauge';
import dynamic from 'next/dynamic';

const TempCharts = dynamic(() => import('./TempCharts'), { ssr: false });

export default function TemperaturePage() {
  const { isOperational } = useMode();
  const [view, setView] = useState<'temperature' | 'drought' | 'humidity'>('temperature');

  const today = new Date().toISOString().split('T')[0];
  const allData = useMemo(() => generateAllStatesData(today), [today]);
  const national = useMemo(() => {
    const avg = allData.reduce((s, d) => s + d.max_temp_c, 0) / allData.length;
    const avgMin = allData.reduce((s, d) => s + d.min_temp_c, 0) / allData.length;
    const avgLST = allData.reduce((s, d) => s + d.lst_insat, 0) / allData.length;
    return { max: Math.round(avg * 10) / 10, min: Math.round(avgMin * 10) / 10, lst: Math.round(avgLST * 10) / 10 };
  }, [allData]);

  const heatwaveStates = allData.filter(d => d.max_temp_c > 42).length;

  // City temperatures for gauges
  const cityTemps = MAJOR_CITIES.slice(0, 6).map(city => {
    const data = allData.find(d => d.stateId === city.state);
    return { name: city.name, temp: data?.max_temp_c || 30, min: data?.min_temp_c || 20 };
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🌡️ Temperature Field</h1>
        <p className="page-subtitle">IMD Temperature (1° × 1°) + INSAT LST</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="National Max Temp" value={national.max} unit="°C" icon="🌡️" trend="up" trendValue="+0.8° anomaly" accentColor={isOperational ? '#FF4D4D' : '#DC2626'} />
        <KPICard label="National Min Temp" value={national.min} unit="°C" icon="🌙" trend="neutral" trendValue="Within normal" />
        <KPICard label="INSAT LST Avg" value={national.lst} unit="°C" icon="🛰️" trend="up" trendValue="Land Surface Temp" accentColor={isOperational ? '#FF6B35' : '#EA580C'} />
        <KPICard label="Heatwave Alerts" value={heatwaveStates} icon="🔥" trend={heatwaveStates > 0 ? 'up' : 'neutral'} trendValue={heatwaveStates > 0 ? 'States >42°C' : 'No alerts'} accentColor={isOperational ? '#FF4D4D' : '#DC2626'} />
      </div>

      {/* Temperature Map */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="tab-row">
          {[
            { key: 'temperature', label: '🌡️ Max Temp' },
            { key: 'drought', label: '📊 Anomaly' },
            { key: 'humidity', label: '💧 Humidity' },
          ].map(v => (
            <button key={v.key} className={`tab-item ${view === v.key ? 'active' : ''}`} onClick={() => setView(v.key as typeof view)}>{v.label}</button>
          ))}
        </div>
        <div className="grid-60-40">
          <IndiaMap data={allData} variable={view} height={380} />
          <div>
            <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>City Temperature Gauges</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {cityTemps.map(city => (
                <ClimateGauge key={city.name} value={city.temp} min={5} max={48} label={city.name} unit="°C" size={120} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-3">
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>30-Year Temperature Trend</h3>
          <TempCharts type="trend" />
        </div>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Diurnal Range by Season</h3>
          <TempCharts type="diurnal" data={allData} />
        </div>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>INSAT LST vs Ground Truth</h3>
          <TempCharts type="lstComparison" data={allData} />
        </div>
      </div>
    </div>
  );
}
