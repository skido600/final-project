import { Link } from "react-router-dom";
import { User, Mail, Lock, Phone, Cake } from "lucide-react";
import { useForm } from "react-hook-form";
import { SignupData, verifyOtp } from "../util/auth";
import { useState } from "react";

import toast from "react-hot-toast";
import OtpModel from "./OtpModel";

function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({});
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const onSubmit = async (data) => {
    try {
      const result = await SignupData(data);

      console.log(result);
      toast.success(result.message);

      setEmail(data.email);
      setShowOtp(true);
      reset()
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // auto move next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setVerifying(true);

      const code = otp.join("");

      const result = await verifyOtp({
        email,
        otp: code,
      });

      toast.success(result.message);

      setShowOtp(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifying(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md  md:max-h-none max-h-[80vh] overflow-y-auto md:bg-white md:border rounded-xl border-slate-200 md:p-8 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>

          <p className="text-slate-500 mt-2">Join MediCare Patient Portal</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Firstname + Surname */}
          <div className="grid ">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Firstname
              </label>

              <div className="relative mt-2">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  {...register("firstName", {
                    required: "firstname or Username is required",
                  })}
                  type="text"
                  placeholder="John"
                  className="w-full border border-slate-300 rounded-xl pl-11 pr-5 py-2 mb-4 outline-none "
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Surname
              </label>

              <div className="relative mt-2">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  {...register("surname", {
                    required: "surname or Username is required",
                  })}
                  type="text"
                  placeholder="Doe"
                  className="w-full border border-slate-300 rounded-xl pl-11 pr-5 py-2   outline-none "
                />
              </div>
            </div>
            {errors.surname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.surname.message}
              </p>
            )}
          </div>

          {/* Age + Sex */}
          <div className="grid ">
            <div>
              <label className="text-sm font-medium text-slate-700">Age</label>

              <div className="relative mt-2">
                <Cake className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

                <input
                  {...register("age", {
                    required: "age  is required",
                  })}
                  type="number"
                  placeholder="22"
                  className="w-full border border-slate-300 rounded-xl pl-11 pr-5 py-2  outline-none "
                />
              </div>
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Sex</label>

              <select
                {...register("sex", {
                  required: "sex  is required",
                })}
                className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Sex</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            {errors.sex && (
              <p className="text-red-500 text-sm mt-1">{errors.sex.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <div className="relative mt-2">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("phone", {
                  required: "phone  is required",
                })}
                type="tel"
                placeholder="+234..."
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("email", {
                  required: "email  is required",
                })}
                type="email"
                placeholder="johndoe@gmail.com"
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
                  required: "password  is required",
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

          {/* Button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full disabled:cursor-not-allowed disabled:opacity-15 bg-sidebar-primary text-sidebar-primary-foreground  transition text-white font-medium py-2 rounded-xl">
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
      {showOtp && (
        <OtpModel
          otp={otp}
          verifying={verifying}
          timeLeft={5}
          formatTime={(s) => `${s}s`}
          onChange={handleOtpChange}
          onKeyDown={handleOtpKeyDown}
          onVerify={handleVerifyOtp}
          onClose={() => setShowOtp(false)}
        />
      )}
    </div>
  );
}

export default Signup;
