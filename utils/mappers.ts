import type { Game } from "~/types/game";
import type { Member, MemberSummary } from "~/types/member";

export function mapGame(api: any): Game {
  return {
    ...api,
    tags: api.tags.map((t: any) => t.tag),
    // A tabela `game_links` já retorna { platform, url } diretamente (não
    // precisa de "unwrap" como as tags), mas pode vir ausente/null caso a
    // query não peça o relacionamento — por isso o fallback para [].
    links: api.links ?? [],
  };
}

// Versão enxuta usada na listagem de membros (/members) — a query dessa
// página só pede as colunas abaixo (sem bio/redes/jogos), então não há o
// que mapear além do rename para camelCase.
export function mapMemberSummary(api: any): MemberSummary {
  return {
    id: api.id,
    name: api.name,
    nick: api.nick,
    defaultRole: api.default_role,
  };
}

// Versão completa usada na página individual do membro (/members/[nick]).
export function mapMember(api: any): Member {
  return {
    id: api.id,
    name: api.name,
    nick: api.nick,
    description: api.description,
    defaultRole: api.default_role,
    // `member_socials` já retorna { platform, url } diretamente, igual
    // `game_links` — mas também pode vir ausente/null, daí o fallback.
    socials: api.socials ?? [],
    // `game_members` é a tabela de junção membro<->jogo: cada linha traz o
    // cargo que a pessoa exerceu *naquele* jogo (role_in_game) junto do
    // jogo em si, já no mesmo formato usado em todo o resto do site
    // (mapGame), pra poder reaproveitar o <Card> sem adaptação nenhuma.
    games: (api.game_members ?? []).map((gm: any) => ({
      ...mapGame(gm.game),
      roleInGame: gm.role_in_game,
    })),
  };
}
