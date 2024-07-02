import express, { Request, Response, Router } from "express";
import zod from "zod";
import authMiddleware from "../middleware";
import { prisma } from "../db";

const router = Router();
enum StatusType {
  Not_Started = "Not_Started",
  In_Progress = "In_Progress",
  Completed = "Completed",
}

const taskBody = zod.object({
  title: zod.string(),
  description: zod.string(),
  status: zod.nativeEnum(StatusType).optional(),
});

interface AuthRequest extends Request {
  userId?: number;
}
//create a new todo
router.post(
  "/create",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description } = taskBody.parse(req.body);

      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const newTodo = await prisma.todo.create({
        data: {
          title,
          description,
          userId,
        },
      });

      res
        .status(201)
        .json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
      if (error instanceof zod.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating todo:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
//get all the todos
router.get("/bulk", authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const todos = await prisma.todo.findMany({
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
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//update the todo
router.get(
  "/update/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const todoId = parseInt(req.params.id, 10);
    const userId = req.userId;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    try {
      // Validate the status
      const validatedStatus = zod.nativeEnum(StatusType).parse(status);

      // Check if the todo exists and belongs to the user
      const todo = await prisma.todo.findFirst({
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
      const updatedTodo = await prisma.todo.update({
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
    } catch (error) {
      if (error instanceof zod.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid status", errors: error.errors });
      }
      console.error("Error updating todo status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
