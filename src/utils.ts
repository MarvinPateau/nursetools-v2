// File: src/utils.ts
// Rôle: fonctions utilitaires math/texte

export function round(n: number) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

export function safeDiv(a: number, b: number) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y) || y <= 0) return 0;
  return x / y;
}

export function scoreTxt(score: number) {
  const n = Number(score);
  if (!Number.isFinite(n)) return '-';
  return String(Math.round(n));
}

export function approxEqual(a: number, b: number, eps: number = 0.02) {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  return Math.abs(x - y) <= eps * Math.max(1, Math.abs(y));
}

export function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function toNumAllowEmpty(v: string) {
  if (v.trim() === '') return Number.NaN;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : Number.NaN;
}

// === Gazométrie helpers ===
export function pfRatio(PaO2: number, FiO2: number) {
  if (FiO2 <= 0) return 0;
  return PaO2 / FiO2;
}

export function alveolarPO2(
  FiO2: number,
  PaCO2: number,
  Patm = 760,
  PH2O = 47,
  R = 0.8
) {
  const k = Patm - PH2O;
  return FiO2 * k - PaCO2 / R; // PAO2 = FiO2*(Patm-PH2O) - PaCO2/R
}

export function aAGradientCustom(
  PaO2: number,
  PaCO2: number,
  FiO2: number,
  Patm = 760,
  PH2O = 47,
  R = 0.8
) {
  const PAO2 = alveolarPO2(FiO2, PaCO2, Patm, PH2O, R);
  return Math.max(0, PAO2 - PaO2);
}

export function anionGap(Na: number, Cl: number, HCO3: number) {
  return Number(Na) - Number(Cl) - Number(HCO3);
}

export function correctedAnionGap(ag: number, albumin_gdl: number) {
  // Correction classique: AGcorr = AG + 2.5 * (4.0 - albumine [g/dL])
  return ag + 2.5 * (4 - albumin_gdl);
}

export function primaryDisorder(pH: number, PaCO2: number, HCO3: number) {
  if (!Number.isFinite(pH) || !Number.isFinite(PaCO2) || !Number.isFinite(HCO3))
    return '—';
  const acidemia = pH < 7.35;
  const alkalemia = pH > 7.45;
  if (!acidemia && !alkalemia) return 'pH normal ou mixte';
  if (acidemia) {
    if (PaCO2 > 45 && HCO3 <= 24) return 'Acidose respiratoire';
    if (HCO3 < 22) return 'Acidose métabolique';
    return 'Acidose mixte/indéterminée';
  }
  if (alkalemia) {
    if (PaCO2 < 35 && HCO3 >= 24) return 'Alcalose respiratoire';
    if (HCO3 > 26) return 'Alcalose métabolique';
    return 'Alcalose mixte/indéterminée';
  }
  return '—';
}
