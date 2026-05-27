import { eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../configs/db.ts";
import { patients } from "../db/schema.ts";
import { HandleResponse } from "../util/response.ts";
import type { PatientType } from "../types/index.ts";
import argon2 from "argon2";
import STMPservice from "../util/sendEmail.ts";
import { Otpcode, hmacProcess } from "../util/generetaOtp.ts";
import { otpTable } from "../db/schema.ts";
export async function Signup(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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

    const users = await db
      .select()
      .from(patients)
      .where(eq(patients.email, normalizedEmail));

    const user = users[0];

    if (user) {
      return HandleResponse(res, false, 409, "User already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const otp = Otpcode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const savedUsers = await db
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

    const savedUser = savedUsers[0];

    if (!savedUser) {
      return HandleResponse(res, false, 500, "Failed to create user");
    }

    const secret = process.env.HMAC_VERIFICATION_CODE_SECRET!;
    const hashedCode = hmacProcess(otp, secret);

    await db.insert(otpTable).values({
      patientId: savedUser.id,
      otp: hashedCode,
      expiresAt,
    });

    await STMPservice.SendingOtp(firstName, surname, normalizedEmail, otp);

    return HandleResponse(
      res,
      true,
      201,
      "Account created. OTP sent to email.",
    );
  } catch (error) {
    next(error);
  }
}

export async function Login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    const users = await db
      .select()
      .from(patients)
      .where(eq(patients.email, normalizedEmail));

    const user = users[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    // ❌ not verified → block login
    if (!user.verified) {
      const otpRecord = await db
        .select()
        .from(otpTable)
        .where(eq(otpTable.patientId, user.id));

      const record = otpRecord[0];

      const otp = Otpcode();
      const secret = process.env.HMAC_VERIFICATION_CODE_SECRET!;
      const hashedOtp = hmacProcess(otp, secret);

      // 🔁 if no record OR expired → resend new OTP
      if (!record || new Date() > record.expiresAt) {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // delete old OTP
        await db.delete(otpTable).where(eq(otpTable.patientId, user.id));

        // save new OTP
        await db.insert(otpTable).values({
          patientId: user.id,
          otp: hashedOtp,
          expiresAt,
        });

        await STMPservice.SendingOtp(
          user.firstName,
          user.surname,
          user.email,
          otp,
        );

        return HandleResponse(
          res,
          false,
          403,
          "Account not verified. New OTP sent to email.",
        );
      }

      // ⏳ OTP still valid
      return HandleResponse(
        res,
        false,
        403,
        "Account not verified. Check your email and enter OTP.",
      );
    }

    // 🔐 password check
    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return HandleResponse(res, false, 400, "Invalid credentials");
    }

    // 🎟️ generate token
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

    return HandleResponse(res, true, 200, "Login successful", {
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function ForgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase();

    const users = await db
      .select()
      .from(patients)
      .where(eq(patients.email, normalizedEmail));

    const user = users[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    const otp = Otpcode();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const secret = process.env.HMAC_VERIFICATION_CODE_SECRET!;
    const hashedOtp = hmacProcess(otp, secret);

    await db.insert(otpTable).values({
      patientId: user.id,
      otp: hashedOtp,
      expiresAt,
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

export async function VerifyResetOtp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = email.toLowerCase();

    const users = await db
      .select()
      .from(patients)
      .where(eq(patients.email, normalizedEmail));

    const user = users[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    const otpRecord = await db
      .select()
      .from(otpTable)
      .where(eq(otpTable.patientId, user.id));

    const record = otpRecord[0];

    if (!record) {
      return HandleResponse(res, false, 404, "OTP not found");
    }

    if (new Date() > record.expiresAt) {
      return HandleResponse(res, false, 400, "OTP expired");
    }

    const secret = process.env.HMAC_VERIFICATION_CODE_SECRET!;
    const hashedOtp = hmacProcess(otp, secret);

    if (hashedOtp !== record.otp) {
      return HandleResponse(res, false, 400, "Invalid OTP");
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "10m" },
    );

    return HandleResponse(res, true, 200, "OTP verified", {
      resetToken,
    });
  } catch (error) {
    next(error);
  }
}
export async function VerifyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = email.toLowerCase();

    const users = await db
      .select()
      .from(patients)
      .where(eq(patients.email, normalizedEmail));

    const user = users[0];

    if (!user) {
      return HandleResponse(res, false, 404, "User not found");
    }

    const otpRecord = await db
      .select()
      .from(otpTable)
      .where(eq(otpTable.patientId, user.id));

    const record = otpRecord[0];

    if (!record) {
      return HandleResponse(res, false, 404, "OTP not found");
    }

    if (new Date() > record.expiresAt) {
      return HandleResponse(res, false, 400, "OTP expired");
    }

    const secret = process.env.HMAC_VERIFICATION_CODE_SECRET!;
    const hashedOtp = hmacProcess(otp, secret);

    if (hashedOtp !== record.otp) {
      return HandleResponse(res, false, 400, "Invalid OTP");
    }

    //  ACTIVATE USER HERE
    await db
      .update(patients)
      .set({ verified: true })
      .where(eq(patients.id, user.id));

    // delete otp after success
    await db.delete(otpTable).where(eq(otpTable.patientId, user.id));

    return HandleResponse(res, true, 200, "Email verified successfully");
  } catch (error) {
    next(error);
  }
}
export async function ResetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    // 1. check passwords match
    if (newPassword !== confirmPassword) {
      return HandleResponse(res, false, 400, "Passwords do not match");
    }

    // 2. verify token
    const decoded = jwt.verify(
      resetToken,
      process.env.JWT_SECRET as string,
    ) as any;

    const userId = decoded.id;

    // 3. hash password
    const hashedPassword = await argon2.hash(newPassword);

    // 4. update password
    await db
      .update(patients)
      .set({ password: hashedPassword })
      .where(eq(patients.id, userId));

    // 5. delete OTPs
    await db.delete(otpTable).where(eq(otpTable.patientId, userId));

    return HandleResponse(res, true, 200, "Password reset successful");
  } catch (error) {
    next(error);
  }
}
