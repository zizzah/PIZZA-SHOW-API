import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "../src/config/prisma";
import routes from "../src/routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "🍕 Pizza Shop API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      pizzas: "/api/pizzas",
      orders: "/api/orders"
    }
  });
});

// Database test route
app.get("/db-test", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ ok: true, count: users.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// API routes
app.use("/api", routes);

export default app;
