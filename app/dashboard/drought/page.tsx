'use client';

import { useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';
import IndiaMap from '@/components/IndiaMap';
import KPICard from '@/components/KPICard';

const SPI_SCALE = [
  { range: '> +2.0', label: 'Extremely Wet', color: '#0000CC' },
  { range: '+1.0 to +2.0', label: 'Very Wet', color: '#3366FF' },
  { range: '-0.99 to +0.99', label: 'Normal', color: '#94A3B8' },
  { range: '-1.0 to -1.99', label: 'Moderate Drought', color: '#FFD700' },
  { range: '-2.0 to -2.99', label: 'Severe Drought', color: '#FF6B35' },
  { range: '< -2.0', label: 'Extreme Drought', color: '#CC0000' },
];

export default function DroughtPage() {
  const { isOperational } = useMode();
  const today = new Date().toISOString().split('T')[0];
  const allData = useMemo(() => generateAllStatesData(today), [today]);

  const droughtStates = allData.filter(d => d.drought_index < 0.3).length;
  const severeStates = allData.filter(d => d.drought_index < 0.15).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💧 Drought Monitor</h1>
        <p className="page-subtitle">SPI-based drought monitoring using IMD + INSAT data fusion</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="States Under Drought" value={droughtStates} icon="🏜️" trend={droughtStates > 5 ? 'up' : 'neutral'} accentColor={isOperational ? '#FF6B35' : '#EA580C'} />
        <KPICard label="Severe Drought" value={severeStates} icon="⚠️" trend={severeStates > 0 ? 'up' : 'neutral'} accentColor={isOperational ? '#FF4D4D' : '#DC2626'} />
        <KPICard label="National SPI" value="-0.42" icon="📊" trend="down" trendValue="Below normal" />
        <KPICard label="Groundwater Deficit" value="12" unit="%" icon="💧" trend="down" trendValue="GRACE satellite" />
      </div>

      <div className="grid-60-40" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>SPI Drought Index Map</h3>
          <IndiaMap data={allData} variable="drought" height={400} />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem', justifyContent: 'center' }}>
            {SPI_SCALE.map(s => (
              <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6rem' }}>
                <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2 }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>SPI Computation</h3>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)', marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--accent-primary)' }}>
                SPI = (X<sub>i</sub> - X̄) / σ
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>Where X<sub>i</sub> = precipitation for period i, X̄ = long-term mean, σ = standard deviation of the historical distribution.</p>
              <p style={{ marginTop: '0.5rem' }}>The SPI is computed by fitting a gamma distribution to the historical precipitation data and transforming it to a normal distribution.</p>
            </div>
          </div>

          <div className="card">
            <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Crop Water Stress</h3>
            <div style={{ fontSize: '0.8rem' }}>
              {[
                { crop: 'Rice (Kharif)', stress: 'Moderate', color: '#FFD700' },
                { crop: 'Cotton (Kharif)', stress: 'High', color: '#FF4D4D' },
                { crop: 'Soybean (Kharif)', stress: 'Low', color: '#00FF88' },
                { crop: 'Wheat (Rabi)', stress: 'N/A', color: '#94A3B8' },
                { crop: 'Mustard (Rabi)', stress: 'N/A', color: '#94A3B8' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>{c.crop}</span>
                  <span style={{ color: c.color, fontWeight: 600 }}>{c.stress}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
