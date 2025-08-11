// File: src/tabs/Gazometrie.tsx
// Rôle: onglet Gazométrie + fonctions associées

import React, { useMemo, useState } from 'react';
import { Card, FieldStr, Chip } from '../ui/UI';
import {
  round,
  correctedAnionGap,
  anionGap,
  aAGradientCustom,
  pfRatio,
  primaryDisorder,
} from '../utils';

export function GazometrieTab() {
  return (
    <section className="mt-6 space-y-6">
      <ABGTool />
    </section>
  );
}

function ABGTool() {
  const [pHStr, setPHStr] = useState<string>('7.40');
  const [PaCO2Str, setPaCO2Str] = useState<string>('40');
  const [HCO3Str, setHCO3Str] = useState<string>('24');
  const [PaO2Str, setPaO2Str] = useState<string>('95');
  const [FiO2pctStr, setFiO2pctStr] = useState<string>('21');
  const [NaStr, setNaStr] = useState<string>('140');
  const [ClStr, setClStr] = useState<string>('104');
  const [albuminStr, setAlbuminStr] = useState<string>('4');
  const [lactateStr, setLactateStr] = useState<string>('1.0');
  const [PatmStr, setPatmStr] = useState<string>('760');
  const [RStr, setRStr] = useState<string>('0.8');

  const num = (s: string) => {
    const n = parseFloat(s.replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  };

  const pH = num(pHStr);
  const PaCO2 = num(PaCO2Str);
  const HCO3 = num(HCO3Str);
  const PaO2 = num(PaO2Str);
  const FiO2pct = num(FiO2pctStr);
  const Na = num(NaStr);
  const Cl = num(ClStr);
  const albumin = num(albuminStr);
  const lactate = num(lactateStr);
  const Patm = num(PatmStr);
  const R = num(RStr);

  const FiO2 = Math.max(
    0,
    Math.min(1, (Number.isFinite(FiO2pct) ? FiO2pct : 0) / 100)
  );

  const pf = useMemo(
    () => (Number.isFinite(PaO2) && FiO2 > 0 ? pfRatio(PaO2, FiO2) : 0),
    [PaO2, FiO2]
  );
  const aagrad = useMemo(
    () =>
      Number.isFinite(PaO2) && Number.isFinite(PaCO2)
        ? aAGradientCustom(
            PaO2,
            PaCO2,
            FiO2,
            Number.isFinite(Patm) ? Patm : 760,
            47,
            Number.isFinite(R) ? R : 0.8
          )
        : 0,
    [PaO2, PaCO2, FiO2, Patm, R]
  );
  const ag = useMemo(
    () =>
      Number.isFinite(Na) && Number.isFinite(Cl) && Number.isFinite(HCO3)
        ? anionGap(Na, Cl, HCO3)
        : 0,
    [Na, Cl, HCO3]
  );
  const agCorr = useMemo(
    () => (Number.isFinite(albumin) ? correctedAnionGap(ag, albumin) : ag),
    [ag, albumin]
  );
  const disorder = useMemo(
    () =>
      Number.isFinite(pH) && Number.isFinite(PaCO2) && Number.isFinite(HCO3)
        ? primaryDisorder(pH, PaCO2, HCO3)
        : '—',
    [pH, PaCO2, HCO3]
  );

  const pfTone: 'ok' | 'warn' | 'danger' | 'info' =
    pf >= 300 ? 'ok' : pf >= 200 ? 'info' : pf >= 100 ? 'warn' : 'danger';
  const lactTone: 'ok' | 'warn' | 'danger' =
    Number.isFinite(lactate) && lactate <= 2
      ? 'ok'
      : Number.isFinite(lactate) && lactate <= 4
      ? 'warn'
      : 'danger';

  const onCopy = async () => {
    const lines = [
      `Trouble: ${disorder}`,
      `P/F: ${round(pf)}`,
      `A–a: ${round(aagrad)} mmHg`,
      `AG: ${round(ag)} | AGcorr: ${round(agCorr)}`,
      Number.isFinite(lactate) ? `Lactate: ${round(lactate)} mmol/L` : '',
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card title="Gazométrie (ABG)" subtitle="Aide à l'interprétation rapide">
      <fieldset className="rounded-2xl border p-3">
        <legend className="px-2 text-xs text-slate-600">Gaz du sang</legend>
        <div className="grid grid-cols-2 gap-3">
          <FieldStr
            label="pH"
            value={pHStr}
            onChange={setPHStr}
            placeholder="ex. 7,32"
          />
          <FieldStr
            label="PaCO₂"
            value={PaCO2Str}
            onChange={setPaCO2Str}
            suffix="mmHg"
            placeholder="ex. 52"
          />
          <FieldStr
            label="HCO₃⁻"
            value={HCO3Str}
            onChange={setHCO3Str}
            suffix="mEq/L"
            placeholder="ex. 20"
          />
          <FieldStr
            label="PaO₂"
            value={PaO2Str}
            onChange={setPaO2Str}
            suffix="mmHg"
            placeholder="ex. 75"
          />
          <FieldStr
            label="FiO₂"
            value={FiO2pctStr}
            onChange={setFiO2pctStr}
            suffix="%"
            placeholder="ex. 40"
          />
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border p-3 mt-3">
        <legend className="px-2 text-xs text-slate-600">Électrolytes</legend>
        <div className="grid grid-cols-2 gap-3">
          <FieldStr
            label="Na⁺"
            value={NaStr}
            onChange={setNaStr}
            suffix="mmol/L"
            placeholder="ex. 140"
          />
          <FieldStr
            label="Cl⁻"
            value={ClStr}
            onChange={setClStr}
            suffix="mmol/L"
            placeholder="ex. 104"
          />
          <FieldStr
            label="HCO₃⁻ (chimie)"
            value={HCO3Str}
            onChange={setHCO3Str}
            suffix="mEq/L"
          />
          <FieldStr
            label="Albumine"
            value={albuminStr}
            onChange={setAlbuminStr}
            suffix="g/dL"
            placeholder="ex. 4"
          />
          <FieldStr
            label="Lactate"
            value={lactateStr}
            onChange={setLactateStr}
            suffix="mmol/L"
            placeholder="ex. 1.6"
          />
        </div>
      </fieldset>

      <details className="mt-3">
        <summary className="text-xs text-slate-600 cursor-pointer">
          Options avancées (altitude & physiologie)
        </summary>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <FieldStr
            label="Pression atmosphérique"
            value={PatmStr}
            onChange={setPatmStr}
            suffix="mmHg"
            placeholder="760"
          />
          <FieldStr
            label="Quotient respiratoire (R)"
            value={RStr}
            onChange={setRStr}
            placeholder="0.8"
          />
        </div>
      </details>

      <div className="space-y-2 mt-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <Chip>{disorder}</Chip>
          <Chip tone={pfTone}>P/F {round(pf)}</Chip>
          <Chip>A–a {round(aagrad)} mmHg</Chip>
          <Chip>AG {round(ag)}</Chip>
          <Chip>AGcorr {round(agCorr)}</Chip>
          {Number.isFinite(lactate) && (
            <Chip tone={lactTone}>Lactate {round(lactate)} mmol/L</Chip>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-xl border text-sm hover:bg-slate-50"
            onClick={onCopy}
          >
            Copier le résumé
          </button>
        </div>
        <div className="text-[11px] text-slate-500">
          Repères: pH 7.35–7.45 ; PaCO₂ 35–45 ; HCO₃⁻ 22–26 ; P/F ≥ 300 ; AG
          normal ~8–12 (non corrigé) ; lactate ≤ 2.
        </div>
      </div>
    </Card>
  );
}
