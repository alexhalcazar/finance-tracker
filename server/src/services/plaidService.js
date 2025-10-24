import moment from "moment";
import "dotenv/config";
import { plaidClient } from "#plaid";
// placeholder until can retrieve access token from database
let access_token = null;

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
  let result = { error: "could not create access token" };
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // TODO: store accessToken securely in our database

    // placeholder
    access_token = response.data.access_token;
    if (access_token) {
      result = { success: "access token created" };
    }
    return result;
  } catch (err) {
    console.error(
      "Could not exchange public token for access token:",
      err.response?.data || err.message
    );
    throw new Error("Error exchanging public token for access token");
  }
};

export const fetchTransactions = async (user_id, days = 30) => {
  try {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const pastDaysAgo = now.subtract(days, "days").format("YYYY-MM-DD");

    // TODO: grab access token from database for user_id
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: pastDaysAgo,
      end_date: today,
    });
    const transactions = response.data.transactions;
    console.log(
      `You have ${transactions.length} transactions from the last thirty days.`
    );
    return transactions;
  } catch (err) {
    console.error(
      "Could not get transactions from Plaid:",
      err.response?.data || err.message
    );
    throw new Error("Error getting transactions from Plaid");
  }
};
