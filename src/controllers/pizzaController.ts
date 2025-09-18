import { Request, Response } from "express";
import prisma from "../config/prisma";
import { createPizzaSchema, updatePizzaSchema, createSizeSchema, createToppingSchema } from "../model/pizza";

// Pizza CRUD operations
export const getAllPizzas = async (req: Request, res: Response) => {
  try {
    const pizzas = await prisma.pizza.findMany({
      include: {
        prices: {
          include: {
            size: true
          }
        }
      }
    });
    res.json(pizzas);
  } catch (error) {
    console.error("Get pizzas error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPizzaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pizza = await prisma.pizza.findUnique({
      where: { id },
      include: {
        prices: {
          include: {
            size: true
          }
        }
      }
    });

    if (!pizza) {
      return res.status(404).json({ error: "Pizza not found" });
    }

    res.json(pizza);
  } catch (error) {
    console.error("Get pizza error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPizza = async (req: Request, res: Response) => {
  try {
    const validatedData = createPizzaSchema.parse(req.body);

    const pizza = await prisma.pizza.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        prices: {
          create: validatedData.prices.map(price => ({
            sizeId: price.sizeId,
            price: price.price
          }))
        }
      },
      include: {
        prices: {
          include: {
            size: true
          }
        }
      }
    });

    res.status(201).json(pizza);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    console.error("Create pizza error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePizza = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updatePizzaSchema.parse(req.body);

    const pizza = await prisma.pizza.update({
      where: { id },
      data: validatedData,
      include: {
        prices: {
          include: {
            size: true
          }
        }
      }
    });

    res.json(pizza);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    console.error("Update pizza error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePizza = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pizza.delete({ where: { id } });
    res.json({ message: "Pizza deleted successfully" });
  } catch (error) {
    console.error("Delete pizza error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Size operations
export const getAllSizes = async (req: Request, res: Response) => {
  try {
    const sizes = await prisma.size.findMany();
    res.json(sizes);
  } catch (error) {
    console.error("Get sizes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSize = async (req: Request, res: Response) => {
  try {
    const validatedData = createSizeSchema.parse(req.body);
    const size = await prisma.size.create({ data: validatedData });
    res.status(201).json(size);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    console.error("Create size error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Topping operations
export const getAllToppings = async (req: Request, res: Response) => {
  try {
    const toppings = await prisma.topping.findMany();
    res.json(toppings);
  } catch (error) {
    console.error("Get toppings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTopping = async (req: Request, res: Response) => {
  try {
    const validatedData = createToppingSchema.parse(req.body);
    const topping = await prisma.topping.create({ data: validatedData });
    res.status(201).json(topping);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    console.error("Create topping error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
