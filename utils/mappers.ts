import type { Game, Tag, Type } from "~/types/game";
import type { Member, MemberSummary } from "~/types/member";
import type { LocalizedText } from "~/types/i18n";
import { stableText } from "~/utils/localizedText";

// `game_types`/`tags` ainda não têm uma coluna `slug` própria no Supabase
// (a migração rodada até agora só converteu `name` pra jsonb) — sem isso,
// `type.slug`/`tag.slug` viriam sempre `undefined`, quebrando tanto o
// roteamento de "coming_soon" (Card.vue/HomeHero.vue/HomeSpotlight.vue/
// HomeHighlights.vue/utils/games.ts) quanto a identidade das opções nos
// filtros (Select.vue/MultiSelect.vue/pages/games.vue). Enquanto isso,
// derivamos um slug ESTÁVEL a partir de `name.en` (ver stableText, que
// prioriza esse idioma exatamente pela convenção observada nos dados reais:
// `name.en` guarda o valor técnico tipo "coming_soon", `name.pt` só a
// tradução visível). Se um dia existir uma coluna `slug` real no banco, ela
// automaticamente tem prioridade (`raw.slug ?? stableText(raw.name)`) — não
// precisa mexer aqui de novo.
export function normalizeType(raw: any): Type | null {
  if (!raw) return null;
  return {
    ...raw,
    slug: raw.slug ?? stableText(raw.name),
  };
}

export function normalizeTag(raw: any): Tag | null {
  if (!raw) return null;
  return {
    ...raw,
    slug: raw.slug ?? stableText(raw.name),
  };
}

export function mapGame(api: any): Game {
  return {
    ...api,
    // Normalização central de TUDO que o Supabase pode devolver como
    // `null` em vez do "vazio" equivalente (array vazio / objeto neutro).
    // Feito uma única vez aqui — na fronteira entre a API e o resto do
    // app — em vez de espalhar `?? []`/checagens de null pelos componentes
    // que consomem `Game`. Regra geral adotada: qualquer coluna nullable ou
    // relacionamento que pode não resolver vira um valor "vazio" seguro
    // (nunca `null`), e uma linha de junção órfã (ex.: tag apagada) é
    // descartada em vez de virar um item quebrado no meio do array.
    //
    // `screenshots`: coluna nullable — jogos sem nenhum screenshot
    // cadastrado (ex.: o "coming_soon" atual) vêm com `null`, não `[]`.
    // Sem isso, qualquer leitura de `game.screenshots.length`
    // (GameGallery.vue) quebra com "can't access property 'length',
    // screenshots is null" — só não aparecia antes porque esse jogo nunca
    // passava pelo GameModal (tem página própria); a seção "Em destaque"
    // da home passou a exibi-lo direto, expondo o problema.
    screenshots: api.screenshots ?? [],
    // `game_types(*)` é muitos-pra-um — na prática sempre resolve (todo
    // jogo tem um type_id), mas se algum dia vier nulo (FK quebrada), cai
    // num tipo neutro em vez de deixar `game.type.slug`/`.name`/`.color`
    // explodir em todo lugar que lê isso (Card.vue, GameModal.vue,
    // getFeaturedGame em utils/games.ts...). `slug: ""` nunca bate com
    // nenhuma comparação real (ex.: `=== "coming_soon"`), então o jogo cai
    // no comportamento padrão (modal) em vez de quebrar a navegação.
    type: normalizeType(api.type) ?? { slug: "", name: "", color: "#3a3a3c" },
    // `api.tags` pode vir `null` igual `screenshots` (sem fallback aqui
    // antes, `.map` num `null` quebraria igual); e mesmo vindo como array,
    // uma linha de `game_tags` cuja tag foi apagada resolve `t.tag` como
    // `null` — o `.filter(Boolean)` descarta essas linhas órfãs (mesmo
    // espírito do filter já usado abaixo para `members`).
    tags: (api.tags ?? [])
      .map((t: any) => normalizeTag(t.tag))
      .filter(Boolean),
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
  const roleByGameId = new Map<number, LocalizedText | string>();
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
