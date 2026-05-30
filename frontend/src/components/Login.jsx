import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  forgotPassword,
  LoginData,
  verifyResetOtp,
  resetPassword,
} from "../util/auth";
import { useState } from "react";

function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await LoginData(data);

      toast.success(result.message);

      console.log(result);
      reset();
      // navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);

      const result = await forgotPassword(email);

      toast.success(result.message);

      setStep(2);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSendingOtp(false);
    }
  };
  const handleVerifyOtp = async () => {
    try {
      setVerifyingOtp(true);

      const result = await verifyResetOtp(email, otp);

      setResetToken(result.resetToken);

      toast.success("OTP verified");

      setStep(3);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifyingOtp(false);
    }
  };
  const handleResetPassword = async () => {
    try {
      setResettingPassword(true);

      const result = await resetPassword(resetToken, newPassword);

      toast.success(result.message);

      setShowForgotModal(false);

      setStep(1);
      setEmail("");
      setOtp("");
      setResetToken("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setResettingPassword(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md md:max-h-none max-h-[80vh] overflow-y-auto md:bg-white md:border rounded-xl border-slate-200 md:p-8 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>

          <p className="text-slate-500 mt-2">
            Login to MediCare Patient Portal
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email or Phone */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Email or Phone Number
            </label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("email", {
                  required: "Email is required",
                })}
                type="text"
                placeholder="johndoe@gmail.com or +234..."
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none "
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("password", {
                  required: "Password is required",
                })}
                type="password"
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none "
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <p
              onClick={() => setShowForgotModal(true)}
              // to="/forgot-password"
              className="text-sm text-blue-600 cursor-pointer hover:underline">
              Forgot Password?
            </p>
          </div>

          {/* Button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full disabled:cursor-not-allowed disabled:opacity-15 bg-sidebar-primary text-sidebar-primary-foreground transition text-white font-medium py-2 rounded-xl">
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setStep(1);
              }}
              className="float-right text-gray-500">
              ✕
            </button>

            {step === 1 && (
              <>
                <h2 className="text-xl font-bold mb-4">Reset Password</h2>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full border rounded-lg p-3"
                />

                <button
                  disabled={sendingOtp}
                  onClick={handleSendOtp}
                  className="w-full mt-4 bg-sidebar-primary text-sidebar-primary-foreground py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-bold mb-4">Verify OTP</h2>

                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full border rounded-lg p-3"
                />

                <button
                  disabled={verifyingOtp}
                  onClick={handleVerifyOtp}
                  className="w-full mt-4 bg-sidebar-primary text-sidebar-primary-foreground py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-bold mb-4">New Password</h2>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full border rounded-lg p-3"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full border rounded-lg p-3"
                />

                <button
                  disabled={resettingPassword}
                  onClick={handleResetPassword}
                  className="w-full mt-4 bg-sidebar-primary text-sidebar-primary-foreground text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {resettingPassword ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
