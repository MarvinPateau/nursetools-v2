import { useEffect, useState } from 'react';
import { useReducedMotion } from './ui/motion/ReducedMotion';

type WeatherLite = { location: string; temp: number; condition: string };

type Props = {
  city?: string;
  onWeather?: (w: WeatherLite) => void;
};

export default function WeatherWidget({ city = 'Solliès-Toucas', onWeather }: Props) {
  const [data, setData] = useState<(WeatherLite & { isDay: boolean }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const key = import.meta.env.VITE_WEATHER_API_KEY;
    if (!key) {
      setError('Clé API météo manquante');
      return;
    }
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city)}&lang=fr&aqi=no`;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        const w = {
          location: json.location.name as string,
          temp: json.current.temp_c as number,
          condition: json.current.condition.text as string,
          isDay: json.current.is_day === 1,
        };
        setData(w);
        onWeather?.({ location: w.location, temp: w.temp, condition: w.condition });
      })
      .catch(() => setError('Impossible de charger la météo.'));
  }, [city, onWeather]);

  const iconFor = (condition: string, isDay: boolean) => {
    const c = condition.toLowerCase();
    if (!isDay) return Moon;
    if (c.includes('pluie')) return Rain;
    if (c.includes('neige')) return Snow;
    if (c.includes('orage')) return Storm;
    if (c.includes('nuage') || c.includes('couvert')) return Cloud;
    return Sun;
  };

  if (error) {
    return <div className="mt-4 text-sm text-red-500">{error}</div>;
  }
  if (!data) {
    return (
      <div
        className={`mt-4 h-10 w-full rounded-xl bg-white/60 text-slate-500 flex items-center justify-center ${
          prefersReduced ? '' : 'motion-safe:animate-pulse'
        }`}
      >
        Chargement météo…
      </div>
    );
  }

  return (
    <div
      className="mt-4 flex items-center gap-2 text-sm text-slate-700"
      role="region"
      aria-label={`Météo actuelle pour ${data.location}`}
    >
      <span aria-hidden>{iconFor(data.condition, data.isDay)}</span>
      <span className="font-medium">{data.temp}°C</span>
      <span className="capitalize">{data.condition}</span>
    </div>
  );
}

const Sun = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 text-yellow-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const Cloud = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 text-slate-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const Rain = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 text-blue-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M16 14v6" />
    <path d="M8 14v6" />
    <path d="M12 16v6" />
  </svg>
);

const Snow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 text-cyan-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M8 15h.01" />
    <path d="M8 19h.01" />
    <path d="M12 17h.01" />
    <path d="M12 21h.01" />
    <path d="M16 15h.01" />
    <path d="M16 19h.01" />
  </svg>
);

const Storm = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 text-yellow-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
    <path d="m13 12-3 5h4l-3 5" />
  </svg>
);

const Moon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6 text-slate-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
  </svg>
);
