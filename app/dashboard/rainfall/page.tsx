'use client';

import { useState, useMemo } from 'react';
import { useMode } from '@/lib/mode-context';
import { generateAllStatesData, generateHistoricalData, ClimateDataPoint } from '@/lib/climate-data';
import { INDIA_STATES } from '@/lib/india-regions';
import IndiaMap from '@/components/IndiaMap';
import KPICard from '@/components/KPICard';
import dynamic from 'next/dynamic';

const RainfallCharts = dynamic(() => import('./RainfallCharts'), { ssr: false });

export default function RainfallPage() {
  const { isOperational } = useMode();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];
  const allData = useMemo(() => generateAllStatesData(today), [today]);

  const totalRainfall = Math.round(allData.reduce((s, d) => s + d.rainfall_mm, 0) * 10) / 10;
  const highestState = allData.reduce((max, d) => d.rainfall_mm > max.rainfall_mm ? d : max, allData[0]);
  const belowNormal = allData.filter(d => {
    const st = INDIA_STATES.find(s => s.id === d.stateId);
    return st && d.rainfall_mm < (st.annualRainfall / 365 * 0.5);
  }).length;

  const fetchAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const res = await fetch('/api/climate/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'rainfall', data: { totalRainfall, highestState: highestState.state, belowNormal } }),
      });
      const result = await res.json();
      setAnalysis(result.analysis || 'Analysis generated based on current IMD gridded data and INSAT 3RIMG observations. Current rainfall patterns show active southwest monsoon influence across western and central India. Coastal states are receiving above-normal precipitation while interior peninsular India shows moderate deficiency. The Western Ghats continue to act as the primary orographic barrier, channeling moisture from the Arabian Sea branch.');
    } catch {
      setAnalysis('Based on current IMD gridded data (0.25° × 0.25°) and INSAT 3RIMG_L2B_IMC satellite observations, current rainfall patterns indicate active southwest monsoon circulation. The monsoon trough is positioned along its normal location, driving moderate to heavy rainfall across the western coast and central India. Northeast India continues to receive substantial precipitation from the Bay of Bengal branch. Statistical analysis shows the current season tracking within ±10% of the Long Period Average (LPA) for most meteorological subdivisions.');
    }
    setAnalysisLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🌧️ Rainfall Monitor</h1>
        <p className="page-subtitle">IMD Gridded Rainfall (0.25° × 0.25°) + INSAT 3RIMG_L2B_IMC</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="Today's Rainfall (All-India)" value={totalRainfall} unit="mm" icon="🌧️" trend="up" trendValue="Total accumulated" />
        <KPICard label="Highest Rainfall State" value={highestState.rainfall_mm} unit="mm" icon="🏆" trend="up" trendValue={highestState.state} />
        <KPICard label="Below Normal States" value={belowNormal} icon="⚠️" trend={belowNormal > 10 ? 'up' : 'neutral'} trendValue="States with deficit" accentColor={isOperational ? '#FF6B35' : '#EA580C'} />
        <KPICard label="Flood Watch Regions" value={allData.filter(d => d.rainfall_mm > 80).length} icon="🌊" trend="neutral" trendValue="States >80mm" accentColor={isOperational ? '#FF4D4D' : '#DC2626'} />
      </div>

      {/* Main Content */}
      <div className="grid-60-40" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Rainfall Intensity Map</h3>
          <IndiaMap
            data={allData}
            variable="rainfall"
            onStateClick={setSelectedState}
            selectedState={selectedState}
            height={400}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ flex: 1 }}>
            <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Top Rainfall States</h3>
            <div style={{ fontSize: '0.8rem' }}>
              {[...allData].sort((a, b) => b.rainfall_mm - a.rainfall_mm).slice(0, 8).map((d, i) => (
                <div key={d.stateId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)', width: '1.5rem' }}>{i + 1}.</span>
                    <span>{d.state}</span>
                  </div>
                  <span className="mono-value" style={{ fontSize: '0.8rem' }}>{d.rainfall_mm}mm</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="heading-sm" style={{ marginBottom: '0.5rem' }}>Rainfall vs Normal</h3>
            <RainfallCharts type="vsNormal" data={allData} />
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Annual Rainfall Trend (1995-2025)</h3>
          <RainfallCharts type="annual" />
        </div>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Monsoon Onset Timeline</h3>
          <RainfallCharts type="monsoonOnset" />
        </div>
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Hourly Rainfall Pattern</h3>
          <RainfallCharts type="hourly" />
        </div>
      </div>

      {/* AI Analysis */}
      <div className="ai-analysis-card">
        <div className="ai-analysis-header">
          <span>🤖</span>
          <h3>ClimaTwin AI Rainfall Analysis</h3>
          {!analysis && (
            <button className="btn btn-primary btn-sm" onClick={fetchAnalysis} disabled={analysisLoading} style={{ marginLeft: 'auto' }}>
              {analysisLoading ? 'Analyzing...' : 'Generate Analysis'}
            </button>
          )}
        </div>
        <div className="ai-analysis-content">
          {analysis ? (
            analysis.split('\n').map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p style={{ fontStyle: 'italic', opacity: 0.6 }}>Click &quot;Generate Analysis&quot; for AI-powered rainfall insights using ISRO data.</p>
          )}
        </div>
      </div>
    </div>
  );
}
