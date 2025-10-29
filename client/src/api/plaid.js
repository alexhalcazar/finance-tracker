export const fetchLatestTransactions = async (token, max = 5) => {
  const latestTransactions = [];
  try {
    const response = await fetch("/api/bank/transactions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    for (let i = 0; i < Math.min(data.length, max); i++) {
      const thisTransaction = {
        amount: data[i].amount,
        date: data[i].date,
        merchant: data[i].merchant_name,
      };

      latestTransactions.push(thisTransaction);
    }
    return latestTransactions;
  } catch (err) {
    console.error("Could not retrieve transactions:", err);
  }
};

export const fetchLinkToken = async (token) => {
  try {
    const response = await fetch("/api/plaid/get_link_token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.link_token;
  } catch (err) {
    console.error("Backend call to create link token failed");
  }
};
