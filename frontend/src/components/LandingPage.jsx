import { Link } from "react-router-dom";
import { Stethoscope, Brain, Calendar, Shield } from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <div className="text-center px-6 py-20 bg-linear-to-r from-green-50 to-blue-50">
        <div className="flex justify-center mb-4">
          <Stethoscope className="w-12 h-12 text-sidebar-primary" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          MediCare AI Health System
        </h1>

        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          A smart healthcare platform that connects patients and doctors,
          provides AI-powered symptom checking, appointment booking, and medical
          history tracking.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-sidebar-primary text-sidebar-primary-foreground text-white px-6 py-3 rounded-xl">
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-slate-300 px-6 py-3 rounded-xl">
            Login
          </Link>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border">
          <Brain className="text-blue-600 w-8 h-8" />
          <h2 className="font-semibold text-lg mt-3">AI Symptom Checker</h2>
          <p className="text-slate-600 mt-2">
            Get instant AI-based health suggestions based on your symptoms.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <Calendar className="text-orange-600 w-8 h-8" />
          <h2 className="font-semibold text-lg mt-3">Appointments</h2>
          <p className="text-slate-600 mt-2">
            Book and manage doctor appointments easily with real-time status.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <Shield className="text-green-600 w-8 h-8" />
          <h2 className="font-semibold text-lg mt-3">Secure System</h2>
          <p className="text-slate-600 mt-2">
            Role-based system (Patient, Doctor, Admin) with JWT authentication.
          </p>
        </div>
      </div>

      {/* ABOUT SYSTEM */}
      <div className="bg-white py-16 px-6 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            What this system does
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            This platform allows patients to check symptoms using AI, book
            appointments with doctors, and track their medical history. Doctors
            can manage appointments and respond to patients. Admin manages the
            system securely.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center py-6 text-slate-500 text-sm">
        © {new Date().getFullYear()} MediCare AI. Built with React + Node.js
      </div>
    </div>
  );
}

export default LandingPage;
