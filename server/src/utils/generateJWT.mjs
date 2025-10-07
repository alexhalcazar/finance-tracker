import "dotenv/config";
import jwt from "jsonwebtoken";

// payload: keep it small
const payload = { sub: "123", email: "you@example.com" };

// read the same secret the server uses
const secret = process.env.JWT_ACCESS_SECRET;
if (!secret) {
  console.error("JWT_ACCESS_SECRET not set in server/.env");
  process.exit(1);
}

const token = jwt.sign(payload, secret, {
  expiresIn: "15m",
  algorithm: "HS256",
});

console.log(token);
