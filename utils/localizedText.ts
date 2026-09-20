import type { LocalizedText } from "~/types/i18n";

// Extrai um texto ESTÁVEL (independente do idioma selecionado) de um campo
// multilíngue — usado só onde o valor precisa servir de IDENTIFICADOR (slug
// de rota de jogo, chave de Map/dedupe), nunca para exibição na interface
// (isso é useLocalizedText().localize(), que respeita o idioma atual do
// usuário e por isso NÃO pode ser usado pra gerar uma URL/chave, já que o
// mesmo jogo geraria valores diferentes em pt e em en).
//
// Prioriza "en": convenção observada nos dados reais do Supabase pra
// game_types.name/tags.name (ex.: { en: "coming_soon", pt: "em_breve" }) —
// o "en" guarda o valor técnico/estável, "pt" é só a tradução visível. Cai
// pra "pt" ou pro primeiro valor disponível se "en" não existir.
//
// Função PURA (não depende de useI18n()/contexto Vue) — pode ser chamada de
// qualquer lugar, inclusive de dentro de utils/mappers.ts (que roda depois
// de um `await`, onde um composable como useI18n() não funcionaria de forma
// confiável).
export function stableText(
  value: LocalizedText | string | null | undefined,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (value.en) return value.en;
  if (value.pt) return value.pt;

  const firstAvailable = Object.values(value).find((v) => !!v);
  return firstAvailable ?? "";
}
