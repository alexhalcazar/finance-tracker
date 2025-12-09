import { z } from "zod";

const loginSchema = z.object({
  // the regex used by browsers to validate input[type=email] fields
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
  email: z.email({
    pattern: z.regexes.html5Email,
    error: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters in length." }),
  username: z
    .string()
    .min(6, { error: "Username must be at least 6 characters in length." }),
});

/**
 * Extend the login schema, pass in a default error message to ensure
 * confirmPassword is equal to the form.password which is available with extend.
 */
const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((form) => form.password === form.confirmPassword, {
    message: "Password's do not match",
    path: ["confirmPassword"],
  });

const addExpenseSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero"),
  category: z.enum(
    [
      "Rent",
      "Bills",
      "Food",
      "Transportation",
      "Tuition",
      "Spending",
      "Savings",
    ],
    {
      errorMap: () => ({ message: "Please select a valid category" }),
    }
  ),
  description: z.string().min(1, { message: "Description is required" }),
  transactionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

const addCategorySchema = z.object({
  type: z.enum(["Income", "Expense"], {
    errorMap: () => ({ message: "Please select a valid type" }),
  }),
  name: z.enum(
    [
      "Rent",
      "Bills",
      "Food",
      "Transportation",
      "Tuition",
      "Spending",
      "Savings",
    ],
    {
      errorMap: () => ({ message: "Please select a valid name" }),
    }
  ),
  limit: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero"),
  budget_id: z.string().nonempty("Budget is required"),
});

const addBudgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  start_date: z
    .string()
    .min(1, "Start date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),
  end_date: z
    .string()
    .min(1, "End date is required")
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date" }),
  currency: z.string().min(1, "Currency is required"),
});

export {
  loginSchema,
  registerSchema,
  addExpenseSchema,
  addCategorySchema,
  addBudgetSchema,
};
