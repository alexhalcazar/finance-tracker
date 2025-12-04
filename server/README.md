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

## Testing API Endpoints

### Testing API Endpoints Resources

Here are some pre-requisite examples that will assist in how the api endpoints are being tested within this project directory.
[A Simple Guide to Setting Up HTTP-Level Tests with Vitest, MongoDB and Supertest](https://medium.com/@burzhuas/a-simple-guide-to-setting-up-http-level-tests-with-vitest-mongodb-and-supertest-1c5c90d22321)

[Repository Example of Vitest and SuperTest Testing API Endpoints](https://github.com/thomaspsik/server-templ-vitest)

### App.js Refactor

```javascript
if (["development", "production"].includes(process.env.ENVIRONMENT)) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} else {
  console.log("Server not started (test mode).");
}

export default app;
```

The above snippet will only run the actual API if the .env file contains a key to value pair of the environment to either value of development or production something like below.

```env
ENVIRONMENT="development"
```

To run succesful tests, essentially testing the API endpoints without starting the actual server, you must leave the ENVIRONMENT value as empty in order to enter test mode. After you have ran your API endpoint tests with vitest and supertest then you can place in the value of either development or production back to the ENVIRONMENT key found in your .env file.

### Running API Endpoint Tests

To run the API endpoint testing navigate to the test file you will like to test then run the exact same way as you have been running vitest tests such as below.

```bash
npm run tests
```

or

````bash
yar tests
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
````

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

## Transaction Endpoint

### How to Use Transaction Endpoints

The transaction endpoints are used to create, read, update, and delete transactions. They are used to manage the transactions of a user.

#### Create Transaction

**POST** `/api/transactions`
To create a transaction, you need to send a POST request to the `/api/transactions` endpoint with the following body:

**Request Body:**

```json
// transaction data sent in request body
{
  "budget_id": 1,
  "category_id": 2,
  "amount": 100.5,
  "note": "Grocery shopping",
  "transaction_date": "2025-12-02"
}
```

**Required Fields:**

- `budget_id` (number) - ID of the budget this transaction belongs to
- `category_id` (number) - ID of the category for this transaction
- `amount` (number) - Transaction amount
- `transaction_date` (string) - Date of transaction in YYYY-MM-DD format
  **Optional Fields:**
- `note` (string) - Additional details about the transaction

#### Get Transaction By ID

**GET** `/api/transactions/:transaction_id`

To get a transaction, you need to send a GET request to the `/api/transactions/:budget_id` endpoint where it will get all

**URL Parameters:**

- `transaction_id` (required) - The ID of the transaction to retrieve
  **Success Response:**

```json
{
  "message": "Transaction retrieved successfully",
  "transactionData": {
    "transaction_id": 123,
    "budget_id": 1,
    "category_id": 2,
    "amount": "100.50",
    "note": "Grocery shopping",
    "transaction_date": "2025-12-02",
    "created_at": "2025-12-02T10:30:00.000Z",
    "updated_at": "2025-12-02T10:30:00.000Z"
  }
}
```

#### Update Transaction

**PUT** `/api/transactions/:transaction_id`

Updates to an existing transaction.

**URL Parameters:**

- `transaction_id` (required) - The ID of the transaction to update

**Request Body:**

```json
{
  "budget_id": 1,
  "category_id": 3,
  "amount": 150.75,
  "note": "Updated grocery shopping",
  "transaction_date": "2025-12-03"
}
```

**Note:** All fields are optional, only include fields you want to update.

#### Delete Transaction

**DELETE** `/api/transactions/:transaction_id`

Deletes a specific transaction by the passed in transaction_id in the URL parameters.

**URL Parameters:**

- `transaction_id` (required) - The ID of the transaction to delete

**Success Response (200):**

```json
{
  "message": "Deleted transaction successfully",
  "deletedTransaction": {
    "transaction_id": 123,
    "budget_id": 1,
    "category_id": 2,
    "amount": "100.50",
    "note": "Grocery shopping",
    "transaction_date": "2025-12-02"
  }
}
```

## Recurring Transaction Endpoints

### Overview

The recurring transaction endpoints allow users to create and manage recurring transactions that repeat at specified intervals (e.g., monthly rent, weekly subscriptions). All endpoints require authentication via JWT token.

**Base URL:** `/api/recurring-transactions`

**Authentication:** All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Create Recurring Transaction

**POST** `/api/recurring-transactions`

Creates a new recurring transaction for the authenticated user. Recurring transactions are useful for expenses or income that repeat on a regular schedule.

**Request Body:**

```json
{
  "budget_id": 1,
  "category_id": 2,
  "amount": 1200.0,
  "note": "Monthly rent payment",
  "frequency": "monthly",
  "start_date": "2025-01-01",
  "end_date": "2026-01-01"
}
```

**Required Fields:**

- `budget_id` (number) - ID of the budget this recurring transaction belongs to
- `category_id` (number) - ID of the category for this recurring transaction
- `amount` (number) - Transaction amount
- `frequency` (string) - How often the transaction repeats (e.g., "daily", "weekly", "monthly", "yearly")
- `start_date` (string) - Start date of the recurring pattern in YYYY-MM-DD format
- `end_date` (string) - End date of the recurring pattern in YYYY-MM-DD format

**Optional Fields:**

- `note` (string) - Additional details about the recurring transaction

**Supported Frequency Values:**

- `daily` - Repeats every day
- `weekly` - Repeats every week
- `biweekly` - Repeats every two weeks
- `monthly` - Repeats every month
- `quarterly` - Repeats every three months
- `yearly` - Repeats every year

#### Update Recurring Transaction

**PUT** `/api/recurring-transactions/{recurring_id}`

Updates an existing recurring transaction.

**Request Body:**

```json
{
  "budget_id": 1,
  "category_id": 2,
  "amount": 1250.0,
  "note": "Updated note",
  "frequency": "monthly",
  "start_date": "2025-01-01",
  "end_date": "2026-01-01"
}
```

**Required Fields in Body Request:**

- `budget_id` (number) - ID of the budget this recurring transaction belongs to
- `category_id` (number) - ID of the category for this recurring transaction
- `amount` (number) - Transaction amount
- `frequency` (string) - How often the transaction repeats
- `start_date` (string) - Start date of the recurring pattern in YYYY-MM-DD format
- `end_date` (string) - End date of the recurring pattern in YYYY-MM-DD format

**Optional Fields in Body Request:**

- `note` (string) - Additional details about the recurring transaction

**Required Parameters**

- `recurring_id` (number) - ID of the recurring transaction to update

#### Get All Recurring Transactions for User

**GET** `/api/recurring-transactions`

Retrieves all recurring transactions associated with the authenticated user's budgets as an array of recurring transactions.

#### Get Specific Recurring Transaction by ID

**GET** `/api/recurring-transactions/:recurring_id`

Retrieves a specific recurring transaction by its ID.

**URL Parameters:**

- `recurring_id` (required) - The ID of the recurring transaction to retrieve

#### GET Rcurring Trasnaction Notes

- Both endpoints require authentication via JWT token
- The "get all" endpoint automatically filters recurring transactions by the authenticated user's budgets
- The response includes all recurring transaction details including frequency, date ranges, and associated budget/category IDs
- Empty results return a 404 status code with an appropriate error message

## Budget API Endpoints

### GET /api/budgets

Retrieves all budgets for authenticated user.

**Authentication Required**: Yes (Bearer token)

**Query Parameters** (optional):

- `limit` (number) - Limits the number of budgets returned

**Request Headers**:

```
Authorization: Bearer <access_token>
```

**Examples**:

```bash
# Get all budgets
curl -i http://localhost:8080/api/budgets \
  -H "Authorization: Bearer <your_access_token>"

# Get budgets with limit
curl -i http://localhost:8080/api/budgets?limit=5 \
  -H "Authorization: Bearer <your_access_token>"
```

### GET /api/budgets/:budget_id

Retrieves a specific budget by budget ID for the authenticated user.

**Authentication Required**: Yes (Bearer token)

**URL Parameters**:

- `budget_id` (required) - The ID of the budget to retrieve

**Example**:

```bash
curl -i http://localhost:8080/api/budgets/1 \
  -H "Authorization: Bearer <your_access_token>"
```

### PUT /api/budgets/:budget_id

Updates an existing budget for the authenticated user.

**Authentication Required**: Yes (Bearer token)

**URL Parameters**:

- `budget_id` (required) - The ID of the budget to update

**Request Body** (all optional):

```json
{
  "name": "Updated Budget Name",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "currency": "USD"
}
```

**Example**:

```bash
curl -i -X PUT http://localhost:8080/api/budgets/1 \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Vacation Fund",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "currency": "EUR"
  }'
```

### DELETE /api/budgets/:budget_id

Deletes a specific budget for the authenticated user.

**Authentication Required**: Yes (Bearer token)

**URL Parameters**:

- `budget_id` (required) - The ID of the budget to delete

**Request Headers**:

```
Authorization: Bearer <access_token>
```

**Example**:

```bash
curl -i -X DELETE http://localhost:8080/api/budgets/1 \
  -H "Authorization: Bearer <your_access_token>"
```

### POST /api/budgets

Creates a new budget for the user.

**Request Headers**:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body** (required):

```json
{
  "name": "Monthly Groceries",
  "start_date": "2025-11-01",
  "end_date": "2025-11-30",
  "currency": "USD"
}
```

**Field Requirement in Request Body**:

- `name` (string, required) - Name of the budget
- `start_date` (string, required) - Start date in YYYY-MM-DD format
- `end_date` (string, required) - End date in YYYY-MM-DD format
- `currency` (string, optional) - Currency code (e.g., USD, EUR)

**Example**:

```bash
curl -i -X POST http://localhost:8080/api/budgets \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Groceries",
    "start_date": "2025-11-01",
    "end_date": "2025-11-30",
    "currency": "USD"
  }'
```
