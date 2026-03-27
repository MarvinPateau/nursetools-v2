// File: src/Navigation.tsx
// Rôle: en-têtes et navigation (desktop + mobile)

import type { TabKey } from './App';
import type { ReactNode } from 'react';
import {
  Activity,
  Calculator,
  Info,
  Moon,
  NotebookPen,
  Sun,
  UserRound,
} from 'lucide-react';

export function Header({
  dark,
  onToggleDark,
}: {
  dark: boolean;
  onToggleDark: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Nurse Toolkit</p>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Outils Infirmiers
          </h1>
        </div>
        <button
          onClick={onToggleDark}
          aria-label="Changer de thème"
          className="p-2.5 rounded-full border border-border bg-card hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ring transition"
          aria-pressed={dark}
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const items: { id: TabKey; icon: ReactNode; label: string }[] = [
    { id: 'calculs', icon: <Calculator className="h-4 w-4" />, label: 'Calculs' },
    { id: 'gaz', icon: <Activity className="h-4 w-4" />, label: 'Gaz' },
    { id: 'patient', icon: <UserRound className="h-4 w-4" />, label: 'Patient' },
    { id: 'notes', icon: <NotebookPen className="h-4 w-4" />, label: 'Notes' },
    { id: 'apropos', icon: <Info className="h-4 w-4" />, label: 'Infos' },
  ];
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden"
      aria-label="Navigation mobile"
    >
      <div className="mx-auto max-w-3xl bg-surface/92 backdrop-blur-xl border-t border-border shadow-e4">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {items.map((t) => {
            const is = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex flex-col items-center justify-center rounded-xl py-2 text-[11px] transform-gpu transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring ${
                  is ? 'bg-card text-primary shadow-e2' : 'text-muted hover:bg-card/80'
                }`}
                aria-current={is ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden>
                  {t.icon}
                </span>
                <span className="mt-1">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
