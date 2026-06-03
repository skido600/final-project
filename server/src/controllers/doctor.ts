import type { Request, Response, NextFunction } from "express";
import { db } from "../configs/db";

import { HandleResponse } from "../util/response";
import argon2 from "argon2";
import { patients } from "../db/schema";
import STMPservice from "../util/sendEmail";
function generatePassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

export async function CreateDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { firstName, surname, sex, email, gender } = req.body;

    const plainPassword = generatePassword();
    const hashedPassword = await argon2.hash(plainPassword);
    const normalizedEmail = email.toLowerCase();

    const user = await db
      .insert(patients)
      .values({
        firstName,
        surname,
        sex,
        role: "doctor",
        email: normalizedEmail,
        password: hashedPassword,
        verified: true,
      })
      .returning();

    //
    await STMPservice.SendDoctorLogin(firstName, surname, email, plainPassword);
    return HandleResponse(res, true, 201, "Doctor created successfully", {
      doctor: user[0],
      password: plainPassword,
    });
  } catch (error) {
    next(error);
  }
}

export async function BookAppointment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { doctorId, date, time, symptoms } = req.body;

    const patientId = req.user.id; // from JWT middleware

    const appointment = await db
      .insert(appointments)
      .values({
        patientId,
        doctorId,
        date,
        time,
        symptoms,
        status: "pending",
      })
      .returning();

    return HandleResponse(res, true, 201, "Appointment booked", appointment[0]);
  } catch (error) {
    next(error);
  }
}

export async function GetDoctorAppointments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const doctorId = req.user.id;

    const data = await db
      .select()
      .from(appointments)
      .where(eq(appointments.doctorId, doctorId));

    return HandleResponse(res, true, 200, "Appointments fetched", data);
  } catch (error) {
    next(error);
  }
}
