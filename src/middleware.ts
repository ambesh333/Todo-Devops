import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Counter, Histogram, Registry } from "prom-client";

interface AuthRequest extends Request {
  userId?: number;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const myVar = process.env.JWT_SECRET;

  const token = req.cookies.token.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  if (myVar) {
    try {
      const decoded = jwt.verify(token, myVar) as { userId: number };
      req.userId = decoded.userId;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(500).json({ message: "JWT_SECRET not configured" });
  }
};

export default authMiddleware;

const register = new Registry();

// Define a counter metric
const apiRequestCounter = new Counter({
  name: "api_request_count",
  help: "Count of requests to API endpoints",
  labelNames: ["method", "route"],
});

// Define a histogram metric for request duration
const httpRequestDurationMicroseconds = new Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
});

// Register the metrics
register.registerMetric(apiRequestCounter);
register.registerMetric(httpRequestDurationMicroseconds);

export const monitor = (route: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    apiRequestCounter.inc({
      method: req.method,
      route: route,
    });

    res.on("finish", () => {
      end({
        method: req.method,
        route: route,
        code: res.statusCode,
      });
    });

    next();
  };
};

export { register };
