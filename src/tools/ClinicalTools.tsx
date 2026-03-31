import { useEffect, useMemo, useState } from 'react';
import { Card, Field, Result, Select } from '../ui/UI';
import { round, safeDiv } from '../utils';
import { SERVICE_PRESETS, type ServicePresetId } from './presets';

export function ServicePresetPanel({
  preset,
  onChange,
}: {
  preset: ServicePresetId;
  onChange: (id: ServicePresetId) => void;
}) {
  const p = SERVICE_PRESETS[preset];
  return (
    <Card title="Protocoles de service" subtitle="Réglage global injecté dans les outils de calcul">
      <Select
        label="Service actif"
        value={preset}
        onChange={(v) => onChange(v as ServicePresetId)}
        options={Object.values(SERVICE_PRESETS).map((s) => ({ v: s.id, l: s.label }))}
      />
      <div className="rounded-xl border border-border bg-surface p-3 text-sm text-muted">
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Concentration par défaut:</span>{' '}
          {p.doseConcentration} mg/mL
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Facteur de chute:</span> {p.dropFactor} gtt/mL
        </p>
        <p className="mt-2">{p.info}</p>
      </div>
    </Card>
  );
}

export function DoseTool({ preset }: { preset: ServicePresetId }) {
  const p = SERVICE_PRESETS[preset];
  const [weight, setWeight] = useState<number>(70);
  const [doseMgKg, setDoseMgKg] = useState<number>(1);
  const [concentration, setConcentration] = useState<number>(p.doseConcentration);

  useEffect(() => {
    setConcentration(p.doseConcentration);
  }, [p.doseConcentration]);

  const doseMg = round(weight * doseMgKg);
  const volumeMl = round(safeDiv(doseMg, concentration));
  const invalid = weight <= 0 || doseMgKg < 0 || concentration <= 0;

  return (
    <div className="space-y-4">
      <Card title="Entrées patient" subtitle="Renseignez uniquement les paramètres de dose">
        <Field label="Poids" value={weight} onChange={(v) => setWeight(Number(v))} suffix="kg" min={0} step="0.1" />
        <Field
          label="Dose prescrite"
          value={doseMgKg}
          onChange={(v) => setDoseMgKg(Number(v))}
          suffix="mg/kg"
          min={0}
          step="0.1"
        />
        <Field
          label="Concentration active"
          value={concentration}
          onChange={(v) => setConcentration(Number(v))}
          suffix="mg/mL"
          min={0}
          step="0.1"
        />
      </Card>

      <Card title="Résultat" subtitle="Lecture sécurisée avant administration">
        <div className="rounded-3xl border-2 border-primary bg-primary/10 px-4 py-5 text-center transition-transform duration-300 hover:scale-[1.01]">
          <div className="text-xs uppercase tracking-wider text-muted">Dose totale</div>
          <div className="text-4xl sm:text-5xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
            {invalid ? '—' : `${doseMg} mg`}
          </div>
          <div className="mt-2 text-xs uppercase tracking-wider text-muted">Volume à prélever</div>
          <div className="text-4xl sm:text-5xl font-extrabold tabular-nums text-primary">
            {invalid ? '—' : `${volumeMl} mL`}
          </div>
        </div>
        {invalid ? (
          <Result tone="danger">Entrées invalides: poids et concentration &gt; 0, dose ≥ 0.</Result>
        ) : (
          <Result tone="success">{doseMg} mg à préparer, soit {volumeMl} mL.</Result>
        )}
      </Card>
    </div>
  );
}

export function InfusionTool({ preset }: { preset: ServicePresetId }) {
  const p = SERVICE_PRESETS[preset];
  const [volume, setVolume] = useState<number>(500);
  const [hours, setHours] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(0);
  const [dropFactor, setDropFactor] = useState<number>(p.dropFactor);
  const [startTime, setStartTime] = useState<string>('08:00');

  useEffect(() => {
    setDropFactor(p.dropFactor);
  }, [p.dropFactor]);

  const totalHours = hours + minutes / 60;
  const mlh = round(safeDiv(volume, totalHours));
  const gttMin = Math.round(safeDiv(volume * dropFactor, hours * 60 + minutes));

  const finishTime = useMemo(() => {
    const [h, m] = startTime.split(':').map((v) => Number(v));
    if (!Number.isFinite(h) || !Number.isFinite(m)) return '—';
    const d = new Date();
    d.setHours(h, m, 0, 0);
    d.setMinutes(d.getMinutes() + Math.max(0, hours * 60 + minutes));
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }, [startTime, hours, minutes]);

  return (
    <div className="space-y-4">
      <Card title="Entrées perfusion" subtitle="Volume, durée et matériel">
        <Field label="Volume" value={volume} onChange={(v) => setVolume(Number(v))} suffix="mL" min={0} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heures" value={hours} onChange={(v) => setHours(Number(v))} suffix="h" min={0} />
          <Field label="Minutes" value={minutes} onChange={(v) => setMinutes(Number(v))} suffix="min" min={0} />
        </div>
        <Field
          label="Facteur de chute"
          value={dropFactor}
          onChange={(v) => setDropFactor(Number(v))}
          suffix="gtt/mL"
          min={0}
        />
        <label className="block">
          <div className="text-sm text-muted mb-1">Heure de début</div>
          <input
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-base"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
      </Card>

      <Card title="Résultat" subtitle="Lecture immédiate des débits">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-3xl border-2 border-primary bg-primary/10 p-4 text-center transition-transform duration-300 hover:scale-[1.01]">
            <div className="text-xs uppercase tracking-wider text-muted">Débit</div>
            <div className="text-4xl font-extrabold tabular-nums text-primary">{mlh} mL/h</div>
          </div>
          <div className="rounded-3xl border-2 border-info bg-info/10 p-4 text-center transition-transform duration-300 hover:scale-[1.01]">
            <div className="text-xs uppercase tracking-wider text-muted">Gouttes/min</div>
            <div className="text-4xl font-extrabold tabular-nums text-info">{gttMin} gtt/min</div>
          </div>
        </div>
        <Result tone="info">Heure de fin estimée: {finishTime}</Result>
      </Card>
    </div>
  );
}

export function BiologyReferenceTool() {
  const rows = [
    ['pH artériel', '7.35–7.45'],
    ['PaCO₂', '35–45 mmHg'],
    ['HCO₃⁻', '22–26 mEq/L'],
    ['Lactate', '≤ 2 mmol/L'],
    ['Na⁺', '135–145 mmol/L'],
    ['K⁺', '3.5–5.0 mmol/L'],
    ['Créatinine', '45–105 µmol/L'],
    ['Glycémie à jeun', '0.70–1.10 g/L'],
  ];

  return (
    <Card title="Normes biologie" subtitle="Référence rapide dédiée">
      <div className="space-y-2">
        {rows.map(([l, r]) => (
          <div key={l} className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2">
            <span className="text-sm text-slate-900 dark:text-slate-100">{l}</span>
            <span className="text-sm font-semibold tabular-nums text-primary">{r}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
