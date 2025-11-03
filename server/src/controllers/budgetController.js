import budget from "#models/budgetModel";

const createNewBudget = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { name, amount, category, period, start_date, end_date, currency } =
      req.body;

    if (!amount || !category) {
      return res.status(400).json({
        error: "Amount and category are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: "Budget amount cannot be less than 0",
      });
    }

    const budgetData = {
      user_id,
      name,
      start_date,
      end_date,
      currency,
    };

    const newBudget = budget.insert(budgetData);
    return res.status(201).json({
      message: "Budget created successfully",
      newBudget,
      s,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create budget",
    });
  }
};

export { createNewBudget };
