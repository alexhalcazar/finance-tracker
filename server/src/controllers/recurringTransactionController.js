import recurringTransaction from "#models/recurringTransactionModel";

const createNewRecurringTransaction = async (req, res) => {
  try {
    const {
      budget_id,
      category_id,
      amount,
      note,
      frequency,
      start_date,
      end_date,
    } = req.body;
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(400).json({
        error: "User not authorized",
      });
    }

    if (
      !budget_id ||
      !category_id ||
      !amount ||
      !start_date ||
      !end_date ||
      !frequency
    ) {
      return res.status(400).json({
        error:
          "budget_id, category_id, amount, frequency, start_date, end_date, transaction_date are required",
      });
    }

    const recurringTransactionData = {
      budget_id,
      category_id,
      amount,
      note,
      start_date,
      end_date,
      frequency,
    };

    const newRecurringTransaction = await recurringTransaction.insert(
      recurringTransactionData
    );

    if (!newRecurringTransaction) {
      return res.status(400).json({
        error: "Failed to create recurring transaction",
      });
    }

    return res.status(201).json({
      message: "Recurring transaction created successfully",
      recurringTransaction: newRecurringTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create recurring transaction" });
  }
};

const updateRecurringTransaction = async (req, res) => {
  try {
    const { recurring_id } = req.params;
    const { user_id } = req.user;
    const {
      budget_id,
      category_id,
      amount,
      note,
      frequency,
      start_date,
      end_date,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: "User not authorized",
      });
    }

    if (!recurring_id) {
      return res.status(400).json({
        error: "Recurring transaction ID is required",
      });
    }

    const recurringTransactionData = {
      budget_id,
      category_id,
      amount,
      note,
      start_date,
      end_date,
      frequency,
    };

    const updatedRecurringTransaction = await recurringTransaction.update(
      recurring_id,
      recurringTransactionData
    );

    if (!updatedRecurringTransaction) {
      return res.status(400).json({
        error: "Failed to update recurring transaction",
      });
    }

    return res.status(200).json({
      message: "Recurring transaction updated successfully",
      recurringTransaction: updatedRecurringTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update recurring transaction" });
  }
};

const deleteRecurringTransaction = async (req, res) => {
  try {
    const { recurring_id } = req.params;
    const { user_id } = req.user;

    if (!user_id) {
      return res.status(400).json({
        error: "User not authorized",
      });
    }

    if (!recurring_id) {
      return res.status(400).json({
        error: "Recurring transaction ID is required",
      });
    }

    const deletedRecurringTransaction =
      await recurringTransaction.delete(recurring_id);

    if (!deletedRecurringTransaction) {
      return res.status(400).json({
        error: "Failed to delete recurring transaction",
      });
    }

    return res.status(200).json({
      message: "Recurring transaction deleted successfully",
      recurringTransaction: deletedRecurringTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recurring transaction" });
  }
};

export {
  createNewRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};
