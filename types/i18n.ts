// Formato multilíngue usado pelos campos de texto vindos do Supabase que
// foram migrados de `text` para `jsonb` (ex.: descrição de jogos/membros,
// nome de tags/tipos, cargo de membro). Chave = código do idioma (mesmo
// `code` cadastrado em nuxt.config.ts -> i18n.locales, hoje "pt"/"en"),
// valor = texto naquele idioma.
//
// `pt` é obrigatório porque é o idioma de fallback fixo (ver
// useLocalizedText) — qualquer outro idioma é opcional, e o índice
// permite adicionar novos idiomas no futuro sem alterar este tipo.
export type LocalizedText = {
  pt: string;
} & {
  [locale: string]: string | undefined;
};
