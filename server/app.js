import express from "express";
import { verifyToken } from "./src/middleware/jwt.js";
const app = express();
const PORT = 8080;

app.use(express.json());


// Public
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Protected
app.get("/api/private", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user?.email || "user"}!` });
});

app.listen(PORT, async () => {
  //  can use any database later on to initiate the connection here
  console.log(`Server is running on port: ${PORT}`);
});
