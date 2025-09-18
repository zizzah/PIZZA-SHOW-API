import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(z.object({
    pizzaId: z.string(),
    sizeId: z.string(),
    toppingIds: z.array(z.string()).default([])
  })).min(1, "At least one item is required")
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED"])
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
