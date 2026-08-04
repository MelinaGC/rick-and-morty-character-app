import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CharacterCard } from "./character-card";
import type { Character } from "@/lib/types";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // The mock deliberately represents Next Image as its rendered browser element.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));
const rick = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  image: "/rick.jpg",
  episode: [],
} as Character;

describe("CharacterCard", () => {
  it("shows character data and emits selection", async () => {
    const onSelect = vi.fn();
    render(
      <CharacterCard
        character={rick}
        selected={false}
        accent="lime"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Alive · Human")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Select Rick Sanchez" }));
    expect(onSelect).toHaveBeenCalledWith(rick);
  });

  it("cannot select a character already chosen in the other explorer", async () => {
    const onSelect = vi.fn();
    render(
      <CharacterCard
        character={rick}
        selected={false}
        disabled
        accent="violet"
        onSelect={onSelect}
      />,
    );

    const card = screen.getByRole("button", {
      name: "Rick Sanchez is selected in the other explorer",
    });
    expect(card).toBeDisabled();
    await userEvent.click(card);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
