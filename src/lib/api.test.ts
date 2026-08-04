import { afterEach, describe, expect, it, vi } from "vitest";
import { getCharacters, getEpisodes } from "./api";

describe("Rick and Morty REST client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns a helpful error when the API request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(getCharacters(1)).rejects.toThrow(
      "The multiverse is not responding. Please try again.",
    );
  });

  it("does not make a request when there are no episodes to load", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getEpisodes([])).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
