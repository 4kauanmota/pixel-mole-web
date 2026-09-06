import type { Game } from "~/types/game";

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
