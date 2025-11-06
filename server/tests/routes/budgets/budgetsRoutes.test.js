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
      const budgetData = {
        name: "Monthly Groceries",
        start_date: "2025-11-01",
        end_date: "2025-11-30",
        currency: "USD",
      };

      const response = await request
        .post("/api/budgets")
        .set("Authorization", `Bearer ${authToken}`)
        .send(budgetData);

      console.log("Response: ", response, "\n");
      console.log("Response status:", response.status);
      console.log("Response body:", response.body);

      // Verify in database
      const createdBudget = await budget.findByName(
        testUser.user_id,
        budgetData.name
      );
      expect(createdBudget).toBeDefined();
      expect(createdBudget.name).toBe(budgetData.name);
    });
  });
});
