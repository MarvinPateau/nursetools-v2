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
import { WeatherWidget, type Weather } from './WeatherWidget';
import { Toggle } from './ui/UI';
import { Sprout } from './Sprout';

export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

export default function NurseToolkitApp() {
  const [tab, setTab] = useState<TabKey>('gaz');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [showSprout, setShowSprout] = useState(true);

  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-bg text-foreground font-sans">
      <Header
        onChangeTab={setTab}
        active={tab}
        sprout={showSprout ? <Sprout mood={weather?.condition} /> : undefined}
      />

      <motion.main
        className="mx-auto w-full max-w-3xl px-4 pb-28 sm:pb-24"
        initial="hidden"
        animate="visible"
        variants={prefersReduced ? undefined : fadeInUp}
        transition={transition}
      >
        <Greeting weather={weather} />
        <WeatherWidget onWeather={setWeather} />
        <Toggle
          label="Mascotte Sprout"
          checked={showSprout}
          onChange={setShowSprout}
        />
        <Tabs active={tab} onChange={setTab} />
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="mt-6 rounded-xl md:rounded-2xl bg-surface/80 backdrop-blur-xl shadow-elevation-3 p-6 border border-border/50"
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

      <footer className="mt-10 border-t border-border/50 bg-surface/80 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 text-sm text-muted-foreground">
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
