'use client';

export default function ClimateMapPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🗺️ Interactive Climate Map</h1>
        <p className="page-subtitle">Google Maps integration with climate data overlays</p>
      </div>

      <div className="card" style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '4rem' }}>🗺️</div>
        <h3 className="heading-md">Google Maps Climate Overlay</h3>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px', lineHeight: 1.6 }}>
          This page integrates with Google Maps API to display interactive climate overlays including temperature heatmaps, rainfall markers, wind vectors, IMD weather stations, flood zones, and cyclone tracks.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          {['🌡️ Temperature Heatmap', '🌧️ Rainfall Dots', '💨 Wind Vectors', '📍 IMD Stations', '🌊 Flood Zones', '🌀 Cyclone Tracks'].map((overlay, i) => (
            <span key={i} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{overlay}</span>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Center: 20.5937°N, 78.9629°E | Zoom: 5 | API: Google Maps JavaScript API
        </p>
        <div style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', maxWidth: '300px', width: '100%' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Point Query Example</div>
          <div style={{ fontSize: '0.8rem' }}>
            <div>📍 22.3°N, 72.1°E</div>
            <div>Nearest Station: <strong>Ahmedabad</strong></div>
            <div>Rainfall: <span className="mono-value" style={{ fontSize: '0.8rem' }}>12.3mm</span></div>
            <div>Max Temp: <span className="mono-value" style={{ fontSize: '0.8rem' }}>38.5°C</span></div>
            <div>Humidity: <span className="mono-value" style={{ fontSize: '0.8rem' }}>72%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
