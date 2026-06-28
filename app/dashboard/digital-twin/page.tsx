'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData } from '@/lib/climate-data';
import IndiaMap from '@/components/IndiaMap';

const CYCLE_STEPS = ['Background Field', 'Observation Ingestion', 'Data Assimilation (EnKF)', 'Analysis State', 'Model Integration', 'Forecast Output'];

export default function DigitalTwinPage() {
  const { isOperational } = useMode();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('rainfall');

  const today = new Date().toISOString().split('T')[0];
  const realityData = useMemo(() => generateAllStatesData(today), [today]);
  const twinData = useMemo(() => {
    // Twin data is slightly different from reality (simulating model reconstruction)
    return realityData.map(d => ({
      ...d,
      rainfall_mm: Math.round((d.rainfall_mm * (0.95 + Math.random() * 0.1)) * 10) / 10,
      max_temp_c: Math.round((d.max_temp_c + (Math.random() - 0.5) * 1.5) * 10) / 10,
    }));
  }, [realityData]);

  // Animated cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % CYCLE_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const mapVariable = activeTab as 'rainfall' | 'temperature' | 'drought' | 'humidity';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⚡ Digital Twin Simulator</h1>
        <p className="page-subtitle">Real-time virtual replica of India&apos;s atmospheric, oceanic, and land-surface processes</p>
      </div>

      {/* Concept Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '1.5rem', borderColor: isOperational ? 'rgba(0,212,255,0.4)' : undefined }}>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto', color: 'var(--text-secondary)' }}>
          India&apos;s climate digital twin continuously ingests <strong style={{ color: 'var(--accent-primary)' }}>INSAT satellite observations</strong>,{' '}
          <strong style={{ color: 'var(--accent-primary)' }}>IMD ground networks</strong>, and reanalysis data to maintain a real-time virtual replica of atmospheric, oceanic, and land-surface processes.
        </p>
      </div>

      {/* Twin Status Panel */}
      <div className="grid-5" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Data Assimilation', value: 'ACTIVE', detail: 'Last cycle: 14:30 IST', color: '#00FF88' },
          { label: 'Model State', value: 'SYNCHRONIZED', detail: 'Real-time sync', color: '#00D4FF' },
          { label: 'Ensemble Members', value: '12', detail: 'Active members', color: '#7C3AED' },
          { label: 'Obs Coverage', value: '94.7%', detail: 'Observation network', color: '#FFD700' },
          { label: 'Divergence', value: '0.003', detail: 'Twin-Reality gap', color: '#00FF88' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{item.label}</div>
            <div className="mono-value" style={{ fontSize: '1.25rem', color: item.color }}>{item.value}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{item.detail}</div>
          </div>
        ))}
      </div>

      {/* Split View: Reality vs Twin */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="tab-row">
          {['rainfall', 'temperature', 'drought', 'humidity'].map(v => (
            <button key={v} className={`tab-item ${activeTab === v ? 'active' : ''}`} onClick={() => setActiveTab(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="split-view">
          <div className="split-panel">
            <div className="split-panel-label">📡 Reality (Observed State)</div>
            <IndiaMap data={realityData} variable={mapVariable} height={320} />
          </div>
          <div className="split-panel">
            <div className="split-panel-label">🤖 Digital Twin (Model State)</div>
            <IndiaMap data={twinData} variable={mapVariable} height={320} />
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem 0', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Twin-Reality Divergence Score: </span>
          <span className="mono-value" style={{ fontSize: '1.1rem' }}>0.003</span>
          <span style={{ color: 'var(--accent-data)', marginLeft: '0.5rem' }}> (Excellent)</span>
        </div>
      </div>

      {/* Data Assimilation Cycle */}
      <div className="card">
        <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>6-Hour Data Assimilation Cycle</h3>
        <div className="pipeline">
          {CYCLE_STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="pipeline-node">
                <div className={`pipeline-node-box ${i === activeStep ? 'active' : ''}`} style={{
                  borderColor: i === activeStep ? 'var(--accent-primary)' : undefined,
                  boxShadow: i === activeStep ? 'var(--glow-cyan)' : undefined,
                  transform: i === activeStep ? 'scale(1.05)' : undefined,
                  transition: 'all 0.3s ease',
                }}>
                  {step}
                </div>
                <div style={{ fontSize: '0.6rem', color: i === activeStep ? 'var(--accent-primary)' : 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {i === activeStep ? '● Processing' : `Step ${i + 1}`}
                </div>
              </div>
              {i < CYCLE_STEPS.length - 1 && <div className="pipeline-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
