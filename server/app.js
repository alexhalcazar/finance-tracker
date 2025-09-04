import express from "express";
import mongodb from "./api/db/connection.js";

import users from "./api/routes/user.js";
import mealplan from "./api/routes/mealplan.js";
import meals from "./api/routes/meals.js";

const app = express();
const PORT = 8080;
dotenv.config();

//  enable cors on the server
const options = { exposedHeader: ["Authorization"] };
app.use(cors(options));

app.use(express.json());

app.use("/users", users);
app.use("/mealplans", mealplan);
app.use("/meals", meals);

app.listen(PORT, async () => {
  //  connect to mongodb before starting server
  await mongodb.connect();

  console.log(`Server is running on port: ${PORT}`);
});
