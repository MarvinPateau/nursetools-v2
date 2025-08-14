export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-fg)",
        },
        foreground: "var(--color-fg)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
        success: "var(--color-success)",
        warn: "var(--color-warn)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        mint: "var(--color-mint)",
        moss: "var(--color-moss)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        e1: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        e2: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        e3: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        e4: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
