// File: src/tabs/Calculs.tsx
// Rôle: outils de calculs

import { useEffect, useMemo, useState } from "react";
import { Card, Field, Result } from "../ui/UI";
import { safeDiv, round, toNum } from "../utils";
import { SERVICE_PRESETS, type ServiceId } from "./servicePresets";

export function CalculsTab() {
  const [service, setService] = useState<ServiceId>("polyvalent");

  return (
    <section className="mt-6 space-y-6">
      <ServiceSelector service={service} onServiceChange={setService} />
      <QuickPanel />
      <DoseCalculator service={service} />
      <div className="grid sm:grid-cols-2 gap-6">
        <InfusionRate />
        <DripRate />
      </div>
      <BiologyNorms />
      <ServiceTools service={service} />
    </section>
  );
}

export function ServicePresetSettings({
  service,
  onServiceChange,
}: {
  service: ServiceId;
  onServiceChange: (service: ServiceId) => void;
}) {
  return <ServiceSelector service={service} onServiceChange={onServiceChange} />;
}

function ServiceSelector({
  service,
  onServiceChange,
}: {
  service: ServiceId;
  onServiceChange: (service: ServiceId) => void;
}) {
  const preset = SERVICE_PRESETS[service];
  return (
    <Card
      title="Protocole local / presets service"
      subtitle="Sélectionnez un service pour charger des repères de concentration et de double contrôle"
    >
      <label className="text-sm text-muted">
        Service clinique
        <select
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={service}
          onChange={(e) => onServiceChange(e.target.value as ServiceId)}
        >
          <option value="polyvalent">Polyvalent</option>
          <option value="urgences">Urgences</option>
          <option value="usi">USI / Réanimation</option>
          <option value="grandsBrules">Grands brûlés</option>
          <option value="pediatrie">Pédiatrie</option>
        </select>
      </label>
      <div className="mt-2 text-xs text-muted">
        Profil actif: <b>{preset.label}</b>
      </div>
      <div className="mt-2 text-xs text-muted">Outils fréquents: {preset.tools.join(" • ")}</div>
      <ul className="mt-2 space-y-1 text-xs text-muted">
        {preset.doubleCheckRules.map((rule, i) => (
          <li key={i}>• {rule}</li>
        ))}
      </ul>
    </Card>
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
function DoseCalculator({ service }: { service: ServiceId }) {
  const [mode, setMode] = useState<DoseMode>("mgkg");
  const [poids, setPoids] = useState<number>(70);
  const [doseMgKg, setDoseMgKg] = useState<number>(1);
  const [concentration, setConcentration] = useState<number>(SERVICE_PRESETS[service].standardConcentrationMgMl);
  const [voulu, setVoulu] = useState<number>(100);
  const [dispo, setDispo] = useState<number>(SERVICE_PRESETS[service].regleTroisReferenceMgMl);
  const [contenuAmpoule, setContenuAmpoule] = useState<number>(1000);
  const [volumeAmpoule, setVolumeAmpoule] = useState<number>(10);
  const [doseSouhaitee, setDoseSouhaitee] = useState<number>(250);
  const [age, setAge] = useState<number>(65);
  const [poidsRef, setPoidsRef] = useState<"reel" | "ideal" | "ajuste">("reel");
  const [renal, setRenal] = useState<"normal" | "renale" | "dialyse">("normal");
  const [grossesse, setGrossesse] = useState<"non" | "oui">("non");

  const selectedPreset = SERVICE_PRESETS[service];

  useEffect(() => {
    setConcentration(selectedPreset.standardConcentrationMgMl);
    setDispo(selectedPreset.regleTroisReferenceMgMl);
  }, [selectedPreset.standardConcentrationMgMl, selectedPreset.regleTroisReferenceMgMl]);

  const safetyAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (mode === "mgkg") {
      if (poids <= 0) alerts.push("Poids patient invalide (doit être > 0 kg).");
      if (doseMgKg < 0) alerts.push("Dose mg/kg négative non autorisée.");
      if (concentration <= 0) alerts.push("Concentration invalide (doit être > 0 mg/mL).");
      if (doseMgKg > 50) alerts.push("Dose mg/kg élevée: vérifier l'unité et la prescription.");
      if (concentration > 1000) alerts.push("Concentration très élevée: confirmer la dilution.");
      if (service === "pediatrie" && doseMgKg > 10)
        alerts.push("Pédiatrie: dose mg/kg élevée, vérifier la dose maximale autorisée.");
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
    if (service === "grandsBrules")
      alerts.push("Grands brûlés: réévaluer fréquemment les besoins hydriques.");

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
    service,
  ]);

  const hardStop = useMemo(() => {
    if (mode === "mgkg") return poids <= 0 || doseMgKg < 0 || concentration <= 0;
    if (mode === "regle3") return voulu < 0 || dispo <= 0;
    if (mode === "dilution")
      return contenuAmpoule <= 0 || volumeAmpoule <= 0 || doseSouhaitee < 0;
    return false;
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
  ]);

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
      return {
        text: `${round(doseTotaleMg)} mg au total → ${round(ml)} mL à prélever.`,
        tone: "success" as const,
      };
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
    hardStop,
  ]);

  return (
    <Card title="Calcul de dose" subtitle="Règle de trois, mg/kg, dilution">
      <div className="mb-3 rounded-xl border border-border bg-surface p-3 text-xs text-muted">
        Preset actif: <b>{selectedPreset.label}</b> (concentration injectée automatiquement).
      </div>

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

export function DoseTool({ service }: { service: ServiceId }) {
  return <DoseCalculator service={service} />;
}

function InfusionRate() {
  const [volume, setVolume] = useState<number>(500);
  const [heures, setHeures] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("08:00");

  const mlh = useMemo(() => {
    const t = Number(heures) + Number(minutes) / 60;
    if (t <= 0) return 0;
    return safeDiv(Number(volume), t);
  }, [volume, heures, minutes]);

  const perfEnd = useMemo(() => {
    const [hh, mm] = startTime.split(":").map((x) => Number(x));
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return "—";
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    const totalMin = Math.max(0, Number(heures) * 60 + Number(minutes));
    d.setMinutes(d.getMinutes() + totalMin);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }, [startTime, heures, minutes]);

  return (
    <Card title="Débit d'infusion" subtitle="Calcul du mL/h + heure de fin">
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
      <label className="block mt-3">
        <div className="text-sm text-muted mb-1">Heure de début perfusion</div>
        <input
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <Result tone="info">Heure de fin estimée: {perfEnd}</Result>
    </Card>
  );
}

export function InfusionTool() {
  return <InfusionRate />;
}

function DripRate() {
  const [volume, setVolume] = useState<number>(100);
  const [minutes, setMinutes] = useState<number>(30);
  const [df, setDf] = useState<number>(20);

  const gtt = useMemo(
    () => safeDiv(Number(volume) * Number(df), Number(minutes)),
    [volume, df, minutes]
  );

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

export function DripTool() {
  return <DripRate />;
}

function BiologyNorms() {
  const items = [
    { label: "pH artériel", range: "7.35 – 7.45" },
    { label: "PaCO₂", range: "35 – 45 mmHg" },
    { label: "HCO₃⁻", range: "22 – 26 mEq/L" },
    { label: "Lactate", range: "≤ 2 mmol/L" },
    { label: "Na⁺", range: "135 – 145 mmol/L" },
    { label: "K⁺", range: "3.5 – 5.0 mmol/L" },
    { label: "Créatinine", range: "≈ 45 – 105 µmol/L (adulte)" },
    { label: "Glycémie à jeun", range: "0.70 – 1.10 g/L" },
  ];

  return (
    <Card title="Normes biologie (repères rapides)" subtitle="Valeurs usuelles adultes — à adapter au protocole local">
      <ul className="grid sm:grid-cols-2 gap-2 text-sm">
        {items.map((item) => (
          <li key={item.label} className="rounded-lg border border-border bg-surface px-3 py-2">
            <div className="font-medium">{item.label}</div>
            <div className="text-muted">{item.range}</div>
          </li>
        ))}
      </ul>
      <div className="text-xs text-muted mt-3">
        Ces repères ne remplacent pas l’interprétation clinique, l’âge, le contexte et les référentiels locaux.
      </div>
    </Card>
  );
}

export function BiologyNormsTool() {
  return <BiologyNorms />;
}

function ServiceTools({ service }: { service: ServiceId }) {
  if (service === "urgences") return <EmergencyTools />;
  if (service === "usi") return <ICUTools />;
  if (service === "grandsBrules") return <BurnTools />;
  if (service === "pediatrie") {
    return (
      <Card title="Pédiatrie — rappel sécurité" subtitle="Poids et doses max">
        <div className="text-sm text-muted">
          Toujours vérifier le poids actualisé du jour et les doses maximales pédiatriques de la molécule.
        </div>
      </Card>
    );
  }
  return (
    <Card title="Polyvalent — rappel pratique" subtitle="Outils généralistes">
      <div className="text-sm text-muted">
        Utilisez les calculateurs de dose, débit et gouttes/min selon protocole local.
      </div>
    </Card>
  );
}

function EmergencyTools() {
  const [poids, setPoids] = useState<number>(70);
  const [hr, setHr] = useState<number>(110);
  const [sbp, setSbp] = useState<number>(100);
  const bolus = round(poids * 20);
  const shockIndex = round(safeDiv(hr, sbp));

  return (
    <Card title="Urgences — outils rapides" subtitle="Bolus et shock index">
      <Field
        label="Poids patient"
        value={poids}
        onChange={(v) => setPoids(Number(v))}
        suffix="kg"
        min={0}
      />
      <Result tone="info">Bolus cristalloïde initial ≈ {bolus} mL (20 mL/kg)</Result>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <Field
          label="Fréquence cardiaque"
          value={hr}
          onChange={(v) => setHr(Number(v))}
          suffix="/min"
          min={0}
        />
        <Field
          label="PAS"
          value={sbp}
          onChange={(v) => setSbp(Number(v))}
          suffix="mmHg"
          min={0}
        />
      </div>
      <Result tone={shockIndex >= 1 ? "warn" : "success"}>Shock index = {shockIndex}</Result>
    </Card>
  );
}

function ICUTools() {
  const [dose, setDose] = useState<number>(0.1);
  const [poids, setPoids] = useState<number>(70);
  const [mgSeringue, setMgSeringue] = useState<number>(8);
  const [volSeringue, setVolSeringue] = useState<number>(50);
  const concentrationMcgMl = safeDiv(mgSeringue * 1000, volSeringue);
  const mlh = round(safeDiv(dose * poids * 60, concentrationMcgMl));

  return (
    <Card title="USI — catécholamines" subtitle="Noradrénaline µg/kg/min → mL/h">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field
          label="Dose cible"
          value={dose}
          onChange={(v) => setDose(Number(v))}
          suffix="µg/kg/min"
          min={0}
          step="0.01"
        />
        <Field
          label="Poids patient"
          value={poids}
          onChange={(v) => setPoids(Number(v))}
          suffix="kg"
          min={0}
        />
        <Field
          label="Noradrénaline dans seringue"
          value={mgSeringue}
          onChange={(v) => setMgSeringue(Number(v))}
          suffix="mg"
          min={0}
        />
        <Field
          label="Volume seringue"
          value={volSeringue}
          onChange={(v) => setVolSeringue(Number(v))}
          suffix="mL"
          min={0}
        />
      </div>
      <Result tone="info">Débit pousse-seringue ≈ {mlh} mL/h</Result>
      <div className="text-xs text-muted mt-2">
        Toujours confirmer la concentration préparée à 2 IDE.
      </div>
    </Card>
  );
}

function BurnTools() {
  const [poids, setPoids] = useState<number>(70);
  const [headPct, setHeadPct] = useState<number>(9);
  const [armPct, setArmPct] = useState<number>(9);
  const [trunkPct, setTrunkPct] = useState<number>(18);
  const [legPct, setLegPct] = useState<number>(18);
  const [perineumPct, setPerineumPct] = useState<number>(1);

  const totalPct = Math.max(0, round(headPct + armPct + trunkPct + legPct + perineumPct));
  const parkland24h = round(4 * poids * totalPct);
  const first8h = round(parkland24h / 2);
  const next16h = round(parkland24h / 2);

  return (
    <Card
      title="Grands brûlés — surface et remplissage"
      subtitle="Règle des 9 + formule de Parkland (adulte)"
    >
      <Field
        label="Poids patient"
        value={poids}
        onChange={(v) => setPoids(Number(v))}
        suffix="kg"
        min={0}
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field
          label="Tête/Cou brûlés"
          value={headPct}
          onChange={(v) => setHeadPct(Number(v))}
          suffix="%"
          min={0}
        />
        <Field
          label="Membres sup. brûlés"
          value={armPct}
          onChange={(v) => setArmPct(Number(v))}
          suffix="%"
          min={0}
        />
        <Field
          label="Tronc brûlé"
          value={trunkPct}
          onChange={(v) => setTrunkPct(Number(v))}
          suffix="%"
          min={0}
        />
        <Field
          label="Membres inf. brûlés"
          value={legPct}
          onChange={(v) => setLegPct(Number(v))}
          suffix="%"
          min={0}
        />
        <Field
          label="Périnée brûlé"
          value={perineumPct}
          onChange={(v) => setPerineumPct(Number(v))}
          suffix="%"
          min={0}
        />
      </div>
      <Result tone={totalPct > 100 ? "danger" : "info"}>
        Surface brûlée estimée: {totalPct}% TBSA
      </Result>
      <Result tone="warn">
        Parkland 24h: {parkland24h} mL (Ringer lactate) — 8 premières heures: {first8h} mL,
        puis 16h: {next16h} mL.
      </Result>
      <div className="text-xs text-muted mt-2">
        Repère adulte: ajuster selon diurèse, lactate et protocole local.
      </div>
    </Card>
  );
}

export function BurnTool() {
  return <BurnTools />;
}

function MiniField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
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
