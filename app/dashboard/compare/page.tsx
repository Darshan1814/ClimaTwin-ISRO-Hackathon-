'use client';

import { useState, useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';
import dynamic from 'next/dynamic';

const CompareCharts = dynamic(() => import('./CompareCharts'), { ssr: false });

export default function ComparePage() {
  const { isOperational } = useMode();
  const [selectedStates, setSelectedStates] = useState<string[]>(['DL', 'MH', 'KL', 'RJ']);
  const [variable, setVariable] = useState('rainfall');

  const today = new Date().toISOString().split('T')[0];
  const allData = useMemo(() => generateAllStatesData(today), [today]);

  const toggleState = (stateId: string) => {
    if (selectedStates.includes(stateId)) {
      setSelectedStates(selectedStates.filter(s => s !== stateId));
    } else if (selectedStates.length < 4) {
      setSelectedStates([...selectedStates, stateId]);
    }
  };

  const selectedData = allData.filter(d => selectedStates.includes(d.stateId));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Compare Regions</h1>
        <p className="page-subtitle">Side-by-side climate comparison of Indian states (max 4)</p>
      </div>

      {/* State Selector */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 className="heading-sm">Select States (max 4)</h3>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {['rainfall', 'temperature', 'humidity', 'drought'].map(v => (
              <button key={v} className={`tab-item ${variable === v ? 'active' : ''}`} onClick={() => setVariable(v)} style={{ padding: '0.375rem 0.75rem' }}>{v}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {INDIA_STATES.map(s => (
            <button
              key={s.id}
              onClick={() => toggleState(s.id)}
              className={`pill ${selectedStates.includes(s.id) ? '' : ''}`}
              style={{
                background: selectedStates.includes(s.id) ? 'rgba(0,212,255,0.2)' : undefined,
                borderColor: selectedStates.includes(s.id) ? 'var(--accent-primary)' : undefined,
                color: selectedStates.includes(s.id) ? 'var(--accent-primary)' : undefined,
                fontWeight: selectedStates.includes(s.id) ? 600 : 400,
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Data Comparison</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Variable</th>
              {selectedData.map(d => (
                <th key={d.stateId} style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', fontSize: '0.65rem', color: 'var(--accent-primary)' }}>{d.state}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Rainfall (mm)', key: 'rainfall_mm' },
              { label: 'Max Temp (°C)', key: 'max_temp_c' },
              { label: 'Min Temp (°C)', key: 'min_temp_c' },
              { label: 'Humidity (%)', key: 'humidity_pct' },
              { label: 'Wind (km/h)', key: 'wind_speed_kmh' },
              { label: 'Cloud Cover (%)', key: 'cloud_cover_pct' },
              { label: 'Drought Index', key: 'drought_index' },
              { label: 'Crop Stress', key: 'crop_stress_index' },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{row.label}</td>
                {selectedData.map(d => (
                  <td key={d.stateId} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', textAlign: 'right' }} className="mono-value">
                    {(d as any)[row.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid-50-50">
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Bar Comparison</h3>
          <CompareCharts type="bar" data={selectedData} variable={variable} />
        </div>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Radar Profile</h3>
          <CompareCharts type="radar" data={selectedData} variable={variable} />
        </div>
      </div>
    </div>
  );
}
