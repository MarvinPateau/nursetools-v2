export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
      },
    },
  },
  plugins: [],
};
