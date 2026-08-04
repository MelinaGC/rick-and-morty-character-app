import { CalendarDays } from "lucide-react";
import type { Episode } from "@/lib/types";

interface EpisodeColumnProps {
  title: string;
  label: string;
  episodes: Episode[];
  variant: "lime" | "shared" | "violet";
}

export function EpisodeColumn({ title, label, episodes, variant }: EpisodeColumnProps) {
  return (
    <section className={`episode-column ${variant}`}>
      <header>
        <span className="episode-label">{label}</span>
        <span className="count">{episodes.length}</span>
        <h3>{title}</h3>
      </header>
      <div className="episode-list">
        {episodes.length ? (
          episodes.map((episode) => (
            <article className="episode-row" key={episode.id}>
              <span className="episode-code">{episode.episode}</span>
              <div>
                <strong>{episode.name}</strong>
                <span>
                  <CalendarDays size={13} /> {episode.air_date}
                </span>
              </div>
            </article>
          ))
        ) : (
          <p className="no-episodes">No episodes in this timeline.</p>
        )}
      </div>
    </section>
  );
}
