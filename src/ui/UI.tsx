// File: src/ui/UI.tsx
// Rôle: primitives UI réutilisables

import { useId, type ReactNode } from 'react';
import { toNumAllowEmpty } from '../utils';

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
    children: ReactNode;
}) {
  return (
    <section
      className="rounded-3xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
      aria-label={title}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export type FieldProps = {
  label: string;
  suffix?: string;
  value: number | string;
  onChange: (value: number | string) => void;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
};

export function Field({
  label,
  suffix,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step,
  placeholder,
}: FieldProps) {
  const id = useId();
  return (
    <label className="block mb-3" htmlFor={id}>
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-xl border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          value={value}
          min={min}
          max={max}
          placeholder={placeholder}
          step={step}
          onChange={(e) =>
            onChange(
              type === 'number'
                ? toNumAllowEmpty(e.target.value)
                : e.target.value
            )
          }
        />
        {suffix && <div className="text-sm text-slate-500">{suffix}</div>}
      </div>
    </label>
  );
}

export function FieldStr({
  label,
  suffix,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <label className="block mb-3" htmlFor={id}>
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-xl border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <div className="text-sm text-slate-500">{suffix}</div>}
        {value !== '' && (
          <button
            type="button"
            aria-label="Effacer"
            className="text-slate-500 text-sm px-2 py-1 rounded-lg border hover:bg-slate-50"
            onClick={() => onChange('')}
          >
            ×
          </button>
        )}
      </div>
    </label>
  );
}

export type SelectOption = { v: string | number; l: string };
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
}) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-slate-700 mb-1">{label}</div>
      <select
        className="w-full rounded-xl border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/20 bg-white"
        value={String(value)}
        onChange={(e) =>
          onChange(
            typeof value === 'number' ? Number(e.target.value) : e.target.value
          )
        }
      >
        {options.map((o) => (
          <option key={String(o.v)} value={String(o.v)}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

export type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};
export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 mb-3 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

export function Chip({
  children,
  tone = 'info',
}: {
  children: ReactNode;
  tone?: 'ok' | 'warn' | 'danger' | 'info';
}) {
  const map: Record<'ok' | 'warn' | 'danger' | 'info', string> = {
    ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warn: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function Badge({ label }: { label: string }) {
  return (
    <div className="text-xs rounded-full border px-2 py-1 bg-slate-50 text-slate-700">
      {label}
    </div>
  );
}

export function Result({
  children,
  tone = 'ok',
}: {
  children: ReactNode;
  tone?: 'ok' | 'warn' | 'danger' | 'info';
}) {
  const toneMap: Record<'ok' | 'warn' | 'danger' | 'info', string> = {
    ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warn: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  const styles = toneMap[tone] || toneMap.ok;
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
