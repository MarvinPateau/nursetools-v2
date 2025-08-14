import { useEffect, useState } from 'react';
import ReactAnimatedWeather from 'react-animated-weather';
import { useReducedMotion } from './ui/motion/ReducedMotion';
import { Sprout } from './Sprout';

type Weather = {
  location: string;
  temp: number;
  condition: string;
};

type Props = {
  city?: string;
  onWeather?: (w: Weather | null) => void;
  showSprout?: boolean;
};

function skycon(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes('pluie')) return 'RAIN';
  if (c.includes('neige')) return 'SNOW';
  if (c.includes('nuage')) return 'CLOUDY';
  if (c.includes('orage')) return 'WIND';
  return 'CLEAR_DAY';
}

function bgFor(condition: string) {
  const c = condition.toLowerCase();
  if (c.includes('pluie')) return 'rain';
  if (c.includes('neige')) return 'snow';
  if (c.includes('nuage')) return 'cloud';
  return 'sun';
}

export function WeatherWidget({ city = 'Solliès-Toucas', onWeather, showSprout }: Props) {
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
        className={`mt-4 h-24 w-full rounded-2xl bg-card border border-border ${prefersReduced ? '' : 'animate-pulse'}`}
        aria-hidden
      />
    );
  }

  if (error || !data) {
    return (
      <div className="mt-4 text-sm text-muted" role="status">
        {error || 'Météo indisponible'}
      </div>
    );
  }

  const cond = data.condition.toLowerCase();
  const mood = cond.includes('pluie') ? 'rainy' : 'happy';
  const message = cond.includes('pluie')
    ? 'La nature boit la pluie.'
    : 'Belle journée verdoyante.';
  const bg = bgFor(data.condition);
  const icon = skycon(data.condition);

  return (
    <div className={`relative mt-4 flex items-center justify-between overflow-hidden rounded-2xl p-4 shadow-e2 border border-border text-white weather-${bg}`}>
      <div className="flex items-center gap-3">
        <ReactAnimatedWeather
          icon={icon}
          color="#fff"
          size={48}
          animate={!prefersReduced}
        />
        <div>
          <div className="text-2xl font-bold">{Math.round(data.temp)}°C</div>
          <div className="text-sm opacity-90">{data.condition}</div>
          <div className="text-xs opacity-80">{message}</div>
        </div>
      </div>
      {showSprout && (
        <span className="ml-2">
          <Sprout mood={mood} />
        </span>
      )}
    </div>
  );
}

export type { Weather };
