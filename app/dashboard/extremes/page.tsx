'use client';

import { useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData, generateExtremeEvents } from '@/lib/climate-data';
import IndiaMap from '@/components/IndiaMap';
import KPICard from '@/components/KPICard';

const EVENT_ICONS: Record<string, string> = { flood: '🌊', drought: '🏜️', cyclone: '🌀', heatwave: '🔥' };
const SEVERITY_COLORS: Record<string, string> = { extreme: 'badge-red', severe: 'badge-orange', moderate: 'badge-gold' };

export default function ExtremesPage() {
  const { isOperational } = useMode();
  const today = new Date().toISOString().split('T')[0];
  const allData = useMemo(() => generateAllStatesData(today), [today]);
  const events = useMemo(() => generateExtremeEvents(today), [today]);

  const eventCounts = { flood: 0, heatwave: 0, cyclone: 0, drought: 0 };
  events.forEach(e => { if (e.event_type in eventCounts) eventCounts[e.event_type as keyof typeof eventCounts]++; });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🔥 Extreme Events Monitor</h1>
        <p className="page-subtitle">Real-time detection and monitoring of extreme weather events across India</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="Active Events" value={events.length} icon="⚠️" trend={events.length > 2 ? 'up' : 'neutral'} trendValue="Total active" accentColor={isOperational ? '#FF4D4D' : '#DC2626'} />
        <KPICard label="Flood Warnings" value={eventCounts.flood} icon="🌊" trend="neutral" accentColor="#2563EB" />
        <KPICard label="Heatwave Alerts" value={eventCounts.heatwave} icon="🔥" trend="up" accentColor="#EA580C" />
        <KPICard label="Cyclone Watch" value={eventCounts.cyclone} icon="🌀" trend="neutral" accentColor="#7C3AED" />
      </div>

      <div className="grid-60-40" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Active Events Map</h3>
          <IndiaMap data={allData} variable="temperature" height={380} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((evt, i) => (
            <div key={i} className="card" style={{ borderColor: evt.severity === 'extreme' ? '#FF0000' : evt.severity === 'severe' ? '#FF4D4D' : '#FF9500', borderWidth: '1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{EVENT_ICONS[evt.event_type] || '⚠️'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize' }}>{evt.event_type}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{evt.state}</div>
                </div>
                <span className={`badge ${SEVERITY_COLORS[evt.severity] || 'badge-gold'}`} style={{ marginLeft: 'auto', fontSize: '0.55rem' }}>{evt.severity}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{evt.description}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Impact Score: <span className="mono-value" style={{ fontSize: '0.7rem' }}>{evt.impact_score}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Methodology */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Detection Thresholds</h3>
        <div className="grid-4">
          {[
            { label: 'Heavy Rainfall', condition: 'Rainfall > 64mm/day', icon: '🌧️', color: '#2563EB' },
            { label: 'Heatwave', condition: 'Max Temp > 45°C', icon: '🔥', color: '#DC2626' },
            { label: 'Severe Drought', condition: 'SPI < -2.0', icon: '🏜️', color: '#EA580C' },
            { label: 'Cyclonic Storm', condition: 'Wind > 88 km/h', icon: '🌀', color: '#7C3AED' },
          ].map((t, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{t.icon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t.label}</div>
              <div className="mono-value" style={{ fontSize: '0.75rem', color: t.color }}>{t.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 72-hour Prediction */}
      <div className="card">
        <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Next 72-Hour Extreme Event Probability</h3>
        <div className="grid-4">
          {[
            { type: 'Flood', risk: 'Medium', color: '#FFD700' },
            { type: 'Heatwave', risk: 'High', color: '#FF4D4D' },
            { type: 'Cyclone', risk: 'Low', color: '#00FF88' },
            { type: 'Drought', risk: 'Medium', color: '#FFD700' },
          ].map((p, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: p.color, margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
                {EVENT_ICONS[p.type.toLowerCase()] || '⚠️'}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.type}</div>
              <div style={{ fontSize: '0.75rem', color: p.color, fontWeight: 700 }}>{p.risk}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
