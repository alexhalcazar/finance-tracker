import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Label } from "@/components/ui/label";

vi.mock("@/utils/cn", () => ({
  cn: (...classes) => classes.filter(Boolean).flat().join(" "),
}));

describe("Label component", () => {
  test("Renders label with text conent", () => {
    render(<Label>Test label</Label>);

    const label = screen.getByText("Test label");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
  });

  test("applies htmlFor attribute", () => {
    render(<Label htmlFor="test-input">Test Label</Label>);

    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-input");
  });

  test("handles event handlers", async () => {
    const user = userEvent.setup();
    const mockOnMouseOver = vi.fn();
    const mockOnMouseLeave = vi.fn();

    render(
      <Label onMouseOver={mockOnMouseOver} onMouseLeave={mockOnMouseLeave}>
        Event Label
      </Label>
    );

    const label = screen.getByText("Event Label");

    await user.hover(label);
    expect(mockOnMouseOver).toHaveBeenCalledTimes(1);

    await user.unhover(label);
    expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
  });

  test("maintains accessibility when used with form controls", () => {
    render(
      <div>
        <Label htmlFor="accessible-input">Accessible Label</Label>
        <input id="accessible-input" type="text" aria-describedby="help-text" />
        <div id="help-text">This is help text</div>
      </div>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAccessibleName("Accessible Label");
  });
});
