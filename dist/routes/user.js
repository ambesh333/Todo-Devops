"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const router = express_1.default.Router();
const myVar = process.env.JWT_SECRET;
const userBody = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = userBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Name already taken or Incorrect Inputs",
        });
    }
    console.log("Received username:", req.body.username);
    try {
        const existingUser = yield db_1.prisma.user.findUnique({
            where: {
                username: req.body.username,
            },
        });
        console.log("Existing user query result:", existingUser);
        if (existingUser) {
            return res.status(409).json({
                message: "User already Present",
            });
        }
        const user = yield db_1.prisma.user.create({
            data: {
                username: req.body.username,
                password: req.body.password,
            },
        });
        console.log("Created user:", user);
        if (myVar) {
            const userId = user.id;
            const token = jsonwebtoken_1.default.sign({
                userId,
            }, myVar);
            res.json({
                message: "User created successfully",
                token: token,
            });
        }
        else {
            res.status(400).json({
                message: "JWT SECRET NOT FOUND And user not created",
            });
        }
    }
    catch (error) {
        console.error("Error in signup process:", error);
        res.status(500).json({
            message: "An error occurred during signup",
            error: error.message,
        });
    }
}));
router.get("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = userBody.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Inputs are not correct",
        });
    }
    const user = yield db_1.prisma.user.findUnique({
        where: {
            username: req.body.username,
        },
    });
    if (user && myVar) {
        const userId = user.id;
        const token = jsonwebtoken_1.default.sign({
            userId,
        }, myVar);
        res.json({
            token: token,
        });
        return;
    }
}));
router.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.prisma.user.findMany({
            select: {
                username: true,
            },
        });
        const username = users.map((user) => user.username);
        res.status(200).json({
            username,
        });
    }
    catch (error) {
        console.error("Error fetching usernames:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
console.log("User endpoint is working");
exports.default = router;
