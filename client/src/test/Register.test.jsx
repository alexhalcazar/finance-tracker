import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { Register } from "@/pages/Register";

//  mock for react-hook-form library
const mockUseForm = vi.fn();
vi.mock("react-hook-form", () => ({
  useForm: () => mockUseForm(),
}));

vi.mock("@/features/auth/formSchema", () => ({
  registerSchema: {},
}));

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: vi.fn(),
}));

//  Get the original console logging
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Register component", () => {
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

  const RegisterWithRouter = () => (
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  //  Test for register on basic rendering on page
  describe("Rendering", () => {
    test("renders register form with email, password and confirm password fields", () => {
      render(<RegisterWithRouter />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your password")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm your password")
      ).toBeInTheDocument();
    });

    test("renders register button with correct text", () => {
      render(<RegisterWithRouter />);

      const submitButton = screen.getByRole("button", { name: "Register" });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    test("renders login link", () => {
      render(<RegisterWithRouter />);

      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      const loginLink = screen.getByRole("link", { name: "Login" });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/auth/login");
    });

    test("renders confirm password field for register form", () => {
      render(<RegisterWithRouter />);

      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm your password")
      ).toBeInTheDocument();
    });
  });

  //  Test for register comopnent on success paths
  describe("Form Interaction, Happy Path", () => {
    test("allows user to type in email field", async () => {
      const user = userEvent.setup();
      render(<RegisterWithRouter />);

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    test("allows user to type in password field", async () => {
      const user = userEvent.setup();
      render(<RegisterWithRouter />);

      const passwordInput = screen.getByPlaceholderText("Enter your password");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    test("allows user to type in confirm password field", async () => {
      const user = userEvent.setup();
      render(<RegisterWithRouter />);

      const confirmPasswordInput = screen.getByPlaceholderText(
        "Confirm your password"
      );
      await user.type(confirmPasswordInput, "password123");

      expect(confirmPasswordInput).toHaveValue("password123");
    });

    test("logs form data on successful submission", async () => {
      const user = userEvent.setup();
      const testData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      mockHandleSubmit.mockImplementation((fn) => (e) => {
        e.preventDefault();
        return fn(testData);
      });

      render(<RegisterWithRouter />);

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith("Login Data\n", testData);
      });
    });

    test("calls onSubmit when form is submitted with valid data", async () => {
      const user = userEvent.setup();

      mockHandleSubmit.mockImplementation((fn) => (e) => {
        e.preventDefault();
        return fn({
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
        });
      });

      render(<RegisterWithRouter />);

      const submitButton = screen.getByRole("button", { name: "Register" });
      await user.click(submitButton);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  //  Test for register component on unsuccessful paths
  describe("Form Validation, Unhappy Path", () => {
    test("displays email validation error", () => {
      mockFormState.errors = {
        email: { message: "Email is required" },
      };

      render(<RegisterWithRouter />);

      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toHaveClass("text-error");
    });

    test("displays password validation error", () => {
      mockFormState.errors = {
        password: { message: "Password must be at least 6 characters" },
      };

      render(<RegisterWithRouter />);

      expect(
        screen.getByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Password must be at least 6 characters")
      ).toHaveClass("text-error");
    });

    test("displays confirm password validation eerror", () => {
      mockFormState.errors = {
        confirmPassword: { message: "Passwords must match" },
      };

      render(<RegisterWithRouter />);

      expect(screen.getByText("Passwords must match")).toBeInTheDocument();
      expect(screen.getByText("Passwords must match")).toHaveClass(
        "text-error"
      );
    });

    test("displays email and password errors simultaneously", () => {
      mockFormState.errors = {
        email: { message: "Email is required" },
        password: { message: "Password is required" },
      };

      render(<RegisterWithRouter />);

      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    test("displays all three field validation errors simultaneously", () => {
      mockFormState.errors = {
        email: { message: "Invalid email format" },
        password: { message: "Password too short" },
        confirmPassword: { message: "Passwords don't match" },
      };

      render(<RegisterWithRouter />);

      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      expect(screen.getByText("Password too short")).toBeInTheDocument();
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });

    test("does not display error message when no error exists", () => {
      mockFormState.errors = {};

      render(<RegisterWithRouter />);

      const errorElements = screen.getAllByText("", { selector: "p" });
      errorElements.forEach((element) => {
        expect(element).toBeInTheDocument();
        expect(element.textContent).toBe("");
      });
    });
  });
});
