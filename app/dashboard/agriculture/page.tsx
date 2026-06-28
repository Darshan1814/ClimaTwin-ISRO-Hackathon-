'use client';

import { useState } from 'react';
import { useMode } from '@/lib/mode-context';
import { INDIA_STATES } from '@/lib/india-regions';
import KPICard from '@/components/KPICard';

const CROPS_KHARIF = ['Rice', 'Cotton', 'Soybean', 'Sugarcane', 'Maize', 'Groundnut'];
const CROPS_RABI = ['Wheat', 'Mustard', 'Chickpea', 'Barley', 'Lentil'];

export default function AgriculturePage() {
  const { isOperational } = useMode();
  const [selectedState, setSelectedState] = useState('PB');

  const stateName = INDIA_STATES.find(s => s.id === selectedState)?.name || 'Punjab';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🌾 Agriculture Impact</h1>
        <p className="page-subtitle">Climate-agriculture intelligence — bridging climate science and food security</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="Crop Health Index" value="72.4" unit="%" icon="🌱" trend="down" trendValue="-3.2% vs last year" accentColor={isOperational ? '#00FF88' : '#16A34A'} />
        <KPICard label="Kharif Progress" value="68" unit="%" icon="🌾" trend="up" trendValue="Sowing complete" />
        <KPICard label="Irrigation Deficit" value="18" unit="%" icon="💧" trend="up" trendValue="Below requirement" accentColor={isOperational ? '#FF6B35' : '#EA580C'} />
        <KPICard label="Pest Risk Level" value="Medium" icon="🐛" trend="neutral" trendValue="Locust watch" />
      </div>

      <div className="grid-50-50" style={{ marginBottom: '1.5rem' }}>
        {/* Crop Calendar */}
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>Crop Calendar Overlay</h3>
          <div style={{ fontSize: '0.75rem' }}>
            {[...CROPS_KHARIF.map(c => ({ name: c, season: 'Kharif', sow: 'Jun', grow: 'Jul-Sep', harvest: 'Oct-Nov' })),
              ...CROPS_RABI.map(c => ({ name: c, season: 'Rabi', sow: 'Nov', grow: 'Dec-Feb', harvest: 'Mar-Apr' }))
            ].map((crop, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ width: '80px', fontWeight: 600 }}>{crop.name}</span>
                <span className={`badge ${crop.season === 'Kharif' ? 'badge-green' : 'badge-gold'}`} style={{ fontSize: '0.5rem', width: '45px', justifyContent: 'center' }}>{crop.season}</span>
                <div style={{ flex: 1, display: 'flex', gap: '0.25rem' }}>
                  <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(0,212,255,0.15)', borderRadius: '4px', fontSize: '0.6rem' }}>🌱 {crop.sow}</span>
                  <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(0,255,136,0.1)', borderRadius: '4px', fontSize: '0.6rem' }}>🌿 {crop.grow}</span>
                  <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(255,215,0,0.15)', borderRadius: '4px', fontSize: '0.6rem' }}>🌾 {crop.harvest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Prediction */}
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Yield Prediction</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Select State</label>
            <select className="form-select" value={selectedState} onChange={e => setSelectedState(e.target.value)} style={{ marginTop: '0.25rem' }}>
              {INDIA_STATES.filter(s => !s.coastal || s.zone !== 'Island').slice(0, 20).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="ai-analysis-card" style={{ padding: '1rem' }}>
            <div className="ai-analysis-content" style={{ fontSize: '0.8rem' }}>
              <p>Based on current rainfall patterns and temperature anomaly data from INSAT-3DR observations, wheat yield in <strong>{stateName}</strong> is projected at <span className="mono-value" style={{ fontSize: '0.8rem' }}>4.2 MT/ha</span> (±0.3 MT/ha), representing a 2.8% decline from the 5-year average.</p>
              <p>Key factors: moderate soil moisture deficit (SPI: -0.8), slightly elevated daytime temperatures (+1.2°C above normal), and adequate but unevenly distributed monsoon rainfall. The crop stress index stands at 0.35, indicating manageable but noteworthy stress levels.</p>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h4 className="heading-sm" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Farmer Advisory</h4>
            <div style={{ padding: '1rem', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', lineHeight: 1.6 }}>
              <p>📌 <strong>Today&apos;s recommendation for {stateName}:</strong></p>
              <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                <li>Delay sowing by 3-5 days due to insufficient soil moisture</li>
                <li>Apply supplemental irrigation if available (20mm recommended)</li>
                <li>Monitor for early-season pest activity (aphids, stem borer)</li>
                <li>Consider drought-tolerant varieties for late-sown areas</li>
              </ul>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Available in 10 regional languages via ClimaTwin mobile advisory system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
