/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable("budgets", (table) => {
    table.string("currency", 10).defaultTo("USD").alter();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("budgets", (table) => {
    table.string("currency", 3).defaultTo("USD").alter();
  });
}
