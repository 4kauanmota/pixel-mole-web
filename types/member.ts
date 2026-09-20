import type { Game } from "./game";
import type { LocalizedText } from "./i18n";

// Rede social de um membro (Discord, Instagram, site pessoal etc). Usa o
// mesmo formato de `GameLink` (plataforma + url opcionalmente com label),
// então o <GameLinkButton> e o mapa LINK_PLATFORMS já existentes (definidos
// pensando em links de jogo) funcionam aqui sem nenhuma alteração.
export interface MemberSocial {
  platform: string;
  url: string;
  label?: string;
}

// Um jogo em que o membro atuou, com o cargo específico que ele exerceu
// *naquele* jogo — que pode ser diferente do cargo geral dele no estúdio
// (ex.: cargo geral "Game Designer", mas atuou como "Programador" na REmemory).
export interface MemberGame extends Game {
  roleInGame: LocalizedText | string;
}

// Membro do estúdio, com todos os dados usados na página individual
// (/members/[nick]).
//
// Sem campo de foto aqui: a tabela `members` no Supabase não tem (e não
// deve ter) essa coluna — a foto é resolvida à parte, a partir do nick, via
// utils/memberPhotos.ts (assets/img/members/[nick]).
export interface Member {
  id: number;
  name: string;
  nick: string;
  description: LocalizedText | string;
  defaultRole: LocalizedText | string;
  socials: MemberSocial[];
  games: MemberGame[];
}

// Versão enxuta usada na listagem (/members): a grade só precisa de nome e
// cargo (a foto é resolvida à parte, ver Member acima), então a query dessa
// página não busca (nem esse tipo carrega) bio, redes sociais ou jogos.
export interface MemberSummary {
  id: number;
  name: string;
  nick: string;
  defaultRole: LocalizedText | string;
}
