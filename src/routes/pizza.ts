import { Router } from "express";
import { 
  getAllPizzas, 
  getPizzaById, 
  createPizza, 
  updatePizza, 
  deletePizza,
  getAllSizes,
  createSize,
  getAllToppings,
  createTopping
} from "../controllers/pizzaController";
import { authenticateToken, requireAdmin } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", getAllPizzas);
router.get("/sizes", getAllSizes);
router.get("/toppings", getAllToppings);
router.get("/:id", getPizzaById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Admin routes
router.post("/", requireAdmin, createPizza);
router.put("/:id", requireAdmin, updatePizza);
router.delete("/:id", requireAdmin, deletePizza);
router.post("/sizes", requireAdmin, createSize);
router.post("/toppings", requireAdmin, createTopping);

export default router;
