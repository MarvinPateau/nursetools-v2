import { useEffect, useState } from 'react';
import { useReducedMotion } from './ui/motion/ReducedMotion';
import ReactAnimatedWeather, { type Icon } from 'react-animated-weather';
import { useMascot, type MascotState } from './mascot/useMascot';

type Weather = {
  location: string;
  temp: number;
  condition: string;
};

type Props = {
  city?: string;
  onWeather?: (w: Weather | null) => void;
};

function styleFor(condition: string): { icon: Icon; bg: string; mascot: MascotState } {
  const c = condition.toLowerCase();
  if (c.includes('pluie')) return { icon: 'RAIN', bg: 'weather-rainy', mascot: 'rainy' };
  if (c.includes('neige')) return { icon: 'SNOW', bg: 'weather-snowy', mascot: 'sunny' };
  if (c.includes('nuage')) return { icon: 'CLOUDY', bg: 'weather-cloudy', mascot: 'cloudy' };
  if (c.includes('orage')) return { icon: 'SLEET', bg: 'weather-rainy', mascot: 'rainy' };
  return { icon: 'CLEAR_DAY', bg: 'weather-sunny', mascot: 'sunny' };
}

export function WeatherWidget({ city = 'Solliès-Toucas', onWeather }: Props) {
  const [data, setData] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const { setState: setMascot } = useMascot();

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
        const style = styleFor(w.condition);
        setMascot(style.mascot);
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
  }, [city, onWeather, setMascot]);

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

  const { icon, bg } = styleFor(data.condition);
  const cond = data.condition.toLowerCase();
  const message = cond.includes('pluie')
    ? 'La nature boit la pluie.'
    : 'Belle journée verdoyante.';
  return (
    <div className={`weather-card mt-4 rounded-2xl border border-border shadow-e2 text-white`}>
      <div className={`weather-bg ${bg}`} aria-hidden />
      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {!prefersReduced && (
            <ReactAnimatedWeather
              icon={icon}
              color="white"
              size={48}
              animate
            />
          )}
          <div>
            <div className="text-2xl font-bold">
              {Math.round(data.temp)}°C
            </div>
            <div className="text-sm">{data.condition}</div>
            <div className="text-xs opacity-80">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { Weather };
