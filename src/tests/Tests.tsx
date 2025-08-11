// File: src/tests/Tests.tsx
// Rôle: tests d'intégration rapides visibles dans l'UI

import {
  approxEqual,
  safeDiv,
  pfRatio,
  aAGradientCustom,
  correctedAnionGap,
  round,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from '../utils';

export function Tests() {
  const cases = [
    {
      name: 'Débit perfusion 500 mL sur 2h',
      expected: 250,
      actual: safeDiv(500, 2),
      pass: approxEqual(safeDiv(500, 2), 250),
    },
    {
      name: 'Gouttes/min 100 mL, 30 min, DF20',
      expected: 66.67,
      actual: safeDiv(100 * 20, 30),
      pass: approxEqual(safeDiv(100 * 20, 30), 66.67),
    },
    {
      name: 'Dose mg/kg 60 kg, 1 mg/kg, 10 mg/mL → mL',
      expected: 6,
      actual: safeDiv(60 * 1, 10),
      pass: approxEqual(safeDiv(60 * 1, 10), 6),
    },
    {
      name: 'Cockcroft–Gault F 30 ans, 60 kg, 70 µmol/L',
      expected: 98.46,
      actual: safeDiv((140 - 30) * 60 * 0.85, 72 * safeDiv(70, 88.4)),
      pass: approxEqual(
        safeDiv((140 - 30) * 60 * 0.85, 72 * safeDiv(70, 88.4)),
        98.46
      ),
    },
    {
      name: 'P/F ratio 80 / 0.21',
      expected: 380.95,
      actual: pfRatio(80, 0.21),
      pass: approxEqual(pfRatio(80, 0.21), 380.95, 0.01),
    },
    {
      name: 'A–a gradient basique',
      expected: 4.7,
      actual: aAGradientCustom(95, 40, 0.21, 760, 47, 0.8),
      pass: approxEqual(
        aAGradientCustom(95, 40, 0.21, 760, 47, 0.8),
        4.7,
        0.05
      ),
    },
    {
      name: 'Anion gap corrigé albumine (AG 16, Alb 2.0)',
      expected: 21,
      actual: correctedAnionGap(16, 2.0),
      pass: approxEqual(correctedAnionGap(16, 2.0), 21, 0.01),
    },
    {
      name: 'Celsius vers Fahrenheit 25°C',
      expected: 77,
      actual: celsiusToFahrenheit(25),
      pass: approxEqual(celsiusToFahrenheit(25), 77, 0.01),
    },
    {
      name: 'Fahrenheit vers Celsius 77°F',
      expected: 25,
      actual: fahrenheitToCelsius(77),
      pass: approxEqual(fahrenheitToCelsius(77), 25, 0.01),
    },
  ];

  const allPass = cases.every((c) => c.pass);

  return (
    <section className="mt-6">
      <details className="rounded-2xl border bg-white p-4">
        <summary
          className={`cursor-pointer select-none text-sm font-medium ${
            allPass ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          Tests intégrés: {allPass ? 'OK' : 'ÉCHEC'}
        </summary>
        <ul className="mt-3 space-y-2 text-sm">
          {cases.map((t, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>{t.name}</span>
              <span className={t.pass ? 'text-emerald-700' : 'text-rose-700'}>
                attendu {round(t.expected)} / obtenu {round(t.actual)} —{' '}
                {t.pass ? 'OK' : 'KO'}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
