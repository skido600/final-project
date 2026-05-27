import express from "express";
import type { Router } from "express";
import {
  Signup,
  Login,
  ForgotPassword,
  VerifyResetOtp,
  ResetPassword,
  VerifyEmail,
} from "../controllers/user_controller.ts";
import { validate } from "../middleware/zodmiddleware.ts";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.ts";

const authroute: Router = express.Router();

// signup
authroute.post("/signup", validate(signupSchema), Signup);

// login
authroute.post("/login", validate(loginSchema), Login);

// forgot password
authroute.post(
  "/forgetpassword",
  validate(forgotPasswordSchema),
  ForgotPassword,
);

// verify OTP code
authroute.post("/verifycode", validate(verifyOtpSchema), VerifyResetOtp);
// verify OTP code
authroute.post("/verifyemail", validate(verifyOtpSchema), VerifyEmail);
// reset password
authroute.put("/resetpassword", validate(resetPasswordSchema), ResetPassword);
export default authroute;
