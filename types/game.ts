export interface Type {
  name: string;
  color: string;
}

export interface Tag {
  name: string;
  icon: string;
  color: string;
}

export interface Game {
  name: string;
  description: string;
  thumbnail: string;
  screenshots: string[];
  type: Type;
  tags: Tag[];
}
