// File: src/Home.tsx
// Header d’accueil sobre + barre d’onglets (utilise la météo passée par App)

import { useMemo } from 'react';
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
  const temp = weather?.temp;
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
    if (cond.includes('tempête'))
      return '🌪 Vigilance météo : adaptez les transferts et déplacements.';
    if (cond.includes('grêle'))
      return '🌨 Conditions instables : anticipez les contraintes logistiques.';
    if (cond.includes('vent'))
      return '💨 Vent soutenu : privilégiez une organisation simple et robuste.';
    if (cond.includes('bruine'))
      return '🌦 Conditions humides : vérifiez confort et sécurité des trajets.';
    if (cond.includes('pluie'))
      return '🌧 Journée pluvieuse : gardez des repères clairs et rapides.';
    if (cond.includes('neige'))
      return '❄️ Conditions hivernales : sécurisez les priorités de la garde.';
    if (cond.includes('orage'))
      return '⛈ Contexte orageux : maintenez un workflow calmement structuré.';
    if (cond.includes('brouillard'))
      return '🌫 Visibilité réduite : privilégiez la clarté des transmissions.';
    if (cond.includes('nuage'))
      return '🌤 Journée calme : appuyez-vous sur des outils fiables.';
    if (cond.includes('soleil') || cond.includes('ensoleillé'))
      return '☀️ Bonne journée pour avancer efficacement.';
    if (temp !== undefined) {
      if (temp >= 35)
        return '🔥 Forte chaleur : pensez hydratation et pauses régulières.';
      if (temp >= 30)
        return '🥵 Chaleur marquée : adaptez le rythme et l’hydratation.';
      if (temp >= 25)
        return '🌡 Température élevée : gardez un rythme soutenable.';
      if (temp >= 15)
        return '🌼 Conditions agréables pour une garde sereine.';
      if (temp >= 10)
        return '🍂 Air frais : pensez à vous couvrir entre deux déplacements.';
      if (temp <= -5) return '🧊 Froid intense : restez bien protégé.';
      if (temp <= 0)
        return '🥶 Température négative : prudence et équipement adapté.';
      if (temp < 10) return '🧥 Temps frais : restez bien couvert.';
    }
    if (h >= 21 || h < 6) return '🌙 Service de nuit : gardez des checks simples.';
    if (h >= 6 && h < 9) return '🌅 Démarrage de journée : focus sur l’essentiel.';
    if (h >= 18 && h < 21) return '🌆 Fin de journée : sécurisez les transmissions.';
    return '🌤 Outils rapides pour les routines de soins.';
  }, [cond, temp, h]);

  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <section className="pt-6 sm:pt-8 mb-2">
      {/* Ligne de contexte (ton + date + emoji météo discret) */}
      <div className="flex flex-wrap items-center gap-2 text-[13px] uppercase tracking-wider text-muted">
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>{wxIcon}</span>
          <span>{baseTone}</span>
        </span>
        <span className="opacity-30">•</span>
        <span className="capitalize">{dateStr}</span>
      </div>

      {/* Titre sobre avec gradient léger */}
      <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight font-display">
        <span className="bg-gradient-to-r from-moss via-primary to-mint bg-clip-text text-transparent">
          {dynamicTitle}
        </span>
      </h2>

      {/* Sous-texte concis */}
      <p className="mt-2 text-muted">
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
      'group rounded-2xl border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-ring',
      'flex items-center justify-center gap-2 px-3 py-2 text-sm',
      is
        ? 'bg-gradient-to-r from-primary to-mint text-primary-foreground border-transparent shadow-e2'
        : 'bg-surface hover:bg-surface/80 text-muted border-border',
    ].join(' ');

  return (
    <div className="mt-5 hidden sm:grid sm:grid-cols-5 gap-2" role="tablist">
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
