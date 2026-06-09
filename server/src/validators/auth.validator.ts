import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(2),
  surname: z.string().min(2),
  age: z.string().min(1),
  sex: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().trim().min(2, "email or phone number  is required"),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
});

export const resetPasswordSchema = z.object({
  resetToken: z.string(),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
});
