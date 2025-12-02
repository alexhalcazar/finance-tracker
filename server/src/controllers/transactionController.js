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

const getTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(400).json({
        error: "User not authorized",
      });
    }

    if (!transaction_id) {
      return res.status(400).json({ error: "transaction_id is required" });
    }

    const transactionData = await transaction.findById(transaction_id);

    if (!transactionData) {
      return res.status(404).json({
        error: "Transaction(s) not found",
      });
    }

    return res.status(200).json({
      message: "Transaction retrieved successfully",
      transactionData,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to retrieve transaction",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(400).json({
        error: "User not authorized",
      });
    }

    if (!transaction_id) {
      return res.status(400).json({
        error: "transaction_id is required",
      });
    }

    const deletedTransaction = await transaction.delete(transaction_id);

    if (!deletedTransaction) {
      return res.status(400).json({
        error: "Failed to delete transaction",
      });
    }

    return res.status(200).json({
      message: "Deleted transaction successfully",
      deletedTransaction,
    });
  } catch (error) {}
};

const updateTransaction = async (req, res) => {
  const { budget_id, category_id, amount, note, transaction_date } = req.body;
  const { transaction_id } = req.params;
  const { user_id } = req.user;

  if (!user_id) {
    return res.status(400).json({
      error: "User not authorized",
    });
  }

  if (!transaction_id) {
    return res.status(400).json({
      error: "transaction_id is required",
    });
  }

  const transactionUpdates = {
    budget_id,
    category_id,
    amount,
    note,
    transaction_date,
  };

  const updatedTransaction = await transaction.update(
    transaction_id,
    transactionUpdates
  );

  if (!updatedTransaction) {
    return res.status(400).json({
      error: "Failed to update transaction",
    });
  }

  return res.status(200).json({
    message: "Updated transaction successfully",
    updatedTransaction,
  });
};
export {
  createNewTransaction,
  getTransaction,
  deleteTransaction,
  updateTransaction,
};
