import { createLinkToken, setAccessToken } from "#services/plaidService";
// import { verifyToken }

// apply middleware to grab user_id
export const getLinkToken = async (req, res) => {
  // const { user_id } = req.body;

  // placeholder
  const user_id = 1;

  try {
    const link_token = await createLinkToken(user_id);
    res.json(link_token);
  } catch (error) {
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
  }
};
