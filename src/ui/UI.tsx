// File: src/ui/UI.tsx
// Rôle: primitives UI réutilisables

import React from 'react';
import { toNumAllowEmpty } from '../utils';

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
    children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 shadow-e1 hover:shadow-e2 transition-shadow"
      aria-label={title}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
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
  const id = React.useId();
  return (
    <label className="block mb-3" htmlFor={id}>
      <div className="text-sm text-muted mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
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
        {suffix && <div className="text-sm text-muted">{suffix}</div>}
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
  const id = React.useId();
  return (
    <label className="block mb-3" htmlFor={id}>
      <div className="text-sm text-muted mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <div className="text-sm text-muted">{suffix}</div>}
        {value !== '' && (
          <button
            type="button"
            aria-label="Effacer"
            className="text-muted text-sm px-2 py-1 rounded-md border border-border hover:bg-surface"
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
      <div className="text-sm text-muted mb-1">{label}</div>
      <select
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
      <span className="text-sm text-muted">{label}</span>
    </label>
  );
}

export function Chip({
  children,
  tone = 'info',
}: {
  children: React.ReactNode;
  tone?: 'success' | 'warn' | 'danger' | 'info';
}) {
  const map: Record<'success' | 'warn' | 'danger' | 'info', string> = {
    success: 'bg-success/10 text-success border-success/20',
    warn: 'bg-warn/10 text-warn border-warn/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-info/10 text-info border-info/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${map[tone]}`}>
      {children}
    </span>
  );
}

export function Badge({ label }: { label: string }) {
  return (
    <div className="text-xs rounded-full border border-border px-2 py-1 bg-surface text-muted">
      {label}
    </div>
  );
}

export function Result({
  children,
  tone = 'success',
}: {
  children: React.ReactNode;
  tone?: 'success' | 'warn' | 'danger' | 'info';
}) {
  const toneMap: Record<'success' | 'warn' | 'danger' | 'info', string> = {
    success: 'bg-success/10 text-success border-success/20',
    warn: 'bg-warn/10 text-warn border-warn/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-info/10 text-info border-info/20',
  };
  const styles = toneMap[tone] || toneMap.success;
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
