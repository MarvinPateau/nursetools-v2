import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type MascotState =
  | 'idle'
  | 'hello'
  | 'success'
  | 'error'
  | 'thinking'
  | 'loading'
  | 'sleep'
  | 'nightShift'
  | 'sunny'
  | 'rainy'
  | 'cloudy';

type MascotContextValue = {
  state: MascotState;
  setState: (s: MascotState) => void;
  enabled: boolean;
  toggleEnabled: () => void;
  reduced: boolean;
  toggleReduced: () => void;
};

const MascotContext = createContext<MascotContextValue | null>(null);

export function MascotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MascotState>('idle');
  const [enabled, setEnabled] = useState(() => getStoredBool('mascot-enabled', true));
  const [reduced, setReduced] = useState(() => getStoredBool('mascot-reduced', false));

  useEffect(() => {
    try {
      localStorage.setItem('mascot-enabled', enabled ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [enabled]);

  useEffect(() => {
    try {
      localStorage.setItem('mascot-reduced', reduced ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [reduced]);

  return (
    <MascotContext.Provider
      value={{
        state,
        setState,
        enabled,
        toggleEnabled: () => setEnabled((e) => !e),
        reduced,
        toggleReduced: () => setReduced((r) => !r),
      }}
    >
      {children}
    </MascotContext.Provider>
  );
}

function getStoredBool(key: string, fallback: boolean) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === '1';
  } catch {
    return fallback;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMascot() {
  const ctx = useContext(MascotContext);
  if (!ctx) throw new Error('useMascot must be used within MascotProvider');
  return ctx;
}
