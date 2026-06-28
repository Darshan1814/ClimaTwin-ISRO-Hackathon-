'use client';

import { useRouter } from 'next/navigation';
import { useMode } from '@/lib/mode-context';
import CosmicBackground from '@/components/CosmicBackground';

const FEATURE_PILLS = [
  'Rainfall Prediction', 'Temperature Forecast', 'Monsoon Tracker', 'Digital Twin',
  'What-If Simulator', 'Extreme Events', 'INSAT Integration', 'Drought Monitor',
  'Crop Stress Analysis', 'Ocean Temps', 'Air Quality', 'AI Forecasting',
  'Scenario Analysis', 'Satellite Imagery', 'ISRO Dashboard',
];

export default function LandingPage() {
  const router = useRouter();
  const { setMode } = useMode();

  const handleLaunch = (mode: 'operational' | 'research') => {
    setMode(mode);
    router.push('/dashboard');
  };

  return (
    <>
      <CosmicBackground />
      <div className="landing-page">
        <div className="landing-hero">
          {/* Title */}
          <div className="landing-isro" style={{ marginBottom: '1.5rem' }}>
            Powered by ISRO Data Ecosystem
          </div>

          {/* Globe */}
          <div className="globe-container">
            <svg viewBox="0 0 280 280" style={{ width: '100%', height: '100%' }}>
              {/* Outer glow ring */}
              <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
              <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
              
              {/* India outline (simplified) */}
              <g transform="translate(75, 40) scale(0.45)" opacity="0.9">
                <path
                  d="M 145,25 L 185,15 225,25 220,50 200,75 230,90 280,105 290,130 295,160 275,155 270,180 260,210 230,250 220,280 200,310 175,310 150,295 140,260 115,240 105,210 95,185 70,165 65,145 75,130 85,115 100,95 120,80 140,55 Z"
                  fill="rgba(0,212,255,0.15)"
                  stroke="#00D4FF"
                  strokeWidth="2"
                />
              </g>

              {/* Animated pulse circles */}
              <circle cx="140" cy="140" r="100" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5">
                <animate attributeName="r" from="95" to="135" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="140" cy="140" r="100" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="0.5">
                <animate attributeName="r" from="90" to="130" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Data points on India */}
              {[
                [130, 100], [150, 120], [120, 140], [145, 155],
                [160, 130], [135, 170], [155, 180], [140, 110],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2" fill="#00D4FF" opacity={0.5 + (i % 3) * 0.15}>
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
          </div>

          {/* Title Text */}
          <h1 className="landing-title">CLIMATWIN INDIA</h1>
          <p className="landing-subtitle">AI-Powered Digital Twin of India&apos;s Climate</p>

          {/* Mission Stats */}
          <div className="mission-stats">
            <div className="stat-item">
              <span className="stat-number">28</span>
              <span className="stat-label">States Monitored</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Years of Data</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">AI Models</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Real-time Sync</span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="mode-selector">
            <div
              className="mode-card mode-card-operational"
              onClick={() => handleLaunch('operational')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
              <h3 style={{ color: '#00D4FF' }}>Operational Mode</h3>
              <p>Space-themed command center with real-time monitoring, cosmic animations, and live satellite tracking.</p>
              <button className="btn btn-primary">Launch →</button>
            </div>
            <div
              className="mode-card mode-card-research"
              onClick={() => handleLaunch('research')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔬</div>
              <h3>Research Mode</h3>
              <p>Clean academic dashboard optimized for data analysis, statistical summaries, and publication-ready outputs.</p>
              <button className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>Enter →</button>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="pills-container">
            <div className="pills-track">
              {[...FEATURE_PILLS, ...FEATURE_PILLS].map((pill, i) => (
                <span key={i} className="pill">{pill}</span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="landing-footer">
            Built for Stoxra Hackathon 2026 | ISRO Challenge PS-5
          </div>
        </div>
      </div>
    </>
  );
}
