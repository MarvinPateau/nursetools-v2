import React from 'react';

// Sprout : petite mascotte cactus, optionnelle
export function Sprout({ mood }: { mood?: string | null }) {
  const cond = (mood || '').toLowerCase();
  const sun = cond.includes('soleil');
  const rain = cond.includes('pluie');
  return (
    <div className="relative h-6 w-6 text-primary" aria-hidden>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M12 22V12" />
        <path d="M7 10v2a5 5 0 0 0 10 0v-2" />
        <path d="M5 13V8a2 2 0 1 1 4 0v5" />
        <path d="M15 11V6a2 2 0 1 1 4 0v5" />
      </svg>
      {sun && (
        <svg
          className="absolute -top-1 -right-1 h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2" />
          <path d="M12 21v2" />
          <path d="M4.22 4.22l1.42 1.42" />
          <path d="M18.36 18.36l1.42 1.42" />
          <path d="M1 12h2" />
          <path d="M21 12h2" />
          <path d="M4.22 19.78l1.42-1.42" />
          <path d="M18.36 5.64l1.42-1.42" />
        </svg>
      )}
      {rain && (
        <svg
          className="absolute -top-1 -right-1 h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a4 4 0 0 0-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 0 0-4-4z" />
        </svg>
      )}
    </div>
  );
}
