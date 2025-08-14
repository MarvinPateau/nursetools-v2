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
      return '🌪 Tempête dehors, sérénité dedans grâce à toi, ma héroïne.';
    if (cond.includes('grêle'))
      return '🌨 Les grêlons tapent, mais tu gardes la réa au chaud.';
    if (cond.includes('vent'))
      return '💨 Vent fou, ton calme en réa ne vacille jamais, ma Chloé.';
    if (cond.includes('bruine'))
      return '🌦 Bruine légère, parfait pour un câlin avant la garde.';
    if (cond.includes('pluie'))
      return '🌧 Un peu de pluie dehors, mais du soleil dans ton cœur.';
    if (cond.includes('neige'))
      return '❄️ Temps parfait pour un chocolat chaud sous un plaid.';
    if (cond.includes('orage'))
      return '⛈ Calme dans la tempête, Chloé.';
    if (cond.includes('brouillard'))
      return '🌫 Horizon flou, mission claire.';
    if (cond.includes('nuage'))
      return '🌤 Un temps doux pour adoucir la garde.';
    if (cond.includes('soleil') || cond.includes('ensoleillé'))
      return '☀️ Un grand soleil pour éclairer ta journée, Chloé !';
    if (temp !== undefined) {
      if (temp >= 35)
        return '🔥 Canicule en vue, pense à bien t’hydrater.';
      if (temp >= 30)
        return '🥵 Grosse chaleur, j’ai glissé une bouteille fraîche dans ton sac.';
      if (temp >= 25)
        return '🌡 Il fait chaud, courage pour la garde.';
      if (temp >= 15)
        return '🌼 Douce température, ton sourire rassure toute la réa.';
      if (temp >= 10)
        return '🍂 Petit air frais, je t’ai laissé un pull dans le casier.';
      if (temp <= -5)
        return '🧊 Froid mordant, tu restes la flamme des soins intensifs.';
      if (temp <= 0)
        return '🥶 Il fait glacial, couvre-toi bien !';
      if (temp < 10)
        return '🧥 Temps frais, garde ton gilet à portée.';
    }
    if (h >= 21 || h < 6)
      return '🌙 Douce nuit, prends soin de toi.';
    if (h >= 6 && h < 9)
      return '🌅 Bonjour ma star de la réa, ton café t’attend.';
    if (h >= 18 && h < 21)
      return '🌆 Fin de garde en vue, je t’attends avec un gros câlin.';
    return '🌤 Un temps doux pour adoucir la garde.';
  }, [cond, temp, h]);

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
