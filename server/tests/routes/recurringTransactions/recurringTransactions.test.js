import { describe, expect, it, beforeAll, beforeEach, afterAll } from "vitest";
import { generateAccessToken } from "src/utils/jwtUtils";
import db from "#db";
import app from "#app";
import supertest from "supertest";

describe("Transaction Routes", () => {
  let testUser;
  let testBudget;
  let testCategory;
  let authToken;
  let request = null;

  // hard coded category and recurring transaction data refered at global
  const categoryData = {
    name: "Utilities",
    type: "expense",
    limit: 500.0,
    color: "#0000FF",
  };

  const recurringTransactionData = {
    amount: 100.0,
    note: "test note",
    start_date: "2025-01-01",
    end_date: "2026-01-01",
    frequency: "monthly",
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

  describe("POST /api/recurring-transactions", () => {
    it("should create a new recurring transaction", async () => {
      const response = await request
        .post("/api/recurring-transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          ...recurringTransactionData,
          category_id: testCategory[0].category_id,
          budget_id: testBudget[0].budget_id,
        });

      expect(response.status).toBe(201);
      expect(response.body.recurringTransaction).toHaveProperty("recurring_id");
      expect(response.body.recurringTransaction.category_id).toBe(
        testCategory[0].category_id
      );
    });
  });
  describe("PUT /api/recurring-transactions/:recurring_id", () => {
    it("should update a recurring transaction", async () => {
      const recurringTransaction = await db("recurring_transactions")
        .insert({
          ...recurringTransactionData,
          category_id: testCategory[0].category_id,
          budget_id: testBudget[0].budget_id,
        })
        .returning("*");

      const response = await request
        .put(
          `/api/recurring-transactions/${recurringTransaction[0].recurring_id}`
        )
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          amount: 200.0,
          note: "Updated note",
          start_date: "2025-02-01",
          end_date: "2026-02-01",
          frequency: "weekly",
        });

      expect(response.status).toBe(200);
      expect(response.body.recurringTransaction.note).toBe("Updated note");
    });
  });
  describe("DELETE /api/recurring-transactions/:recurring_id", () => {
    it("should delete a recurring transaction", async () => {
      const recurringTransaction = await db("recurring_transactions")
        .insert({
          ...recurringTransactionData,
          category_id: testCategory[0].category_id,
          budget_id: testBudget[0].budget_id,
        })
        .returning("*");

      const response = await request
        .delete(
          `/api/recurring-transactions/${recurringTransaction[0].recurring_id}`
        )
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Recurring transaction deleted successfully"
      );
    });
  });
  describe("GET /api/recurring-transactions/:recurring_id", () => {
    it("should get a recurring transaction by ID", async () => {
      const recurringTransaction = await db("recurring_transactions")
        .insert({
          ...recurringTransactionData,
          category_id: testCategory[0].category_id,
          budget_id: testBudget[0].budget_id,
        })
        .returning("*");

      const response = await request
        .get(
          `/api/recurring-transactions/${recurringTransaction[0].recurring_id}`
        )
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.recurringTransaction).toHaveProperty(
        "recurring_id",
        recurringTransaction[0].recurring_id
      );
    });
  });
  describe("GET /api/recurring-transactions", () => {
    it("should get all recurring transactions for the user", async () => {
      await db("recurring_transactions").insert({
        ...recurringTransactionData,
        category_id: testCategory[0].category_id,
        budget_id: testBudget[0].budget_id,
      });

      const response = await request
        .get("/api/recurring-transactions")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.recurringTransactions.length).toBeGreaterThan(0);
    });
  });
});
