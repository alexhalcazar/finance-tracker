import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { AddExpense } from "@/pages/AddExpense"; // adjust path if needed

// mock react-hook-form
const mockUseForm = vi.fn();
vi.mock("react-hook-form", () => ({
  useForm: () => mockUseForm(),
}));

vi.mock("@/formSchemas/allFormSchemas", () => ({
  addExpenseSchema: {},
}));

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: vi.fn(),
}));

// Save original console
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("AddExpense Component", () => {
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

  const AddExpenseWithRouter = () => (
    <BrowserRouter>
      <AddExpense />
    </BrowserRouter>
  );

  // Rendering tests
  describe("Rendering", () => {
    test("renders Add Expense page with heading, description and submit button", () => {
      render(<AddExpenseWithRouter />);

      expect(
        screen.getByRole("heading", { name: /add expense/i })
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /record a new expense below to keep track of your spending\./i
        )
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    test("renders form with all input fields", () => {
      render(<AddExpenseWithRouter />);

      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/transaction date/i)).toBeInTheDocument();
    });
  });

  // Happy path form interactions
  describe("Form Interaction, Happy Path", () => {
    test("allows user to type in amount and description fields", async () => {
      const user = userEvent.setup();
      render(<AddExpenseWithRouter />);

      const amountInput = screen.getByLabelText(/amount/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(amountInput, "100");
      await user.type(descriptionInput, "Groceries");

      // Fix numeric input comparison
      expect(amountInput).toHaveValue(100); // number
      expect(descriptionInput).toHaveValue("Groceries");
    });

    test("logs form data on submission", async () => {
      const user = userEvent.setup();
      const testData = {
        amount: 50,
        category: "Food",
        description: "Taxi",
        transactionDate: "2025-10-27",
      };

      mockHandleSubmit.mockImplementation((fn) => (e) => {
        e.preventDefault();
        return fn(testData);
      });

      render(<AddExpenseWithRouter />);

      const submitButton = screen.getByRole("button", { name: /add/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          "Add Expense Data\n",
          testData
        );
      });
    });
  });

  // Unhappy path / validation
  describe("Form Validation, Unhappy Path", () => {
    test("shows validation error for invalid amount", () => {
      mockFormState.errors = {
        amount: { message: "Amount must be greater than zero" },
      };

      render(<AddExpenseWithRouter />);

      expect(
        screen.getByText("Amount must be greater than zero")
      ).toBeInTheDocument();
    });

    test("shows multiple validation errors for empty fields", () => {
      mockFormState.errors = {
        amount: { message: "Amount must be greater than zero" },
        description: { message: "Description is required" },
        category: { message: "Please select a valid category" },
        transactionDate: { message: "Please enter a valid date" },
      };

      render(<AddExpenseWithRouter />);

      expect(
        screen.getByText("Amount must be greater than zero")
      ).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
      expect(
        screen.getByText("Please select a valid category")
      ).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid date")).toBeInTheDocument();
    });
  });
});
