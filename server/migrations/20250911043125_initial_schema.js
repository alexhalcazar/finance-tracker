export const up = async (knex) => {
  try {
    const hasUsers = await knex.schema.hasTable("users");
    if (!hasUsers) {
      await knex.schema.createTable("users", (table) => {
        table.increments("user_id").primary();
        table.string("username").notNullable().unique();
        table.string("email").notNullable().unique();
        table.text("password_hash");
        table.timestamps(true, true); // created_at, updated_at
      });
    }

    const hasBudgets = await knex.schema.hasTable("budgets");

    if (!hasBudgets) {
      await knex.schema.createTable("budgets", (table) => {
        table.increments("budget_id").primary();
        table
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("user_id")
          .inTable("users")
          .onDelete("CASCADE");
        table.string("name", 100).notNullable();
        table.date("start_date").notNullable();
        table.date("end_date").notNullable();
        table.string("currency", 3).defaultTo("USD");
        table.timestamps(true, true);
      });
    }

    const hasCategories = await knex.schema.hasTable("categories");
    if (!hasCategories) {
      await knex.schema.createTable("categories", (table) => {
        table.increments("category_id").primary();
        table
          .integer("budget_id")
          .unsigned()
          .notNullable()
          .references("budget_id")
          .inTable("budgets")
          .onDelete("CASCADE");
        table.string("name", 100).notNullable();
        table.string("type", 10).notNullable(); // income | expense
        table.decimal("limit", 12, 2);
        table.string("color", 7);
        table.timestamps(true, true);
      });
    }

    const hasTransactions = await knex.schema.hasTable("transactions");
    if (!hasTransactions) {
      await knex.schema.createTable("transactions", (table) => {
        table.increments("transaction_id").primary();
        table
          .integer("budget_id")
          .unsigned()
          .notNullable()
          .references("budget_id")
          .inTable("budgets")
          .onDelete("CASCADE");
        table
          .integer("category_id")
          .unsigned()
          .references("category_id")
          .inTable("categories")
          .onDelete("SET NULL");
        table.decimal("amount", 12, 2).notNullable();
        table.text("note");
        table.date("transaction_date").notNullable();
        table.timestamps(true, true);
      });
    }

    const hasRecurringTransactions = await knex.schema.hasTable(
      "recurring_transactions"
    );
    if (!hasRecurringTransactions) {
      await knex.schema.createTable("recurring_transactions", (table) => {
        table.increments("recurring_id").primary();
        table
          .integer("budget_id")
          .unsigned()
          .notNullable()
          .references("budget_id")
          .inTable("budgets")
          .onDelete("CASCADE");
        table
          .integer("category_id")
          .unsigned()
          .references("category_id")
          .inTable("categories")
          .onDelete("SET NULL");
        table.decimal("amount", 12, 2).notNullable();
        table.string("frequency", 20).notNullable();
        table.date("start_date").notNullable();
        table.date("end_date");
        table.text("note");
        table.timestamps(true, true);
      });
    }
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

export const down = async (knex) => {
  try {
    await knex.schema.dropTableIfExists("recurring_transactions");
    await knex.schema.dropTableIfExists("transactions");
    await knex.schema.dropTableIfExists("categories");
    await knex.schema.dropTableIfExists("budgets");
    await knex.schema.dropTableIfExists("users");
  } catch (error) {
    console.error("Error dropping tables:", error);
    throw error;
  }
};
