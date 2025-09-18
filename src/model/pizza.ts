import { z } from "zod";

export const createPizzaSchema = z.object({
  name: z.string().min(2, "Pizza name must be at least 2 characters"),
  description: z.string().optional(),
  prices: z.array(z.object({
    sizeId: z.string(),
    price: z.number().positive("Price must be positive")
  })).min(1, "At least one price is required")
});

export const updatePizzaSchema = z.object({
  name: z.string().min(2, "Pizza name must be at least 2 characters").optional(),
  description: z.string().optional(),
});

export const createSizeSchema = z.object({
  name: z.string().min(2, "Size name must be at least 2 characters"),
});

export const createToppingSchema = z.object({
  name: z.string().min(2, "Topping name must be at least 2 characters"),
  isExtraCharge: z.boolean().default(false),
});

export type CreatePizzaInput = z.infer<typeof createPizzaSchema>;
export type UpdatePizzaInput = z.infer<typeof updatePizzaSchema>;
export type CreateSizeInput = z.infer<typeof createSizeSchema>;
export type CreateToppingInput = z.infer<typeof createToppingSchema>;
