import { Resend } from "resend";
import { otpTemplate } from "./Template/OtpTemplate.ts";
import { forgetPasswordTemplate } from "./Template/Forgetpass.ts";

class STMPservice {
  // private static EMAIL_API_URL = "https://emailsender-theta.vercel.app";
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
      // const response = await fetch(`${this.EMAIL_API_URL}/send-email`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     to: email,
      //     subject: "Your OTP Code - Raphmaths Estate",
      //     html: htmlContent,
      //   }),
      // });
      const result = await this.resend.emails.send({
        from: "MediCare <onboarding@resend.dev>",
        to: email,
        subject: "Your OTP Code - MediCare ",
        html: htmlContent,
      });

      // const data = await response.json();
      // console.log("OTP API response:", data);
      return result;
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

      const result = await this.resend.emails.send({
        from: "MediCare <onboarding@resend.dev>",
        to: email,
        subject: "Reset Password OTP - MediCare",
        html: htmlContent,
      });

      return result;
    } catch (error) {
      console.error("Error sending forget password OTP:", error);
      throw error;
    }
  }
}

export default STMPservice;
