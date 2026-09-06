export const GAME_TYPES = {
  all: { value: "all", label: "Todos os Jogos", color: "#f0f0f0" },
  coming_soon: { value: "coming_soon", label: "Em Breve", color: "#FFD564" },
  game_jam: { value: "game_jam", label: "Game Jam", color: "#c0392b" },
};

export const TAGS = {
  romance: {
    name: "romance",
    icon: "Heart",
    color: "#A81E8A",
  },
  // horror: { value: "horror", label: "Terror", icon: "Skull", color: "#4D1184" },
  visual_novel: {
    name: "visual_novel",
    icon: "BookOpen",
    color: "#0F6EC1",
  },
  adventure: {
    name: "adventure",
    icon: "Compass",
    color: "#FD971B",
  },
  // action: { value: "action", label: "Ação", icon: "Swords", color: "#FFD564" },
  platform: {
    name: "platform",
    icon: "Mountain",
    color: "#2E8B57",
  },
};

// Mapa de plataformas exibidas no modal de detalhes do jogo (GameModal).
// A chave deve ser o slug da plataforma (ex.: vindo do campo `links` do
// Supabase, no formato { platform: "steam", url: "..." }).
//
// - Plataformas SEM `icon` usam o ícone de marca oficial correspondente,
//   resolvido automaticamente via simple-icons (GameLinkButton.vue).
// - Plataformas COM `icon` usam um ícone genérico do lucide-vue-next
//   (útil para links que não têm uma "marca", como site próprio ou e-mail).
//
// Qualquer slug que não esteja neste mapa ainda funciona: o GameLinkButton
// tenta resolver o ícone de marca pelo slug puro e cai para um ícone
// genérico caso a plataforma não seja reconhecida.
export const LINK_PLATFORMS: Record<
  string,
  { label: string; color: string; icon?: string }
> = {
  steam: { label: "Steam", color: "#171a21" },
  itchio: { label: "itch.io", color: "#fa5c5c" },
  github: { label: "GitHub", color: "#181717" },
  youtube: { label: "YouTube", color: "#ff0000" },
  discord: { label: "Discord", color: "#5865f2" },
  x: { label: "X", color: "#000000" },
  instagram: { label: "Instagram", color: "#e4405f" },
  tiktok: { label: "TikTok", color: "#000000" },
  twitch: { label: "Twitch", color: "#9146ff" },
  gmail: { label: "E-mail", color: "#3a3a3c", icon: "Mail" },
  website: { label: "Site", color: "#3a3a3c", icon: "Globe" },
};

// export const GAMES: Game[] = [
//   {
//     name: "REmemory",
//     description: "love",
//     image:
//       "https://img.itch.zone/aW1hZ2UvNDE5NTU4My8yNTAwNjEyMS5wbmc=/original/IVvC7f.png",
//     tags: [TAGS.romance, TAGS.visual_novel],
//     type: GAME_TYPES.coming_soon,
//   },
//   {
//     name: "WIP: The Unfinished Journey",
//     description:
//       "Play the beta version of the game, but DON’T TRY TO REACH THE END, okay?",
//     image:
//       "https://img.itch.zone/aW1nLzI2NDAzODUyLnBuZw==/315x250%23c/bsedlB.png",
//     tags: [TAGS.platform, TAGS.adventure],
//     type: GAME_TYPES.game_jam,
//     // Exemplo de formato esperado para os links (campo a ser criado no Supabase):
//     links: [
//       { platform: "itchio", url: "https://pixelmole.itch.io/unfinished-journey" },
//       { platform: "github", url: "https://github.com/pixelmole/unfinished-journey" },
//     ],
//   },
// ];
