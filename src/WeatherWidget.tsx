import { useEffect, useState } from 'react';
import { useReducedMotion } from './ui/motion/ReducedMotion';

type Weather = {
  location: string;
  temp: number;
  condition: string;
};

type Props = {
  city?: string;
  onWeather?: (w: Weather | null) => void;
};

function iconFor(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes('pluie'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M4 16.5a4.5 4.5 0 0 1 1-8.9 5.5 5.5 0 0 1 10.9 1.4 4 4 0 0 1 2.1 7.5" />
        <path d="M16 13v3" />
        <path d="M12 16v3" />
        <path d="M8 13v3" />
      </svg>
    );
  if (c.includes('neige'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 2v20" />
        <path d="M4.93 6.93l14.14 14.14" />
        <path d="M4.93 21.07L19.07 6.93" />
        <path d="M2 12h20" />
      </svg>
    );
  if (c.includes('nuage'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M17.5 19a4.5 4.5 0 0 0-.9-8.9A5.5 5.5 0 0 0 6 9.5a4 4 0 0 0 1 7.9h10.5z" />
      </svg>
    );
  if (c.includes('orage'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M13 16l-3 5" />
        <path d="M13 16l4-8" />
        <path d="M3 13a4 4 0 0 1 2-7.5 5.5 5.5 0 0 1 10.9 1.4 4 4 0 0 1 2.1 7.5" />
      </svg>
    );
  // default sun
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
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

export function WeatherWidget({ city = 'Solliès-Toucas', onWeather }: Props) {
  const [data, setData] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    async function load() {
      const key = import.meta.env.VITE_WEATHER_API_KEY;
      if (!key) {
        setError('Clé API manquante');
        onWeather?.(null);
        setLoading(false);
        return;
      }
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city)}&lang=fr&aqi=no`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erreur réseau');
        const json = await res.json();
        const w: Weather = {
          location: json.location.name,
          temp: json.current.temp_c,
          condition: json.current.condition.text,
        };
        setData(w);
        onWeather?.(w);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('Météo indisponible');
        onWeather?.(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [city, onWeather]);

  if (loading) {
    return (
      <div
        className={`mt-2 h-8 w-32 rounded bg-white/50 ${prefersReduced ? '' : 'animate-pulse'}`}
        aria-hidden
      />
    );
  }

  if (error || !data) {
    return (
      <div className="mt-2 text-sm text-slate-500" role="status">
        {error || 'Météo indisponible'}
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-slate-700">
      <span aria-hidden>{iconFor(data.condition)}</span>
      <span className="text-sm">
        {Math.round(data.temp)}°C — {data.condition}
      </span>
    </div>
  );
}

export type { Weather };
