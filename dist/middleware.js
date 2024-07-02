"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const myVar = process.env.JWT_SECRET;
    const token = req.cookies.token.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    if (myVar) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, myVar);
            req.userId = decoded.userId;
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
    else {
        return res.status(500).json({ message: "JWT_SECRET not configured" });
    }
};
exports.default = authMiddleware;
