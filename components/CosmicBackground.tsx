'use client';

import { useEffect, useRef } from 'react';
import { useMode } from '@/lib/mode-context';

export default function CosmicBackground() {
  const { isOperational } = useMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!isOperational || !containerRef.current) return;

    // Generate stars
    const container = containerRef.current;
    const starField = container.querySelector('.star-field');
    if (starField && starField.children.length === 0) {
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = 1 + Math.random() * 2;
        const colors = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#00D4FF', '#7C3AED'];
        star.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          opacity: ${0.3 + Math.random() * 0.7};
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          --twinkle-duration: ${2 + Math.random() * 3}s;
          --twinkle-delay: ${Math.random() * 5}s;
        `;
        starField.appendChild(star);
      }
    }

    // Satellite orbit animation
    const satellite = satelliteRef.current;
    if (satellite) {
      let angle = 0;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rx = 200;
      const ry = 80;

      const animate = () => {
        angle += 0.005;
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);
        satellite.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOperational]);

  if (!isOperational) return null;

  return (
    <div className="cosmic-bg" ref={containerRef}>
      {/* Star Field */}
      <div className="star-field" style={{ position: 'absolute', inset: 0 }} />

      {/* Meteor Shower */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`meteor-${i}`}
          className="meteor-streak"
          style={{
            top: `${Math.random() * 50}%`,
            left: `${Math.random() * 80}%`,
            '--meteor-duration': `${3 + Math.random() * 3}s`,
            '--meteor-delay': `${i * 2 + Math.random() * 3}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Aurora Bands */}
      <div
        className="aurora-band"
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '200px',
          background: 'linear-gradient(180deg, rgba(0,212,255,0.12) 0%, transparent 100%)',
        }}
      />
      <div
        className="aurora-band"
        style={{
          top: '30%',
          left: 0,
          width: '150px',
          height: '60%',
          background: 'linear-gradient(90deg, rgba(0,212,255,0.08) 0%, rgba(124,58,237,0.05) 50%, transparent 100%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="aurora-band"
        style={{
          top: '20%',
          right: 0,
          width: '150px',
          height: '60%',
          background: 'linear-gradient(270deg, rgba(124,58,237,0.08) 0%, rgba(0,200,200,0.05) 50%, transparent 100%)',
          animationDelay: '4s',
        }}
      />

      {/* Orbit Rings */}
      <div className="orbit-ring orbit-ring-1">
        <div style={{
          position: 'absolute',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#00D4FF',
          boxShadow: '0 0 8px #00D4FF',
          top: '-3px',
          left: '50%',
          marginLeft: '-3px',
        }} />
      </div>
      <div className="orbit-ring orbit-ring-2">
        <div style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#7C3AED',
          boxShadow: '0 0 6px #7C3AED',
          bottom: '-2px',
          left: '25%',
        }} />
      </div>

      {/* ISRO Satellite */}
      <div
        ref={satelliteRef}
        style={{
          position: 'fixed',
          width: '30px',
          height: '30px',
          zIndex: 0,
          filter: 'drop-shadow(0 0 4px #00D4FF)',
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Satellite body */}
          <rect x="11" y="10" width="8" height="10" rx="1" fill="#00D4FF" opacity="0.9" />
          {/* Solar panels */}
          <rect x="1" y="12" width="9" height="6" rx="1" fill="#00D4FF" opacity="0.6" />
          <rect x="20" y="12" width="9" height="6" rx="1" fill="#00D4FF" opacity="0.6" />
          {/* Panel lines */}
          <line x1="4" y1="12" x2="4" y2="18" stroke="#000" strokeWidth="0.5" opacity="0.3" />
          <line x1="7" y1="12" x2="7" y2="18" stroke="#000" strokeWidth="0.5" opacity="0.3" />
          <line x1="23" y1="12" x2="23" y2="18" stroke="#000" strokeWidth="0.5" opacity="0.3" />
          <line x1="26" y1="12" x2="26" y2="18" stroke="#000" strokeWidth="0.5" opacity="0.3" />
          {/* Antenna */}
          <line x1="15" y1="10" x2="15" y2="5" stroke="#00D4FF" strokeWidth="1" />
          <circle cx="15" cy="4" r="1.5" fill="#00D4FF" />
        </svg>
      </div>
    </div>
  );
}
