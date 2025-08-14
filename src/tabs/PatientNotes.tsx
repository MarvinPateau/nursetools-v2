// File: src/tabs/PatientNotes.tsx
// Rôle: onglets Patient / Notes / À propos

import { useState } from 'react';

import { Card, Field, Result, Select } from '../ui/UI';
import { round, safeDiv } from '../utils';

export function PatientTab() {
  return (
    <section className="mt-6 space-y-6">
      <CrCl />
      <BMI />
    </section>
  );
}

export function NotesTab() {
  return (
    <section className="mt-6 space-y-6">
      <NoteBlock />
    </section>
  );
}

export function AProposTab() {
  return (
    <section className="mt-6 space-y-6">
      <Card
        title="À propos"
        subtitle="Conçu pour Chloé — usage d’aide uniquement"
      >
        <p className="text-sm text-muted">
          Toujours vérifier selon le protocole local et réaliser un double
          contrôle pour les calculs. Créé avec ❤️ pour Chloé.
        </p>
      </Card>
    </section>
  );
}

function CrCl() {
  const [age, setAge] = useState<number>(30);
  const [poids, setPoids] = useState<number>(60);
  const [sexe, setSexe] = useState<'F' | 'M'>('F');
  const [unit, setUnit] = useState<'umol' | 'mgdl'>('umol');
  const [scr, setScr] = useState<number>(70);

  const mgdl = unit === 'umol' ? safeDiv(Number(scr), 88.4) : Number(scr);
  const factor = sexe === 'F' ? 0.85 : 1;
  const crcl = safeDiv((140 - Number(age)) * Number(poids) * factor, 72 * mgdl);

  return (
    <Card
      title="Clairance de la créatinine"
      subtitle="Équation de Cockcroft–Gault (adulte)"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Âge"
          value={age}
          onChange={(v) => setAge(Number(v))}
          suffix="ans"
        />
        <Field
          label="Poids"
          value={poids}
          onChange={(v) => setPoids(Number(v))}
          suffix="kg"
        />
        <Select
          label="Sexe"
          value={sexe}
          onChange={(v) => setSexe(v as 'F' | 'M')}
          options={[
            { v: 'F', l: 'Femme' },
            { v: 'M', l: 'Homme' },
          ]}
        />
        <Select
          label="Unité"
          value={unit}
          onChange={(v) => setUnit(v as 'umol' | 'mgdl')}
          options={[
            { v: 'umol', l: 'µmol/L' },
            { v: 'mgdl', l: 'mg/dL' },
          ]}
        />
        <Field
          label={`Créatinine sérique (${unit === 'umol' ? 'µmol/L' : 'mg/dL'})`}
          value={scr}
          onChange={(v) => setScr(Number(v))}
        />
      </div>
      <Result>
        CrCl ≈ <b>{round(crcl)}</b> mL/min
      </Result>
      <div className="text-[11px] text-muted mt-2">
        Vérifier la posologie selon protocole local.
      </div>
    </Card>
  );
}

function BMI() {
  const [taille, setTaille] = useState<number>(170);
  const [poids, setPoids] = useState<number>(60);
  const m = Number(taille) / 100;
  const bmi = safeDiv(Number(poids), m * m);
  const interp =
    bmi < 18.5
      ? 'Insuffisance pondérale'
      : bmi < 25
      ? 'Corpulence normale'
      : bmi < 30
      ? 'Surpoids'
      : 'Obésité';

  return (
    <Card title="IMC" subtitle="Indice de masse corporelle">
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Taille"
          value={taille}
          onChange={(v) => setTaille(Number(v))}
          suffix="cm"
        />
        <Field
          label="Poids"
          value={poids}
          onChange={(v) => setPoids(Number(v))}
          suffix="kg"
        />
      </div>
      <Result>{`IMC = ${round(bmi)} — ${interp}`}</Result>
    </Card>
  );
}

function NoteBlock() {
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('notes');
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const saveNotes = (next: string[]) => {
    setNotes(next);
    localStorage.setItem('notes', JSON.stringify(next));
  };

  const addNote = () => {
    const t = input.trim();
    if (!t) return;
    saveNotes([...notes, t]);
    setInput('');
  };

  return (
    <Card
      title="Bloc-notes rapide"
      subtitle="Sauvegardez localement vos repères (reste dans ce navigateur)"
    >
      <textarea
        className="w-full rounded-xl border border-border bg-surface p-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Écrire une note et appuyer sur Entrée"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNote();
          }
        }}
      />
      {notes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {notes.map((n, i) => (
            <li
              key={i}
              className="rounded-lg border border-border bg-card/70 px-3 py-2 text-sm"
            >
              {n}
            </li>
          ))}
        </ul>
      )}
      <div className="text-[11px] text-muted mt-2">
        Astuce: <em>Ctrl/Cmd + P</em> pour imprimer la page / exporter en PDF.
      </div>
    </Card>
  );
}
