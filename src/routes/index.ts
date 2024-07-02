import { Router } from "express";
import UserRoutes from "./user";
import taskRoutes from "./task";

const router = Router();

router.use("/user", UserRoutes);
router.use("/task", taskRoutes);

export default router;
