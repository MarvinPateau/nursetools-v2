// File: src/App.tsx
// Rôle: point d'entrée visuel, gestion d'état d'onglet, layout général (design modernisé et épuré)

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, BottomNav } from './Navigation';
import { Greeting, Tabs } from './Home';
import { TabContent } from './TabsRouter';
import { fadeInUp } from './ui/motion/presets';
import { transition } from './ui/motion/transition';
import { useReducedMotion } from './ui/motion/ReducedMotion';
import WeatherWidget from './WeatherWidget';

export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

export default function NurseToolkitApp() {
  const [tab, setTab] = useState<TabKey>('gaz');
  const [weather, setWeather] = useState<{
    location: string;
    temp: number;
    condition: string;
  } | null>(null);

  const prefersReduced = useReducedMotion();

  // La météo est désormais chargée par le composant WeatherWidget

  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <Header onChangeTab={setTab} active={tab} />

      <motion.main
        className="mx-auto w-full max-w-3xl px-4 pb-28 sm:pb-24"
        initial="hidden"
        animate="visible"
        variants={prefersReduced ? undefined : fadeInUp}
        transition={transition}
      >
        <Greeting weather={weather} />
        <WeatherWidget onWeather={setWeather} />
        <Tabs active={tab} onChange={setTab} />
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="mt-6 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl p-6 border border-white/70"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={prefersReduced ? undefined : fadeInUp}
            transition={transition}
          >
            <TabContent active={tab} />
          </motion.div>
        </AnimatePresence>
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
