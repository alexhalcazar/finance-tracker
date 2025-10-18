import db from "#db";

class Transaction {
  constructor(tableName) {
    if (!tableName) {
      throw new Error("The table must be defined for this model");
    }
    this.tableName = tableName;
  }

  /**
   * findAll finds all transactions based on flexible filter criteria
   * @param {Object} filters - An object containing any combination of filter criteria
   *   e.g., { budget_id: 123, category_id: 456, transaction_date: '2024-01-01' }
   * @param {Object} limit - limit option to query based on a count
   */
  async findAll(filters, limitCount) {
    if (filters && limit) {
      return await db(this.tableName)
        .where(filters)
        .limit(limitCount)
        .select("*");
    }

    if (filters) {
      return await db(this.tableName).where(filters).select("*");
    }

    return await query.select("*");
  }

  // findById will try to find the transaction by the transaction id
  async findById(transaction_id) {
    const [transaction] = db(this.tableName).where({ transaction_id }).first();

    return await transaction;
  }

  // findByUserId queries transactions by the passed in user_id
  async findByUserId(user_id) {
    return await db(this.tableName)
      .join("budgets", "transactions.budget_id", "budgets.budget_id")
      .where("budgets.user_id", user_id)
      .select("transactions.*");
  }

  /**
   *
   * @typedef {Object} transaction_data
   * @property {number} budget_id - Existing budget foreign key number the transaction belongs to
   * @property {number} category_id - Existing category foreign key number the transaction belongs to
   * @property {string} note - User's optional note for this specific transaction
   * @property {date} transaction_date - Date the transaction occurred on
   * @property {timestamp_date} created_at - Timestamp date when the transaction was created on
   * @property {timestamp_date} updated_at - Timestamp date when the transaction was updated on
   */
  async insert(transaction_data) {
    const [transaction] = await db(this.tableName).insert({ transaction_data });
    return transaction;
  }

  /**
   *
   * @property {number} transaction_id - existing transaction id you want to update
   * @typedef {Object} transaction_updates
   * @property {number} budget_id - Able to update the budget id foreign key if needed
   * @property {number} category_id - Able to update the budget id foreign key if needed
   * @property {string} note - User's optional note for this specific transaction
   * @property {date} transaction_date - Date the transaction occurred on
   * @property {timestamp_date} created_at - Timestamp date when the transaction was created on
   * @property {timestamp_date} updated_at - Timestamp date when the transaction was updated on
   */
  async update(transaction_id, transaction_updates) {
    const [updated_transaction] = await db(this.tableName)
      .where({ transaction_id })
      .update({ transaction_updates });
    return updated_transaction;
  }

  /**
   *
   * @param {number} transaction_id - delete by primary key number index
   * @returns recently deleted transaction
   */
  async delete(transaction_id) {
    const [deleted_transaction] = await db(this.tableName)
      .where({ transaction_id })
      .del()
      .returning("*");

    return deleted_transaction;
  }
}

const tableName = "transactions";
const transaction = new Transaction(tableName);
export default transaction;
