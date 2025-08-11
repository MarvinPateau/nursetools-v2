// File: src/Home.tsx
// Header d’accueil sobre + barre d’onglets (utilise la météo passée par App)

import React, { useMemo } from 'react';
import type { TabKey } from './App';

type WeatherLite = { location: string; temp: number; condition: string } | null;

export function Greeting({ weather }: { weather: WeatherLite }) {
  // Heure → ton général
  const now = new Date();
  const h = now.getHours();
  const baseTone =
    h < 6
      ? 'Très tôt'
      : h < 12
      ? 'Bonjour'
      : h < 18
      ? 'Bon après-midi'
      : h < 22
      ? 'Bonsoir'
      : 'Douce nuit';

  // Cond météo → emoji & titre discrets (si météo dispo)
  const cond = (weather?.condition || '').toLowerCase();
  const wxIcon = cond.includes('pluie')
    ? '🌧️'
    : cond.includes('neige')
    ? '❄️'
    : cond.includes('orage')
    ? '⛈️'
    : cond.includes('nuage')
    ? '☁️'
    : cond.includes('bruine')
    ? '🌦️'
    : cond.includes('soleil') || cond.includes('ensoleillé')
    ? '☀️'
    : h < 6 || h >= 21
    ? '🌙'
    : '🌤️';

  const dynamicTitle = useMemo(() => {
    if (cond.includes('pluie'))
      return 'Chloé, prends le temps — tout en douceur.';
    if (cond.includes('neige')) return 'Chloé, au chaud et efficace.';
    if (cond.includes('orage')) return 'Chloé, calme dans la tempête.';
    if (cond.includes('nuage')) return 'Chloé, l’essentiel, sans nuages.';
    if (cond.includes('soleil') || cond.includes('ensoleillé'))
      return 'Chloé, clair et rapide comme un rayon.';
    return 'Chloé, tout ce qu’il te faut, dans ta poche.';
  }, [cond]);

  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <section className="pt-6 sm:pt-8 mb-2">
      {/* Ligne de contexte (ton + date + emoji météo discret) */}
      <div className="flex flex-wrap items-center gap-2 text-[13px] uppercase tracking-wider text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>{wxIcon}</span>
          <span>{baseTone}</span>
        </span>
        <span className="opacity-30">•</span>
        <span className="capitalize">{dateStr}</span>
      </div>

      {/* Titre sobre avec gradient léger */}
      <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight font-display">
        <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-600 bg-clip-text text-transparent">
          {dynamicTitle}
        </span>
      </h2>

      {/* Sous-texte concis */}
      <p className="mt-2 text-slate-600">
        Calculs rapides, repères utiles et outils patients.
        <span className="hidden sm:inline">
          {' '}
          Optimisé pour mobile, hors stress.
        </span>
      </p>
      {/* NB: la ligne météo détaillée est affichée dans App, juste sous le Greeting. */}
    </section>
  );
}

export function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const items: { id: TabKey; label: string; icon: string }[] = [
    { id: 'calculs', icon: '💊', label: 'Calculs' },
    { id: 'gaz', icon: '🩸', label: 'Gazométrie' },
    { id: 'patient', icon: '🧪', label: 'Patient' },
    { id: 'notes', icon: '🗒️', label: 'Notes' },
    { id: 'apropos', icon: 'ℹ️', label: 'À propos' },
  ];

  const cls = (is: boolean) =>
    [
      'group rounded-2xl border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20',
      'flex items-center justify-center gap-2 px-3 py-2 text-sm',
      is
        ? 'bg-gradient-to-r from-brand-600 to-cyan-500 text-white border-transparent shadow'
        : 'bg-white/60 hover:bg-white text-slate-700 border-white/60',
    ].join(' ');

  return (
    <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2" role="tablist">
      {items.map((t) => {
        const is = active === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={is}
            onClick={() => onChange(t.id)}
            className={cls(is)}
          >
            <span className="text-base leading-none" aria-hidden>
              {t.icon}
            </span>
            <span className="font-medium">{t.label}</span>
            {is && (
              <span
                className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-white/80"
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
