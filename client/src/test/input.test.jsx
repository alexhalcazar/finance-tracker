import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input component", () => {
  test("renders input with basic props", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");

    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
    expect(input.type).toBe("text");
  });

  test("applies custom id attributes", () => {
    render(<Input id="test-input" placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    expect(input).toHaveAttribute("id", "test-input");
  });

  test("applies custom className", () => {
    render(<Input className="custom-class" placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    expect(input).toHaveClass("custom-class");
  });

  test("can be disabled", () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
  });

  test("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  test("calls onChange handler when typed in", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<Input onChange={mockOnChange} placeholder="Type here" />);

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "test");

    expect(mockOnChange).toHaveBeenCalledTimes(4);
  });

  test("error message appears after input in DOM structure", () => {
    render(
      <Input error={true} errorMessage="Error message" placeholder="DOM test" />
    );

    const input = screen.getByPlaceholderText("DOM test");
    const errorMessage = screen.getByText("Error message");
    const wrapper = input.parentElement;

    expect(wrapper.children).toHaveLength(2);
    expect(wrapper.children[0]).toBe(input);
    expect(wrapper.children[1]).toBe(errorMessage);
  });
});
