import jwt from "jsonwebtoken";

/**
 * Verifies a JWT passed as an Authorization: Bearer <token> header.
 * On success: attaches decoded payload to req.user and calls next()
 * On failure: returns 401 Unauthorized.
 */

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_TTL = "15m",
  JWT_REFRESH_TTL = "7d",
} = process.env;

// Additional hard guard (helps fail fast during startup)
if (!JWT_ACCESS_SECRET) {
  console.warn("[auth] JWT_ACCESS_SECRET is not set. Set it in server/.env");
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers?.authorization;
  // Check header present + format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  // Extract Token
  const token = authHeader.split(" ")[1];
  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  // Verify (JWT_ACESS_SECRET + HS256 from utils)
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
      algorithms: ["HS256"],
    });
    // Attach the request and continue
    req.user = decoded; // Make user info available to downstream handlers
    return next();
  } catch (err) {
    // Invalid signatures or expired token
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
