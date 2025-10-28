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
   * @param {Object} filters - An object containing any combination of filter criteria
   *   e.g., { budget_id: 123, category_id: 456, start_date: '2024-01-01' }
   * @param {Number} limitCount - limit option to query based on a count
   */
  async findAll(filters, limitCount) {
    if (filters && limitCount) {
      return await db(this.tableName)
        .where(filters)
        .limit(limitCount)
        .select("*");
    }

    if (!filters) {
      throw new Error("findAll must contain at least a 'filters' argument");
    }

    return await db(this.tableName).where(filters).select("*");
  }

  // findById will try to find the transaction by the recurring_id
  async findById(recurring_id) {
    if (!recurringId) {
      throw new Error("findById must contain a 'recurring_id' argument");
    }

    return await db(this.tableName).where({ recurring_id }).first();
  }

  /**
   *
   * @typedef {Object} transaction_data
   * @property {number} budget_id - Existing budget foreign key number the transaction belongs to
   * @property {number} category_id - Existing category foreign key number the transaction belongs to
   * @property {number} amount - Amount for this specific transaction
   * @property {string} frequency - Frequency displays how frequent this transaction occurs
   * @property {timestamp_date} start_date - Timestamp date when the transaction started on
   * @property {timestamp_date} end_date - Timestamp date when the transaction ends on
   * @property {string} note - optional note for this recurring transaction
   */
  async insert(transaction_data) {
    const [transaction] = await db(this.tableName)
      .insert({ transaction_data })
      .returning("*");
    return transaction;
  }

  /**
   *
   * @typedef {Object} transaction_data
   * @property {number} transaction_id - Existing id for the
   * @property {number} amount - Amount for this specific transaction
   * @property {string} frequency - Frequency displays how frequent this transaction occurs
   * @property {timestamp_date} start_date - Timestamp date when the transaction started on
   * @property {timestamp_date} end_date - Timestamp date when the transaction ends on
   * @property {string} note - optional note for this recurring transaction
   */
  async update(recurring_id, recurring_transaction_updates) {
    const [updatedRecurringTransaction] = await db(this.tableName)
      .where({ recurring_id })
      .update({ recurring_transaction_updates })
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
