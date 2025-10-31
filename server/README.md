## Server Project Directory Overview

```text
server/
├── .env.example
├── .eslintrc.json
├── .gitignore
├── app.js
├── jsconfig.json
├── knexfile.js
├── migrations/
│   └── 20250911043125_initial_schema.js
├── package-lock.json
├── package.json
├── README.md
├── server/
├── src/
│   ├── config/
│   │   └── plaid.js
│   ├── controllers/
│   │   ├── bankController.js
│   │   └── plaidController.js
│   ├── db/
│   │   └── db.js
│   ├── middleware/
│   │   └── jwt.js
│   ├── models/
│   │   ├── budgetModel.js
│   │   ├── categoryModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── bank.js
│   │   ├── dummy.js
│   │   └── plaid.js
│   ├── seeds/
│   │   ├── 01_users.js
│   │   ├── 02_budgets.js
│   │   └── 03_categories.js
│   ├── services/
│   │   └── plaidService.js
│   └── utils/
│       └── hash.js
├── tests/
│   ├── db/
│   │   └── userModel.test.js
│   └── models/
│       └── categoryModel.test.js
└── vite.config.js
```

## Module Path Aliases

To simplify imports and avoid long relative paths, this project uses **module path aliases**.

### Example Usage

```js
// instead of a long relative path
import user from "../../models/user.js";

// Use the alias
import user from "#models/user";
```

### Setting up Aliases

To implement module path aliases, add paths in the `package.json` file under imports. Aliases must start with #:

```js
"imports": {
        "#db/*.js": "./src/db/*.js",
        "#models/*.js": "./src/models/*.js",
        "#config": "./knexfile.js",
        "#yourAliasHere": "./actual/path/file",
    },
```

### Editor Support (Optional)

To provide editor support (autocomplete, go-to-definition, and error checking in VS Code) you can mirror these aliases in a `jsconfig.json` file.

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#db/*": ["src/db/*"],
      "#models/*": ["src/models/*"],
      "#config": ["knexfile.js"]
      "#yourAliasHere": ["./actual/path/file"]
    }
  }
}
```

## Plaid Installation

This application interacts with Plaid's API to allow users to securely connect their banks. Plaid's API requires authentication credentials to be stored securely in environment variables.

To run this project each developer needs their own Plaid developer account and API credentials.

### 1. Create a Plaid Developer Account

-Go to https://dashboard.plaid.com/signup
-Sign up for a free developer account.
-Once logged in, navigate to the Keys section in the Plaid dashboard.
-You’ll find your Client ID and Sandbox Secret there.
-The Sandbox environment provides fake institutions and test data — it’s safe for local testing.

### 2. Set up Environment Variables

Create a .env file at the root directory and add the following variables:

```
bash

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=
```

### 3. Run the Project

Once your .env is set up, install dependencies and start the developement server

```
bash

npm install
npm run dev
```

## How This App Uses Plaid

This application integrates with Plaid to allow users to securely connect their bank accounts and view transactions. To simplify the development process, we use:

### 1. Plaid Node Library

Handles server-side API calls like:
-Creating link tokens
-Exchanging public tokens for access tokens
-Fetching transactions and account data
Simplifies raw HTTP requests by providing a structured, promise-based interface.
Keeps sensitive keys (client_id and secret) safely on the backend.

reference: https://github.com/plaid/plaid-node

### 2. React-Plaid-Link

Handles client-side authentication in React.
Provides a ready-made UI component for the Plaid Link flow (popup modal for bank login).
Works seamlessly with the backend to receive link tokens and exchange them for user access tokens.
Makes it easy to integrate Plaid into a React dashboard or other UI components.

reference: https://www.npmjs.com/package/react-plaid-link/v/2.1.2

### Flow Summary

1. Frontend requests a link token from your backend.
2. React-Plaid-Link uses this token to open the bank connection popup.
3. User completes login → Plaid returns a public token.
4. Backend exchanges the public token for an access token (stored securely).
5. Access token is used for further API calls like fetching transactions.

To learn more: https://plaid.com/docs/quickstart/

## Financial Models

### How to Use Financial Models

All the financial models follow a similar pattern which details a similar pattern here:
https://itnext.io/crafting-database-models-with-knex-js-and-postgresql-b3a74e789794

All the models have their properties and types listed inside each model of what each parameter represents as well as what each returns. You may use these models when fleshing out API endpoints and or any other additional backend logic you need.

#### Budget Model Examples

findAll looks like this for the budget model and similar other models.

```javascript
// Get all budgets for user
const userBudgets = await budget.findAll(123);

// Get limited results
const limitedBudgets = await budget.findAll(123, 5);
```

findByName takes in a user_id and a name then returns one budget associated with it.

```javascript
const personalBudget = await budget.findByName(123, "Personal Budget");
```

findById takes in the budget id (for each model it will be the main primary key) and returns one budget record.

```javascript
const budgetDetails = await budget.findById(123);
```

insert will take in the object that the model expects and inserts a new record into the database, for example below is the a new budget being inserted.

```javascript
const newBudget = await budget.insert({
  user_id: 245,
  name: "Vacation Fund",
  start_date: new Date("2025-01-01"),
  end_date: new Date("2025-12-31"),
  currency: "USD",
});
```

update will update the object with whichever properties and values you pass in as an object, alongside the main primary id you want to update for.

```javascript
const updatedBudget = await budget.update(123, {
  name: "Updated Vacation Fund",
  end_date: new Date("2026-12-31"),
});
```

delete will delete the object with the passed in primary id of that model.

```javascript
const deletedBudget = await budget.delete(123);
```
