export type ServiceId = 'polyvalent' | 'urgences' | 'usi' | 'grandsBrules' | 'pediatrie';

type ServicePreset = {
  label: string;
  standardConcentrationMgMl: number;
  regleTroisReferenceMgMl: number;
  doubleCheckRules: string[];
  tools: string[];
};

export const SERVICE_PRESETS: Record<ServiceId, ServicePreset> = {
  polyvalent: {
    label: 'Service polyvalent',
    standardConcentrationMgMl: 10,
    regleTroisReferenceMgMl: 250,
    doubleCheckRules: [
      'Double contrôle dose et unité (mg vs µg).',
      'Vérifier poids de référence et fonction rénale.',
    ],
    tools: ['Dose mg/kg', 'Débit perfusion', 'Gouttes/min'],
  },
  urgences: {
    label: 'Urgences',
    standardConcentrationMgMl: 5,
    regleTroisReferenceMgMl: 100,
    doubleCheckRules: [
      "Tracer heure de préparation et heure d'administration.",
      'Double contrôle obligatoire pour bolus/vasopresseurs.',
    ],
    tools: ['Bolus rapide mL/kg', 'Shock index', 'Règle de trois'],
  },
  usi: {
    label: 'USI / Réanimation',
    standardConcentrationMgMl: 4,
    regleTroisReferenceMgMl: 40,
    doubleCheckRules: [
      'Toujours valider concentration seringue sur pousse-seringue.',
      'Double contrôle IDE/IDE pour catécholamines et sédation.',
    ],
    tools: ['Débit mL/h', 'Dose µg/kg/min → mL/h', 'Gazométrie'],
  },
  grandsBrules: {
    label: 'Unité grands brûlés',
    standardConcentrationMgMl: 2,
    regleTroisReferenceMgMl: 50,
    doubleCheckRules: [
      'Recalculer la surface brûlée (%) à chaque réévaluation.',
      'Tracer bilan entrée/sortie et objectifs de diurèse.',
    ],
    tools: ['Parkland 24h', 'Surface brûlée (règle des 9)', 'Débit perfusion'],
  },
  pediatrie: {
    label: 'Pédiatrie',
    standardConcentrationMgMl: 1,
    regleTroisReferenceMgMl: 10,
    doubleCheckRules: [
      'Toujours calculer sur poids actualisé du jour.',
      'Double contrôle systématique avant administration IV.',
    ],
    tools: ['Dose mg/kg', 'Bolus mL/kg', 'Limites max pédiatriques'],
  },
};
