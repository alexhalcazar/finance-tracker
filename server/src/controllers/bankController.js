import { fetchTransactions } from "#services/plaidService";
// import { verifyToken }

// apply middleware to grab user_id
export const getTransactions = async (req, res) => {
  // const { user_id } = res.body;

  // placeholder
  const user_id = 1;

  try {
    // can pass in amount of days
    const transactions = await fetchTransactions(user_id);
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transactions from Plaid APi" });
  }
};
