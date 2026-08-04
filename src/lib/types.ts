export type CharacterStatus = "Alive" | "Dead" | "unknown";

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  image: string;
  episode: string[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  url: string;
}

export interface PaginatedResponse<T> {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: T[];
}

export interface EpisodeGroups {
  characterOneOnly: string[];
  shared: string[];
  characterTwoOnly: string[];
}
