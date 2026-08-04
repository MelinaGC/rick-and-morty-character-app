import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Character } from "@/lib/types";
import { CharacterCard } from "./character-card";

interface CharacterPanelProps {
  number: 1 | 2;
  results: Character[];
  selected: Character | null;
  excludedCharacterId?: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
  onSelect: (character: Character) => void;
}

export function CharacterPanel(props: CharacterPanelProps) {
  const accent = props.number === 1 ? "lime" : "violet";
  return (
    <section
      className={`character-panel ${accent}`}
      aria-labelledby={`character-${props.number}`}
      data-testid={`character-explorer-${props.number}`}
    >
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Explorer 0{props.number}</span>
          <h2 id={`character-${props.number}`}>Character #{props.number}</h2>
        </div>
        {props.selected && <span className="selection-pill">Selected</span>}
      </div>

      {props.loading ? (
        <div className="card-grid" aria-label="Loading characters">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="character-card skeleton" key={index} />
          ))}
        </div>
      ) : props.error ? (
        <div className="panel-message error">{props.error}</div>
      ) : (
        <div className="card-grid">
          {props.results.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={props.selected?.id === character.id}
              disabled={props.excludedCharacterId === character.id}
              accent={accent}
              onSelect={props.onSelect}
            />
          ))}
        </div>
      )}

      <nav className="pagination" aria-label={`Character ${props.number} pagination`}>
        <button
          type="button"
          onClick={() => props.onPageChange(props.page - 1)}
          disabled={props.page === 1 || props.loading}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        <span>
          <strong>{String(props.page).padStart(2, "0")}</strong> /
          {String(props.pages).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => props.onPageChange(props.page + 1)}
          disabled={props.page === props.pages || props.loading}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </nav>
    </section>
  );
}
