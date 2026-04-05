import type { Game } from "~/types/game";

export function mapGame(api: any): Game {
  return {
    ...api,
    tags: api.tags.map((t: any) => t.tag),
  };
}
