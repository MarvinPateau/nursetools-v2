export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          fg: "hsl(var(--primary-fg))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          fg: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        success: {
          DEFAULT: "hsl(var(--success))",
          fg: "hsl(var(--success-fg))",
        },
        warn: {
          DEFAULT: "hsl(var(--warn))",
          fg: "hsl(var(--warn-fg))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          fg: "hsl(var(--danger-fg))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          fg: "hsl(var(--info-fg))",
        },
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        "elevation-1": "0 1px 2px 0 hsl(var(--foreground)/0.05)",
        "elevation-2":
          "0 2px 4px -1px hsl(var(--foreground)/0.05), 0 4px 6px -1px hsl(var(--foreground)/0.05)",
        "elevation-3":
          "0 10px 15px -3px hsl(var(--foreground)/0.1), 0 4px 6px -4px hsl(var(--foreground)/0.1)",
        "elevation-4":
          "0 20px 25px -5px hsl(var(--foreground)/0.1), 0 10px 10px -5px hsl(var(--foreground)/0.04)",
      },
    },
  },
  plugins: [],
};
