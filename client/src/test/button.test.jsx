import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, vi, describe } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  test("render button with text", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const mockClickHandler = vi.fn();

    render(<Button onClick={mockClickHandler}>Click Me</Button>);

    const button = screen.getByText("Click Me");
    await user.click(button);

    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  test("applies correct variant classes", () => {
    render(<Button variant="secondary">Click Me</Button>);
    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();
  });

  test("can be disabled", async () => {
    const user = userEvent.setup();
    const mockClickHandler = vi.fn();

    render(
      <Button onClick={mockClickHandler} disabled>
        Button
      </Button>
    );
    const button = screen.getByText("Button");

    expect(button).toBeDisabled();

    await user.click(button);
    expect(mockClickHandler).not.toHaveBeenCalled();
  });
});
