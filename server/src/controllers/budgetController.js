import budget from "#models/budgetModel";

const createNewBudget = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { name, start_date, end_date, currency } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Budget name is required",
      });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({
        error: "Budget start_date and end date is required",
      });
    }

    const budgetData = {
      user_id,
      name,
      start_date,
      end_date,
      currency,
    };

    const newBudget = await budget.insert(budgetData);
    return res.status(201).json({
      message: "Budget created successfully",
      newBudget,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create budget",
    });
  }
};

const getAllBudgets = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { limit } = req.query;

    if (limit) {
      const budgets = await budget.findAll(user_id, limit);
      return res.status(200).json({
        message: "Budgets retrieved successfully",
        budgets,
      });
    }

    const budgets = await budget.findAll(user_id);
    return res.status(200).json({
      message: "Budgets retrieved successfully",
      budgets,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve budgets",
    });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { budget_id } = req.params;

    if (!budget_id) {
      return res.status(400).json({
        error: "Budget ID is required",
      });
    }

    const budgetData = await budget.findById(budget_id);

    if (!budgetData) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    if (budgetData.user_id !== user_id) {
      return res.status(403).json({
        error: "Unauthorized access to this budget",
      });
    }

    return res.status(200).json({
      message: "Budget retrieved successfully",
      budget: budgetData,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve budget",
    });
  }
};

export { createNewBudget, getAllBudgets, getBudgetById };
