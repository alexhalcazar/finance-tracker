import { describe, expect, it, beforeAll, beforeEach, afterAll } from "vitest";
import { generateAccessToken } from "src/utils/jwtUtils";
import budget from "#models/budgetModel.js";
import db from "#db";
import app from "#app";
import supertest from "supertest";

describe("test REST Service", async () => {
  let request = null;

  beforeAll(() => {
    console.log("before all tests: start server");
    request = supertest.agent(app);
  });

  afterAll(async () => {
    console.log("after all tests: close server");
  });

  it("Gets the types endpoint", async () => {
    const res = await request.get("/api/ping");
    expect(res.status).toBe(200);
  });
});

describe("Budget Routes", () => {
  let testUser;
  let authToken;
  let request = null;
  const budgetData = {
    name: "Monthly Groceries",
    start_date: "2025-11-01",
    end_date: "2025-11-30",
    currency: "USD",
  };

  beforeAll(async () => {
    await db.seed.run();

    testUser = await db("users").first();

    console.log("before all tests: start server");
    request = supertest.agent(app);

    // Generate auth token
    authToken = generateAccessToken({
      user_id: testUser.user_id,
      email: testUser.email,
      username: testUser.username,
    });
  });

  beforeEach(async () => {
    const userBudgets = await budget.findAll(testUser.user_id);
    for (const userBudget of userBudgets) {
      await budget.delete(userBudget.budget_id);
    }
  });

  describe("POST /budgets", () => {
    it("should create a new budget for authenticated user", async () => {
      const response = await request
        .post("/api/budgets")
        .set("Authorization", `Bearer ${authToken}`)
        .send(budgetData);

      expect(response.status).toBe(201);

      // Verify in database
      const createdBudget = await budget.findByName(
        testUser.user_id,
        budgetData.name
      );
      expect(createdBudget).toBeDefined();
      expect(createdBudget.name).toBe(budgetData.name);
    });

    it("should reject budget creation with invalid token", async () => {
      const response = await request
        .post("/api/budgets")
        .set("Authorization", "Bearer this_is_not_a_valid_jwt_token")
        .send(budgetData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");

      const createdBudget = await budget.findByName(
        testUser.user_id,
        budgetData.name
      );
      expect(createdBudget).toBeUndefined();
    });
  });

  describe("GET /budgets", () => {
    it("should retrieve all budgets for authenticated user", async () => {
      await budget.insert({
        ...budgetData,
        user_id: testUser.user_id,
      });

      const response = await request
        .get("/api/budgets")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("budgets");
      expect(response.body.budgets.length).toBeGreaterThan(0);
    });
  });
  describe("GET /budgets/:budget_id", () => {
    it("should retrieve a specific budget for authenticated user", async () => {
      const createdBudget = await budget.insert({
        ...budgetData,
        user_id: testUser.user_id,
      });

      const response = await request
        .get(`/api/budgets/${createdBudget.budget_id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("budget");
      expect(response.body.budget.budget_id).toBe(createdBudget.budget_id);
    });
  });
});
