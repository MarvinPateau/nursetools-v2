// File: src/Navigation.tsx
// Rôle: en-têtes et navigation (desktop + mobile)

import type { TabKey } from './App';

function Sun() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

export function Header({
  onChangeTab,
  active,
  dark,
  onToggleDark,
}: {
  onChangeTab: (t: TabKey) => void;
  active: TabKey;
  dark: boolean;
  onToggleDark: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-surface/70 backdrop-blur-md shadow-e2 border-b border-border">
      <div className="mx-auto w-full max-w-3xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight font-display">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-xl bg-primary" aria-hidden />
            <span>Outils de Chloé</span>
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <nav
            className="hidden sm:flex gap-2 text-sm"
            aria-label="Navigation principale"
          >
            <TopLink id="calculs" label="Calculs" active={active} onClick={onChangeTab} />
            <TopLink id="gaz" label="Gazométrie" active={active} onClick={onChangeTab} />
            <TopLink id="patient" label="Patient" active={active} onClick={onChangeTab} />
            <TopLink id="notes" label="Notes" active={active} onClick={onChangeTab} />
            <TopLink id="apropos" label="À propos" active={active} onClick={onChangeTab} />
          </nav>
          <button
            onClick={onToggleDark}
            aria-label="Changer de thème"
            className="p-2 rounded-full hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ring"
            aria-pressed={dark}
          >
            {dark ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function TopLink({
  id,
  label,
  active,
  onClick,
}: {
  id: TabKey;
  label: string;
  active: TabKey;
  onClick: (t: TabKey) => void;
}) {
  const is = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-3 py-1.5 rounded-full border transform-gpu transition-transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-ring hover:scale-105 active:scale-95 ${
        is
          ? 'bg-gradient-to-r from-primary to-mint text-primary-foreground border-transparent shadow-e2'
          : 'bg-surface hover:bg-surface/80 text-muted border-border'
      }`}
      aria-current={is ? 'page' : undefined}
    >
      {label}
    </button>
  );
}

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const items: { id: TabKey; icon: string; label: string }[] = [
    { id: 'calculs', icon: '💊', label: 'Calculs' },
    { id: 'gaz', icon: '🩸', label: 'Gaz' },
    { id: 'patient', icon: '🧪', label: 'Patient' },
    { id: 'notes', icon: '🗒️', label: 'Notes' },
    { id: 'apropos', icon: 'ℹ️', label: 'Infos' },
  ];
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden"
      aria-label="Navigation mobile"
    >
      <div className="mx-auto max-w-3xl bg-surface/70 backdrop-blur-md border-t border-border shadow-e2">
        <div className="grid grid-cols-5">
          {items.map((t) => {
            const is = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex flex-col items-center justify-center py-2 text-xs transform-gpu transition-transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-ring hover:scale-105 active:scale-95 ${
                  is ? 'text-primary' : 'text-muted'
                }`}
                aria-current={is ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden>
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
