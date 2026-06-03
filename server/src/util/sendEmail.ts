import { Resend } from "resend";
import { otpTemplate } from "./Template/OtpTemplate.ts";
import { forgetPasswordTemplate } from "./Template/Forgetpass.ts";
import { doctorLoginTemplate } from "./Template/doctorTemp.ts";

class STMPservice {
  private static EMAIL_API_URL = "https://emailsender-theta.vercel.app";
  private static resend = new Resend(process.env.RESEND_API_KEY);
  public static async SendingOtp(
    firstName: string,
    surname: string,
    email: string,
    otpCode: string,
  ) {
    try {
      const fullname = `${firstName} ${surname}`;
      let htmlContent = otpTemplate;
      htmlContent = htmlContent
        .replace(/{{otp_code}}/g, otpCode)
        .replace(/{{email}}/g, fullname)
        .replace(/{{year}}/g, new Date().getFullYear().toString())
        .replace(/{{company_name}}/g, "MediCare");
      console.log("Resend works");
      // Send OTP via your API
      const response = await fetch(`${this.EMAIL_API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Your OTP Code - MediCare",
          html: htmlContent,
        }),
      });
      // const result = await this.resend.emails.send({
      //   from: "MediCare <noreply@medicare.com>",
      //   to: email,
      //   subject: "Your OTP Code - MediCare ",
      //   html: htmlContent,
      // });
      console.log("Resend result:", response);
      // const data = await response.json();
      // console.log("OTP API response:", data);
      return response;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }
  public static async SendingForgetPasswordOtp(
    firstName: string,
    surname: string,
    email: string,
    otpCode: string,
  ) {
    try {
      const fullname = `${firstName} ${surname}`;

      let htmlContent = forgetPasswordTemplate;

      htmlContent = htmlContent
        .replace(/{{otp_code}}/g, otpCode)
        .replace(/{{email}}/g, fullname)
        .replace(/{{year}}/g, new Date().getFullYear().toString())
        .replace(/{{company_name}}/g, "MediCare");

      console.log("Sending forget password OTP...");

      // const result = await this.resend.emails.send({
      //   from: "MediCare <noreply@medicare.com>",
      //   to: email,
      //   subject: "Reset Password OTP - MediCare",
      //   html: htmlContent,
      // });
      const response = await fetch(`${this.EMAIL_API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Your OTP Code - MediCare",
          html: htmlContent,
        }),
      });
      console.log("Resend result: g forget password OTP", response);
      return response;
    } catch (error) {
      console.error("Error sending forget password OTP:", error);
      throw error;
    }
  }
  public static async SendDoctorLogin(
    firstName: string,
    surname: string,
    email: string,
    password: string,
  ) {
    try {
      const fullName = `${firstName} ${surname}`;

      let htmlContent = doctorLoginTemplate;

      htmlContent = htmlContent
        .replace(/{{name}}/g, fullName)
        .replace(/{{email}}/g, email)
        .replace(/{{password}}/g, password);

      const response = await fetch(`${this.EMAIL_API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Your Doctor Account - MediCare",
          html: htmlContent,
        }),
      });

      console.log("Doctor email sent:", response);

      return response;
    } catch (error) {
      console.error("Error sending doctor email:", error);
      throw error;
    }
  }
}

export default STMPservice;
