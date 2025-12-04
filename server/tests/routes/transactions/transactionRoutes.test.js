import { describe, expect, it, beforeAll, beforeEach, afterAll } from "vitest";
import { generateAccessToken } from "src/utils/jwtUtils";
import db from "#db";
import app from "#app";
import supertest from "supertest";
import category from "#models/categoryModel";
import budget from "#models/budgetModel";

describe("Transaction Routes", () => {
  let testUser;
  let testBudget;
  let testCategory;
  let authToken;
  let request = null;

  // hard coded category and transaction data refered at global
  const categoryData = {
    name: "Utilities",
    type: "expense",
    limit: 500.0,
    color: "#0000FF",
  };

  const transactionData = {
    amount: 100.0,
    transaction_date: "2025-01-01",
    note: "Test Transaction",
  };

  beforeAll(async () => {
    await db.seed.run();

    testUser = await db("users").first();
    request = supertest.agent(app);

    // Generate auth token
    authToken = generateAccessToken({
      user_id: testUser.user_id,
      email: testUser.email,
      username: testUser.username,
    });

    testBudget = await db("budgets")
      .insert({
        user_id: testUser.user_id,
        name: "Test Budget",
        start_date: "2025-01-01",
        end_date: "2025-12-31",
        currency: "USD",
      })
      .returning("*");

    testCategory = await db("categories")
      .insert({
        ...categoryData,
        budget_id: testBudget[0].budget_id,
      })
      .returning("*");
  });

  beforeEach(async () => {
    await db("transactions").del();
  });

  afterAll(async () => {
    await db("categories").del();
    await db("budgets").del();
    await db("users").del();
    await db.destroy();
  });

  describe("POST /api/transactions", () => {
    it("Should create a new transaction", async () => {
      const response = await request
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          ...transactionData,
          budget_id: testBudget[0].budget_id,
          category_id: testCategory[0].category_id,
        });
      expect(response.body.message).toBe("Transaction created successfully");
    });
  });

  describe("GET /api/transactions/:transaction_id", () => {
    it("Should get a specific transaction", async () => {
      const transaction = await db("transactions")
        .insert({
          ...transactionData,
          budget_id: testBudget[0].budget_id,
          category_id: testCategory[0].category_id,
        })
        .returning("*");

      const response = await request
        .get(`/api/transactions/${transaction[0].transaction_id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.transactionData).toBeDefined();
    });
  });

  describe("DELETE /api/transactions/:transaction_id", () => {
    it("Should delete a specific transaction", async () => {
      const transaction = await db("transactions")
        .insert({
          ...transactionData,
          budget_id: testBudget[0].budget_id,
          category_id: testCategory[0].category_id,
        })
        .returning("*");

      const response = await request
        .delete(`/api/transactions/${transaction[0].transaction_id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.message).toBe("Deleted transaction successfully");
    });
  });

  describe("UPDATE /api/transactions/:transaction_id", () => {
    it("Should update a specific transaction", async () => {
      const transaction = await db("transactions")
        .insert({
          ...transactionData,
          budget_id: testBudget[0].budget_id,
          category_id: testCategory[0].category_id,
        })
        .returning("*");

      const response = await request
        .put(`/api/transactions/${transaction[0].transaction_id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          ...transactionData,
          budget_id: testBudget[0].budget_id,
          category_id: testCategory[0].category_id,
          amount: 1000,
        });

      expect(response.body.message).toBe("Updated transaction successfully");
    });
  });
});
