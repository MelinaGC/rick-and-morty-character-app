import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CharacterPanel } from "./character-panel";

const baseProps = {
  number: 1 as const,
  results: [],
  selected: null,
  pages: 3,
  loading: false,
  error: null,
  onSelect: vi.fn(),
};

afterEach(cleanup);

describe("CharacterPanel", () => {
  it("disables previous on page one and requests the next page", async () => {
    const onPageChange = vi.fn();
    const { getByRole } = render(
      <CharacterPanel {...baseProps} page={1} onPageChange={onPageChange} />,
    );

    expect(getByRole("button", { name: "Previous page" })).toBeDisabled();
    await userEvent.click(getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("requests the previous page and disables next on the final page", async () => {
    const onPageChange = vi.fn();
    const { getByRole } = render(
      <CharacterPanel {...baseProps} page={3} onPageChange={onPageChange} />,
    );

    expect(getByRole("button", { name: "Next page" })).toBeDisabled();
    await userEvent.click(getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("shows a meaningful API error instead of the character grid", () => {
    render(
      <CharacterPanel
        {...baseProps}
        page={1}
        error="The multiverse is not responding. Please try again."
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("The multiverse is not responding. Please try again."),
    ).toBeVisible();
    expect(screen.queryByRole("button", { name: /Select/ })).not.toBeInTheDocument();
  });
});
