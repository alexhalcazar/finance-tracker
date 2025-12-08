import { fetchTransactions, retrieveAccessToken } from "#services/plaidService";

export const getTransactions = async (req, res) => {
  const { user_id } = req.user;
  try {
    // fetch the Plaid access_token from DB using the user_id
    const access_token = await retrieveAccessToken(user_id);
    // can pass in amount of days
    const transactions = await fetchTransactions(access_token);
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transactions from Plaid API" });
  }
};
