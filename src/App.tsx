import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator, ClipboardList, Droplets, FlaskConical, Home, Settings, Stethoscope } from 'lucide-react';
import { Header, BottomNav } from './Navigation';
import {
  BiologyNormsTool,
  BurnTool,
  DoseTool,
  DripTool,
  InfusionTool,
  ServicePresetSettings,
} from './tabs/Calculs';
import type { ServiceId } from './tabs/servicePresets';
import { GazometrieTab } from './tabs/Gazometrie';
import { PatientTab, NotesTab } from './tabs/PatientNotes';
import { transition } from './ui/motion/transition';
import { fadeInUp } from './ui/motion/presets';
import { useReducedMotion } from './ui/motion/ReducedMotion';

export type SectionKey = 'home' | 'tools' | 'memos' | 'settings';
export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

type ToolId = 'dose' | 'infusion' | 'drip' | 'burn' | 'bio' | 'gazo' | 'patient' | 'notes';

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
    title: 'Calculs médicamenteux',
    subtitle: 'Dose, dilution, débits, presets service',
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
    id: 'drip',
    title: 'Gouttes / minute',
    subtitle: 'Calcul isolé du débit en gtt/min',
    icon: <Droplets className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'burn',
    title: 'Surface brûlée',
    subtitle: 'TBSA + Parkland (adulte)',
    icon: <FlaskConical className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'bio',
    title: 'Normes biologie',
    subtitle: 'Référence rapide dédiée',
    icon: <ClipboardList className="h-7 w-7" />,
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
    icon: <Home className="h-7 w-7" />,
    section: 'tools',
  },
  {
    id: 'notes',
    title: 'Notes rapides',
    subtitle: 'Mémo local de garde',
    icon: <Settings className="h-7 w-7" />,
    section: 'memos',
  },
];

export default function NurseToolkitApp() {
  const [section, setSection] = useState<SectionKey>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [service, setService] = useState<ServiceId>('polyvalent');
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
    if (section === 'tools') return 'Outils cliniques';
    if (section === 'memos') return 'Mémos';
    return 'Réglages';
  }, [section, activeTool]);

  const visibleTools = useMemo(() => {
    if (section === 'home') return TOOLS;
    if (section === 'settings') return [];
    return TOOLS.filter((t) => t.section === section);
  }, [section]);

  const renderTool = () => {
    if (activeTool === 'dose') return <DoseTool service={service} />;
    if (activeTool === 'infusion') return <InfusionTool />;
    if (activeTool === 'drip') return <DripTool />;
    if (activeTool === 'burn') return <BurnTool />;
    if (activeTool === 'bio') return <BiologyNormsTool />;
    if (activeTool === 'gazo') return <GazometrieTab />;
    if (activeTool === 'patient') return <PatientTab />;
    if (activeTool === 'notes') return <NotesTab />;
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
                  {section === 'settings' && (
                    <div className="mb-4 rounded-2xl border border-border bg-card p-3">
                      <ServicePresetSettings service={service} onServiceChange={setService} />
                    </div>
                  )}
                  <p className="text-sm text-muted mb-4">
                    Choisissez un outil en un geste. Interface optimisée pour usage rapide en situation de fatigue.
                  </p>
                  {visibleTools.length > 0 ? (
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
                  ) : (
                    <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted">
                      Configurez ici vos presets de service. Ils sont injectés automatiquement dans les calculateurs.
                    </div>
                  )}
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
