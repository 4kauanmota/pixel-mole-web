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
// `platform` deve ser um slug (ex: "steam", "itchio", "github", "youtube"...).
// Sempre que possível, usar o slug correspondente do simple-icons para que o
// ícone de marca seja resolvido automaticamente pelo GameLinkButton.
export interface GameLink {
  platform: string;
  url: string;
  label?: string;
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
}
