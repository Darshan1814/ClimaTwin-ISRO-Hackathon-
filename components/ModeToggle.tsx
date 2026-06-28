'use client';

import { useMode } from '@/lib/mode-context';

export default function ModeToggle() {
  const { mode, toggleMode } = useMode();

  return (
    <button className="mode-toggle" onClick={toggleMode} title="Switch mode">
      <span>{mode === 'operational' ? '🚀' : '🔬'}</span>
      <div className={`mode-toggle-switch ${mode === 'research' ? 'research' : ''}`} />
      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {mode === 'operational' ? 'Operational' : 'Research'}
      </span>
    </button>
  );
}
