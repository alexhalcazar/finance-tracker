import express from "express";
import { verifyToken } from "./src/middleware/jwt.js";
import dummyRouter from "./src/routes/dummy.js";

const app = express();
const PORT = 8080;

app.use(express.json());


// Public ping (no auth)
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

// Protected dummy router: GET /api/dummy
app.use("/api/dummy", verifyToken, dummyRouter);

app.listen(PORT, async () => {
  //  can use any database later on to initiate the connection here
  console.log(`Server is running on port: ${PORT}`);
});
