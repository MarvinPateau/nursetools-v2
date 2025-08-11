// File: src/TabsRouter.tsx
// Rôle: routeur d'onglets -> rend le bon bloc selon l'onglet actif

import type { TabKey } from './App';
import { CalculsTab } from './tabs/Calculs';
import { GazometrieTab } from './tabs/Gazometrie';
import { PatientTab, NotesTab, AProposTab } from './tabs/PatientNotes';

export function TabContent({ active }: { active: TabKey }) {
  if (active === 'calculs') return <CalculsTab />;
  if (active === 'gaz') return <GazometrieTab />;
  if (active === 'patient') return <PatientTab />;
  if (active === 'notes') return <NotesTab />;
  return <AProposTab />;
}
