import express from "express";
const app = express();
const PORT = 8080;

app.use(express.json());
app.listen(PORT, async () => {
  //  can use any database later on to initiate the connection here
  console.log(`Server is running on port: ${PORT}`);
});
