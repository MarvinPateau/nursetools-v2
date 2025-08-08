// File: src/tabs/Calculs.tsx
// Rôle: outils de calculs

import React, { useMemo, useState } from "react";
import { Card, Field, Result } from "../ui/UI";
import { safeDiv, round, toNum } from "../utils";

export function CalculsTab() {
  return (
    <section className="mt-6 space-y-6">
      <QuickPanel />
      <DoseCalculator />
      <div className="grid sm:grid-cols-2 gap-6">
        <InfusionRate />
        <DripRate />
      </div>
    </section>
  );
}

function QuickPanel() {
  const [w, setW] = useState<number>(60);
  const [d, setD] = useState<number>(1);
  const [c, setC] = useState<number>(10);
  const ml = safeDiv(Number(w) * Number(d), Number(c));
  return (
    <div className="rounded-3xl border bg-white p-4">
      <div className="text-sm font-medium mb-2">Raccourci: dose mg/kg → mL</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <MiniField label="Poids" value={w} suffix="kg" onChange={setW} />
        <MiniField label="Dose" value={d} suffix="mg/kg" onChange={setD} />
        <MiniField label="Concentration" value={c} suffix="mg/mL" onChange={setC} />
      </div>
      <div className="rounded-xl border bg-slate-50 text-slate-800 px-3 py-2 text-sm">≈ {round(ml)} mL</div>
    </div>
  );
}

function DoseCalculator() {
  const [mode, setMode] = useState<"mgkg" | "regle3" | "dilution">("mgkg");
  const [poids, setPoids] = useState<number>(70);
  const [doseMgKg, setDoseMgKg] = useState<number>(1);
  const [concentration, setConcentration] = useState<number>(10);
  const [voulu, setVoulu] = useState<number>(100);
  const [dispo, setDispo] = useState<number>(250);
  const [contenuAmpoule, setContenuAmpoule] = useState<number>(1000);
  const [volumeAmpoule, setVolumeAmpoule] = useState<number>(10);
  const [doseSouhaitee, setDoseSouhaitee] = useState<number>(250);

  const res = useMemo(() => {
    if (mode === "mgkg") {
      const doseTotaleMg = Number(poids) * Number(doseMgKg);
      const ml = safeDiv(doseTotaleMg, Number(concentration));
      return { text: `${round(doseTotaleMg)} mg au total → ${round(ml)} mL à prélever.`, tone: "ok" as const };
    }
    if (mode === "regle3") {
      const ml = safeDiv(Number(voulu), Number(dispo));
      return { text: `${round(ml)} mL à prélever.`, tone: "ok" as const };
    }
    if (mode === "dilution") {
      const v1 = safeDiv(Number(doseSouhaitee), Number(contenuAmpoule)) * Number(volumeAmpoule);
      return { text: `${round(v1)} mL à prélever depuis l'ampoule. Compléter avec solvant selon protocole.`, tone: "info" as const };
    }
    return { text: "", tone: "info" as const };
  }, [mode, poids, doseMgKg, concentration, voulu, dispo, contenuAmpoule, volumeAmpoule, doseSouhaitee]);

  return (
    <Card title="Calcul de dose" subtitle="Règle de trois, mg/kg, dilution">
      <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "mgkg", label: "mg/kg" },
          { id: "regle3", label: "Règle de trois" },
          { id: "dilution", label: "Dilution" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${mode === m.id ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "mgkg" && (
        <div>
          <Field label="Poids du patient" value={poids} onChange={setPoids} suffix="kg" step="0.1" />
          <Field label="Dose prescrite" value={doseMgKg} onChange={setDoseMgKg} suffix="mg/kg" step="0.1" />
          <Field label="Concentration disponible" value={concentration} onChange={setConcentration} suffix="mg/mL" step="0.1" />
          <Result>{res.text}</Result>
        </div>
      )}

      {mode === "regle3" && (
        <div>
          <Field label="Dose voulue" value={voulu} onChange={setVoulu} suffix="mg" step="0.1" />
          <Field label="Concentration (ce que vous avez)" value={dispo} onChange={setDispo} suffix="mg/mL" step="0.1" />
          <Result>{res.text}</Result>
        </div>
      )}

      {mode === "dilution" && (
        <div>
          <Field label="Contenu ampoule" value={contenuAmpoule} onChange={setContenuAmpoule} suffix="mg" />
          <Field label="Volume ampoule" value={volumeAmpoule} onChange={setVolumeAmpoule} suffix="mL" step="0.1" />
          <Field label="Dose souhaitée" value={doseSouhaitee} onChange={setDoseSouhaitee} suffix="mg" />
          <Result tone="info">{res.text}</Result>
        </div>
      )}

      <div className="text-xs text-slate-500 mt-3">Double contrôle recommandé.</div>
    </Card>
  );
}

function InfusionRate() {
  const [volume, setVolume] = useState<number>(500);
  const [heures, setHeures] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(0);

  const mlh = useMemo(() => {
    const t = Number(heures) + Number(minutes) / 60;
    if (t <= 0) return 0;
    return safeDiv(Number(volume), t);
  }, [volume, heures, minutes]);

  return (
    <Card title="Débit d'infusion" subtitle="Calcul du mL/h">
      <Field label="Volume à perfuser" value={volume} onChange={setVolume} suffix="mL" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Heures" value={heures} onChange={setHeures} suffix="h" />
        <Field label="Minutes" value={minutes} onChange={setMinutes} suffix="min" />
      </div>
      <Result>{`${round(mlh)} mL/h`}</Result>
    </Card>
  );
}

function DripRate() {
  const [volume, setVolume] = useState<number>(100);
  const [minutes, setMinutes] = useState<number>(30);
  const [df, setDf] = useState<number>(20);

  const gtt = useMemo(() => safeDiv(Number(volume) * Number(df), Number(minutes)), [volume, df, minutes]);

  return (
    <Card title="Gouttes par minute" subtitle="(Volume × facteur de chute) ÷ temps">
      <Field label="Volume" value={volume} onChange={setVolume} suffix="mL" />
      <Field label="Temps" value={minutes} onChange={setMinutes} suffix="min" />
      <Field label="Facteur de chute" value={df} onChange={setDf} suffix="gtt/mL" />
      <Result>{`${Math.round(gtt)} gtt/min`}</Result>
    </Card>
  );
}

function MiniField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="block">
      <div className="text-[11px] text-slate-600">{label}</div>
      <div className="flex items-center gap-1">
        <input
          className="w-full rounded-lg border px-2 py-1 text-sm"
          type="number"
          value={value}
          onChange={(e) => onChange(toNum(e.target.value))}
        />
        <span className="text-[11px] text-slate-500">{suffix}</span>
      </div>
    </label>
  );
}
