/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  try {
    await knex.schema.alterTable("users", (table) => {
      table.string("encrypted_token");
      table.string("initialization_vector");
      table.string("tag");
    });
  } catch (err) {
    console.error("Error altering users table for encryption:", err);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  try {
    await knex.schema.alterTable("users", (table) => {
      table.dropColumn("encrypted_token");
      table.dropColumn("initialization_vector");
      table.dropColumn("tag");
    });
  } catch (err) {
    console.error("Error dropping encryption related columns:", err);
  }
};
