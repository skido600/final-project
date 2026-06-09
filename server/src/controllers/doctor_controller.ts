import type { Request, Response, NextFunction } from "express";
import { db } from "../configs/db.ts";
import { and, eq, or, ne, ilike, sql } from "drizzle-orm";
import { HandleResponse } from "../util/response.ts";
import argon2 from "argon2";
import { aiSuggestions, appointments, patients } from "../db/schema.ts";
import STMPservice from "../util/sendEmail.ts";

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
    const { firstName, surname, sex, email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .select({
        id: patients.id,
        role: patients.role,
        email: patients.email,
      })
      .from(patients)
      .where(eq(patients.email, normalizedEmail))
      .limit(1);

    const [user1] = existing;

    if (user1) {
      return res.status(409).json({
        success: false,
        message: `Email already exists as ${user1.role}`,
      });
    }
    const plainPassword = generatePassword();
    const hashedPassword = await argon2.hash(plainPassword);

    await db
      .insert(patients)
      .values({
        firstName,
        surname,
        sex: sex?.toLowerCase(),
        role: "doctor",
        email: normalizedEmail,
        password: hashedPassword,
        verified: true,
      })
      .returning();

    //
    await STMPservice.SendDoctorLogin(
      firstName,
      surname,
      normalizedEmail,
      plainPassword,
    );
    return HandleResponse(res, true, 201, "Doctor created successfully", {
      // doctor: user[0],
      // password: plainPassword,
    });
  } catch (error) {
    next(error);
  }
}
export async function BookAppointment(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const { doctorId, date, time, symptoms } = req.body;

    const patientId = req.user.id;
    const doctor = await db
      .select({
        id: patients.id,
        role: patients.role,
      })
      .from(patients)
      .where(eq(patients.id, doctorId))
      .limit(1);

    if (doctor.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
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
export async function GetMyAppointments(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const patientId = req.user.id;
    // const search = req.query.search?.trim();

    const data = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        time: appointments.time,
        symptoms: appointments.symptoms,
        status: appointments.status,
        createdAt: appointments.createdAt,

        // doctor info
        doctorId: appointments.doctorId,
        doctorFirstName: patients.firstName,
        doctorSurname: patients.surname,
        doctorEmail: patients.email,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.doctorId, patients.id))
      .where(and(eq(appointments.patientId, patientId)));

    return HandleResponse(res, true, 200, "Appointments fetched", data);
  } catch (error) {
    next(error);
  }
}

export async function GetDoctors(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const doctors = await db
      .select({
        id: patients.id,
        firstName: patients.firstName,
        surname: patients.surname,
      })
      .from(patients)
      .where(eq(patients.role, "doctor"));

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    next(error);
  }
}

export async function AcceptAppointment(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const { appointmentId } = req.params;

    const updated = await db
      .update(appointments)
      .set({ status: "accepted" })
      .where(eq(appointments.id, appointmentId))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Appointment accepted",
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
}

export async function RejectAppointment(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const { appointmentId } = req.params;

    const updated = await db
      .update(appointments)
      .set({ status: "rejected" })
      .where(eq(appointments.id, appointmentId))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Appointment rejected",
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
}

export async function CancelAppointment(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const { appointmentId } = req.params;

    const updated = await db
      .update(appointments)
      .set({ status: "cancelled" })
      .where(eq(appointments.id, appointmentId))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled by doctor",
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
}
export async function GetDoctorAppointments(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const doctorId = req.user.id;
    const search = req.query.search?.trim();
    const doctorAppointments = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        time: appointments.time,
        symptoms: appointments.symptoms,
        status: appointments.status,
        createdAt: appointments.createdAt,

        patientId: patients.id,
        patientFirstName: patients.firstName,
        patientsurnameName: patients.surname,
        patientAge: patients.age,
        patientSex: patients.sex,
        patientPhone: patients.phone,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          ne(appointments.status, "rejected"),
          ne(appointments.status, "cancelled"),

          search
            ? or(
                ilike(patients.firstName, `%${search}%`),
                ilike(patients.surname, `%${search}%`),
              )
            : undefined,
        ),
      );

    return res.status(200).json({
      success: true,
      data: doctorAppointments,
    });
  } catch (error) {
    next(error);
  }
}

export async function GetPatientAppointments(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const patientId = req.user.id;

    const patientAppointments = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        time: appointments.time,
        symptoms: appointments.symptoms,
        status: appointments.status,
        createdAt: appointments.createdAt,

        // doctor info
        doctorId: appointments.doctorId,
        doctorFirstName: patients.firstName,
        doctorSurname: patients.surname,
        doctorEmail: patients.email,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.doctorId, patients.id))
      .where(eq(appointments.patientId, patientId));

    return res.status(200).json({
      success: true,
      data: patientAppointments,
    });
  } catch (error) {
    next(error);
  }
}

export async function GetPatientDashboardStats(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const patientId = req.user.id;

    const [appointmentStats] = await db
      .select({
        totalAppointments: sql<number>`count(*)`,
        pendingAppointments: sql<number>`
          count(case when ${appointments.status} = 'pending' then 1 end)
        `,
        acceptedAppointments: sql<number>`
          count(case when ${appointments.status} = 'accepted' then 1 end)
        `,
        rejectedAppointments: sql<number>`
          count(case when ${appointments.status} = 'rejected' then 1 end)
        `,
        cancelledAppointments: sql<number>`
          count(case when ${appointments.status} = 'cancelled' then 1 end)
        `,
      })
      .from(appointments)
      .where(eq(appointments.patientId, patientId));

    const [aiUsage] = await db
      .select({
        totalAiChecks: sql<number>`count(*)`,
      })
      .from(aiSuggestions)
      .where(eq(aiSuggestions.patientId, patientId));

    return res.status(200).json({
      success: true,
      data: {
        patientName: req.user.firstName + " " + req.user.surname,
        totalAppointments: appointmentStats?.totalAppointments || 0,
        pendingAppointments: appointmentStats?.pendingAppointments || 0,
        acceptedAppointments: appointmentStats?.acceptedAppointments || 0,
        rejectedAppointments: appointmentStats?.rejectedAppointments || 0,
        cancelledAppointments: appointmentStats?.cancelledAppointments || 0,
        totalAiChecks: aiUsage?.totalAiChecks || 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function GetPatientAppointmentHistory(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const patientId = req.user.id;

    const history = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        time: appointments.time,
        symptoms: appointments.symptoms,
        status: appointments.status,
        createdAt: appointments.createdAt,

        // doctor info (POPULATED)
        doctorId: appointments.doctorId,
        doctorFirstName: patients.firstName,
        doctorSurname: patients.surname,
      })
      .from(appointments)
      .leftJoin(
        patients,
        eq(appointments.doctorId, patients.id), // ✅ populate doctor
      )
      .where(eq(appointments.patientId, patientId));

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function GetDoctorProfile(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const doctorId = req.user.id;

    const [doctor] = await db
      .select({
        id: patients.id,
        firstName: patients.firstName,
        surname: patients.surname,
        email: patients.email,
        role: patients.role,
      })
      .from(patients)
      .where(eq(patients.id, doctorId))
      .limit(1);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: doctor.id,
        firstName: doctor.firstName,
        surname: doctor.surname,
        role: doctor.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
