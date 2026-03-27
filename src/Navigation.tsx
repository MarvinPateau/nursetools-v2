import { ArrowLeft, Calculator, Home, Moon, Settings, Stethoscope, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SectionKey } from './App';

export function Header({
  title,
  dark,
  onToggleDark,
  onBack,
}: {
  title: string;
  dark: boolean;
  onToggleDark: () => void;
  onBack?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/92 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Retour"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary">
              <Stethoscope className="h-4 w-4" />
            </div>
          )}
          <h1 className="truncate text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
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
  active: SectionKey;
  onChange: (t: SectionKey) => void;
}) {
  const items: { id: SectionKey; icon: ReactNode; label: string }[] = [
    { id: 'home', icon: <Home className="h-4 w-4" />, label: 'Accueil' },
    { id: 'calculs', icon: <Calculator className="h-4 w-4" />, label: 'Calculs' },
    { id: 'scores', icon: <Stethoscope className="h-4 w-4" />, label: 'Scores' },
    { id: 'settings', icon: <Settings className="h-4 w-4" />, label: 'Réglages' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40" aria-label="Navigation principale mobile">
      <div className="mx-auto max-w-4xl bg-surface/95 backdrop-blur-xl border-t border-border shadow-e4">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {items.map((t) => {
            const is = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex flex-col items-center justify-center rounded-xl py-2 text-[11px] transition duration-200 focus:outline-none focus:ring-2 focus:ring-ring ${
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
