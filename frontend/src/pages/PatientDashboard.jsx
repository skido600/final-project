import {

  Stethoscope,
  Clock,

  Handshake,
} from "lucide-react";

function PatientDashboard() {
  const patientName = "Leo";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded p-4  border border-slate-200">
        <h1 className="text-xl flex items-center font-bold text-slate-800">
          Welcome back, {patientName} <Handshake className="text-" />
        </h1>

        <p className="text-slate-500 text-sm mt-2">
          Manage your appointments, symptoms, and health records easily.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* <div className="bg-white rounded p-5  border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Appointments</p>

              <h2 className="text-3xl font-bold mt-2 text-slate-800">4</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="text-blue-600" />
            </div>
          </div>
        </div> */}

        <div className="bg-white rounded p-5  border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">AI Checks</p>

              <h2 className="text-xl font-bold mt-2 text-slate-800">2</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Stethoscope className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded p-5  border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Pending Visits</p>

              <h2 className="text-xl font-bold mt-2 text-slate-800">1</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Clock className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="bg-white rounded p-6  border border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Upcoming Appointment
          </h2>
        </div>

        <div className="mt-5 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-800">Dr. John Doe</h3>

              <p className="text-slate-500 mt-1">General Physician</p>
            </div>

            <div>
              <p className="text-slate-700 font-medium">May 25, 2026</p>

              <p className="text-slate-500 text-sm">10:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="bg-white rounded-2xl p-6  border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent AI Health Suggestion
        </h2>

        <div className="mt-4 p-5 rounded-xl bg-green-50 border border-green-200">
          <p className="text-slate-700">
            Based on your last symptoms, possible conditions may include:
          </p>

          <ul className="mt-3 list-disc list-inside text-slate-600">
            <li>Malaria</li>
            <li>Flu</li>
          </ul>

          <p className="mt-4 text-sm text-slate-500">
            This AI suggestion is not a final diagnosis. Please consult a
            doctor.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
