'use client';

import { useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';
import IndiaMap from '@/components/IndiaMap';
import KPICard from '@/components/KPICard';

const ONSET_DATA = [
  { state: 'Kerala', date: 'Jun 1', status: 'arrived' },
  { state: 'Karnataka', date: 'Jun 5', status: 'arrived' },
  { state: 'Goa', date: 'Jun 7', status: 'arrived' },
  { state: 'Maharashtra', date: 'Jun 10', status: 'arrived' },
  { state: 'Andhra Pradesh', date: 'Jun 12', status: 'arrived' },
  { state: 'Odisha', date: 'Jun 15', status: 'arrived' },
  { state: 'Gujarat', date: 'Jun 15', status: 'arrived' },
  { state: 'Madhya Pradesh', date: 'Jun 18', status: 'arrived' },
  { state: 'West Bengal', date: 'Jun 20', status: 'arrived' },
  { state: 'Bihar', date: 'Jun 22', status: 'arrived' },
  { state: 'Uttar Pradesh', date: 'Jun 25', status: 'arriving' },
  { state: 'Delhi', date: 'Jul 1', status: 'pending' },
  { state: 'Punjab', date: 'Jul 3', status: 'pending' },
  { state: 'Rajasthan', date: 'Jul 8', status: 'pending' },
  { state: 'Jammu & Kashmir', date: 'Jul 12', status: 'pending' },
];

export default function MonsoonPage() {
  const { isOperational } = useMode();
  const today = new Date().toISOString().split('T')[0];
  const allData = useMemo(() => generateAllStatesData(today), [today]);

  const monsoonStates = allData.filter(d => d.rainfall_mm > 20);
  const surplusStates = allData.filter(d => {
    const st = INDIA_STATES.find(s => s.id === d.stateId);
    return st && d.rainfall_mm > (st.annualRainfall / 365 * 1.1);
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🌀 Monsoon Tracker</h1>
        <p className="page-subtitle">Southwest Monsoon progression, variability analysis, and impact assessment</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="Monsoon Coverage" value={`${Math.round(monsoonStates.length / allData.length * 100)}`} unit="%" icon="🌀" trend="up" trendValue="Of India covered" />
        <KPICard label="Surplus States" value={surplusStates.length} icon="💧" trend="up" trendValue=">110% of normal" accentColor={isOperational ? '#00FF88' : '#16A34A'} />
        <KPICard label="Active Low Pressure" value="2" icon="🌊" trend="neutral" trendValue="Bay of Bengal" />
        <KPICard label="ENSO State" value="Neutral" icon="🌏" trend="neutral" trendValue="No El Niño/La Niña" />
      </div>

      <div className="grid-60-40" style={{ marginBottom: '1.5rem' }}>
        {/* Monsoon Progression Map */}
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Monsoon Deficiency Map</h3>
          <IndiaMap data={allData} variable="drought" height={380} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', justifyContent: 'center', fontSize: '0.7rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 12, height: 12, background: '#16A34A', borderRadius: 2 }} /> Surplus (&gt;110%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 12, height: 12, background: '#94A3B8', borderRadius: 2 }} /> Normal (90-110%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 12, height: 12, background: '#FF6B35', borderRadius: 2 }} /> Deficient (&lt;90%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 12, height: 12, background: '#DC2626', borderRadius: 2 }} /> Large Deficit (&lt;60%)
            </span>
          </div>
        </div>

        {/* Onset Timeline */}
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Monsoon Onset Timeline</h3>
          <div style={{ fontSize: '0.8rem' }}>
            {ONSET_DATA.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: item.status === 'arrived' ? 'var(--accent-data)' : item.status === 'arriving' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  boxShadow: item.status === 'arrived' ? 'var(--glow-green)' : 'none',
                  flexShrink: 0,
                }} />
                <span style={{ flex: 1 }}>{item.state}</span>
                <span className="mono-value" style={{ fontSize: '0.75rem' }}>{item.date}</span>
                <span className={`badge ${item.status === 'arrived' ? 'badge-green' : item.status === 'arriving' ? 'badge-gold' : 'badge-cyan'}`} style={{ fontSize: '0.55rem' }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IMD Long-Range Forecast + ENSO Impact */}
      <div className="grid-50-50">
        <div className="ai-analysis-card">
          <div className="ai-analysis-header">
            <span>🌀</span>
            <h3>IMD Long-Range Forecast</h3>
          </div>
          <div className="ai-analysis-content">
            <p>Based on current SST patterns and MJO phase analysis, the southwest monsoon is progressing normally across the Indian subcontinent. The monsoon trough is positioned along its climatological normal, extending from the Bay of Bengal low-pressure area westward across central India.</p>
            <p>INSAT-3DR satellite imagery confirms active convective systems over the Arabian Sea, with moisture flux convergence supporting continued northward progression. The monsoon is expected to cover the entire country by the second week of July, within ±3 days of the normal schedule.</p>
            <p>Seasonal rainfall for June-September 2026 is forecast to be 96-104% of the Long Period Average (LPA: 868.6 mm), indicating a &quot;normal&quot; monsoon season. However, sub-regional variability remains high, with western Rajasthan and parts of northwest India expected to receive below-normal precipitation.</p>
          </div>
        </div>

        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>🌏 El Niño / La Niña Impact</h3>
          <div style={{ padding: '1rem 0', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)' }}>
              <span>Current ENSO State:</span>
              <span className="badge badge-cyan">NEUTRAL</span>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Niño 3.4 SST Anomaly</div>
              <div className="mono-value" style={{ fontSize: '1.25rem' }}>-0.3°C</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The ENSO-neutral condition is favorable for the Indian monsoon. Historical data shows that neutral years typically result in near-normal monsoon rainfall (±5% of LPA). No significant teleconnection impact expected this season. The Indian Ocean Dipole (IOD) is slightly positive (+0.2°C), which may marginally enhance monsoon rainfall over southern peninsular India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
