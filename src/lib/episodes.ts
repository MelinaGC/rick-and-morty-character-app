import type { Character, EpisodeGroups } from "./types";

export function splitEpisodes(first: Character, second: Character): EpisodeGroups {
  const firstEpisodes = new Set(first.episode);
  const secondEpisodes = new Set(second.episode);

  return {
    characterOneOnly: first.episode.filter((episode) => !secondEpisodes.has(episode)),
    shared: first.episode.filter((episode) => secondEpisodes.has(episode)),
    characterTwoOnly: second.episode.filter((episode) => !firstEpisodes.has(episode)),
  };
}
