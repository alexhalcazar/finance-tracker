import { faker } from "@faker-js/faker";

export async function seed(knex) {
  // Clear existing data
  await knex("categories").del();
  await knex("transactions").del();
  await knex("recurring_transactions").del();
  await knex("budgets").del();
  await knex("users").del();

  const users = [...Array(5).keys()].map((key) => ({
    username: faker.internet.username(),
    email: faker.internet.email().toLowerCase(),
  }));

  // pass in test hardcoded test password hash for development purposes
  await knex("users").insert(
    users.map((user) => ({ ...user, password_hash: "test_password" }))
  );
}
