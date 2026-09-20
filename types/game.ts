import type { LocalizedText } from "./i18n";

export interface Type {
  // Slug estável (plain text, NUNCA traduzido) usado como IDENTIFICADOR em
  // toda a lógica de negócio do app — ex.: `type.slug === "coming_soon"`
  // decide se um jogo ganha página própria ou abre em modal (ver
  // Card.vue/HomeHero.vue/HomeSpotlight.vue/HomeHighlights.vue/
  // utils/games.ts/pages/games.vue/pages/index.vue). `name` é só o RÓTULO
  // exibido (multilíngue) — nunca deve entrar em comparação/lógica.
  slug: string;
  name: LocalizedText | string;
  color: string;
}

export interface Tag {
  // Mesmo motivo/uso de Type.slug acima: `tag.name` também é usado como
  // identificador (seleção de filtro em MultiSelect.vue, comparação de
  // tags selecionadas em pages/games.vue) — precisa de um slug estável e
  // nunca traduzido, separado do rótulo exibido.
  slug: string;
  name: LocalizedText | string;
  icon: string;
  color: string;
}

// Link para uma plataforma externa do jogo (Steam, itch.io, redes sociais, etc).
// `platform` é a FONTE DA VERDADE para o ícone exibido (ver LINK_PLATFORMS em
// data/games.ts) — não a URL. Deve ser o valor exatamente como gravado no
// Supabase (ex: "steam", "itch.io", "github", "youtube", "linkedin"...).
export interface GameLink {
  platform: string;
  url: string;
  label?: string;
}

// Membro do estúdio que participou do desenvolvimento deste jogo, com o
// cargo específico exercido *neste* jogo (role_in_game) — mesma ideia do
// MemberGame (types/member.ts), só que na direção oposta: aqui é "quem
// trabalhou neste jogo", lá é "em quais jogos esta pessoa trabalhou". Só
// nick/name (sem foto/bio/redes — a seção de créditos do GameModal não
// precisa de mais que isso).
export interface GameMember {
  nick: string;
  name: string;
  roleInGame: LocalizedText | string;
}

export interface Game {
  // Sempre presente (toda query de jogos usa "*", que inclui a coluna),
  // mas só ficou explícito aqui a partir de quando passou a ser
  // efetivamente usado em código (filtrar/ordenar jogos por id — ver
  // fetchAllGames em utils/games.ts e mapMember em utils/mappers.ts).
  id: number;
  name: LocalizedText | string;
  description: LocalizedText | string;
  thumbnail: string;
  screenshots: string[];
  type: Type;
  tags: Tag[];
  // Opcional: ainda não existe no Supabase, mas o componente de modal já
  // está preparado para recebê-lo assim que o campo for criado.
  links?: GameLink[];
  // Opcional pelo mesmo motivo: nem toda query que busca jogos seleciona
  // esse relacionamento (ver fetchAllGames em utils/games.ts).
  members?: GameMember[];
}
