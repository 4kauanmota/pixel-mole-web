export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Marca — fixas, usadas por tags/tipos/destaques vindos do banco.
        pm: {
          purple: "var(--pm-purple)",
          pink: "var(--pm-pink)",
          blue: "var(--pm-blue)",
          orange: "var(--pm-orange)",
          yellow: "var(--pm-yellow)",
          dark: "var(--pm-dark)",
          black: "var(--pm-black)",
          gray: "var(--pm-gray)",
        },
        // Semânticas — mudam com o tema (dark/light). Preferir sempre
        // estas em vez de `pm-*`/`gray-*`/hex soltos em novos trechos.
        surface: {
          page: "var(--surface-page)",
          alt: "var(--surface-page-alt)",
          card: "var(--surface-card)",
          panel: "var(--surface-panel)",
          hover: "var(--surface-hover)",
          overlay: "var(--surface-overlay)",
          scrim: "var(--surface-scrim)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          faint: "var(--text-faint)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          contrast: "var(--accent-contrast)",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      rotate: {
        270: "-90deg",
      },
      borderRadius: {
        control: "var(--radius-control)",
        card: "var(--radius-card)",
        panel: "var(--radius-panel)",
      },
    },
  },
};
