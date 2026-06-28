'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Mode = 'operational' | 'research';

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
  setMode: (m: Mode) => void;
  isOperational: boolean;
}

const ModeContext = createContext<ModeContextType>({
  mode: 'operational',
  toggleMode: () => {},
  setMode: () => {},
  isOperational: true,
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('operational');

  useEffect(() => {
    const saved = localStorage.getItem('climaTwin_mode') as Mode | null;
    if (saved === 'research' || saved === 'operational') {
      setModeState(saved);
      if (saved === 'research') {
        document.body.classList.add('research-mode');
      }
    }
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem('climaTwin_mode', m);
    if (m === 'research') {
      document.body.classList.add('research-mode');
    } else {
      document.body.classList.remove('research-mode');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'operational' ? 'research' : 'operational');
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode, isOperational: mode === 'operational' }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
