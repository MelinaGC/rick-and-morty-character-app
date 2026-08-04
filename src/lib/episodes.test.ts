import { describe, expect, it } from "vitest";
import { splitEpisodes } from "./episodes";
import type { Character } from "./types";

const character = (id: number, episode: string[]) => ({ id, episode }) as Character;

describe("splitEpisodes", () => {
  it("separates exclusive and shared episodes without duplicates", () => {
    expect(
      splitEpisodes(character(1, ["e1", "e2", "e3"]), character(2, ["e2", "e3", "e4"])),
    ).toEqual({
      characterOneOnly: ["e1"],
      shared: ["e2", "e3"],
      characterTwoOnly: ["e4"],
    });
  });

  it("handles characters with no shared episodes", () => {
    expect(splitEpisodes(character(1, ["e1"]), character(2, ["e2"])).shared).toEqual([]);
  });
});
