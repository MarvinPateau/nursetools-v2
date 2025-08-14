import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        success: 'var(--success)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
      },
      fontSize: {
        xs: 'var(--font-12)',
        sm: 'var(--font-14)',
        base: 'var(--font-16)',
        lg: 'var(--font-20)',
        xl: 'var(--font-24)',
        '2xl': 'var(--font-32)',
      },
      borderRadius: {
        md: 'var(--radius-md)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        4: 'var(--shadow-4)',
      },
      spacing: {
        0: 'var(--space-0)',
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
      },
      container: {
        center: true,
        screens: {
          '2xl': '1280px',
        },
        padding: {
          DEFAULT: '1.5rem',
          md: '2rem',
        },
      },
    },
  },
  plugins: [],
};

export default config;
