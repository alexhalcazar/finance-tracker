import { expect, test, vi, describe, beforeEach } from "vitest";
import recurringTransaction from "#models/recurringTransactionModel";

const recurringTransactionData = {
  budget_id: 1,
  category_id: 1,
  amount: 1200.52,
  frequency: "monthly",
  start_date: new Date("2025-01-01"),
  end_date: new Date("2025-12-31"),
  note: "monthly rent payment",
  transaction_date: new Date("2025-10-15"),
};

const updateRecurringTransaction = {
  recurring_id: 1,
  amount: 1500.75,
  note: "Updated monthly rent",
};

const returnedData = {
  ...recurringTransactionData,
  recurring_id: 1,
  created_at: new Date("2025-10-18T00:00:00Z"),
  updated_at: new Date("2025-10-18T00:00:00Z"),
};

const allRecurringTransactionsData = [
  returnedData,
  {
    recurring_id: 2,
    budget_id: 1,
    category_id: 2,
    amount: 3500.25,
    frequency: "monthly",
    start_date: new Date("2025-01-01"),
    end_date: new Date("2025-12-31"),
    note: "monthly salary",
  },
  {
    recurring_id: 3,
    budget_id: 1,
    category_id: 3,
    amount: 50.26,
    frequency: "weekly",
    start_date: new Date("2025-01-01"),
    end_date: new Date("2025-12-31"),
    note: "weekly groceries",
  },
];

vi.mock("#db", () => ({
  default: vi.fn(() => ({
    insert: vi.fn(() => ({
      returning: vi.fn().mockResolvedValue([returnedData]),
    })),
    where: vi.fn(() => ({
      select: vi.fn().mockResolvedValue(allRecurringTransactionsData),
      first: vi.fn().mockResolvedValue(returnedData),
      limit: vi.fn(() => ({
        select: vi.fn().mockResolvedValue([allRecurringTransactionsData[0]]),
      })),
      update: vi.fn(() => ({
        returning: vi
          .fn()
          .mockResolvedValue([
            { ...returnedData, ...updateRecurringTransaction },
          ]),
      })),
      del: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([returnedData]),
      })),
    })),
    select: vi.fn().mockResolvedValue(allRecurringTransactionsData),
  })),
}));

describe("Recurring Transaction Model Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("insert new recurring transaction into the 'transactions' table", async () => {
    const result = await recurringTransaction.insert(recurringTransactionData);
    expect(result).toEqual(returnedData);
  });

  test("throw error when findAll is called without filters argument", async () => {
    await expect(recurringTransaction.findAll()).rejects.toThrow(
      "findAll must contain at least a 'filters' argument"
    );
  });

  test("find all transactions with filters and limit", async () => {
    const filters = { budget_id: 1, category_id: 1 };
    const result = await recurringTransaction.findAll(filters, 1);
    expect(result).toEqual([allRecurringTransactionsData[0]]);
    expect(result).toHaveLength(1);
  });

  test("find recurring transaction by id from the 'recurring transactions' table", async () => {
    const result = await recurringTransaction.findById(1);
    expect(result).toEqual(returnedData);
  });

  test("update an existing transaction from the 'transactions' table", async () => {
    const result = await recurringTransaction.update(
      1,
      updateRecurringTransaction
    );
    expect(result).toMatchObject(updateRecurringTransaction);
  });

  test("delete an existing transaction from the 'transactions' table", async () => {
    const result = await recurringTransaction.delete(1);
    expect(result).toEqual(returnedData);
  });
});
