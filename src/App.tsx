import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Calculator, ClipboardList, FlaskConical, Settings2, UserRound } from 'lucide-react';
import { Header, BottomNav } from './Navigation';
import { GazometrieTab } from './tabs/Gazometrie';
import { PatientTab, NotesTab } from './tabs/PatientNotes';
import { transition } from './ui/motion/transition';
import { fadeInUp } from './ui/motion/presets';
import { useReducedMotion } from './ui/motion/ReducedMotion';
import {
  BiologyReferenceTool,
  DoseTool,
  PerfusionTool,
} from './isolated/IsolatedTools';
import { SERVICE_PRESETS, type ServicePreset, type ServicePresetId } from './isolated/presets';

export type SectionKey = 'home' | 'tools' | 'memos' | 'settings';
export type TabKey = 'calculs' | 'gaz' | 'patient' | 'notes' | 'apropos';

type ToolId = 'dose' | 'perfusion' | 'gazometrie' | 'patient' | 'bio';

type ToolMeta = {
  id: ToolId;
  title: string;
  subtitle: string;
  icon: ReactNode;
  section: 'tools';
  category: 'Calculs' | 'Réanimation' | 'Scores';
};

const TOOLS: ToolMeta[] = [
  {
    id: 'dose',
    title: 'Calcul de dose',
    subtitle: 'Dose → volume à prélever',
    icon: <Calculator className="h-7 w-7" />,
    section: 'tools',
    category: 'Calculs',
  },
  {
    id: 'perfusion',
    title: 'Perfusion',
    subtitle: 'mL/h, gtt/min, heure de fin',
    icon: <ClipboardList className="h-7 w-7" />,
    section: 'tools',
    category: 'Calculs',
  },
  {
    id: 'gazometrie',
    title: 'Gazométrie',
    subtitle: 'Interprétation ABG rapide',
    icon: <Activity className="h-7 w-7" />,
    section: 'tools',
    category: 'Réanimation',
  },
  {
    id: 'patient',
    title: 'Repères patient',
    subtitle: 'CrCl, IMC',
    icon: <UserRound className="h-7 w-7" />,
    section: 'tools',
    category: 'Scores',
  },
  {
    id: 'bio',
    title: 'Normes biologie',
    subtitle: 'Référence rapide isolée',
    icon: <FlaskConical className="h-7 w-7" />,
    section: 'tools',
    category: 'Scores',
  },
];

export default function NurseToolkitApp() {
  const [section, setSection] = useState<SectionKey>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [search, setSearch] = useState('');
  const [serviceId, setServiceId] = useState<ServicePresetId>('polyvalent');
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

  const preset: ServicePreset = SERVICE_PRESETS[serviceId];

  const currentTitle = useMemo(() => {
    if (activeTool) return TOOLS.find((t) => t.id === activeTool)?.title ?? 'Outil';
    if (section === 'home') return 'Accueil';
    if (section === 'tools') return 'Outils';
    if (section === 'memos') return 'Mémos';
    return 'Réglages';
  }, [section, activeTool]);

  const renderTool = () => {
    if (activeTool === 'dose') return <DoseTool preset={preset} />;
    if (activeTool === 'perfusion') return <PerfusionTool preset={preset} />;
    if (activeTool === 'gazometrie') return <GazometrieTab />;
    if (activeTool === 'patient') return <PatientTab />;
    if (activeTool === 'bio') return <BiologyReferenceTool />;
    return null;
  };

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [search]);

  const toolsByCategory = useMemo(() => {
    const groups: Record<string, ToolMeta[]> = {};
    for (const t of filteredTools) {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    }
    return groups;
  }, [filteredTools]);

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
                <section className="rounded-3xl border border-border bg-card shadow-e4 p-4 sm:p-6 pb-24">
                  {renderTool()}
                </section>
              ) : section === 'home' ? (
                <section className="space-y-4 pb-24">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nurse&apos;s Toolbox</h2>
                    <p className="text-sm text-muted mt-1">
                      Navigation simple: sélectionnez une section principale depuis cette page.
                    </p>
                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        onClick={() => setSection('tools')}
                        className="rounded-xl border border-border bg-surface px-4 py-3 text-left hover:bg-card"
                      >
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ouvrir les outils cliniques</div>
                        <div className="text-xs text-muted">Calcul de dose, perfusion, gazométrie, normes biologie…</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSection('memos')}
                        className="rounded-xl border border-border bg-surface px-4 py-3 text-left hover:bg-card"
                      >
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ouvrir les mémos</div>
                        <div className="text-xs text-muted">Notes rapides de garde.</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSection('settings')}
                        className="rounded-xl border border-border bg-surface px-4 py-3 text-left hover:bg-card"
                      >
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Configurer le protocole local</div>
                        <div className="text-xs text-muted">Presets service injectés automatiquement dans les calculs.</div>
                      </button>
                    </div>
                  </div>
                </section>
              ) : section === 'tools' ? (
                <section className="space-y-4 pb-24">
                  <p className="text-sm text-muted">Recherche rapide + outils groupés par catégorie.</p>
                  <div className="rounded-2xl border border-border bg-card p-3">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher un outil…"
                      className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-sm"
                    />
                  </div>
                  {Object.entries(toolsByCategory).map(([category, list]) => (
                    <section key={category} className="space-y-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {list.map((tool) => (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => setActiveTool(tool.id)}
                            className="text-left rounded-2xl border border-border bg-card p-4 shadow-e2 hover:shadow-e4 transition focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-primary">
                              {tool.icon}
                            </div>
                            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                              {tool.title}
                            </h4>
                            <p className="mt-1 text-xs text-muted leading-snug">{tool.subtitle}</p>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </section>
              ) : section === 'memos' ? (
                <section className="rounded-3xl border border-border bg-card shadow-e4 p-4 sm:p-6 pb-24">
                  <NotesTab />
                </section>
              ) : (
                <section className="space-y-4 rounded-3xl border border-border bg-card shadow-e4 p-4 sm:p-6 pb-24">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Protocole local actif</h2>
                  <p className="text-sm text-muted">
                    Les presets service sont gérés ici et injectés automatiquement dans les outils Dose et Perfusion.
                  </p>
                  <label className="block">
                    <div className="text-sm text-muted mb-1">Service</div>
                    <select
                      className="w-full rounded-md border border-border bg-surface px-3 py-2"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value as ServicePresetId)}
                    >
                      <option value="polyvalent">Polyvalent</option>
                      <option value="urgences">Urgences</option>
                      <option value="usi">USI / Réa</option>
                      <option value="pediatrie">Pédiatrie</option>
                    </select>
                  </label>
                  <div className="rounded-2xl border border-border bg-surface p-3">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{preset.label}</div>
                    <div className="text-xs text-muted mt-1">Concentration par défaut: {preset.defaultConcentrationMgMl} mg/mL</div>
                    <div className="text-xs text-muted">Facteur de chute: {preset.dripFactor} gtt/mL</div>
                    <ul className="mt-2 space-y-1 text-xs text-muted">
                      {preset.checks.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-3 text-sm text-muted">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Settings2 className="h-4 w-4" /> Sécurité
                    </div>
                    Les résultats restent une aide au calcul : toujours appliquer le protocole local et le double contrôle IDE.
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
