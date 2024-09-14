import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import router from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { collectDefaultMetrics } from "prom-client";
import { register } from "./middleware";

dotenv.config();

const app = express();

// Collect default system metrics
collectDefaultMetrics({ register });

// Expose the metrics endpoint
app.get("/metrics", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    next(err);
  }
});

app.get("/metrics2", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Todo backend server is up",
  });
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

// API routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Todo backend server is up",
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
