import type { Character, Episode, PaginatedResponse } from "./types";

const API_URL = "https://rickandmortyapi.com/api";

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { signal });
  if (!response.ok)
    throw new Error("The multiverse is not responding. Please try again.");
  return response.json() as Promise<T>;
}

export const getCharacters = (page: number, signal?: AbortSignal) =>
  request<PaginatedResponse<Character>>(`/character?page=${page}`, signal);

export async function getEpisodes(
  urls: string[],
  signal?: AbortSignal,
): Promise<Episode[]> {
  if (!urls.length) return [];
  const ids = urls.map((url) => url.split("/").pop()).join(",");
  const result = await request<Episode | Episode[]>(`/episode/${ids}`, signal);
  return Array.isArray(result) ? result : [result];
}
