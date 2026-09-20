// Formato ATUAL de `studio.socials` (jsonb), confirmado pelo usuário direto
// do conteúdo gravado no Supabase: um ARRAY de objetos `{ platform, url }`.
// Ex.:
//   [
//     { "platform": "website", "url": "https://..." },
//     { "platform": "instagram", "url": "https://..." }
//   ]
//
// Mesmo formato de `game_links`/`member_socials` (arrays de `{platform,url}`
// em tabelas relacionadas) — a rodada anterior tinha confirmado um formato
// de objeto (`{ platform: url }`) que valia naquele momento; o usuário
// trocou a estrutura gravada no banco pra este array, então o parsing
// (utils/studio.ts) e a resolução de ícone/cor (utils/socials.ts) seguem
// este formato agora. `label` é opcional: sobrescreve o label padrão da
// plataforma (LINK_PLATFORMS) quando presente, mesma convenção antiga.
export interface StudioSocial {
  platform: string;
  url: string;
  label?: string;
}

// Registro único do estúdio (uma linha só na tabela `studio`) — nome oficial
// e redes sociais, usados pela Home e pelo Footer no lugar de texto fixo no
// código. Pode crescer com mais campos no futuro (descrição, etc.) sem
// quebrar quem já usa `name`/`socials`.
export interface Studio {
  name: string;
  socials: StudioSocial[];
}
