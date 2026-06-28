'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMode } from '@/lib/mode-context';
import CosmicBackground from '@/components/CosmicBackground';
import ModeToggle from '@/components/ModeToggle';
import ExportButton from '@/components/ExportButton';

const NAV_ITEMS = [
  { icon: '🌍', label: 'Mission Control', href: '/dashboard' },
  { icon: '🌧️', label: 'Rainfall Monitor', href: '/dashboard/rainfall' },
  { icon: '🌡️', label: 'Temperature Field', href: '/dashboard/temperature' },
  { icon: '🌀', label: 'Monsoon Tracker', href: '/dashboard/monsoon' },
  { icon: '🛰️', label: 'Satellite View', href: '/dashboard/satellites' },
  { icon: '🤖', label: 'AI Forecast Engine', href: '/dashboard/ai-forecast' },
  { icon: '🗺️', label: 'Climate Map', href: '/dashboard/climate-map' },
  { icon: '⚡', label: 'Digital Twin', href: '/dashboard/digital-twin' },
  { icon: '🎛️', label: 'What-If Simulator', href: '/dashboard/what-if' },
  { icon: '🔥', label: 'Extreme Events', href: '/dashboard/extremes' },
  { icon: '🌾', label: 'Agriculture Impact', href: '/dashboard/agriculture' },
  { icon: '💧', label: 'Drought Monitor', href: '/dashboard/drought' },
  { icon: '🌊', label: 'Ocean Surface', href: '/dashboard/ocean' },
  { icon: '💨', label: 'Air Quality', href: '/dashboard/air-quality' },
  { icon: '📊', label: 'Compare Regions', href: '/dashboard/compare' },
  { icon: '📄', label: 'Reports & Export', href: '/dashboard/reports' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isOperational } = useMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentNav = NAV_ITEMS.find(item => item.href === pathname) || NAV_ITEMS[0];

  return (
    <>
      {isOperational && <CosmicBackground />}

      <div className="dashboard-layout">
        {/* Mobile Overlay */}
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-logo">
            <div className="sidebar-logo-monogram">CT</div>
            <div>
              <div className="sidebar-logo-text">ClimaTwin</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                ISRO Digital Twin
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-sidebar)',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            ISRO × ClimaTwin 2026
          </div>
        </aside>

        {/* Main Content */}
        <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? '260px' : '0' }}>
          {/* Top Header */}
          <header className="top-header">
            <div className="header-left">
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                ☰
              </button>
              <div className="header-breadcrumb">
                ClimaTwin / <span>{currentNav.label}</span>
              </div>
            </div>

            <div className="header-center">
              IST {time}
            </div>

            <div className="header-right">
              <ModeToggle />
              <div className="live-indicator">
                <span className="pulse-dot" />
                <span>Data Sync Active</span>
              </div>
              <ExportButton elementId="page-content" title={currentNav.label} />
            </div>
          </header>

          {/* Page Content */}
          <main className="page-content" id="page-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
