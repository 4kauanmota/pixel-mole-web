export const GAME_TYPES = {
  all: { value: "all", label: "Todos os Jogos", color: "#f0f0f0" },
  coming_soon: { value: "coming_soon", label: "Em Breve", color: "#FFD564" },
  game_jam: { value: "game_jam", label: "Game Jam", color: "#c0392b" },
};

export interface GameType {
  value: string;
  label: string;
  color: string;
}

export const TAGS = {
  romance: {
    value: "romance",
    label: "Romance",
    icon: "Heart",
    color: "#A81E8A",
  },
  // horror: { value: "horror", label: "Terror", icon: "Skull", color: "#4D1184" },
  visual_novel: {
    value: "visual_novel",
    label: "Visual novel",
    icon: "BookOpen",
    color: "#0F6EC1",
  },
  adventure: {
    value: "adventure",
    label: "Aventura",
    icon: "Compass",
    color: "#FD971B",
  },
  // action: { value: "action", label: "Ação", icon: "Swords", color: "#FFD564" },
  platform: {
    value: "platform",
    label: "Plataforma",
    icon: "Mountain",
    color: "#2E8B57",
  },
};

export interface Tag {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export interface Game {
  name: string;
  description: string;
  image: string;
  tags: Tag[];
  type: GameType;
}

export const GAMES: Game[] = [
  {
    name: "REmemory",
    description: "love",
    image:
      "https://img.itch.zone/aW1hZ2UvNDE5NTU4My8yNTAwNjEyMS5wbmc=/original/IVvC7f.png",
    tags: [TAGS.romance, TAGS.visual_novel],
    type: GAME_TYPES.coming_soon,
  },
  {
    name: "WIP: The Unfinished Journey",
    description:
      "Play the beta version of the game, but DON’T TRY TO REACH THE END, okay?",
    image:
      "https://img.itch.zone/aW1nLzI2NDAzODUyLnBuZw==/315x250%23c/bsedlB.png",
    tags: [TAGS.platform, TAGS.adventure],
    type: GAME_TYPES.game_jam,
  },
];
