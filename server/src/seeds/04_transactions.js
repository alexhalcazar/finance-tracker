import { faker } from "@faker-js/faker";

export async function seed(knex) {
  await knex("transactions").del();

  const categories = await knex("categories")
    .join("budgets", "categories.budget_id", "budgets.budget_id")
    .select(
      "categories.category_id",
      "categories.budget_id",
      "categories.type",
      "categories.limit",
      "budgets.start_date",
      "budgets.end_date"
    );

  const transactions = [];

  categories.forEach((category) => {
    const numTransactions = faker.number.int({ min: 10, max: 20 });

    for (let i = 0; i < numTransactions; i++) {
      const transactionDate = faker.date.between({
        from: category.start_date,
        to: category.end_date,
      });

      let amount;
      if (category.type === "expense") {
        const maxAmount = category.limit
          ? category.limit * 0.5
          : faker.number.float({ min: 10, max: 100 });
        amount = faker.number.float({
          min: maxAmount * 0.2,
          max: maxAmount,
          multipleOf: 0.01,
        });
      } else {
        amount = faker.number.float({
          min: 100,
          max: 500,
          multipleOf: 0.01,
        });
      }

      transactions.push({
        budget_id: category.budget_id,
        category_id: category.category_id,
        amount: amount,
        note: "random note",
        transaction_date: transactionDate,
      });
    }
  });
  await knex("transactions").insert(transactions);
}
