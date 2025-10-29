import { createLinkToken, setAccessToken } from "#services/plaidService";

export const getLinkToken = async (req, res) => {
  // const { user_id } = req.user.user_id;

  // placeholder
  const user_id = 1;

  try {
    const link_token = await createLinkToken(user_id);
    res.json(link_token);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error getting creating link token from Plaid API" });
  }
};

export const exchangeLinkToken = async (req, res) => {
  const { publicToken } = req.body;
  try {
    const response = await setAccessToken(publicToken);
    res.json(response);
  } catch (err) {
    console.error("Error exchanging link token from Plaid API");
    res
      .status(500)
      .json({ error: "Error exchanging link token from Plaid API" });
  }
};
