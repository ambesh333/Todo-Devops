import express, { Request, Response } from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { monitor } from "../middleware";

const router = express.Router();
const myVar = process.env.JWT_SECRET;

const userBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

interface User {
  username: string;
}

router.post(
  "/signup",
  monitor("/user/signup"),
  async (req: Request, res: Response) => {
    const { success } = userBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Name already taken or Incorrect Inputs",
      });
    }

    console.log("Received username:", req.body.username);

    try {
      const existingUser = await prisma.user.findUnique({
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

      const user = await prisma.user.create({
        data: {
          username: req.body.username,
          password: req.body.password,
        },
      });

      console.log("Created user:", user);

      if (myVar) {
        const userId = user.id;
        const token = jwt.sign(
          {
            userId,
          },
          myVar
        );
        res.cookie("token", `Bearer ${token}`);
        res.json({
          message: "User created successfully",
          token: `Bearer ${token}`,
        });
      } else {
        res.status(400).json({
          message: "JWT SECRET NOT FOUND And user not created",
        });
      }
    } catch (error: any) {
      console.error("Error in signup process:", error);
      res.status(500).json({
        message: "An error occurred during signup",
        error: error.message,
      });
    }
  }
);

router.get(
  "/signin",
  monitor("/user/signin"),
  async (req: Request, res: Response) => {
    const { success } = userBody.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        message: "Inputs are not correct",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    if (user && myVar) {
      const userId = user.id;
      const token = jwt.sign(
        {
          userId,
        },
        myVar
      );
      res.cookie("token", `Bearer ${token}`);
      res.json({
        token: `Bearer ${token}`,
      });
      return;
    }
  }
);

router.get(
  "/bulk",
  monitor("/user/bulk"),
  async (req: Request, res: Response) => {
    try {
      const users: User[] = await prisma.user.findMany({
        select: {
          username: true,
        },
      });
      const username = users.map((user) => user.username);
      res.status(200).json({
        username,
      });
    } catch (error) {
      console.error("Error fetching usernames:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

export default router;
