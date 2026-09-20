import type { LocalizedText } from "~/types/i18n";

// Composable central pra qualquer texto multilíngue vindo do Supabase
// (colunas jsonb no formato { pt: "...", en: "..." }). Objetivo: nenhum
// componente precisa saber qual é o idioma atual nem fazer
// `locale === "pt" ? texto.pt : texto.en` na mão — só chama
// `localize(campo)` e recebe o texto já no idioma certo. Use em qualquer
// lugar da aplicação que exiba um campo vindo do Supabase que possa (hoje
// ou no futuro) virar multilíngue.
//
// Aceita tanto o formato NOVO (objeto LocalizedText) quanto o formato
// ANTIGO (string simples) — assim campos que ainda não foram migrados pra
// jsonb no Supabase continuam funcionando exatamente como antes, sem
// quebrar nada enquanto a migração (coluna por coluna) não é feita.
//
// Fallback, nessa ordem:
//   1. Idioma selecionado atualmente (locale.value)
//   2. "pt" (fallback fixo, conforme pedido)
//   3. Primeiro valor não-vazio disponível no objeto (pra não mostrar nada
//      em branco se nem o idioma atual nem "pt" existirem)
//   4. "" (string vazia, nunca undefined/null, pra sempre poder interpolar
//      direto no template sem checagem extra)
export function useLocalizedText() {
  const { locale } = useI18n();

  function localize(
    value: LocalizedText | string | null | undefined,
  ): string {
    if (!value) return "";

    // Formato antigo: coluna Supabase ainda é `text` puro (não migrada pra
    // jsonb) — devolve como está, sem tentar tratar como multilíngue.
    if (typeof value === "string") return value;

    const current = value[locale.value];
    if (current) return current;

    if (value.pt) return value.pt;

    const firstAvailable = Object.values(value).find((v) => !!v);
    return firstAvailable ?? "";
  }

  return { localize };
}
