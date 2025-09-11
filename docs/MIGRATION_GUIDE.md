## Install Dependencies

Install the required Node.js packages (including `knex`, `pg`, and `dotenv`):

```bash
npm install
```

(Optional) Install Knex CLI globally:

```bash
npm install -g knex
```

## Run Migrations

To apply all pending database migrations using Knex:

```bash
npx knex migrate:latest
```
> This will run the migration files in the `migrations/`folder and update the PostreSQL schema accordingly.