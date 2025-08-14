// File: src/Navigation.tsx
// Rôle: en-têtes et navigation (desktop + mobile)

import React from 'react';
import type { TabKey } from './App';

export function Header({
  onChangeTab,
  active,
  sprout,
}: {
  onChangeTab: (t: TabKey) => void;
  active: TabKey;
  sprout?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-bg/60 border-b border-border/50">
      <div className="mx-auto w-full max-w-3xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight font-display">
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block h-6 w-6 rounded-xl bg-primary"
              aria-hidden
            />
            <span>Outils de Chloé</span>
          </span>
        </h1>
        <div className="flex items-center gap-4">
          <nav
            className="hidden sm:flex gap-2 text-sm"
            aria-label="Navigation principale"
          >
            <TopLink
              id="calculs"
              label="Calculs"
              active={active}
              onClick={onChangeTab}
            />
            <TopLink
              id="gaz"
              label="Gazométrie"
              active={active}
              onClick={onChangeTab}
            />
            <TopLink
              id="patient"
              label="Patient"
              active={active}
              onClick={onChangeTab}
            />
            <TopLink
              id="notes"
              label="Notes"
              active={active}
              onClick={onChangeTab}
            />
            <TopLink
              id="apropos"
              label="À propos"
              active={active}
              onClick={onChangeTab}
            />
          </nav>
          {sprout && <div className="hidden sm:block" aria-hidden>{sprout}</div>}
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
          ? 'bg-primary text-primary-fg border-transparent shadow'
          : 'bg-bg/60 hover:bg-bg text-foreground border-border/50'
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
      <div className="mx-auto max-w-3xl bg-bg/60 backdrop-blur-xl border-t border-border/50">
        <div className="grid grid-cols-5">
          {items.map((t) => {
            const is = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex flex-col items-center justify-center py-2 text-xs transform-gpu transition-transform duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-ring hover:scale-105 active:scale-95 ${
                  is ? 'text-primary' : 'text-muted-foreground'
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
