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
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const middleware_1 = __importDefault(require("../middleware"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
var StatusType;
(function (StatusType) {
    StatusType["Not_Started"] = "Not_Started";
    StatusType["In_Progress"] = "In_Progress";
    StatusType["Completed"] = "Completed";
})(StatusType || (StatusType = {}));
const taskBody = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    status: zod_1.default.nativeEnum(StatusType).optional(),
});
router.post("/create", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = taskBody.parse(req.body);
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const newTodo = yield db_1.prisma.todo.create({
            data: {
                title,
                description,
                userId,
            },
        });
        res
            .status(201)
            .json({ message: "Todo created successfully", todo: newTodo });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res
                .status(400)
                .json({ message: "Invalid input", errors: error.errors });
        }
        console.error("Error creating todo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/bulk", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const todos = yield db_1.prisma.todo.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
            },
        });
        res.json(todos);
    }
    catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/update/:id", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = parseInt(req.params.id, 10);
    const userId = req.userId;
    const { status } = req.body;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        // Validate the status
        const validatedStatus = zod_1.default.nativeEnum(StatusType).parse(status);
        // Check if the todo exists and belongs to the user
        const todo = yield db_1.prisma.todo.findFirst({
            where: {
                id: todoId,
                userId: userId,
            },
        });
        if (!todo) {
            return res
                .status(404)
                .json({ message: "Todo not found or doesn't belong to the user" });
        }
        // Update the todo status
        const updatedTodo = yield db_1.prisma.todo.update({
            where: {
                id: todoId,
            },
            data: {
                status: validatedStatus,
            },
        });
        res.json({
            message: "Todo status updated successfully",
            todo: updatedTodo,
        });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res
                .status(400)
                .json({ message: "Invalid status", errors: error.errors });
        }
        console.error("Error updating todo status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
