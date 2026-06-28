'use client';

import { useMode } from '@/lib/mode-context';
import KPICard from '@/components/KPICard';

export default function OceanPage() {
  const { isOperational } = useMode();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🌊 Ocean Surface Temperatures</h1>
        <p className="page-subtitle">INSAT 3RIMG_L2B_SST — Indian Ocean monitoring</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="Arabian Sea SST" value="29.2" unit="°C" icon="🌊" trend="up" trendValue="+0.5° anomaly" />
        <KPICard label="Bay of Bengal SST" value="30.1" unit="°C" icon="🌊" trend="up" trendValue="+0.8° anomaly" accentColor={isOperational ? '#FF6B35' : '#EA580C'} />
        <KPICard label="IOD Index" value="+0.3" icon="🌏" trend="neutral" trendValue="Slightly positive" />
        <KPICard label="ENSO (Niño 3.4)" value="-0.3" unit="°C" icon="🌏" trend="neutral" trendValue="Neutral phase" />
      </div>

      <div className="grid-50-50" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 className="heading-sm" style={{ marginBottom: '1rem' }}>Indian Ocean SST Field</h3>
          <svg viewBox="0 0 400 300" style={{ width: '100%', maxWidth: '400px' }}>
            {/* Ocean background */}
            <rect x="0" y="0" width="400" height="300" fill="#0a1628" rx="8" />
            {/* India outline (simplified) */}
            <path d="M 200,30 L 250,50 270,80 280,120 270,160 260,200 240,230 220,250 200,260 180,250 160,230 140,200 120,160 110,120 120,80 140,50 Z" fill="rgba(100,100,100,0.4)" stroke="rgba(200,200,200,0.5)" strokeWidth="1" />
            {/* Arabian Sea */}
            <text x="60" y="160" fill="#00D4FF" fontSize="10" textAnchor="middle">Arabian</text>
            <text x="60" y="175" fill="#00D4FF" fontSize="10" textAnchor="middle">Sea</text>
            <circle cx="60" cy="140" r="30" fill="none" stroke="rgba(255,100,50,0.3)" strokeWidth="2"><animate attributeName="r" values="28;35;28" dur="3s" repeatCount="indefinite" /></circle>
            <text x="60" y="145" fill="#FF6B35" fontSize="12" fontWeight="bold" textAnchor="middle">29.2°C</text>
            {/* Bay of Bengal */}
            <text x="330" y="120" fill="#00D4FF" fontSize="10" textAnchor="middle">Bay of</text>
            <text x="330" y="135" fill="#00D4FF" fontSize="10" textAnchor="middle">Bengal</text>
            <circle cx="330" cy="100" r="30" fill="none" stroke="rgba(255,77,77,0.3)" strokeWidth="2"><animate attributeName="r" values="28;35;28" dur="4s" repeatCount="indefinite" /></circle>
            <text x="330" y="105" fill="#FF4D4D" fontSize="12" fontWeight="bold" textAnchor="middle">30.1°C</text>
            {/* Indian Ocean */}
            <text x="200" y="280" fill="#94A3B8" fontSize="10" textAnchor="middle">Indian Ocean</text>
            {/* SST gradient zones */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={80 + i * 35} cy={230 + Math.sin(i) * 20} r="15" fill={`rgba(${100 + i * 20}, ${50 + i * 10}, ${200 - i * 20}, 0.2)`} stroke="none" />
            ))}
            {/* Warm pool indicator */}
            <rect x="280" y="150" width="80" height="40" rx="4" fill="rgba(255,77,77,0.15)" stroke="rgba(255,77,77,0.3)" strokeWidth="1" />
            <text x="320" y="167" fill="#FF4D4D" fontSize="8" textAnchor="middle">Warm Pool</text>
            <text x="320" y="180" fill="#FF4D4D" fontSize="10" fontWeight="bold" textAnchor="middle">&gt;28.5°C</text>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>IOD Monitoring</h3>
            <div style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
              <p style={{ color: 'var(--text-secondary)' }}>The Indian Ocean Dipole measures the SST difference between the western and eastern Indian Ocean.</p>
              <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Western IO SST</div>
                  <div className="mono-value" style={{ fontSize: '1rem' }}>28.7°C</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Eastern IO SST</div>
                  <div className="mono-value" style={{ fontSize: '1rem' }}>28.4°C</div>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <span className="badge badge-cyan">IOD: +0.3°C (Slightly Positive)</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>🌀 Cyclone Potential</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Regions with SST &gt; 26.5°C support cyclogenesis.</p>
            <div style={{ fontSize: '0.8rem' }}>
              {[
                { region: 'Bay of Bengal (North)', sst: '30.1°C', potential: 'High' },
                { region: 'Bay of Bengal (South)', sst: '29.4°C', potential: 'Moderate' },
                { region: 'Arabian Sea (East)', sst: '29.2°C', potential: 'Moderate' },
                { region: 'Arabian Sea (West)', sst: '27.8°C', potential: 'Low' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>{r.region}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="mono-value" style={{ fontSize: '0.75rem' }}>{r.sst}</span>
                    <span className={`badge ${r.potential === 'High' ? 'badge-red' : r.potential === 'Moderate' ? 'badge-orange' : 'badge-green'}`} style={{ fontSize: '0.5rem' }}>{r.potential}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
