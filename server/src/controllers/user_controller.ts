
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../configs/db.ts";
import { patients, otpTable } from "../db/schema.ts";
import { HandleResponse } from "../util/response.ts";
import type { PatientType } from "../types/index.ts";
import argon2 from "argon2";
import STMPservice from "../util/sendEmail.ts";
import { Otpcode, hmacProcess } from "../util/generetaOtp.ts";
import { eq, and, desc } from "drizzle-orm";
import { config} from "dotenv"
config()
const OTP_TYPE_VERIFY = "verify_email";
const OTP_TYPE_RESET = "reset_password";
//  SIGNUP
export async function Signup(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      firstName,
      surname,
      age,
      sex,
      phone,
      email,
      password,
    }: PatientType = req.body;

    const normalizedEmail = email.toLowerCase();

    const existing = await db
      .select()
      .from(patients)
      .where(eq(patients.email, normalizedEmail));

    if (existing[0]) {
      return HandleResponse(res, false, 409, "User already exists");
    }

    const hashedPassword = await argon2.hash(password);
    const otp = Otpcode();
    const secret = process.env.HMAC_VERIFICATION_CODE_SECRET!;
    const hashedOtp = hmacProcess(otp, secret);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await db
      .insert(patients)
      .values({
        firstName,
        surname,
        age,
        sex,
        phone,
        email: normalizedEmail,
        password: hashedPassword,
        verified: false,
      })
      .returning();

    const savedUser = user[0];

    if (!savedUser) {
      return HandleResponse(res, false, 500, "User creation failed");
    }

    await db.delete(otpTable).where(eq(otpTable.patientId, savedUser.id));

    await db.insert(otpTable).values({
      patientId: savedUser.id,
      otp: hashedOtp,
      type: OTP_TYPE_VERIFY,
      expiresAt,
    });

    await STMPservice.SendingOtp(
      firstName,
      surname,
      normalizedEmail,
      otp,
    );

    return HandleResponse(res, true, 201, "Account created. OTP sent.");
  } catch (error) {
    next(error);
  }
}

//  LOGIN
export async function Login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    const user = (
      await db
        .select()
        .from(patients)
        .where(eq(patients.email, normalizedEmail))
    )[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    // NOT VERIFIED → HANDLE OTP
    if (!user.verified) {
      const record = await db
        .select()
        .from(otpTable)
        .where(
          and(
            eq(otpTable.patientId, user.id),
            eq(otpTable.type, OTP_TYPE_VERIFY),
          ),
        )
        .orderBy(desc(otpTable.createdAt))
        .limit(1);

      const otpRecord = record[0];

      const expired =
        !otpRecord || new Date(otpRecord.expiresAt).getTime() < Date.now();

      if (expired) {
        const otp = Otpcode();
        const secret = process.env.HMAC_VERIFICATION_CODE_SECRET!;
        const hashedOtp = hmacProcess(otp, secret);

        await db.delete(otpTable).where(eq(otpTable.patientId, user.id));

        await db.insert(otpTable).values({
          patientId: user.id,
          otp: hashedOtp,
          type: OTP_TYPE_VERIFY,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await STMPservice.SendingOtp(
          user.firstName,
          user.surname,
          user.email,
          otp,
        );

        return HandleResponse(res, false, 403, "New OTP sent to email");
      }

      return HandleResponse(res, false, 403, "Account not verified check your email and input the otp to verify");
    }

    // PASSWORD CHECK
    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return HandleResponse(res, false, 400, "Invalid credentials");
    }

    // TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return HandleResponse(res, true, 200, "Login successful", { token });
  } catch (error) {
    next(error);
  }
}

