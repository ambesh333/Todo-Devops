import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

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
