// Alternância dark/light do site inteiro. O valor fica em `useState`
// (compartilhado entre todos os componentes) e é espelhado no atributo
// `data-theme` do <html> — é ESSE atributo que os tokens de cor em
// assets/css/main.css escutam (`:root[data-theme="light|dark"]`).
//
// Persistido em localStorage. Sem preferência salva, cai para
// `prefers-color-scheme` do sistema. `init()` roda uma vez, no plugin
// client-side (plugins/theme.client.ts), o quanto antes no ciclo de vida
// pra minimizar o "flash" do tema errado.
export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "pm-theme";

export function useTheme() {
  const theme = useState<ThemeMode>("pm-theme-mode", () => "dark");

  function apply(mode: ThemeMode) {
    theme.value = mode;
    if (import.meta.client) {
      document.documentElement.setAttribute("data-theme", mode);
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // localStorage pode falhar (modo privado etc.) — não é crítico,
        // o tema só não persiste entre visitas.
      }
    }
  }

  function toggle() {
    apply(theme.value === "dark" ? "light" : "dark");
  }

  function init() {
    if (!import.meta.client) return;

    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }

    if (stored === "dark" || stored === "light") {
      apply(stored);
      return;
    }

    const prefersLight = window.matchMedia?.(
      "(prefers-color-scheme: light)",
    ).matches;
    apply(prefersLight ? "light" : "dark");
  }

  return { theme, toggle, apply, init };
}
