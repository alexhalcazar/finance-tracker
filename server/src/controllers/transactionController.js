import transaction from "#models/transactionModel";

const createNewTransaction = async (req, res) => {
  try {
    const { budget_id, category_id, amount, note, transaction_date } = req.body;
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(400).json({
        error: "User not authorized",
      });
    }

    if (!budget_id || !category_id || !amount || !transaction_date) {
      return res.status(400).json({
        error:
          "budget_id, category_id, amount, and transaction_date are required",
      });
    }

    const transactionData = {
      budget_id,
      category_id,
      amount,
      note,
      transaction_date,
    };

    const newTransaction = await transaction.insert(transactionData);

    if (!newTransaction) {
      return res.status(400).json({
        error: "Failed to create transaction",
      });
    }

    return res.status(201).json({
      message: "Transaction created successfully",
      newTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create transaction",
    });
  }
};

export { createNewTransaction };
