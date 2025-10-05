import db from "#db/db.js";

class Budget {
  constructor(tableName) {
    if (!tableName) {
      throw new Error("The table name must be defined for this model");
    }
    this.tableName = tableName;
  }

  // findAll budgets in the database by optional passed user id
  async findAll(user_id) {
    if (user_id) {
      return await db(this.tableName).where({ user_id }).select("*");
    }
    return await db(this.tableName).select("*");
  }

  // findByName finds the budget in the database by passed user id and the category name
  async findByName(user_id, name) {
    const [budget] = await db(this.tableName).where({ user_id, name }).first();
    return budget;
  }

  // findById finds budget by passed in budget id
  async findById(budget_id) {
    const [budget] = await db(this.tableName).where({ budget_id }).first();
    return budget;
  }

  // insert new budget to the database
  async insert(budgetData) {
    const [newBudget] = await db(this.tableName)
      .insert({ budgetData })
      .returning("*");
    return newBudget;
  }

  // update existing budget with targeted budget id and the updates object
  async update(budget_id, updates) {
    const [updatedBudget] = await db(this.tableName)
      .where({ budget_id })
      .update({ updates })
      .returning("*");
    return updatedBudget;
  }

  // delete existing budget from db with targeted passed in budget id
  async delete(budget_id) {
    const [deletedBudget] = await db(this.tableName)
      .where({ budget_id })
      .del()
      .returning("*");
    return deletedBudget;
  }
}

// initiate an instance of budget model class, will be used in other places
const tableName = "budgets";
const budget = new Budget(tableName);
export default budget;
