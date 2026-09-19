// Recebe a cor de fundo de uma Tag "filled" (ex.: `tag.color` vindo do
// Supabase) e devolve a cor de texto com mais contraste (claro/escuro).
//
// `hexColor` é nullable de propósito: `color` é uma coluna de texto livre
// no Supabase (tags/tipos de jogo), então pode em tese vir vazia/nula. Sem
// esse guard, `hexColor.replace(...)` quebraria a Tag inteira por causa de
// um dado de cor ausente — um detalhe cosmético não deveria derrubar a
// renderização. Cor malformada (não "#rrggbb") cai no mesmo fallback: os
// `parseInt` resultam em `NaN`, e `NaN > 0.5` é sempre `false`, então ainda
// devolve um valor de contraste válido.
export function useContrastColor(hexColor?: string | null): string {
  if (!hexColor) return "#f0f0f0";

  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#272528" : "#f0f0f0";
}
