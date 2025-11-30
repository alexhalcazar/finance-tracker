import { describe, expect, it, beforeAll, beforeEach, afterAll } from "vitest";
import { generateAccessToken } from "src/utils/jwtUtils";
import db from "#db";
import app from "#app";
import supertest from "supertest";

describe("Categories Routes", () => {
  let testUser;
  let testBudget;
  let testCategory;
  let authToken;
  let request = null;

  const categoryData = {
    name: "Utilities",
    type: "expense",
    limit: 500.0,
    color: "#0000FF",
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
  });

  beforeEach(async () => {
    await db("categories").del();
  });

  afterAll(async () => {
    await db("categories").del();
    await db("budgets").del();
    await db("users").del();
    await db.destroy();
  });

  describe("POST /api/categories/budget/:budget_id", () => {
    it("should create a new category successfully", async () => {
      const response = await request
        .post(`/api/categories/budget/${testBudget[0].budget_id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...categoryData, budget_id: testBudget[0].budget_id });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Categories created successfully");
      expect(response.body.createNewCategory).toBeDefined();
    });
  });

  describe("PUT /api/categories/:category_id", () => {
    it("should update an existing category", async () => {
      testCategory = await db("categories")
        .insert({
          ...categoryData,
          budget_id: testBudget[0].budget_id,
        })
        .returning("*");

      const response = await request
        .put(`/api/categories/${testCategory[0].category_id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Updated Utilities",
          type: "expense",
          limit: 600.0,
          color: "#FF0000",
          budget_id: testBudget[0].budget_id,
        });
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Category update succesful");
      expect(response.body.updatedCategory).toBeDefined();
    });
  });

  describe("DELETE /api/categories/:category_id", () => {
    it("should delete an existing category", async () => {
      testCategory = await db("categories")
        .insert({
          ...categoryData,
          budget_id: testBudget[0].budget_id,
        })
        .returning("*");

      const response = await request
        .delete(`/api/categories/${testCategory[0].category_id}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.body.message).toBe("Successfully deleted category");
    });
  });

  describe("GET /api/categories/budget/:budget_id", () => {
    it("should get all categories for a budget", async () => {
      await db("categories").insert({
        ...categoryData,
        budget_id: testBudget[0].budget_id,
      });

      const response = await request
        .get(`/api/categories/budget/${testBudget[0].budget_id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.message).toBe("Categories retrieved successfully");
      expect(response.body.categories).toBeDefined();
    });
  });

  describe("GET /api/categories/:category_id", () => {
    it("should get category by given category id", async () => {
      testCategory = await db("categories")
        .insert({
          ...categoryData,
          budget_id: testBudget[0].budget_id,
        })
        .returning("*");

      const response = await request
        .get(`/api/categories/${testCategory[0].category_id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.body.message).toBe("Category retrieved successfully");
    });
  });
});
