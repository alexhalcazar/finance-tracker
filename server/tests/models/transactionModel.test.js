import { expect, test, vi, describe, beforeEach } from "vitest";
import transaction from "#models/transactionModel.js";

const transactionData = {
  budget_id: 1,
  category_id: 1,
  amount: 50.75,
  note: "Grocery shopping at Whole Foods",
  transaction_date: new Date("2025-10-15"),
};

const updateTransaction = {
  transaction_id: 1,
  amount: 65.5,
  note: "Updated grocery shopping",
};

const returnedData = {
  ...transactionData,
  transaction_id: 1,
  created_at: new Date("2025-10-18T00:00:00Z"),
  updated_at: new Date("2025-10-18T00:00:00Z"),
};

const allTransactionsData = [
  returnedData,
  {
    transaction_id: 2,
    budget_id: 1,
    category_id: 2,
    amount: 1200.0,
    note: "Monthly salary",
    transaction_date: new Date("2025-10-01"),
    created_at: new Date("2025-10-18T00:00:00Z"),
    updated_at: new Date("2025-10-18T00:00:00Z"),
  },
];

const userTransactionsData = [
  returnedData,
  {
    transaction_id: 3,
    budget_id: 1,
    category_id: 3,
    amount: 25.0,
    note: "Coffee",
    transaction_date: new Date("2025-10-16"),
    created_at: new Date("2025-10-18T00:00:00Z"),
    updated_at: new Date("2025-10-18T00:00:00Z"),
  },
];

vi.mock("#db", () => ({
  default: vi.fn(() => ({
    insert: vi.fn(() => ({
      returning: vi.fn().mockResolvedValue([returnedData]),
    })),
    where: vi.fn(() => ({
      select: vi.fn().mockResolvedValue(allTransactionsData),
      first: vi.fn().mockResolvedValue(returnedData),
      limit: vi.fn(() => ({
        select: vi.fn().mockResolvedValue([allTransactionsData[0]]),
      })),
      update: vi.fn(() => ({
        returning: vi
          .fn()
          .mockResolvedValue([{ ...returnedData, ...updateTransaction }]),
      })),
      del: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([returnedData]),
      })),
    })),
    join: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn(() => ({
          select: vi.fn().mockResolvedValue(userTransactionsData),
        })),
      })),
    })),
    select: vi.fn().mockResolvedValue(allTransactionsData),
  })),
}));

describe("Transaction Model Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("insert new transaction into the 'transactions' table", async () => {
    const result = await transaction.insert(transactionData);
    expect(result).toEqual(returnedData);
  });

  test("find all transactions without filters", async () => {
    const result = await transaction.findAll();
    expect(result).toEqual(allTransactionsData);
    expect(result).toHaveLength(2);
  });

  test("find all transactions with filters", async () => {
    const filters = { budget_id: 1, category_id: 1 };
    const result = await transaction.findAll(filters);
    expect(result).toEqual(allTransactionsData);
  });

  test("find all transactions with filters and limit", async () => {
    const filters = { budget_id: 1 };
    const result = await transaction.findAll(filters, 1);
    expect(result).toEqual([allTransactionsData[0]]);
    expect(result).toHaveLength(1);
  });

  test("find transaction by id from the 'transactions' table", async () => {
    const result = await transaction.findById(1);
    expect(result).toEqual(returnedData);
  });

  test("find transactions by user_id from the 'transactions' table", async () => {
    const result = await transaction.findByUserId(1);
    expect(result).toEqual(userTransactionsData);
    expect(result).toHaveLength(2);
  });

  test("update an existing transaction from the 'transactions' table", async () => {
    const result = await transaction.update(1, updateTransaction);
    expect(result).toMatchObject(updateTransaction);
  });

  test("delete an existing transaction from the 'transactions' table", async () => {
    const result = await transaction.delete(1);
    expect(result).toEqual(returnedData);
  });
});
