import express from "express";
import bodyParser from "body-parser";
import router from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/v1", router);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
