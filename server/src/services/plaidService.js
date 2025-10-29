import moment from "moment";
import "dotenv/config";
import { plaidClient } from "#plaid";

export const createLinkToken = async (user_id) => {
  const request = {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    client_name: "Pocket Budget",
    language: "en",
    country_codes: ["US"],
    user: { client_user_id: user_id.toString() },
    products: ["transactions"],
  };
  try {
    const response = await plaidClient.linkTokenCreate(request);
    return { link_token: response.data.link_token };
  } catch (err) {
    console.error(
      "Error getting Plaid token:",
      err.response?.data || err.message
    );
    throw new Error("Error getting Plaid token");
  }
};

export const setAccessToken = async (publicToken) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const access_token = response.data.access_token;
    // TODO: store accessToken securely in our database
  } catch (err) {
    console.error(
      "Could not exchange public token for access token:",
      err.response?.data || err.message
    );
    throw new Error("Error exchanging public token for access token");
  }
};

export const fetchTransactions = async (access_token, days = 30) => {
  try {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const pastDaysAgo = now.subtract(days, "days").format("YYYY-MM-DD");

    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: pastDaysAgo,
      end_date: today,
    });
    const transactions = response.data.transactions;
    return transactions;
  } catch (err) {
    console.error(
      "Could not get transactions from Plaid:",
      err.response?.data || err.message
    );
    throw new Error("Error getting transactions from Plaid");
  }
};
