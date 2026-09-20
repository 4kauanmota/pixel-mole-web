import type { Game } from "~/types/game";
import { mapGame } from "./mappers";

// Busca TODOS os jogos, com a mesma query usada pela página de Games
// (pages/index.vue) — extraída pra cá de dentro daquele arquivo, sem
// nenhuma alteração de comportamento. Essa página não define nenhum
// critério de ordenação próprio (nada de .order()), então a ordem
// retornada aqui é literalmente a ordem "oficial" de exibição do site —
// seja lá qual for a regra real por trás dela (id, ordem de retorno do
// Postgres, etc.).
//
// Motivo de existir como função própria: qualquer outro lugar que precise
// mostrar jogos na MESMA ordem da página de Games (hoje,
// pages/members/[nick].vue) deve chamar esta função e filtrar o resultado,
// em vez de duplicar a query ou tentar adivinhar/reproduzir a regra de
// ordenação por conta própria — assim as duas páginas compartilham
// exatamente a mesma lógica, e não apenas uma cópia que parece igual.
export async function fetchAllGames(supabase: any): Promise<Game[]> {
  const { data, error } = await supabase.from("games").select(`
  *,
  type:game_types(*),
  tags:game_tags(tag:tag_id(*)),
  links:game_links(platform, url),
  members:game_members(role_in_game, member:members(id, name, nick))
  `);

  if (error) {
    // Causas mais comuns pra esse erro especificamente na parte
    // "links"/"members": não existe uma foreign key entre
    // game_links/game_members e games (o PostgREST precisa dela pra
    // resolver o embed), ou RLS habilitado nessas tabelas sem uma policy de
    // SELECT pra role anon/public (tabela nova no Supabase já nasce com RLS
    // ligado e sem nenhuma policy, então toda leitura vem vazia/bloqueada).
    console.error(
      "[Supabase] Erro ao buscar games (se a mensagem mencionar 'game_links', 'game_members' ou 'relationship', confira a foreign key e as policies de RLS dessas tabelas):",
      error,
    );
  }

  return ((data as Game[]) ?? []).map(mapGame);
}

// Jogo "em destaque" da nova home (`/`) — usado tanto no Hero quanto na
// seção editorial "Em destaque" (mesmo critério nos dois lugares, ver
// components/HomeHero.vue e HomeSpotlight.vue).
//
// O modelo de dados de Game (types/game.ts) não tem nenhum campo de data
// (nem de "lançamento", nem de "criado em"), então não dá pra ordenar por
// "mais recente"/"mais próximo de sair" de verdade. Critério combinado, do
// mais forte pro mais fraco:
//   1. Jogos com type.slug === "coming_soon" (o próximo lançamento do
//      estúdio) têm prioridade sobre qualquer outro tipo.
//   2. Dentro do grupo escolhido (coming_soon, ou todos os jogos se não
//      houver nenhum coming_soon), o de maior `id` — aproximação razoável
//      de "mais recente", já que id é sequencial/crescente no Supabase.
// Decisão alinhada com o usuário (não há campo de data pra usar de verdade).
export function getFeaturedGame(games: Game[]): Game | null {
  if (!games.length) return null;

  const comingSoon = games.filter((game) => game.type.slug === "coming_soon");
  const pool = comingSoon.length ? comingSoon : games;

  return pool.reduce((newest, game) => (game.id > newest.id ? game : newest));
}
