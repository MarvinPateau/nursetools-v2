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
      className="rounded-xl md:rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow"
      aria-label={title}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
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
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
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
        {suffix && <div className="text-sm text-muted-foreground">{suffix}</div>}
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
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <div className="text-sm text-muted-foreground">{suffix}</div>}
        {value !== '' && (
          <button
            type="button"
            aria-label="Effacer"
            className="text-muted-foreground text-sm px-2 py-1 rounded-md border border-border hover:bg-muted"
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
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <select
        className="w-full rounded-md border border-border bg-bg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
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
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

export function Chip({
  children,
  tone = 'info',
}: {
  children: React.ReactNode;
  tone?: 'ok' | 'warn' | 'danger' | 'info';
}) {
  const toneMap: Record<
    'ok' | 'warn' | 'danger' | 'info',
    { cls: string; icon: React.ReactNode }
  > = {
    ok: {
      cls: 'bg-success/20 text-success border-success/40',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
    },
    warn: {
      cls: 'bg-warn/20 text-warn border-warn/40',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
    },
    danger: {
      cls: 'bg-danger/20 text-danger border-danger/40',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6" />
          <path d="M9 9l6 6" />
        </svg>
      ),
    },
    info: {
      cls: 'bg-info/20 text-info border-info/40',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
    },
  };
  const t = toneMap[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${t.cls}`}
    >
      <span aria-hidden>{t.icon}</span>
      {children}
    </span>
  );
}

export function Badge({ label }: { label: string }) {
  return (
    <div className="text-xs rounded-full border border-border bg-muted text-muted-foreground px-2 py-1">
      {label}
    </div>
  );
}

export function Result({
  children,
  tone = 'ok',
}: {
  children: React.ReactNode;
  tone?: 'ok' | 'warn' | 'danger' | 'info';
}) {
  const toneMap: Record<'ok' | 'warn' | 'danger' | 'info', string> = {
    ok: 'bg-success/20 text-success border-success/40',
    warn: 'bg-warn/20 text-warn border-warn/40',
    danger: 'bg-danger/20 text-danger border-danger/40',
    info: 'bg-info/20 text-info border-info/40',
  };
  const styles = toneMap[tone] || toneMap.ok;
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
