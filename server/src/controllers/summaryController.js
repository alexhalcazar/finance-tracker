import db from "#db";
// summaryController.js handles grabbing global summary information

const getTotalGlobalIncome = async (req, res) => {
  const { user_id } = req.user;

  try {
    if (!user_id) {
      return res.status(400).json({ error: "User is not authorized" });
    }

    const result = await db("transactions")
      .join("budgets", "transactions.budget_id", "budgets.budget_id")
      .join("categories", "transactions.category_id", "categories.category_id")
      .where("budgets.user_id", user_id)
      .where("categories.type", "income")
      .sum("transactions.amount as total_income")
      .first();

    res.status(200).json({
      user_id,
      total_income: result?.total_income || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching income for user" });
  }
};

const getTotalGlobalExpenses = async (req, res) => {
  const { user_id } = req.user;

  try {
    if (!user_id) {
      return res.status(400).json({ error: "User is not authorized" });
    }

    const result = await db("transactions")
      .join("budgets", "transactions.budget_id", "budgets.budget_id")
      .join("categories", "transactions.category_id", "categories.category_id")
      .where("budgets.user_id", user_id)
      .where("categories.type", "expense")
      .sum("transactions.amount as total_expenses")
      .first();

    res.status(200).json({
      user_id,
      total_expenses: result?.total_expenses || 0,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses for user" });
  }
};

const getRemainingBudgetForMonth = async (req, res) => {
  const { user_id } = req.user;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  try {
    if (!user_id) {
      return res.status(400).json({});
    }
    const budgetResult = await db("budgets")
      .join("categories", "budgets.budget_id", "categories.budget_id")
      .where("budgets.user_id", user_id)
      .where("budgets.start_date", "<=", endOfMonth)
      .where("budgets.end_date", ">=", startOfMonth)
      .sum("categories.limit as total_budget")
      .first();

    const expensesResult = await db("transactions")
      .join("budgets", "transactions.budget_id", "budgets.budget_id")
      .join("categories", "transactions.category_id", "categories.category_id")
      .where("budgets.user_id", user_id)
      .where("categories.type", "expense")
      .whereBetween("transactions.transaction_date", [startOfMonth, endOfMonth])
      .sum("transactions.amount as total_expenses")
      .first();

    const totalBudget = budgetResult?.total_budget || 0;
    const totalExpenses = expensesResult?.total_expenses || 0;
    const remainingBudget = totalBudget - totalExpenses;

    res.status(200).json({
      user_id,
      remaining_budget: remainingBudget,
    });
  } catch (error) {
    console.error("Error fetching remaining budget:", error);
    res.status(500).json({ error: "Error fetching remaining budget" });
  }
};
export {
  getTotalGlobalIncome,
  getTotalGlobalExpenses,
  getRemainingBudgetForMonth,
};
