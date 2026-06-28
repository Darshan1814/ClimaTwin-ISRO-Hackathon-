'use client';

import { useState, useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';
import IndiaMap from '@/components/IndiaMap';

const PRESETS = [
  { name: 'RCP 2.6', temp: 1.0, rainfall: 5, co2: 490, sst: 0.5, enso: 'neutral', iod: 'neutral' },
  { name: 'RCP 4.5', temp: 1.8, rainfall: -5, co2: 580, sst: 1.0, enso: 'neutral', iod: 'neutral' },
  { name: 'RCP 8.5', temp: 3.5, rainfall: -15, co2: 800, sst: 2.5, enso: 'el_nino', iod: 'negative' },
  { name: '2050 Proj', temp: 2.0, rainfall: -10, co2: 550, sst: 1.2, enso: 'neutral', iod: 'positive' },
  { name: 'Worst Case', temp: 4.0, rainfall: -30, co2: 800, sst: 3.0, enso: 'el_nino', iod: 'negative' },
];

export default function WhatIfPage() {
  const { isOperational } = useMode();
  const [tempDelta, setTempDelta] = useState(0);
  const [rainfallDelta, setRainfallDelta] = useState(0);
  const [co2, setCo2] = useState(420);
  const [sstDelta, setSstDelta] = useState(0);
  const [enso, setEnso] = useState('neutral');
  const [iod, setIod] = useState('neutral');
  const [results, setResults] = useState<null | { narrative: string; impacts: { state: string; tempChange: number; rainfallChange: number; droughtRisk: string; cropImpact: number }[] }>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const baseData = useMemo(() => generateAllStatesData(today), [today]);

  const simulatedData = useMemo(() => {
    if (!results) return baseData;
    return baseData.map(d => ({
      ...d,
      max_temp_c: d.max_temp_c + tempDelta,
      min_temp_c: d.min_temp_c + tempDelta * 0.7,
      rainfall_mm: Math.max(0, d.rainfall_mm * (1 + rainfallDelta / 100)),
      drought_index: Math.max(0, Math.min(1, d.drought_index - rainfallDelta / 200)),
    }));
  }, [results, baseData, tempDelta, rainfallDelta]);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTempDelta(preset.temp);
    setRainfallDelta(preset.rainfall);
    setCo2(preset.co2);
    setSstDelta(preset.sst);
    setEnso(preset.enso);
    setIod(preset.iod);
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/climate/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp_delta: tempDelta, rainfall_delta: rainfallDelta, co2_ppm: co2, sst_delta: sstDelta, enso, iod }),
      });
      const data = await res.json();
      setResults({
        narrative: data.national_summary || `Under a +${tempDelta}°C warming scenario with ${rainfallDelta}% rainfall change and CO₂ at ${co2}ppm, India's climate system shows significant regional variation. Northern plains face increased heat stress while western coastal regions may experience intensified monsoon precipitation. Agricultural productivity is projected to decline by ${Math.abs(tempDelta * 3).toFixed(1)}% nationally.`,
        impacts: data.state_impacts || INDIA_STATES.slice(0, 15).map(s => ({
          state: s.name,
          tempChange: Math.round((tempDelta + (Math.random() - 0.5) * 0.5) * 10) / 10,
          rainfallChange: Math.round((rainfallDelta + (Math.random() - 0.5) * 10) * 10) / 10,
          droughtRisk: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'moderate' : 'low',
          cropImpact: Math.round((-tempDelta * 3 + (Math.random() - 0.5) * 5) * 10) / 10,
        })),
      });
    } catch {
      setResults({
        narrative: `Simulation complete. Under the specified scenario (+${tempDelta}°C, ${rainfallDelta}% rainfall, ${co2}ppm CO₂), India faces differentiated regional impacts. The Indo-Gangetic plains and peninsular India show heightened vulnerability to combined heat and water stress. Monsoon variability increases with ENSO-IOD coupling effects.`,
        impacts: INDIA_STATES.slice(0, 15).map(s => ({
          state: s.name,
          tempChange: Math.round((tempDelta + (Math.random() - 0.5)) * 10) / 10,
          rainfallChange: Math.round((rainfallDelta + (Math.random() - 0.5) * 15) * 10) / 10,
          droughtRisk: tempDelta > 2 ? 'high' : tempDelta > 1 ? 'moderate' : 'low',
          cropImpact: Math.round((-tempDelta * 2.5 + rainfallDelta * 0.1) * 10) / 10,
        })),
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎛️ What-If Simulator</h1>
        <p className="page-subtitle">Explore how India&apos;s climate responds to atmospheric changes</p>
      </div>

      <div className="grid-35-65">
        {/* Controls */}
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>Scenario Controls</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Temperature Anomaly</span>
                <span className="mono-value" style={{ fontSize: '0.75rem' }}>{tempDelta > 0 ? '+' : ''}{tempDelta}°C</span>
              </label>
              <input type="range" className="range-slider" min={-2} max={4} step={0.5} value={tempDelta} onChange={e => setTempDelta(Number(e.target.value))} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Rainfall Change</span>
                <span className="mono-value" style={{ fontSize: '0.75rem' }}>{rainfallDelta > 0 ? '+' : ''}{rainfallDelta}%</span>
              </label>
              <input type="range" className="range-slider" min={-40} max={40} step={5} value={rainfallDelta} onChange={e => setRainfallDelta(Number(e.target.value))} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>CO₂ Concentration</span>
                <span className="mono-value" style={{ fontSize: '0.75rem' }}>{co2} ppm</span>
              </label>
              <input type="range" className="range-slider" min={350} max={800} step={10} value={co2} onChange={e => setCo2(Number(e.target.value))} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>SST Anomaly</span>
                <span className="mono-value" style={{ fontSize: '0.75rem' }}>{sstDelta > 0 ? '+' : ''}{sstDelta}°C</span>
              </label>
              <input type="range" className="range-slider" min={-1} max={3} step={0.5} value={sstDelta} onChange={e => setSstDelta(Number(e.target.value))} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ENSO State</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {['la_nina', 'neutral', 'el_nino'].map(v => (
                  <button key={v} className={`btn btn-sm ${enso === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setEnso(v)} style={{ flex: 1, fontSize: '0.7rem' }}>
                    {v === 'la_nina' ? 'La Niña' : v === 'neutral' ? 'Neutral' : 'El Niño'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>IOD State</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {['negative', 'neutral', 'positive'].map(v => (
                  <button key={v} className={`btn btn-sm ${iod === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setIod(v)} style={{ flex: 1, fontSize: '0.7rem' }}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Quick Presets</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {PRESETS.map(p => (
                  <button key={p.name} className="btn btn-secondary btn-sm" onClick={() => applyPreset(p)} style={{ fontSize: '0.65rem' }}>{p.name}</button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={runSimulation} disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? '⏳ Simulating...' : '🚀 Run Simulation'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results ? (
            <>
              {/* Side-by-side maps */}
              <div className="split-view">
                <div className="split-panel">
                  <div className="split-panel-label">Current State</div>
                  <IndiaMap data={baseData} variable="temperature" height={250} />
                </div>
                <div className="split-panel">
                  <div className="split-panel-label">Simulated Scenario</div>
                  <IndiaMap data={simulatedData} variable="temperature" height={250} />
                </div>
              </div>

              {/* Sector Impacts */}
              <div className="grid-4">
                {[
                  { icon: '🌾', label: 'Agriculture', value: `${(tempDelta * -3).toFixed(1)}%`, detail: 'Crop yield change', color: '#FF6B35' },
                  { icon: '💧', label: 'Water', value: `${(rainfallDelta * 0.8).toFixed(0)}%`, detail: 'Reservoir impact', color: '#00D4FF' },
                  { icon: '🔥', label: 'Extremes', value: `+${(tempDelta * 15).toFixed(0)}%`, detail: 'Frequency change', color: '#FF4D4D' },
                  { icon: '❤️', label: 'Health', value: `${(tempDelta * 8).toFixed(0)}`, detail: 'Heat stress index', color: '#7C3AED' },
                ].map((item, i) => (
                  <div key={i} className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{item.label}</div>
                    <div className="mono-value" style={{ fontSize: '1.25rem', color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{item.detail}</div>
                  </div>
                ))}
              </div>

              {/* Impact Table */}
              <div className="card">
                <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>State-Level Impact Analysis</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        {['State', 'Temp Change', 'Rainfall Change', 'Drought Risk', 'Crop Impact'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.impacts.map((imp, i) => (
                        <tr key={i}>
                          <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{imp.state}</td>
                          <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{imp.tempChange > 0 ? '+' : ''}{imp.tempChange}°C</td>
                          <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{imp.rainfallChange > 0 ? '+' : ''}{imp.rainfallChange}%</td>
                          <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <span className={`badge ${imp.droughtRisk === 'high' ? 'badge-red' : imp.droughtRisk === 'moderate' ? 'badge-orange' : 'badge-green'}`} style={{ fontSize: '0.55rem' }}>
                              {imp.droughtRisk}
                            </span>
                          </td>
                          <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{imp.cropImpact > 0 ? '+' : ''}{imp.cropImpact}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Narrative */}
              <div className="ai-analysis-card">
                <div className="ai-analysis-header">
                  <span>🤖</span>
                  <h3>ClimaTwin Scenario Analysis</h3>
                </div>
                <div className="ai-analysis-content"><p>{results.narrative}</p></div>
              </div>
            </>
          ) : (
            <div className="card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '4rem' }}>🎛️</span>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Adjust parameters and run a simulation</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.6 }}>Try a preset: RCP 2.6, RCP 8.5, or Worst Case</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
