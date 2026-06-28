'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData, getNationalAverage, generateExtremeEvents, ClimateDataPoint } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';
import IndiaMap from '@/components/IndiaMap';
import KPICard from '@/components/KPICard';
import dynamic from 'next/dynamic';

const RechartsCharts = dynamic(() => import('./RechartsCharts'), { ssr: false });

const FEED_EVENTS = [
  { type: 'Heat Alert', icon: '🔥' },
  { type: 'Rainfall Spike', icon: '🌧️' },
  { type: 'Wind Gust', icon: '💨' },
  { type: 'Humidity Surge', icon: '💧' },
  { type: 'Temp Drop', icon: '❄️' },
  { type: 'Clear Skies', icon: '☀️' },
];

export default function MissionControl() {
  const { isOperational } = useMode();
  const [mapVariable, setMapVariable] = useState<'rainfall' | 'temperature' | 'drought' | 'humidity'>('rainfall');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [feedItems, setFeedItems] = useState<{ time: string; state: string; event: string; value: string }[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const allData = useMemo(() => generateAllStatesData(today), [today]);
  const national = useMemo(() => getNationalAverage(allData), [allData]);
  const extremes = useMemo(() => generateExtremeEvents(today), [today]);

  // Live feed simulation
  useEffect(() => {
    const addFeedItem = () => {
      const state = INDIA_STATES[Math.floor(Math.random() * INDIA_STATES.length)];
      const event = FEED_EVENTS[Math.floor(Math.random() * FEED_EVENTS.length)];
      const value = (20 + Math.random() * 25).toFixed(1);
      const now = new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' });
      setFeedItems(prev => [...prev.slice(-15), { time: now, state: state.name, event: `${event.icon} ${event.type}`, value: `${value}°C` }]);
    };

    addFeedItem();
    const interval = setInterval(addFeedItem, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedData = selectedState ? allData.find(d => d.stateId === selectedState) : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🌍 Mission Control Hub
        </h1>
        <p className="page-subtitle">Real-time climate intelligence across India</p>
      </div>

      {/* KPI Row */}
      <div className="grid-5" style={{ marginBottom: '1.5rem' }}>
        <KPICard
          label="National Avg Temperature"
          value={national.avg_max_temp}
          unit="°C"
          icon="🌡️"
          trend="up"
          trendValue="+0.8° vs avg"
          accentColor={isOperational ? undefined : '#DC2626'}
        />
        <KPICard
          label="Today's Rainfall Index"
          value={national.avg_rainfall}
          unit="mm"
          icon="🌧️"
          trend={national.avg_rainfall > 10 ? 'up' : 'down'}
          trendValue={national.avg_rainfall > 10 ? 'Active monsoon' : 'Below normal'}
          accentColor={isOperational ? undefined : '#2563EB'}
        />
        <KPICard
          label="Monsoon Progress"
          value="67.3"
          unit="%"
          icon="🌀"
          trend="up"
          trendValue="Of seasonal avg"
          accentColor={isOperational ? undefined : '#16A34A'}
        />
        <KPICard
          label="Active Extreme Events"
          value={extremes.length}
          icon="⚠️"
          trend={extremes.length > 2 ? 'up' : 'neutral'}
          trendValue={extremes.length > 0 ? 'Action required' : 'All clear'}
          accentColor={isOperational ? undefined : '#EA580C'}
        />
        <KPICard
          label="AI Prediction Accuracy"
          value="87.3"
          unit="%"
          icon="🤖"
          trend="up"
          trendValue="Ensemble model"
          accentColor={isOperational ? undefined : '#7C3AED'}
        />
      </div>

      {/* Main Content: Map + Right Panel */}
      <div className="grid-60-40" style={{ marginBottom: '1.5rem' }}>
        {/* India Map */}
        <div className="card">
          <div className="tab-row">
            {(['rainfall', 'temperature', 'drought', 'humidity'] as const).map(v => (
              <button
                key={v}
                className={`tab-item ${mapVariable === v ? 'active' : ''}`}
                onClick={() => setMapVariable(v)}
              >
                {v === 'rainfall' ? '🌧️' : v === 'temperature' ? '🌡️' : v === 'drought' ? '🏜️' : '💧'} {v}
              </button>
            ))}
          </div>
          <IndiaMap
            data={allData}
            variable={mapVariable}
            onStateClick={setSelectedState}
            selectedState={selectedState}
            height={420}
          />
          {selectedData && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              fontSize: '0.8rem',
            }}>
              <div><span style={{ color: 'var(--text-secondary)' }}>State:</span> <strong>{selectedData.state}</strong></div>
              <div><span style={{ color: 'var(--text-secondary)' }}>Rainfall:</span> <span className="mono-value" style={{ fontSize: '0.8rem' }}>{selectedData.rainfall_mm}mm</span></div>
              <div><span style={{ color: 'var(--text-secondary)' }}>Temp:</span> <span className="mono-value" style={{ fontSize: '0.8rem' }}>{selectedData.min_temp_c}°–{selectedData.max_temp_c}°C</span></div>
              <div><span style={{ color: 'var(--text-secondary)' }}>Humidity:</span> <span className="mono-value" style={{ fontSize: '0.8rem' }}>{selectedData.humidity_pct}%</span></div>
              <div><span style={{ color: 'var(--text-secondary)' }}>Wind:</span> <span className="mono-value" style={{ fontSize: '0.8rem' }}>{selectedData.wind_speed_kmh}km/h</span></div>
              <div><span style={{ color: 'var(--text-secondary)' }}>LST:</span> <span className="mono-value" style={{ fontSize: '0.8rem' }}>{selectedData.lst_insat}°C</span></div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Live Feed */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 className="heading-sm" style={{ fontSize: '0.85rem' }}>Live Climate Feed</h3>
              <span className="badge badge-green" style={{ fontSize: '0.6rem' }}>
                <span className="pulse-dot" style={{ width: 5, height: 5 }} /> LIVE
              </span>
            </div>
            <div className="live-feed">
              {feedItems.map((item, i) => (
                <div key={i} className="feed-item">
                  <span className="feed-time">{item.time}</span>
                  <span className="feed-state">{item.state.split(' ')[0]}</span>
                  <span className="feed-event">{item.event} {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Status */}
          <div className="card">
            <h3 className="heading-sm" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>ClimaTwin AI Status</h3>
            {[
              { name: 'LSTM v2', status: 'active', lastRun: '2m ago' },
              { name: 'Prophet', status: 'active', lastRun: '5m ago' },
              { name: 'XGBoost', status: 'active', lastRun: '1m ago' },
              { name: 'Ensemble', status: 'active', lastRun: 'Now' },
            ].map((model) => (
              <div key={model.name} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: '0.8rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`status-dot ${model.status}`} />
                  <span>{model.name}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{model.lastRun}</span>
              </div>
            ))}
          </div>

          {/* Extreme Events Alert */}
          {extremes.length > 0 && (
            <div className="card" style={{ borderColor: 'rgba(255,77,77,0.5)' }}>
              <h3 className="heading-sm" style={{ fontSize: '0.85rem', color: 'var(--accent-alert)', marginBottom: '0.5rem' }}>
                ⚠️ Active Alerts ({extremes.length})
              </h3>
              {extremes.slice(0, 3).map((evt, i) => (
                <div key={i} style={{
                  padding: '0.375rem 0',
                  fontSize: '0.75rem',
                  borderBottom: '1px solid rgba(255,77,77,0.1)',
                }}>
                  <span className="badge badge-red" style={{ fontSize: '0.55rem', marginRight: '0.5rem' }}>
                    {evt.severity.toUpperCase()}
                  </span>
                  {evt.event_type}: {evt.state}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid-3">
        <div className="card">
          <h3 className="heading-sm" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            7-Day India Rainfall Trend
          </h3>
          <RechartsCharts type="rainfall" data={allData} />
        </div>
        <div className="card">
          <h3 className="heading-sm" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Temperature Anomaly
          </h3>
          <RechartsCharts type="tempAnomaly" data={allData} />
        </div>
        <div className="card">
          <h3 className="heading-sm" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Monsoon Progress 2025
          </h3>
          <RechartsCharts type="monsoonProgress" data={allData} />
        </div>
      </div>
    </div>
  );
}
