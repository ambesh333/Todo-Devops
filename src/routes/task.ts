import express, { Request, Response } from "express";

const router = express.Router();

// Define your routes here
router.get("/", (req: Request, res: Response) => {
  res.send("Hello from user routes!");
});

// Export the router
export default router;
