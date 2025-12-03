import db from "#db";

class RecurringTransaction {
  constructor(tableName) {
    if (!tableName) {
      throw new Error("The table must be defined for this model");
    }
    this.tableName = tableName;
  }
  /**
   * findAll finds all transactions based on flexible filter criteria
   * @param {int} user_id - Passed in user_id
   */
  async findAll(user_id) {
    return await db("recurring_transactions")
      .join("budgets", "recurring_transactions.budget_id", "budgets.budget_id")
      .where("budgets.user_id", user_id)
      .select("recurring_transactions.*");
  }

  // findById will try to find the transaction by the recurring_id
  async findById(recurring_id) {
    if (!recurring_id) {
      throw new Error("findById must contain a 'recurring_id' argument");
    }

    return await db(this.tableName).where({ recurring_id }).first();
  }

  /**
   *
   * @typedef {Object} recurring_transaction_data
   * @property {number} budget_id - Existing budget foreign key number the transaction belongs to
   * @property {number} category_id - Existing category foreign key number the transaction belongs to
   * @property {number} amount - Amount for this specific transaction
   * @property {string} frequency - Frequency displays how frequent this transaction occurs
   * @property {timestamp_date} start_date - Timestamp date when the transaction started on
   * @property {timestamp_date} end_date - Timestamp date when the transaction ends on
   * @property {string} note - optional note for this recurring transaction
   */
  async insert(recurring_transaction_data) {
    const [recurring_transaction] = await db(this.tableName)
      .insert(recurring_transaction_data)
      .returning("*");
    return recurring_transaction;
  }

  /**
   *
   * @typedef {Object} transaction_data -> recurring_transaction_updates
   * @property {number} transaction_id - id of the transaction
   * @property {number} budget_id - id of the budget the recurring transaction belongs to
   * @property {number} category_id - id of the category the recurring transaction belongs to
   * @property {number} amount - Amount for this specific transaction
   * @property {string} frequency - Frequency displays how frequent this transaction occurs
   * @property {timestamp_date} start_date - Timestamp date when the transaction started on
   * @property {timestamp_date} end_date - Timestamp date when the transaction ends on
   * @property {string} note - optional note for this recurring transaction
   */
  async update(recurring_id, recurring_transaction_updates) {
    const [updatedRecurringTransaction] = await db(this.tableName)
      .where({ recurring_id })
      .update(recurring_transaction_updates)
      .returning("*");
    return updatedRecurringTransaction;
  }

  async delete(recurring_id) {
    const [deletedRecurringTransaction] = await db(this.tableName)
      .where({ recurring_id })
      .del()
      .returning("*");
    return deletedRecurringTransaction;
  }
}

const tableName = "recurring_transactions";
const recurringTransaction = new RecurringTransaction(tableName);
export default recurringTransaction;
