import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator, FileText, FlaskConical, Gauge, Stethoscope } from 'lucide-react';
import { Header, BottomNav } from './Navigation';
import { GazometrieTab } from './tabs/Gazometrie';
import { PatientTab, NotesTab } from './tabs/PatientNotes';
import {
  BiologyReferenceTool,
  DoseTool,
  InfusionTool,
  ServicePresetPanel,
} from './tools/ClinicalTools';
import { SERVICE_PRESETS, type ServicePresetId } from './tools/presets';
import { transition } from './ui/motion/transition';
import { fadeInUp } from './ui/motion/presets';
import { useReducedMotion } from './ui/motion/ReducedMotion';

export type SectionKey = 'home' | 'tools' | 'memos' | 'settings';
export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

type ToolId = 'dose' | 'perfusion' | 'bio' | 'gazo' | 'patient';

type ToolMeta = {
  id: ToolId;
  title: string;
  subtitle: string;
  icon: ReactNode;
  section: 'tools' | 'memos';
};

const TOOLS: ToolMeta[] = [
  {
    id: 'dose',
    title: 'Calcul de dose',
    subtitle: 'Dose totale + volume à prélever',
    icon: <Calculator className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'perfusion',
    title: 'Perfusion / Surveillance',
    subtitle: 'mL/h, gtt/min, heure de fin',
    icon: <Gauge className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'bio',
    title: 'Normes biologie',
    subtitle: 'Références rapides dédiées',
    icon: <FlaskConical className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'gazo',
    title: 'Gazométrie',
    subtitle: 'Interprétation ABG',
    icon: <Stethoscope className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'patient',
    title: 'Repères patient',
    subtitle: 'CrCl / IMC',
    icon: <FileText className="h-7 w-7" />,
    section: 'tools',
  },
];

export default function NurseToolkitApp() {
  const [section, setSection] = useState<SectionKey>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [preset, setPreset] = useState<ServicePresetId>('polyvalent');
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

  useEffect(() => {
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      localStorage.setItem('servicePreset', preset);
    } catch {
      // ignore storage errors
    }
  }, [dark, preset]);

  useEffect(() => {
    try {
      const savedPreset = localStorage.getItem('servicePreset') as ServicePresetId | null;
      if (savedPreset && SERVICE_PRESETS[savedPreset]) setPreset(savedPreset);
    } catch {
      // ignore storage errors
    }
  }, []);

  const currentTitle = useMemo(() => {
    if (activeTool) return TOOLS.find((t) => t.id === activeTool)?.title ?? 'Outil';
    if (section === 'home') return 'Accueil';
    if (section === 'tools') return 'Outils';
    if (section === 'memos') return 'Mémos';
    return 'Réglages';
  }, [section, activeTool]);

  const visibleTools = useMemo(() => {
    if (section === 'home') return TOOLS;
    if (section === 'tools') return TOOLS.filter((t) => t.section === 'tools');
    return [];
  }, [section]);

  const renderTool = () => {
    if (activeTool === 'dose') return <DoseTool preset={preset} />;
    if (activeTool === 'perfusion') return <InfusionTool preset={preset} />;
    if (activeTool === 'bio') return <BiologyReferenceTool />;
    if (activeTool === 'gazo') return <GazometrieTab />;
    if (activeTool === 'patient') return <PatientTab />;
    return null;
  };

  const renderSection = () => {
    if (section === 'memos') return <NotesTab />;
    if (section === 'settings') return <ServicePresetPanel preset={preset} onChange={setPreset} />;

    return (
      <section>
        <p className="text-sm text-muted mb-4">
          Accès rapide aux vues isolées. Chaque carte ouvre un outil dédié plein écran, sans scroll parasite.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                setSection('tools');
                setActiveTool(tool.id);
              }}
              className="text-left rounded-2xl border border-border bg-card p-4 shadow-e2 hover:shadow-e4 transition focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-primary">
                {tool.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">{tool.title}</h3>
              <p className="mt-1 text-xs text-muted leading-snug">{tool.subtitle}</p>
            </button>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-slate-900 dark:text-slate-100 font-sans">
        <Header
          title={currentTitle}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onBack={activeTool ? () => setActiveTool(null) : undefined}
        />

        <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-4 sm:pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool ?? section}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={prefersReduced ? undefined : fadeInUp}
              transition={transition}
            >
              {activeTool ? (
                <section className="rounded-3xl border border-border bg-card shadow-e4 p-4 sm:p-6">{renderTool()}</section>
              ) : (
                <section className="rounded-3xl border border-border bg-card shadow-e3 p-4 sm:p-6">{renderSection()}</section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav
          active={section}
          onChange={(next) => {
            setSection(next);
            setActiveTool(null);
          }}
        />
      </div>
    </div>
  );
}
