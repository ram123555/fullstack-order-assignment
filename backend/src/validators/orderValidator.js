const { z } = require("zod");

const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Customer name is required"),

  customerEmail: z
    .string()
    .email("Invalid email address"),

  product: z
    .string()
    .trim()
    .min(1, "Product is required"),

  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1"),

  price: z
    .number()
    .min(0, "Price cannot be negative")
});

module.exports = orderSchema;