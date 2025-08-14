// File: src/components/layout/AppShell.tsx
// Rôle: cadre général avec topbar fixe et lien de contournement

import type { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

interface AppShellProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AppShell({ title, actions, children }: AppShellProps) {
  return (
    <>
      <a
        href="#main-content"
        className="focus-ring sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:text-fg"
      >
        Aller au contenu
      </a>

      <header
        role="banner"
        className="fixed inset-x-0 top-0 z-40 h-16 border-b border-muted/20 bg-card/90 backdrop-blur flex items-center"
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 md:px-6">
          <h1 className="text-lg font-semibold text-fg">{title}</h1>
          <div className="flex items-center gap-2" role="toolbar">
            <ThemeToggle />
            {actions}
          </div>
        </div>
      </header>

      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className="pt-16 mx-auto w-full max-w-[1200px] px-4 md:px-6 text-fg"
      >
        {children}
      </main>
    </>
  );
}

