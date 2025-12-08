import {
  createLinkToken,
  setAccessToken,
  retrieveAccessToken,
} from "#services/plaidService";

export const getLinkToken = async (req, res) => {
  const { user_id } = req.user;

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
  const { user_id } = req.user;
  try {
    const response = await setAccessToken(publicToken, user_id);
    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error exchanging link token from Plaid API" });
  }
};

export const getAccessToken = async (req, res) => {
  const { user_id } = req.user;
  try {
    const response = await retrieveAccessToken(user_id);
    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving access token from database" });
  }
};
