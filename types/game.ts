export interface Type {
  name: string;
  color: string;
}

export interface Tag {
  name: string;
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
  roleInGame: string;
}

export interface Game {
  name: string;
  description: string;
  thumbnail: string;
  screenshots: string[];
  type: Type;
  tags: Tag[];
  // Opcional: ainda não existe no Supabase, mas o componente de modal já
  // está preparado para recebê-lo assim que o campo for criado.
  links?: GameLink[];
  // Opcional pelo mesmo motivo: nem toda query que busca jogos seleciona
  // esse relacionamento (ver getAllGames em pages/index.vue).
  members?: GameMember[];
}
