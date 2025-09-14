import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { Login } from "@/pages/Login";

//  mock for reack-hook-form library
const mockUseForm = vi.fn();
vi.mock("react-hook-form", () => ({
  useForm: () => mockUseForm(),
}));

vi.mock("@/features/auth/formSchema", () => ({
  loginSchema: {},
}));

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: vi.fn(),
}));

//  Get the original console logging
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Login Component", () => {
  let mockRegister;
  let mockHandleSubmit;
  let mockFormState;

  beforeEach(() => {
    vi.clearAllMocks();

    console.log = vi.fn();
    console.error = vi.fn();

    mockRegister = vi.fn(() => ({}));
    mockHandleSubmit = vi.fn((fn) => (e) => {
      e.preventDefault();
      return fn();
    });
    mockFormState = { errors: {} };

    mockUseForm.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: mockFormState,
    });
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  const LoginWithRouter = () => (
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Tests for rendering the login form
  describe("Rendering", () => {
    test("renders login page with correct heading and description", () => {
      render(<LoginWithRouter />);

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(
        screen.getByText("Welcome back to pocket budget, jump back below.")
      ).toBeInTheDocument();
    });

    test("renders login form with email and password fields", () => {
      render(<LoginWithRouter />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your password")
      ).toBeInTheDocument();
    });
  });

  //  Test for login comopnent on success paths
  describe("Form Interaction, Happy Path", () => {
    test("allows user to type in email field", async () => {
      const user = userEvent.setup();
      render(<LoginWithRouter />);

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    test("logs form data on successful submission", async () => {
      const user = userEvent.setup();
      const testData = { email: "test@example.com", password: "password123" };

      mockHandleSubmit.mockImplementation((fn) => (e) => {
        e.preventDefault();
        return fn(testData);
      });

      render(<LoginWithRouter />);

      const submitButton = screen.getByRole("button", { name: "Sign In" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Login Data\n", testData);
      });
    });
  });

  describe("Form Validation, Unhappy Path", () => {
    test("display email validation error", () => {
      mockFormState.errors = {
        email: { message: "Email is required" },
      };

      render(<LoginWithRouter />);

      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toHaveClass("text-error");
    });

    test("display email and password errors simultaneously", () => {
      mockFormState.errors = {
        email: { message: "Email is required" },
        password: { message: "Password is required" },
      };

      render(<LoginWithRouter />);

      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });
});
