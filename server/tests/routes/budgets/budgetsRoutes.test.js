import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import db from "#db";
import budget from "#models/budgetModel";
import { generateAccessToken } from "src/utils/jwtUtils";
import fetch from "node-fetch";

const BEFORE_ALL_TIMEOUT = 30000; // 30 explicity wait time seconds to alleviate race conditions

describe("Budget Routes", () => {
  let testUser;
  let authToken;
  let server;
  const baseURL = "http://localhost";
  const portNumber = 8080;

  beforeAll(async () => {
    // Run migrations and seeds
    await db.migrate.latest();
    await db.seed.run();

    // Get test user
    testUser = await db("users").first();

    // Generate auth token
    authToken = generateAccessToken({
      user_id: testUser.user_id,
      email: testUser.email,
      username: testUser.username,
    });

    // Start the server
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseURL = `http://localhost:${port}`;
        console.log(`Test server started on ${baseURL}`);
        resolve();
      });
    });
  }, BEFORE_ALL_TIMEOUT);
  afterAll(async () => {
    // Close server if it was created
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await db.destroy();
  });

  afterAll(async () => {
    // Close server if it was created
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await db.destroy();
  });

  beforeEach(async () => {
    const userBudgets = await budget.findAll(testUser.user_id);

    for (const userBudget of userBudgets) {
      await budget.delete(userBudget.budget_id);
    }
  });

  describe("POST /api/bdugets", () => {
    let response;
    let body;

    beforeAll(async () => {
      const budgetData = {
        name: "Monthly Groceries",
        amount: 520.15,
        category: "Food",
        period: "monthly",
        start_date: "2025-11-01",
        end_date: "2025-11-30",
        currency: "USD",
      };

      response = await fetch(`${baseURL}:${portNumber}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(budgetData),
      });

      body = await response.json();
    }, BEFORE_ALL_TIMEOUT);

    it("should return status 201", () => {
      expect(response.status).toBe(201);
    });
  });
});
