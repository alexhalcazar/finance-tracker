export const up = async (knex) => {
    try {
        await knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('username').notNullable().unique();
            table.string('email').notNullable().unique();
            table.timestamps(true, true);
        });
    } catch (error) {
        console.error('Failed to create users table:', error);
        throw error;
    }
};

export const down = async (knex) => {
    try {
        await knex.schema.dropTableIfExists('users');
    } catch (error) {
        console.error('Faoled to drop users table:', error);
        throw error;
    }
};
