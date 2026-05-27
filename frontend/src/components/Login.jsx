import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

function Login() {
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
        <form className="space-y-5">
          {/* Email or Phone */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Email or Phone Number
            </label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                type="text"
                placeholder="johndoe@gmail.com or +234..."
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none "
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground transition text-white font-medium py-2 rounded-xl">
            Login
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
    </div>
  );
}

export default Login;
