// File: src/tabs/Calculs.tsx
// Rôle: outils de calculs

import { useMemo, useState } from "react";
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
  const hasInvalidValues = w <= 0 || d < 0 || c <= 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-sm font-medium mb-2">Raccourci: dose mg/kg → mL</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <MiniField label="Poids" value={w} suffix="kg" onChange={(v) => setW(Number(v))} />
        <MiniField label="Dose" value={d} suffix="mg/kg" onChange={(v) => setD(Number(v))} />
        <MiniField
          label="Concentration"
          value={c}
          suffix="mg/mL"
          onChange={(v) => setC(Number(v))}
        />
      </div>
      <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
        ≈ {round(ml)} mL
      </div>
      {hasInvalidValues && (
        <div className="mt-2 text-xs text-danger">
          Vérifiez les entrées: poids et concentration doivent être {'>'} 0, dose ≥ 0.
        </div>
      )}
    </div>
  );
}

type DoseMode = "mgkg" | "regle3" | "dilution";
function DoseCalculator() {
  const [mode, setMode] = useState<DoseMode>("mgkg");
  const [poids, setPoids] = useState<number>(70);
  const [doseMgKg, setDoseMgKg] = useState<number>(1);
  const [concentration, setConcentration] = useState<number>(10);
  const [voulu, setVoulu] = useState<number>(100);
  const [dispo, setDispo] = useState<number>(250);
  const [contenuAmpoule, setContenuAmpoule] = useState<number>(1000);
  const [volumeAmpoule, setVolumeAmpoule] = useState<number>(10);
  const [doseSouhaitee, setDoseSouhaitee] = useState<number>(250);
  const [age, setAge] = useState<number>(65);
  const [poidsRef, setPoidsRef] = useState<"reel" | "ideal" | "ajuste">("reel");
  const [renal, setRenal] = useState<"normal" | "renale" | "dialyse">("normal");
  const [grossesse, setGrossesse] = useState<"non" | "oui">("non");

  const safetyAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (mode === "mgkg") {
      if (poids <= 0) alerts.push("Poids patient invalide (doit être > 0 kg).");
      if (doseMgKg < 0) alerts.push("Dose mg/kg négative non autorisée.");
      if (concentration <= 0) alerts.push("Concentration invalide (doit être > 0 mg/mL).");
      if (doseMgKg > 50) alerts.push("Dose mg/kg élevée: vérifier l'unité et la prescription.");
      if (concentration > 1000) alerts.push("Concentration très élevée: confirmer la dilution.");
    }
    if (mode === "regle3") {
      if (voulu < 0) alerts.push("Dose voulue négative non autorisée.");
      if (dispo <= 0) alerts.push("Concentration disponible invalide (doit être > 0).");
    }
    if (mode === "dilution") {
      if (contenuAmpoule <= 0) alerts.push("Contenu ampoule invalide (doit être > 0).");
      if (volumeAmpoule <= 0) alerts.push("Volume ampoule invalide (doit être > 0 mL).");
      if (doseSouhaitee < 0) alerts.push("Dose souhaitée négative non autorisée.");
      if (doseSouhaitee > contenuAmpoule)
        alerts.push("Dose souhaitée > contenu ampoule: dilution/reconstitution à confirmer.");
    }

    if (age >= 75) alerts.push("Patient âgé: démarrer bas et recontrôler la tolérance.");
    if (renal !== "normal")
      alerts.push("Contexte rénal à risque: adapter la posologie selon protocole local.");
    if (grossesse === "oui")
      alerts.push("Grossesse déclarée: vérifier les contre-indications spécifiques.");
    if (poidsRef !== "reel")
      alerts.push("Poids de référence non réel: valider la formule de dose choisie.");

    return alerts;
  }, [
    mode,
    poids,
    doseMgKg,
    concentration,
    voulu,
    dispo,
    contenuAmpoule,
    volumeAmpoule,
    doseSouhaitee,
    age,
    renal,
    grossesse,
    poidsRef,
  ]);

  const hardStop = useMemo(() => {
    if (mode === "mgkg") return poids <= 0 || doseMgKg < 0 || concentration <= 0;
    if (mode === "regle3") return voulu < 0 || dispo <= 0;
    if (mode === "dilution")
      return contenuAmpoule <= 0 || volumeAmpoule <= 0 || doseSouhaitee < 0;
    return false;
  }, [mode, poids, doseMgKg, concentration, voulu, dispo, contenuAmpoule, volumeAmpoule, doseSouhaitee]);

  const res = useMemo(() => {
    if (hardStop) {
      return {
        text: "Entrée invalide: corrigez les champs en erreur avant validation.",
        tone: "danger" as const,
      };
    }
    if (mode === "mgkg") {
      const doseTotaleMg = Number(poids) * Number(doseMgKg);
      const ml = safeDiv(doseTotaleMg, Number(concentration));
      return { text: `${round(doseTotaleMg)} mg au total → ${round(ml)} mL à prélever.`, tone: "success" as const };
    }
    if (mode === "regle3") {
      const ml = safeDiv(Number(voulu), Number(dispo));
      return { text: `${round(ml)} mL à prélever.`, tone: "success" as const };
    }
    if (mode === "dilution") {
      const v1 = safeDiv(Number(doseSouhaitee), Number(contenuAmpoule)) * Number(volumeAmpoule);
      return {
        text: `${round(v1)} mL à prélever depuis l'ampoule. Compléter avec solvant selon protocole.`,
        tone: "info" as const,
      };
    }
    return { text: "", tone: "info" as const };
  }, [mode, poids, doseMgKg, concentration, voulu, dispo, contenuAmpoule, volumeAmpoule, doseSouhaitee, hardStop]);

  return (
    <Card title="Calcul de dose" subtitle="Règle de trois, mg/kg, dilution">
      <div className="mb-3 rounded-xl border border-border bg-surface p-3">
        <div className="text-xs font-medium text-muted mb-2">Contexte patient (sécurité)</div>
        <div className="grid sm:grid-cols-2 gap-2">
          <Field label="Âge" value={age} onChange={(v) => setAge(Number(v))} suffix="ans" min={0} />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-muted">
              Poids de référence
              <select
                className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={poidsRef}
                onChange={(e) => setPoidsRef(e.target.value as "reel" | "ideal" | "ajuste")}
              >
                <option value="reel">Réel</option>
                <option value="ideal">Idéal</option>
                <option value="ajuste">Ajusté</option>
              </select>
            </label>
            <label className="text-sm text-muted">
              Fonction rénale
              <select
                className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={renal}
                onChange={(e) => setRenal(e.target.value as "normal" | "renale" | "dialyse")}
              >
                <option value="normal">Normale</option>
                <option value="renale">Insuffisance</option>
                <option value="dialyse">Dialyse</option>
              </select>
            </label>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={grossesse === "oui"}
              onChange={(e) => setGrossesse(e.target.checked ? "oui" : "non")}
            />
            Grossesse
          </label>
        </div>
      </div>

      <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
        {(
          [
            { id: "mgkg", label: "mg/kg" },
            { id: "regle3", label: "Règle de trois" },
            { id: "dilution", label: "Dilution" },
          ] as { id: DoseMode; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${
              mode === m.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface text-muted border-border hover:bg-card"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "mgkg" && (
        <div>
          <Field
            label="Poids du patient"
            value={poids}
            onChange={(v) => setPoids(Number(v))}
            suffix="kg"
            step="0.1"
            min={0}
          />
          <Field
            label="Dose prescrite"
            value={doseMgKg}
            onChange={(v) => setDoseMgKg(Number(v))}
            suffix="mg/kg"
            step="0.1"
            min={0}
          />
          <Field
            label="Concentration disponible"
            value={concentration}
            onChange={(v) => setConcentration(Number(v))}
            suffix="mg/mL"
            step="0.1"
            min={0}
          />
          <Result tone={res.tone}>{res.text}</Result>
        </div>
      )}

      {mode === "regle3" && (
        <div>
          <Field
            label="Dose voulue"
            value={voulu}
            onChange={(v) => setVoulu(Number(v))}
            suffix="mg"
            step="0.1"
            min={0}
          />
          <Field
            label="Concentration (ce que vous avez)"
            value={dispo}
            onChange={(v) => setDispo(Number(v))}
            suffix="mg/mL"
            step="0.1"
            min={0}
          />
          <Result tone={res.tone}>{res.text}</Result>
        </div>
      )}

      {mode === "dilution" && (
        <div>
          <Field
            label="Contenu ampoule"
            value={contenuAmpoule}
            onChange={(v) => setContenuAmpoule(Number(v))}
            suffix="mg"
            min={0}
          />
          <Field
            label="Volume ampoule"
            value={volumeAmpoule}
            onChange={(v) => setVolumeAmpoule(Number(v))}
            suffix="mL"
            step="0.1"
            min={0}
          />
          <Field
            label="Dose souhaitée"
            value={doseSouhaitee}
            onChange={(v) => setDoseSouhaitee(Number(v))}
            suffix="mg"
            min={0}
          />
          <Result tone={res.tone}>{res.text}</Result>
        </div>
      )}

      {safetyAlerts.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs">
          {safetyAlerts.map((a, i) => (
            <li key={i} className="text-warn">
              • {a}
            </li>
          ))}
        </ul>
      )}

      <div className="text-xs text-muted mt-3">Double contrôle recommandé.</div>
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
      <Field
        label="Volume à perfuser"
        value={volume}
        onChange={(v) => setVolume(Number(v))}
        suffix="mL"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Heures"
          value={heures}
          onChange={(v) => setHeures(Number(v))}
          suffix="h"
        />
        <Field
          label="Minutes"
          value={minutes}
          onChange={(v) => setMinutes(Number(v))}
          suffix="min"
        />
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
      <Field
        label="Volume"
        value={volume}
        onChange={(v) => setVolume(Number(v))}
        suffix="mL"
      />
      <Field
        label="Temps"
        value={minutes}
        onChange={(v) => setMinutes(Number(v))}
        suffix="min"
      />
      <Field
        label="Facteur de chute"
        value={df}
        onChange={(v) => setDf(Number(v))}
        suffix="gtt/mL"
      />
      <Result>{`${Math.round(gtt)} gtt/min`}</Result>
    </Card>
  );
}

function MiniField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="block">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="flex items-center gap-1">
        <input
          className="w-full rounded-lg border border-border bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(toNum(e.target.value))}
        />
        <span className="text-[11px] text-muted">{suffix}</span>
      </div>
    </label>
  );
}
