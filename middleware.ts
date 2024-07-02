import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
//add cookie
interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const myVar = process.env.JWT_SECRET;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (myVar) {
    try {
      const decoded = jwt.verify(token, myVar) as { userId: string };
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
