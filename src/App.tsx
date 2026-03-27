// File: src/App.tsx
// Rôle: point d'entrée visuel, gestion d'état d'onglet, layout général (design modernisé et épuré)

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, BottomNav } from './Navigation';
import { Greeting, Tabs, ColorGuide } from './Home';
import { TabContent } from './TabsRouter';
import { fadeInUp } from './ui/motion/presets';
import { transition } from './ui/motion/transition';
import { useReducedMotion } from './ui/motion/ReducedMotion';
import { WeatherWidget, type Weather } from './WeatherWidget';

export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

export default function NurseToolkitApp() {
  const [tab, setTab] = useState<TabKey>('gaz');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore storage errors
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const prefersReduced = useReducedMotion();
  const domainFrameClass: Record<TabKey, string> = {
    calculs: 'domain-frame-calculs',
    gaz: 'domain-frame-gaz',
    patient: 'domain-frame-patient',
    notes: 'domain-frame-notes',
    apropos: 'domain-frame-apropos',
  };

  useEffect(() => {
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [dark]);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-slate-900 dark:text-slate-100 font-sans">
        <Header
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
        />

        <motion.main
          className="mx-auto w-full max-w-4xl px-4 pb-28 sm:pb-24"
          initial="hidden"
          animate="visible"
          variants={prefersReduced ? undefined : fadeInUp}
          transition={transition}
        >
          <Greeting weather={weather} />
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            <div className="rounded-2xl border border-border bg-card px-3 py-2 text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted">Usage</div>
              <div className="text-lg font-semibold tabular-nums">1 main</div>
            </div>
            <div className="rounded-2xl border border-border bg-card px-3 py-2 text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted">Contexte</div>
              <div className="text-lg font-semibold tabular-nums">Urgence</div>
            </div>
            <div className="rounded-2xl border border-border bg-card px-3 py-2 text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted">Priorité</div>
              <div className="text-lg font-semibold tabular-nums">Lisibilité</div>
            </div>
            <div className="rounded-2xl border border-border bg-card px-3 py-2 text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted">Contrôle</div>
              <div className="text-lg font-semibold tabular-nums">Double-check</div>
            </div>
          </section>
          <Tabs active={tab} onChange={setTab} />
          <ColorGuide active={tab} />
          <WeatherWidget onWeather={setWeather} />
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
              <div className={`rounded-3xl bg-card shadow-e3 p-5 sm:p-6 border border-border ${domainFrameClass[tab]}`}>
                <TabContent active={tab} />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.main>

        <BottomNav active={tab} onChange={setTab} />

        <footer className="mt-10 border-t border-border bg-surface/80 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-4xl px-4 py-6 text-sm text-muted">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                ⚠️ Cet outil aide uniquement aux calculs infirmiers — il ne
                remplace pas l’avis médical.
              </div>
              <div>© {new Date().getFullYear()} NurseTools</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
