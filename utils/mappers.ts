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
    // `game_members` é a tabela de junção jogo<->membro (mesma usada em
    // mapMember, só que na direção oposta): cada linha traz o cargo que a
    // pessoa exerceu NESTE jogo (role_in_game) junto dos dados básicos dela.
    // O filter descarta linhas sem o relacionamento de membro resolvido
    // (não deveria acontecer com a foreign key certa, mas evita quebrar a
    // seção de créditos por causa de uma linha órfã).
    members: (api.members ?? [])
      .filter((gm: any) => gm.member)
      .map((gm: any) => ({
        nick: gm.member.nick,
        name: gm.member.name,
        roleInGame: gm.role_in_game,
      })),
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
//
// `allGames` é o resultado de fetchAllGames (utils/games.ts) — a MESMA
// função/query usada pela página de Games para listar todos os jogos.
// Em vez de tentar reproduzir/adivinhar o critério de ordenação da página
// de Games (que nem sequer define um .order() explícito — a ordem "real"
// ali é só o retorno natural da query), simplesmente filtramos essa mesma
// lista, já na ordem exata dela, para os jogos deste membro. Isso garante
// por construção que a ordem dos jogos aqui é idêntica à da página de
// Games, sem duplicar nenhuma lógica de ordenação.
export function mapMember(api: any, allGames: Game[]): Member {
  // Cargo que o membro exerceu em cada jogo (role_in_game), indexado pelo
  // id do jogo — só isso é obtido da própria linha de `game_members`; os
  // dados completos do jogo (thumbnail, tags, links, créditos etc.) vêm de
  // `allGames`, garantindo que sejam exatamente os mesmos exibidos na
  // página de Games para aquele jogo.
  const roleByGameId = new Map<number, string>();
  for (const gm of api.game_members ?? []) {
    if (gm.game) roleByGameId.set(gm.game.id, gm.role_in_game);
  }

  return {
    id: api.id,
    name: api.name,
    nick: api.nick,
    description: api.description,
    defaultRole: api.default_role,
    // `member_socials` já retorna { platform, url } diretamente, igual
    // `game_links` — mas também pode vir ausente/null, daí o fallback.
    socials: api.socials ?? [],
    games: allGames
      .filter((game) => roleByGameId.has(game.id))
      .map((game) => ({
        ...game,
        roleInGame: roleByGameId.get(game.id)!,
      })),
  };
}
