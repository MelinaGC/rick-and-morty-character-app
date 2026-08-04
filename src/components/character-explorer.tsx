"use client";

import { useEffect, useMemo, useState } from "react";
import { Orbit } from "lucide-react";
import { getCharacters, getEpisodes } from "@/lib/api";
import { splitEpisodes } from "@/lib/episodes";
import type { Character, Episode } from "@/lib/types";
import { CharacterPanel } from "./character-panel";
import { EpisodeColumn } from "./episode-column";

interface CharacterState {
  page: number;
  pages: number;
  results: Character[];
  loading: boolean;
  error: string | null;
}

interface EpisodesRequestState {
  requestKey: string;
  episodes: Record<string, Episode>;
  error: string | null;
}

const initialState: CharacterState = {
  page: 1,
  pages: 1,
  results: [],
  loading: true,
  error: null,
};

export function CharacterExplorer() {
  const [firstList, setFirstList] = useState(initialState);
  const [secondList, setSecondList] = useState(initialState);
  const [first, setFirst] = useState<Character | null>(null);
  const [second, setSecond] = useState<Character | null>(null);
  const [episodesState, setEpisodesState] = useState<EpisodesRequestState>({
    requestKey: "",
    episodes: {},
    error: null,
  });

  function loadList(
    page: number,
    setter: React.Dispatch<React.SetStateAction<CharacterState>>,
  ) {
    const controller = new AbortController();
    setter((state) => ({ ...state, page, loading: true, error: null }));
    getCharacters(page, controller.signal)
      .then((data) =>
        setter({
          page,
          pages: data.info.pages,
          results: data.results,
          loading: false,
          error: null,
        }),
      )
      .catch((error: Error) => {
        if (error.name !== "AbortError")
          setter((state) => ({ ...state, loading: false, error: error.message }));
      });
    return controller;
  }

  useEffect(() => {
    const controller = loadList(1, setFirstList);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = loadList(1, setSecondList);
    return () => controller.abort();
  }, []);

  const groups = useMemo(
    () => (first && second ? splitEpisodes(first, second) : null),
    [first, second],
  );

  const episodeUrls = useMemo(() => {
    if (!groups) return [];

    return [
      ...new Set([
        ...groups.characterOneOnly,
        ...groups.shared,
        ...groups.characterTwoOnly,
      ]),
    ];
  }, [groups]);

  const requestKey = episodeUrls.join(",");
  const episodesLoading = groups !== null && episodesState.requestKey !== requestKey;
  const episodesError =
    episodesState.requestKey === requestKey ? episodesState.error : null;

  useEffect(() => {
    if (!groups) return;

    const controller = new AbortController();

    getEpisodes(episodeUrls, controller.signal)
      .then((data) => {
        setEpisodesState({
          requestKey,
          episodes: Object.fromEntries(data.map((episode) => [episode.url, episode])),
          error: null,
        });
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setEpisodesState({
            requestKey,
            episodes: {},
            error: error.message,
          });
        }
      });

    return () => controller.abort();
  }, [episodeUrls, groups, requestKey]);

  const resolve = (urls: string[]) =>
    urls
      .map((url) => episodesState.episodes[url])
      .filter((episode): episode is Episode => Boolean(episode));

  return (
    <main>
      <header className="hero">
        <div className="brand">
          <Orbit size={19} />
        </div>
        <div className="hero-copy">
          <h1>
            Rick and Morty <br /> <em>episode explorer</em>
          </h1>
        </div>
        <div className="signal">
          <span /> API SIGNAL <strong>LIVE</strong>
        </div>
      </header>

      <section className="selectors" aria-label="Character selectors">
        <CharacterPanel
          {...firstList}
          number={1}
          selected={first}
          excludedCharacterId={second?.id}
          onSelect={setFirst}
          onPageChange={(page) => loadList(page, setFirstList)}
        />
        <div className="versus" aria-hidden="true">
          <span>+</span>
        </div>
        <CharacterPanel
          {...secondList}
          number={2}
          selected={second}
          excludedCharacterId={first?.id}
          onSelect={setSecond}
          onPageChange={(page) => loadList(page, setSecondList)}
        />
      </section>

      <section className="results" aria-live="polite">
        <div className="results-heading">
          <span className="eyebrow">Timeline analysis</span>
          <h2>Episode breakdown</h2>
        </div>
        {!first || !second ? (
          <div className="locked-state">
            <div className="lock-orbit">
              <Orbit size={30} />
            </div>
            <div>
              <strong>Two selections required</strong>
              <p>
                Select one character from each explorer to unlock the episode explorer.
              </p>
            </div>
            <div className="progress-dots">
              <span className={first ? "complete" : ""}>1</span>
              <i />
              <span className={second ? "complete" : ""}>2</span>
            </div>
          </div>
        ) : episodesLoading ? (
          <div className="locked-state">
            <div className="spinner" /> Calculating timeline intersections…
          </div>
        ) : episodesError ? (
          <div className="locked-state error">{episodesError}</div>
        ) : groups ? (
          <div className="episode-grid">
            <EpisodeColumn
              title={`${first.name} only`}
              label="Exclusive timeline 01"
              episodes={resolve(groups.characterOneOnly)}
              variant="lime"
            />
            <EpisodeColumn
              title="Shared episodes"
              label="Timeline intersection"
              episodes={resolve(groups.shared)}
              variant="shared"
            />
            <EpisodeColumn
              title={`${second.name} only`}
              label="Exclusive timeline 02"
              episodes={resolve(groups.characterTwoOnly)}
              variant="violet"
            />
          </div>
        ) : null}
      </section>
      <footer>DATA FROM THE RICK AND MORTY API</footer>
    </main>
  );
}
