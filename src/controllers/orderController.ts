import { Request, Response } from "express";
import prisma from "../config/prisma";
import { createOrderSchema, updateOrderStatusSchema } from "../model/order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Calculate total price
    let totalPrice = 0;
    const orderItems = [];

    for (const item of validatedData.items) {
      // Get pizza price for the selected size
      const pizzaPrice = await prisma.pizzaPrice.findFirst({
        where: {
          pizzaId: item.pizzaId,
          sizeId: item.sizeId
        }
      });

      if (!pizzaPrice) {
        return res.status(400).json({ error: `Price not found for pizza ${item.pizzaId} with size ${item.sizeId}` });
      }

      let itemPrice = pizzaPrice.price;

      // Add topping prices
      if (item.toppingIds.length > 0) {
        const toppings = await prisma.topping.findMany({
          where: { id: { in: item.toppingIds } }
        });

        const extraChargeToppings = toppings.filter(t => t.isExtraCharge);
        itemPrice += extraChargeToppings.length * 2; // $2 per extra charge topping
      }

      totalPrice += itemPrice;
      orderItems.push({
        pizzaId: item.pizzaId,
        sizeId: item.sizeId,
        toppingIds: item.toppingIds,
        price: itemPrice
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        items: {
          create: orderItems.map(item => ({
            pizzaId: item.pizzaId,
            sizeId: item.sizeId,
            toppings: {
              create: item.toppingIds.map(toppingId => ({
                toppingId
              }))
            }
          }))
        }
      },
      include: {
        items: {
          include: {
            pizza: true,
            size: true,
            toppings: {
              include: {
                topping: true
              }
            }
          }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
      totalPrice
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    console.error("Create order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            pizza: true,
            size: true,
            toppings: {
              include: {
                topping: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            pizza: true,
            size: true,
            toppings: {
              include: {
                topping: true
              }
            }
          }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateOrderStatusSchema.parse(req.body);

    const order = await prisma.order.update({
      where: { id },
      data: { status: validatedData.status },
      include: {
        items: {
          include: {
            pizza: true,
            size: true,
            toppings: {
              include: {
                topping: true
              }
            }
          }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const order = await prisma.order.findFirst({
      where: { 
        id,
        OR: [
          { userId }, // User can see their own orders
          { user: { role: "ADMIN" } } // Admin can see all orders
        ]
      },
      include: {
        items: {
          include: {
            pizza: true,
            size: true,
            toppings: {
              include: {
                topping: true
              }
            }
          }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
