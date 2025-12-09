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

export { getTotalGlobalIncome };
