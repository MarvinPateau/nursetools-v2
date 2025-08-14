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

export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

export default function NurseToolkitApp() {
  const [tab, setTab] = useState<TabKey>('gaz');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [dark, setDark] = useState(false);

  const prefersReduced = useReducedMotion();

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Header
          onChangeTab={setTab}
          active={tab}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
        />

        <motion.main
          className="mx-auto w-full max-w-3xl px-4 pb-28 sm:pb-24"
          initial="hidden"
          animate="visible"
          variants={prefersReduced ? undefined : fadeInUp}
          transition={transition}
        >
          <Greeting weather={weather} />
          <WeatherWidget onWeather={setWeather} showSprout />
          <Tabs active={tab} onChange={setTab} />
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="mt-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={prefersReduced ? undefined : fadeInUp}
              transition={transition}
            >
              <div className="rounded-2xl bg-card shadow-e3 p-6 border border-border">
                <TabContent active={tab} />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.main>

        <BottomNav active={tab} onChange={setTab} />

        <footer className="mt-10 border-t border-border bg-surface/70 backdrop-blur-md">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 text-sm text-muted">
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
    </div>
  );
}
