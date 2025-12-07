/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  knex.schema.alterTable("users", (table) => {
    table.string("encrypted_token");
    table.string("initialization_vector");
    table.string("tag");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  knex.schema.alterTable("users", (table) => {
    table.dropColumn("bank_access_token");
    table.dropColumn("initialization_vector");
    table.dropColumn("tag");
  });
}
