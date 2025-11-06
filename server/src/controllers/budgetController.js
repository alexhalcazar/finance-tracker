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

export { createNewBudget };
