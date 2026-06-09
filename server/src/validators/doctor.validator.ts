import { z } from "zod";

export const createDoctorSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  surname: z.string().trim().min(2, "Surname must be at least 2 characters"),

  sex: z.enum(["Male", "Female", "Other"], {
    message: "Sex must be Male, Female or Other",
  }),

  email: z.string().trim().email("Invalid email address"),
});

export const bookAppointmentSchema = z.object({
  doctorId: z.string().trim().min(2, "Doctor id is required"),

  date: z.string().min(1, "Appointment date is required"),

  time: z.string().min(1, "Appointment time is required"),

  symptoms: z
    .string()
    .trim()
    .min(8, "Symptoms must be at least 8 characters")
    .max(500, "Symptoms too long (max 200 characters)"),
});
