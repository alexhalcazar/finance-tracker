import { faker } from "@faker-js/faker";

export async function seed(knex) {
  // Delete existing categories
  await knex("categories").del();

  // Get all budgets
  const budgets = await knex("budgets").select("budget_id");

  // Define category templates
  const expenseTemplates = [
    { name: "Rent", limit: { min: 800, max: 2500 } },
    { name: "Groceries", limit: { min: 300, max: 800 } },
    { name: "Transportation", limit: { min: 100, max: 400 } },
    { name: "Utilities", limit: { min: 80, max: 250 } },
    { name: "Entertainment", limit: { min: 50, max: 300 } },
    { name: "Dining Out", limit: { min: 100, max: 400 } },
    { name: "Healthcare", limit: { min: 50, max: 300 } },
    { name: "Shopping", limit: { min: 100, max: 500 } },
    { name: "Insurance", limit: { min: 100, max: 400 } },
    { name: "Subscriptions", limit: { min: 20, max: 150 } },
  ];

  const incomeTemplates = [
    "Salary",
    "Freelance",
    "Investment Returns",
    "Side Hustle",
    "Bonus",
  ];

  const categories = [];

  budgets.forEach((budget) => {
    // Add 5-8 expense categories per budget
    const numExpenses = faker.number.int({ min: 5, max: 8 });
    const selectedExpenses = faker.helpers.arrayElements(
      expenseTemplates,
      numExpenses
    );

    selectedExpenses.forEach((template) => {
      categories.push({
        budget_id: budget.budget_id,
        name: template.name,
        type: "expense",
        limit: faker.number.float({
          min: template.limit.min,
          max: template.limit.max,
          multipleOf: 0.01,
        }),
        color: faker.color.rgb({ format: "hex" }),
      });
    });

    // Add 2-3 income categories per budget
    const numIncome = faker.number.int({ min: 2, max: 3 });
    const selectedIncome = faker.helpers.arrayElements(
      incomeTemplates,
      numIncome
    );

    selectedIncome.forEach((name) => {
      categories.push({
        budget_id: budget.budget_id,
        name: name,
        type: "income",
        limit: null,
        color: faker.color.rgb({ format: "hex" }),
      });
    });
  });

  await knex("categories").insert(categories);
}
