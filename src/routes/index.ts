import { Router } from "express";
import authRoutes from "./auth";
import pizzaRoutes from "./pizza";
import orderRoutes from "./order";

const router = Router();

// API routes
router.use("/auth", authRoutes);
router.use("/pizzas", pizzaRoutes);
router.use("/orders", orderRoutes);

export default router;
