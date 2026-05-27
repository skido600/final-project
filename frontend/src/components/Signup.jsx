import { Link } from "react-router-dom";
import { User, Mail, Lock, Phone, Cake } from "lucide-react";

function Signup() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md  md:max-h-none max-h-[80vh] overflow-y-auto md:bg-white md:border rounded-xl border-slate-200 md:p-8 p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>

          <p className="text-slate-500 mt-2">Join MediCare Patient Portal</p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Firstname + Surname */}
          <div className="grid ">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Firstname
              </label>

              <div className="relative mt-2">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="John"
                  className="w-full border border-slate-300 rounded-xl pl-11 pr-5 py-2 mb-4 outline-none "
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Surname
              </label>

              <div className="relative mt-2">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full border border-slate-300 rounded-xl pl-11 pr-5 py-2   outline-none "
                />
              </div>
            </div>
          </div>

          {/* Age + Sex */}
          <div className="grid ">
            <div>
              <label className="text-sm font-medium text-slate-700">Age</label>

              <div className="relative mt-2">
                <Cake className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

                <input
                  type="number"
                  placeholder="22"
                  className="w-full border border-slate-300 rounded-xl pl-11 pr-5 py-2  outline-none "
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Sex</label>

              <select className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select Sex</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <div className="relative mt-2">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                type="tel"
                placeholder="+234..."
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                type="email"
                placeholder="johndoe@gmail.com"
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

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground  transition text-white font-medium py-2 rounded-xl">
            Create Account
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
    </div>
  );
}

export default Signup;
