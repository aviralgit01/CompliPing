import { z } from "zod";

export const common = {
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  phone: z.string().min(10, "Invalid phone number"),
};

export const emailSchema = z.object({
  email: common.email,
});
