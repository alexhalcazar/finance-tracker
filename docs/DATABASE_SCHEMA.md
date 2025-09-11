# Database Schema for Finance Tracker

## Overview

This document describes the database schema for the Finance Tracker application, which allows users to manage multiple budgets with customizable categories, transactions, and recurring transactions.

---

## Tables

### 1. users

| Column        | Type             | Constraints                 | Description                      |
|---------------|------------------|-----------------------------|---------------------------------|
| user_id       | SERIAL           | PRIMARY KEY                 | Unique identifier for a user    |
| username      | VARCHAR          | NOT NULL, UNIQUE            | User's username                 |
| email         | VARCHAR          | NOT NULL, UNIQUE            | User's email address            |
| password_hash | TEXT             |                             | Hashed password                 |
| created_at    | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP   | Record creation timestamp       |
| updated_at    | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP   | Record update timestamp         |

---

### 2. budgets

| Column      | Type             | Constraints                                               | Description                      |
|-------------|------------------|-----------------------------------------------------------|---------------------------------|
| budget_id   | SERIAL           | PRIMARY KEY                                               | Unique identifier for a budget  |
| user_id     | INTEGER          | NOT NULL, REFERENCES users(user_id) ON DELETE CASCADE    | Owner of the budget             |
| name        | VARCHAR(100)     | NOT NULL                                                  | Name of the budget             |
| start_date  | DATE             | NOT NULL                                                  | Budget start date              |
| end_date    | DATE             | NOT NULL                                                  | Budget end date                |
| currency    | VARCHAR(3)       | DEFAULT 'USD'                                             | Currency code (ISO 4217 format)|
| created_at  | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record creation timestamp       |
| updated_at  | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record update timestamp         |

---

### 3. categories

| Column      | Type             | Constraints                                               | Description                      |
|-------------|------------------|-----------------------------------------------------------|---------------------------------|
| category_id | SERIAL           | PRIMARY KEY                                               | Unique identifier for a category|
| budget_id   | INTEGER          | NOT NULL, REFERENCES budgets(budget_id) ON DELETE CASCADE| Budget this category belongs to |
| name        | VARCHAR(100)     | NOT NULL                                                  | Category name                  |
| type        | VARCHAR(10)      | NOT NULL                                                  | Category type (`income` or `expense`) |
| limit       | DECIMAL(12, 2)   |                                                           | Optional spending/income limit |
| color       | VARCHAR(7)       |                                                           | Optional color hex code (e.g., `#FF0000`) |
| created_at  | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record creation timestamp       |
| updated_at  | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record update timestamp         |

---

### 4. transactions

| Column          | Type             | Constraints                                               | Description                      |
|-----------------|------------------|-----------------------------------------------------------|---------------------------------|
| transaction_id  | SERIAL           | PRIMARY KEY                                               | Unique identifier for transaction |
| budget_id       | INTEGER          | NOT NULL, REFERENCES budgets(budget_id) ON DELETE CASCADE| Budget associated with transaction |
| category_id     | INTEGER          | REFERENCES categories(category_id) ON DELETE SET NULL    | Category associated (nullable)   |
| amount          | DECIMAL(12, 2)   | NOT NULL                                                  | Transaction amount               |
| note            | TEXT             |                                                           | Optional note                   |
| transaction_date| DATE             | NOT NULL                                                  | Date of transaction             |
| created_at      | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record creation timestamp       |
| updated_at      | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record update timestamp         |

---

### 5. recurring_transactions

| Column          | Type             | Constraints                                               | Description                      |
|-----------------|------------------|-----------------------------------------------------------|---------------------------------|
| recurring_id    | SERIAL           | PRIMARY KEY                                               | Unique identifier for recurring transaction |
| budget_id       | INTEGER          | NOT NULL, REFERENCES budgets(budget_id) ON DELETE CASCADE| Budget associated with recurring transaction |
| category_id     | INTEGER          | REFERENCES categories(category_id) ON DELETE SET NULL    | Category associated (nullable)   |
| amount          | DECIMAL(12, 2)   | NOT NULL                                                  | Recurring transaction amount    |
| frequency      | VARCHAR(20)      | NOT NULL                                                  | Frequency (e.g., weekly, monthly)|
| start_date     | DATE             | NOT NULL                                                  | When recurring transactions start |
| end_date       | DATE             |                                                           | Optional end date for recurrence |
| note           | TEXT             |                                                           | Optional note                   |
| created_at     | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record creation timestamp       |
| updated_at     | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP                                 | Record update timestamp         |

---

## Relationships

- **users** can have multiple **budgets** (1-to-many).
- **budgets** have multiple **categories** (1-to-many).
- **budgets** also have multiple **transactions** and **recurring_transactions** (1-to-many).
- Each **category** belongs to one **budget**.
- Each **transaction** belongs to one **budget** and optionally one **category**.
- Each **recurring_transaction** belongs to one **budget** and optionally one **category**.
- Deleting a **user** cascades deletes their **budgets**, which cascades deletes categories, transactions, and recurring transactions.
- Deleting a **budget** cascades deletes its **categories**, **transactions**, and **recurring_transactions**.
- Deleting a **category** sets `category_id` to `NULL` in related transactions and recurring transactions.

---

## Notes

- All timestamps (`created_at`, `updated_at`) are automatically managed by Knex.
- `currency` uses ISO 4217 3-letter codes, defaulting to `'USD'`.
- `limit` in categories is optional and can be used to enforce budget constraints.
- The `type` column in categories distinguishes between income and expense categories.
- `frequency` in recurring transactions should describe the interval (e.g., `"weekly"`, `"monthly"`, `"yearly"`).

---

## ER Diagram

You can find the ER Diagram [here](./ERD.png) to visualize the schema relationships.

---

