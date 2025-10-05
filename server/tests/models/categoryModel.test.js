import { expect, test, vi, describe, beforeEach } from "vitest";
import category from "#models/categoryModel.js";

const categoryData = {
  budget_id: 1,
  name: "Groceries",
  type: "expense",
  limit: 500.0,
  color: "#FF5733",
};

const updateCategory = {
  category_id: 1,
  name: "Updated Groceries",
  limit: 600.0,
};

const returnedData = {
  ...categoryData,
  category_id: 1,
  created_at: new Date("2025-09-25T00:00:00Z"),
  updated_at: new Date("2025-09-25T00:00:00Z"),
};

const allCategoriesData = [
  returnedData,
  {
    category_id: 2,
    budget_id: 1,
    name: "Salary",
    type: "income",
    color: "#2ECC71",
    created_at: new Date("2025-09-25T00:00:00Z"),
    updated_at: new Date("2025-09-25T00:00:00Z"),
  },
];

vi.mock("#db", () => ({
  default: vi.fn(() => ({
    insert: vi.fn(() => ({
      returning: vi.fn().mockResolvedValue([returnedData]),
    })),
    where: vi.fn(() => ({
      select: vi.fn().mockResolvedValue(allCategoriesData),
      first: vi.fn().mockResolvedValue(returnedData),
      update: vi.fn(() => ({
        returning: vi
          .fn()
          .mockResolvedValue([{ ...returnedData, ...updateCategory }]),
      })),
      del: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([returnedData]),
      })),
    })),
    select: vi.fn().mockResolvedValue(allCategoriesData),
  })),
}));

describe("Category Model - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("insert new category into the 'categories' table", async () => {
    const result = await category.insert(categoryData);
    expect(result).toEqual(returnedData);
  });

  test("find all categories by budget_id from the 'categories' table", async () => {
    const result = await category.findAll(1);
    expect(result).toEqual(allCategoriesData);
    expect(result).toHaveLength(2);
  });

  test("find category by type from the 'categories' table", async () => {
    const result = await category.findByType(1, "expense");
    expect(result).toEqual(returnedData);
  });

  test("find category by id from the 'categories' table", async () => {
    const result = await category.findById(1);
    expect(result).toEqual(returnedData);
  });

  test("update an existing category from the 'categories' table", async () => {
    const result = await category.update(1, updateCategory);
    expect(result).toMatchObject(updateCategory);
  });

  test("delete an existing category from the 'categories' table", async () => {
    const result = await category.delete(1);
    expect(result).toEqual(returnedData);
  });
});
