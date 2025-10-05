import { faker } from "@faker-js/faker";

export async function seed(knex) {
  // delete existing budgets in db
  await knex("budgets").del();

  // Get user IDs
  const users = await knex("users").select("user_id");

  const budgetNames = [
    "Personal Budget",
    "Vacation Fund",
    "Monthly Budget",
    "Business Expenses",
    "Emergency Fund",
    "Home Renovation",
  ];
  const budgets = [];

  users.forEach((user) => {
    const numberOfBudgets = 3;

    //  Create up to 3 budgets for each user in the database
    for (let i = 0; i < numberOfBudgets; i++) {
      // generate a previous date and toDate ranges between 90 minimum and 300 maximum days apart
      const previousDate = faker.date.between({
        from: "2024-01-01",
        to: "2024-12-31",
      });

      const toDate = faker.date.soon({
        from: faker.number.int({ min: 90, max: 300 }),
        refDate: previousDate,
      });

      budgets.push({
        user_id: user.user_id,
        name: `${faker.helpers.arrayElement(budgetNames)} ${faker.date.month()}`,
        start_date: previousDate,
        end_date: toDate,
        currency: "USD",
      });
    }
  });
  await knex("budgets").insert(budgets);
}
