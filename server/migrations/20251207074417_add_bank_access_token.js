/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  knex.schema.alterTable("users", (table) => {
    table.string("bank_access_token");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  knex.schema.alterTable("users", (table) => {
    table.dropColumn("bank_access_token");
  });
}
