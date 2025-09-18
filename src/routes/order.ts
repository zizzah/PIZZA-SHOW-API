import { Router } from "express";
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus,
  getOrderById
} from "../controllers/orderController";
import { authenticateToken, requireAdmin } from "../middlewares/auth";

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

// User routes
router.post("/", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:id", getOrderById);

// Admin routes
router.get("/", requireAdmin, getAllOrders);
router.put("/:id/status", requireAdmin, updateOrderStatus);

export default router;
