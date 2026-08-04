import Image from "next/image";
import { Check } from "lucide-react";
import type { Character } from "@/lib/types";

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  disabled?: boolean;
  accent: "lime" | "violet";
  onSelect: (character: Character) => void;
}

export function CharacterCard({
  character,
  selected,
  disabled = false,
  accent,
  onSelect,
}: CharacterCardProps) {
  return (
    <button
      type="button"
      className={`character-card ${selected ? "selected" : ""} ${disabled ? "unavailable" : ""} ${accent}`}
      onClick={() => onSelect(character)}
      disabled={disabled}
      aria-pressed={selected}
      data-testid={`character-card-${character.id}`}
      aria-label={
        disabled
          ? `${character.name} is selected in the other explorer`
          : `Select ${character.name}`
      }
    >
      <span className="portrait">
        <Image src={character.image} alt="" fill sizes="88px" unoptimized />
      </span>
      <span className="character-copy">
        <strong>{character.name}</strong>
        <span className="character-meta">
          <i className={`status ${character.status.toLowerCase()}`} aria-hidden="true" />
          {character.status} · {character.species}
        </span>
      </span>
      {selected && (
        <span className="selected-mark" aria-hidden="true">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
      {disabled && <span className="unavailable-label">Already selected</span>}
    </button>
  );
}
