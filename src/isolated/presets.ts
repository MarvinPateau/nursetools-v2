export type ServicePresetId = 'polyvalent' | 'urgences' | 'usi' | 'pediatrie';

export type ServicePreset = {
  id: ServicePresetId;
  label: string;
  defaultConcentrationMgMl: number;
  dripFactor: number;
  checks: string[];
};

export const SERVICE_PRESETS: Record<ServicePresetId, ServicePreset> = {
  polyvalent: {
    id: 'polyvalent',
    label: 'Polyvalent',
    defaultConcentrationMgMl: 10,
    dripFactor: 20,
    checks: ['Vérifier poids patient', 'Double contrôle dose/unité'],
  },
  urgences: {
    id: 'urgences',
    label: 'Urgences',
    defaultConcentrationMgMl: 5,
    dripFactor: 20,
    checks: ['Priorité à la lisibilité du résultat', "Tracer heure de préparation"],
  },
  usi: {
    id: 'usi',
    label: 'USI / Réa',
    defaultConcentrationMgMl: 4,
    dripFactor: 60,
    checks: ['Double contrôle IDE/IDE', 'Vérifier pousse-seringue et concentration'],
  },
  pediatrie: {
    id: 'pediatrie',
    label: 'Pédiatrie',
    defaultConcentrationMgMl: 1,
    dripFactor: 60,
    checks: ['Poids actualisé du jour obligatoire', 'Re-vérifier dose maximale'],
  },
};
