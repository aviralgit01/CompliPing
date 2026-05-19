import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  // .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Must contain at least one number"),
  city: z.string().trim().min(2, "City name is required"),

  firmName: z
    .string()
    .min(2, "Firm name must be at least 2 characters")
    .max(200, "Firm name must be less than 200 characters"),

  icaiNumber: z.string().optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters") // Increased length is key
    .max(100, "Password is too long"),
  // .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Must contain at least one number")
  // .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
