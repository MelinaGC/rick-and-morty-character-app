import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EpisodeColumn } from "./episode-column";

describe("EpisodeColumn", () => {
  it("renders an intentional empty state", () => {
    render(
      <EpisodeColumn
        title="Shared episodes"
        label="Intersection"
        episodes={[]}
        variant="shared"
      />,
    );
    expect(screen.getByText("No episodes in this timeline.")).toBeInTheDocument();
  });
});