//  FORGOT PASSWORD
export async function ForgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
console.log("ForgotPassword called");
    const normalizedEmail = email.toLowerCase();

    const user = (
      await db.select().from(patients).where(eq(patients.email, normalizedEmail))
    )[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    const otp = Otpcode();
    const hashedOtp = hmacProcess(otp, process.env.HMAC_VERIFICATION_CODE_SECRET!);

    await db.delete(otpTable).where(eq(otpTable.patientId, user.id));

    await db.insert(otpTable).values({
      patientId: user.id,
      otp: hashedOtp,
      type: OTP_TYPE_RESET,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await STMPservice.SendingForgetPasswordOtp(
      user.firstName,
      user.surname,
      email,
      otp,
    );

    return HandleResponse(res, true, 200, "OTP sent to email");
  } catch (error) {
    next(error);
  }
}

//  VERIFY EMAIL OTP
export async function VerifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = email.toLowerCase();

    const user = (
      await db.select().from(patients).where(eq(patients.email, normalizedEmail))
    )[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    const record = await db
      .select()
      .from(otpTable)
      .where(
        and(
          eq(otpTable.patientId, user.id),
          eq(otpTable.type, OTP_TYPE_VERIFY),
        ),
      )
      .orderBy(desc(otpTable.createdAt))
      .limit(1);

    const otpRecord = record[0];

    if (!otpRecord) {
      return HandleResponse(res, false, 404, "OTP not found");
    }

    // TIME CHECK (ONLY RELIABLE EXPIRY METHOD)
    if (new Date(otpRecord.expiresAt).getTime() < Date.now()) {
      return HandleResponse(res, false, 400, "OTP expired");
    }

    const hashedOtp = hmacProcess(
      otp,
      process.env.HMAC_VERIFICATION_CODE_SECRET!,
    );

    if (hashedOtp !== otpRecord.otp) {
      return HandleResponse(res, false, 400, "Invalid OTP");
    }

    await db
      .update(patients)
      .set({ verified: true })
      .where(eq(patients.id, user.id));

    await db.delete(otpTable).where(eq(otpTable.patientId, user.id));

    return HandleResponse(res, true, 200, "Email verified successfully");
  } catch (error) {
    next(error);
  }
}

export async function VerifyForgotPasswordOtp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, otp } = req.body;
console.log("VerifyForgotPasswordOtp called");
    const user = (
      await db
        .select()
        .from(patients)
        .where(eq(patients.email, email.toLowerCase()))
    )[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    const record = (
      await db
        .select()
        .from(otpTable)
        .where(
          and(
            eq(otpTable.patientId, user.id),
            eq(otpTable.type, OTP_TYPE_RESET),
          ),
        )
        .orderBy(desc(otpTable.createdAt))
        .limit(1)
    )[0];

    if (!record) {
      return HandleResponse(res, false, 404, "OTP not found");
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return HandleResponse(res, false, 400, "OTP expired");
    }

    const hashedOtp = hmacProcess(
      otp,
      process.env.HMAC_VERIFICATION_CODE_SECRET!,
    );

    if (hashedOtp !== record.otp) {
      return HandleResponse(res, false, 400, "Invalid OTP");
    }


// const hashedOtp = hmacProcess(
//   otp,
//   process.env.HMAC_VERIFICATION_CODE_SECRET!,
// );


    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    await db.delete(otpTable).where(eq(otpTable.id, record.id));

    return HandleResponse(
      res,
      true,
      200,
      "OTP verified",
      { resetToken },
    );
  } catch (error) {
    next(error);
  }
}
//  RESET PASSWORD
export async function ResetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return HandleResponse(res, false, 400, "Passwords do not match");
    }

    let decoded: any;

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string);
    } catch {
      return HandleResponse(res, false, 400, "Invalid or expired reset token");
    }

    const hashedPassword = await argon2.hash(newPassword);

    await db
      .update(patients)
      .set({ password: hashedPassword })
      .where(eq(patients.id, decoded.id));

    await db.delete(otpTable).where(eq(otpTable.patientId, decoded.id));

    return HandleResponse(res, true, 200, "Password reset successful");
  } catch (error) {
    next(error);
  }
}
