import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator, ClipboardList, FlaskConical, NotebookPen, Settings, Stethoscope } from 'lucide-react';
import { Header, BottomNav } from './Navigation';
import { BiologyNormsToolView, DoseToolView, InfusionToolView, ServicePresetSettings } from './tabs/Calculs';
import { GazometrieTab } from './tabs/Gazometrie';
import { PatientTab, NotesTab } from './tabs/PatientNotes';
import { transition } from './ui/motion/transition';
import { fadeInUp } from './ui/motion/presets';
import { useReducedMotion } from './ui/motion/ReducedMotion';

export type SectionKey = 'home' | 'tools' | 'memos' | 'settings';
export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

type ToolId = 'dose' | 'infusion' | 'bio' | 'gazo' | 'patient' | 'notes' | 'protocoles';

type ToolMeta = {
  id: ToolId;
  title: string;
  subtitle: string;
  icon: ReactNode;
  section: Exclude<SectionKey, 'home'>;
};

const TOOLS: ToolMeta[] = [
  {
    id: 'dose',
    title: 'Calcul de dose',
    subtitle: 'Dose, dilution, sécurité',
    icon: <Calculator className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'infusion',
    title: 'Perfusion / Surveillance',
    subtitle: 'mL/h, gouttes/min, heure de fin',
    icon: <Stethoscope className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'bio',
    title: 'Normes biologie',
    subtitle: 'Référentiel rapide',
    icon: <FlaskConical className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'gazo',
    title: 'Gazométrie',
    subtitle: 'ABG, P/F, AG, lactate',
    icon: <Stethoscope className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'patient',
    title: 'Repères patient',
    subtitle: 'CrCl, IMC',
    icon: <ClipboardList className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'notes',
    title: 'Notes rapides',
    subtitle: 'Mémo local de garde',
    icon: <NotebookPen className="h-7 w-7" />,
    section: 'memos',
  },
  {
    id: 'protocoles',
    title: 'Protocoles service',
    subtitle: 'Presets actifs',
    icon: <Settings className="h-7 w-7" />,
    section: 'settings',
  },
];

export default function NurseToolkitApp() {
  const [section, setSection] = useState<SectionKey>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
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
    } catch {
      // ignore storage errors
    }
  }, [dark]);

  const currentTitle = useMemo(() => {
    if (activeTool) return TOOLS.find((t) => t.id === activeTool)?.title ?? 'Outil';
    if (section === 'home') return 'Tableau de bord';
    if (section === 'tools') return 'Outils';
    if (section === 'memos') return 'Mémos';
    return 'Réglages';
  }, [section, activeTool]);

  const visibleTools = useMemo(() => {
    if (section === 'home') return TOOLS;
    if (section === 'settings') return TOOLS.filter((t) => t.section === 'settings');
    return TOOLS.filter((t) => t.section === section);
  }, [section]);

  const renderTool = () => {
    if (activeTool === 'dose') return <DoseToolView />;
    if (activeTool === 'infusion') return <InfusionToolView />;
    if (activeTool === 'bio') return <BiologyNormsToolView />;
    if (activeTool === 'gazo') return <GazometrieTab />;
    if (activeTool === 'patient') return <PatientTab />;
    if (activeTool === 'notes') return <NotesTab />;
    if (activeTool === 'protocoles') return <ServicePresetSettings />;
    return null;
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
                <section className="rounded-3xl border border-border bg-card shadow-e4 p-4 sm:p-6">
                  {renderTool()}
                </section>
              ) : (
                <section>
                  <p className="text-sm text-muted mb-4">
                    Choisissez un outil isolé: une vue = une tâche. Zéro scroll inutile, zéro mélange des contextes.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {visibleTools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setActiveTool(tool.id)}
                        className="text-left rounded-2xl border border-border bg-card p-4 shadow-e2 hover:shadow-e4 transition focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-primary">
                          {tool.icon}
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                          {tool.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted leading-snug">{tool.subtitle}</p>
                      </button>
                    ))}
                  </div>
                </section>
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
