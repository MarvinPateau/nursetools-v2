// File: src/App.tsx
// Rôle: point d'entrée visuel, gestion d'état d'onglet, layout général (design modernisé et épuré)

import { useState, useEffect } from 'react';
import { Header, BottomNav } from './Navigation';
import { Greeting, Tabs } from './Home';
import { TabContent } from './TabsRouter';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from './ui/motion/presets';
import { transition } from './ui/motion/transition';
import { useReducedMotion } from './ui/motion/ReducedMotion';

export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

export default function NurseToolkitApp() {
  const [tab, setTab] = useState<TabKey>('gaz');
  const [weather, setWeather] = useState<{
    location: string;
    temp: number;
    condition: string;
  } | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const API_KEY = 'd847b58a33ea424498a121309250808';
    async function loadWeather() {
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Hyères,FR&lang=fr&aqi=no`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather({
          location: data.location.name,
          temp: data.current.temp_c,
          condition: data.current.condition.text,
        });
      } catch (err) {
        console.error('Erreur météo:', err);
      }
    }
    loadWeather();
  }, []);

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Header onChangeTab={setTab} active={tab} />

      <motion.main
        initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0, transition }}
        className="mx-auto w-full max-w-3xl px-4 pb-28 sm:pb-24"
      >
        <Greeting weather={weather} />
        <Tabs active={tab} onChange={setTab} />
        <div className="mt-6 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl p-6 border border-white/70">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={fadeInUp}
              initial="hidden"
              animate="enter"
              exit="exit"
            >
              <TabContent active={tab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      <BottomNav active={tab} onChange={setTab} />

      <footer className="mt-10 border-t border-white/40 bg-white/60 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 text-sm text-slate-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              ⚠️ Cet outil aide uniquement aux calculs infirmiers — il ne
              remplace pas l'avis médical.
            </div>
            <div>© {new Date().getFullYear()} — Fait avec ❤️ pour Chloé</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
