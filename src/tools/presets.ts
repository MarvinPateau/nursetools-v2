export type ServicePresetId = 'polyvalent' | 'urgences' | 'usi' | 'grandsBrules' | 'pediatrie';

export type ServicePreset = {
  id: ServicePresetId;
  label: string;
  doseConcentration: number;
  dropFactor: number;
  info: string;
};

export const SERVICE_PRESETS: Record<ServicePresetId, ServicePreset> = {
  polyvalent: {
    id: 'polyvalent',
    label: 'Polyvalent',
    doseConcentration: 10,
    dropFactor: 20,
    info: 'Usage standard adulte avec double contrôle IDE.',
  },
  urgences: {
    id: 'urgences',
    label: 'Urgences',
    doseConcentration: 5,
    dropFactor: 20,
    info: 'Priorité vitesse/sécurité, traçabilité horaire stricte.',
  },
  usi: {
    id: 'usi',
    label: 'USI / Réanimation',
    doseConcentration: 4,
    dropFactor: 60,
    info: 'Validation concentration pousse-seringue avant administration.',
  },
  grandsBrules: {
    id: 'grandsBrules',
    label: 'Grands brûlés',
    doseConcentration: 2,
    dropFactor: 20,
    info: 'Réévaluation rapprochée des besoins hydriques et bilan entrée/sortie.',
  },
  pediatrie: {
    id: 'pediatrie',
    label: 'Pédiatrie',
    doseConcentration: 1,
    dropFactor: 60,
    info: 'Poids du jour obligatoire, vérification dose max systématique.',
  },
};
