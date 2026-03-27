import { useEffect, useMemo, useState } from 'react';
import { Card, Field, Result } from '../ui/UI';
import { round, safeDiv } from '../utils';
import type { ServicePreset } from './presets';

export function DoseTool({ preset }: { preset: ServicePreset }) {
  const [weight, setWeight] = useState<number>(70);
  const [doseMgKg, setDoseMgKg] = useState<number>(1);
  const [concentration, setConcentration] = useState<number>(preset.defaultConcentrationMgMl);

  useEffect(() => {
    setConcentration(preset.defaultConcentrationMgMl);
  }, [preset.defaultConcentrationMgMl]);

  const totalDose = useMemo(() => round(weight * doseMgKg), [weight, doseMgKg]);
  const volumeMl = useMemo(() => round(safeDiv(totalDose, concentration)), [totalDose, concentration]);
  const invalid = weight <= 0 || doseMgKg < 0 || concentration <= 0;

  return (
    <section className="space-y-4">
      <Card title="Entrées patient" subtitle="Saisissez uniquement les paramètres nécessaires">
        <Field label="Poids" value={weight} onChange={(v) => setWeight(Number(v))} suffix="kg" min={0} />
        <Field
          label="Dose prescrite"
          value={doseMgKg}
          onChange={(v) => setDoseMgKg(Number(v))}
          suffix="mg/kg"
          min={0}
          step="0.1"
        />
        <Field
          label="Concentration"
          value={concentration}
          onChange={(v) => setConcentration(Number(v))}
          suffix="mg/mL"
          min={0}
          step="0.1"
        />
      </Card>

      <Card title="Résultat" subtitle="Lecture immédiate avant administration">
        <Result tone={invalid ? 'danger' : 'success'}>
          <div className="text-2xl sm:text-4xl">{invalid ? 'Entrée invalide' : `${volumeMl} mL à prélever`}</div>
          {!invalid && <div className="text-sm mt-1 opacity-80">Dose totale: {totalDose} mg</div>}
        </Result>
      </Card>
    </section>
  );
}

export function PerfusionTool({ preset }: { preset: ServicePreset }) {
  const [volume, setVolume] = useState<number>(500);
  const [hours, setHours] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [dripFactor, setDripFactor] = useState<number>(preset.dripFactor);

  useEffect(() => {
    setDripFactor(preset.dripFactor);
  }, [preset.dripFactor]);

  const totalHours = useMemo(() => hours + minutes / 60, [hours, minutes]);
  const mlh = useMemo(() => round(safeDiv(volume, totalHours)), [volume, totalHours]);
  const gttMin = useMemo(() => Math.round(safeDiv(volume * dripFactor, hours * 60 + minutes)), [volume, dripFactor, hours, minutes]);

  const endTime = useMemo(() => {
    const [h, m] = startTime.split(':').map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return '—';
    const d = new Date();
    d.setHours(h, m, 0, 0);
    d.setMinutes(d.getMinutes() + hours * 60 + minutes);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }, [startTime, hours, minutes]);

  const invalid = volume <= 0 || totalHours <= 0;

  return (
    <section className="space-y-4">
      <Card title="Entrées perfusion" subtitle="Paramètres opérationnels">
        <Field label="Volume" value={volume} onChange={(v) => setVolume(Number(v))} suffix="mL" min={0} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heures" value={hours} onChange={(v) => setHours(Number(v))} suffix="h" min={0} />
          <Field label="Minutes" value={minutes} onChange={(v) => setMinutes(Number(v))} suffix="min" min={0} />
        </div>
        <Field
          label="Facteur de chute"
          value={dripFactor}
          onChange={(v) => setDripFactor(Number(v))}
          suffix="gtt/mL"
          min={0}
        />
        <label className="block mb-3">
          <div className="text-sm text-muted mb-1">Heure de début</div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
      </Card>

      <Card title="Résultat" subtitle="Double lecture avant branchement">
        <Result tone={invalid ? 'danger' : 'info'}>
          <div className="text-2xl sm:text-4xl">{invalid ? 'Entrée invalide' : `${mlh} mL/h`}</div>
          {!invalid && (
            <div className="text-sm mt-1 opacity-90">
              {gttMin} gtt/min • Fin estimée: {endTime}
            </div>
          )}
        </Result>
      </Card>
    </section>
  );
}

export function BiologyReferenceTool() {
  const items = [
    ['pH artériel', '7.35 – 7.45'],
    ['PaCO₂', '35 – 45 mmHg'],
    ['HCO₃⁻', '22 – 26 mEq/L'],
    ['Lactate', '≤ 2 mmol/L'],
    ['Na⁺', '135 – 145 mmol/L'],
    ['K⁺', '3.5 – 5.0 mmol/L'],
    ['Créatinine', '≈ 45 – 105 µmol/L'],
  ];

  return (
    <Card title="Normes biologie" subtitle="Référence rapide isolée">
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-surface px-3 py-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{k}</div>
            <div className="text-xs text-muted">{v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
