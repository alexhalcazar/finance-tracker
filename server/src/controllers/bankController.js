import { fetchTransactions } from "#services/plaidService";

export const getTransactions = async (req, res) => {
  // const { user_id } = req.user;
  const { access_token } = req.body;
  try {
    // TODO: fetch the Plaid access_token from DB using the user_id
    // const access_token = await getAccessToken(user_id);

    // can pass in amount of days
    const transactions = await fetchTransactions(access_token);
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transactions from Plaid API" });
  }
};
