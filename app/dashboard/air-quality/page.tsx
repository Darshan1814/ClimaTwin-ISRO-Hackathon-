'use client';

import { useMode } from '@/lib/mode-context';
import { MAJOR_CITIES } from '@/lib/india-regions';
import KPICard from '@/components/KPICard';

const AQI_CITIES = MAJOR_CITIES.map((city, i) => ({
  ...city,
  aqi: [185, 156, 89, 142, 78, 120, 168, 134, 95, 112][i] || 100,
  pm25: [95, 78, 35, 72, 28, 55, 85, 65, 38, 48][i] || 50,
  pm10: [145, 120, 65, 110, 52, 88, 130, 98, 58, 75][i] || 80,
}));

function getAQICategory(aqi: number) {
  if (aqi <= 50) return { label: 'Good', color: '#00FF88', bg: 'rgba(0,255,136,0.1)' };
  if (aqi <= 100) return { label: 'Moderate', color: '#FFD700', bg: 'rgba(255,215,0,0.1)' };
  if (aqi <= 150) return { label: 'Unhealthy (SG)', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#FF4D4D', bg: 'rgba(255,77,77,0.1)' };
  return { label: 'Very Unhealthy', color: '#CC0000', bg: 'rgba(204,0,0,0.1)' };
}

export default function AirQualityPage() {
  const { isOperational } = useMode();
  const avgAQI = Math.round(AQI_CITIES.reduce((s, c) => s + c.aqi, 0) / AQI_CITIES.length);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💨 Air Quality Index</h1>
        <p className="page-subtitle">Air quality monitoring with climate correlation analysis</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KPICard label="National Avg AQI" value={avgAQI} icon="💨" trend="up" trendValue={getAQICategory(avgAQI).label} accentColor={getAQICategory(avgAQI).color} />
        <KPICard label="Cities >150 AQI" value={AQI_CITIES.filter(c => c.aqi > 150).length} icon="⚠️" trend="up" trendValue="Unhealthy level" accentColor={isOperational ? '#FF4D4D' : '#DC2626'} />
        <KPICard label="Best Air Quality" value={Math.min(...AQI_CITIES.map(c => c.aqi))} icon="🌿" trend="neutral" trendValue="Lowest AQI" accentColor={isOperational ? '#00FF88' : '#16A34A'} />
        <KPICard label="Worst Air Quality" value={Math.max(...AQI_CITIES.map(c => c.aqi))} icon="🏭" trend="up" trendValue="Highest AQI" accentColor={isOperational ? '#FF4D4D' : '#DC2626'} />
      </div>

      <div className="grid-50-50" style={{ marginBottom: '1.5rem' }}>
        {/* AQI Table */}
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Top 10 Cities — Air Quality</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {['City', 'AQI', 'PM2.5', 'PM10', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...AQI_CITIES].sort((a, b) => b.aqi - a.aqi).map((city, i) => {
                const cat = getAQICategory(city.aqi);
                return (
                  <tr key={i}>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{city.name}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{city.aqi}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{city.pm25}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{city.pm10}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ color: cat.color, fontWeight: 600, fontSize: '0.7rem' }}>{cat.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Climate-AQI Correlation */}
        <div className="card">
          <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Climate-AQI Correlation</h3>
          <div className="ai-analysis-content" style={{ fontSize: '0.8rem' }}>
            <p><strong>Temperature Inversions (Winter):</strong> During November-February, strong surface inversions trap pollutants in the boundary layer, significantly worsening AQI in the Indo-Gangetic plains. Delhi, Lucknow, and Patna experience AQI levels 2-3x higher than summer.</p>
            <p><strong>Monsoon Rainfall:</strong> The southwest monsoon acts as a natural air purifier. June-September rainfall washes out particulate matter, with AQI improving by 40-60% across most cities. This demonstrates the intimate link between climate and air quality.</p>
            <p><strong>Wind Patterns:</strong> Northwest winds during winter carry pollutants from agricultural stubble burning (Punjab/Haryana) to Delhi-NCR. Southeast winds during monsoon disperse pollutants more effectively.</p>
          </div>
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { factor: 'Winter Inversion', impact: 'AQI +150%', color: '#FF4D4D' },
              { factor: 'Monsoon Rainfall', impact: 'AQI -55%', color: '#00FF88' },
              { factor: 'Stubble Burning', impact: 'AQI +200%', color: '#FF4D4D' },
              { factor: 'Sea Breeze', impact: 'AQI -30%', color: '#00D4FF' },
            ].map((f, i) => (
              <div key={i} style={{ padding: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{f.factor}</div>
                <div className="mono-value" style={{ fontSize: '0.8rem', color: f.color }}>{f.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
