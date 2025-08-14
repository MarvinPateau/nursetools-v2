import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../ui/motion/ReducedMotion';
import type { MascotState } from './MascotNurse';

interface MascotContextValue {
  state: MascotState;
  setState: (s: MascotState, ttl?: number) => void;
  enabled: boolean;
  toggleEnabled: () => void;
  reduced: boolean;
  userReduced: boolean;
  toggleReduced: () => void;
}

const MascotCtx = createContext<MascotContextValue>({
  state: 'idle',
  setState: () => {},
  enabled: true,
  toggleEnabled: () => {},
  reduced: false,
  userReduced: false,
  toggleReduced: () => {},
});

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const systemReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(() => {
    if (typeof localStorage === 'undefined') return true;
    return localStorage.getItem('mascot-enabled') !== 'false';
  });
  const [userReduced, setUserReduced] = useState(() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('mascot-reduced') === 'true';
  });
  const [state, setStateInner] = useState<MascotState>('idle');
  const timer = useRef<number | undefined>(undefined);

  const setState = (s: MascotState, ttl = 2000) => {
    setStateInner(s);
    if (ttl > 0) {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStateInner('idle'), ttl);
    }
  };

  useEffect(() => {
    localStorage.setItem('mascot-enabled', String(enabled));
  }, [enabled]);

  useEffect(() => {
    localStorage.setItem('mascot-reduced', String(userReduced));
  }, [userReduced]);

  const value: MascotContextValue = {
    state,
    setState,
    enabled,
    toggleEnabled: () => setEnabled((v) => !v),
    reduced: systemReduced || userReduced,
    userReduced,
    toggleReduced: () => setUserReduced((v) => !v),
  };

  return <MascotCtx.Provider value={value}>{children}</MascotCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMascot() {
  return useContext(MascotCtx);
}
