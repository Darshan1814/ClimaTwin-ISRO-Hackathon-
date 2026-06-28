'use client';

import { useMode } from '@/lib/mode-context';

const SATELLITES = [
  { name: 'INSAT-3D', type: 'Geostationary', altitude: '35,786 km', lon: '82°E', status: 'active', products: ['Imager', 'Sounder', 'DCS'], color: '#00D4FF' },
  { name: 'INSAT-3DR', type: 'Geostationary', altitude: '35,786 km', lon: '74°E', status: 'active', products: ['Imager', 'Sounder', 'SAR'], color: '#7C3AED' },
  { name: 'INSAT-3DS', type: 'Geostationary', altitude: '35,786 km', lon: '93.5°E', status: 'active', products: ['Imager', 'Sounder'], color: '#00FF88' },
];

const PRODUCTS = [
  { id: 'LST', name: 'INSAT 3RIMG_L2B_LST', description: 'Land Surface Temperature', resolution: '4km spatial | 30min temporal', icon: '🌡️', status: 'Active', lastUpdate: '14:30 IST', coverage: '98.2%' },
  { id: 'SST', name: 'INSAT 3RIMG_L2B_SST', description: 'Sea Surface Temperature', resolution: '4km spatial | 30min temporal', icon: '🌊', status: 'Active', lastUpdate: '14:30 IST', coverage: '95.7%' },
  { id: 'IMC', name: 'INSAT 3RIMG_L2B_IMC', description: 'Rainfall Estimation', resolution: '4km spatial | 30min temporal', icon: '🌧️', status: 'Active', lastUpdate: '14:15 IST', coverage: '97.1%' },
  { id: 'IMD_R', name: 'IMD Gridded Rainfall', description: 'Gauge-based rainfall analysis', resolution: '0.25° × 0.25° | Daily', icon: '📊', status: 'Active', lastUpdate: '09:00 IST', coverage: '99.5%' },
  { id: 'IMD_T', name: 'IMD Max Temperature', description: 'Station-interpolated max temp', resolution: '1° × 1° | Daily', icon: '🌡️', status: 'Active', lastUpdate: '09:00 IST', coverage: '99.8%' },
];

export default function SatellitesPage() {
  const { isOperational } = useMode();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🛰️ Satellite View</h1>
        <p className="page-subtitle">ISRO/INSAT data integration and satellite constellation status</p>
      </div>

      {/* Satellite Constellation */}
      <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>INSAT Constellation Status</h3>
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '250px', margin: '0 auto' }}>
          {/* Earth */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '60px',
            borderRadius: '60px 60px 0 0',
            background: 'linear-gradient(135deg, #1a5276, #2ecc71)',
            border: '1px solid rgba(0,212,255,0.3)',
          }} />
          {/* Orbital arc */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '200px',
            borderRadius: '225px 225px 0 0',
            border: '1px dashed rgba(0,212,255,0.2)',
            borderBottom: 'none',
          }} />
          {/* Satellites */}
          {SATELLITES.map((sat, i) => {
            const angle = -30 + i * 40;
            const rad = angle * Math.PI / 180;
            const rx = 200, ry = 180;
            const x = 250 + rx * Math.cos(rad * 0.8 - 1.2);
            const y = 230 - ry * Math.sin(rad * 0.4 + 0.8);
            return (
              <div key={sat.name} style={{
                position: 'absolute',
                left: `${x - 25}px`,
                top: `${y - 15}px`,
                textAlign: 'center',
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  margin: '0 auto 0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  filter: isOperational ? `drop-shadow(0 0 6px ${sat.color})` : 'none',
                }}>🛰️</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: sat.color, whiteSpace: 'nowrap' }}>{sat.name}</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-secondary)' }}>{sat.lon}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.75rem' }}>
          <div><span style={{ color: 'var(--text-secondary)' }}>Altitude:</span> <span className="mono-value" style={{ fontSize: '0.75rem' }}>35,786 km</span></div>
          <div><span style={{ color: 'var(--text-secondary)' }}>Period:</span> <span className="mono-value" style={{ fontSize: '0.75rem' }}>23h 56m 4s</span></div>
          <div><span style={{ color: 'var(--text-secondary)' }}>Inclination:</span> <span className="mono-value" style={{ fontSize: '0.75rem' }}>0°</span></div>
        </div>
      </div>

      {/* Product Cards */}
      <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Data Products</h3>
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {PRODUCTS.map(product => (
          <div key={product.id} className="card card-glow">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{product.icon}</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{product.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{product.description}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Status</div>
                <span className="badge badge-green" style={{ fontSize: '0.55rem' }}>
                  <span className="status-dot active" style={{ width: 5, height: 5 }} /> {product.status}
                </span>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Last Updated</div>
                <span className="mono-value" style={{ fontSize: '0.7rem' }}>{product.lastUpdate}</span>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Resolution</div>
                <span style={{ fontSize: '0.7rem' }}>{product.resolution}</span>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>Coverage</div>
                <span className="mono-value" style={{ fontSize: '0.7rem' }}>{product.coverage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Status */}
      <div className="card">
        <h3 className="heading-sm" style={{ marginBottom: '0.75rem' }}>Real-Time Acquisition Status</h3>
        <div className="data-table" style={{ fontSize: '0.8rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sensor</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cycle</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quality</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sensor: 'INSAT-3DR Imager', mode: 'Full Disk', cycle: '30 min', quality: '98.5%', status: 'Acquiring' },
                { sensor: 'INSAT-3DR Sounder', mode: 'Sector Scan', cycle: '60 min', quality: '97.2%', status: 'Processing' },
                { sensor: 'INSAT-3D Imager', mode: 'Full Disk', cycle: '26 min', quality: '99.1%', status: 'Acquiring' },
                { sensor: 'INSAT-3DS Imager', mode: 'Full Disk', cycle: '30 min', quality: '98.8%', status: 'Standby' },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{row.sensor}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{row.mode}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{row.cycle}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="mono-value">{row.quality}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span className={`badge ${row.status === 'Acquiring' ? 'badge-green' : row.status === 'Processing' ? 'badge-cyan' : 'badge-gold'}`} style={{ fontSize: '0.55rem' }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
