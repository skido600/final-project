import { Stethoscope, Clock } from "lucide-react";

import { useState } from "react";
import { formatDateTime } from "../util/createdAt";
import { Signature, BanknoteX } from "lucide-react";
import { formatAppointment } from "../util/formatedateTime";
import { usePatientDashboard } from "../hooks/usePatientDashboard";
import AIhistory from "../components/AIhistory";
import ProfileWelcome from "../components/ProfileWelcome";
import { statusConfig } from "../util/ststus";
// statusConfig
function PatientDashboard() {
  const [openId, setOpenId] = useState(null);

  const { history, stats, historyLoading, statsLoading } =
    usePatientDashboard();
  console.log("history check", history);
  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };
  function StatusBadge({ status }) {
    const config = statusConfig[status] || {
      label: status,
      className: "bg-slate-100 text-slate-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs border ${config.className}`}>
        {config.label}
      </span>
    );
  }
  if (historyLoading || statsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* ===== WELCOME SECTION ===== */}
        <div className="bg-white rounded p-4 border border-slate-200">
          <div className="h-6 w-48 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-80 bg-slate-200 rounded" />
        </div>

        {/* ===== STATS SECTION ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded p-5 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
                  <div className="h-6 w-12 bg-slate-200 rounded" />
                </div>

                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* ===== HISTORY SECTION ===== */}
        <div className="bg-white rounded p-6 border border-slate-200">
          <div className="h-6 w-40 bg-slate-200 rounded mb-4" />

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mt-5 p-5 rounded-xl bg-slate-50 border border-slate-200">
              {/* top row */}
              <div className="flex justify-between">
                <div>
                  <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>

                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>

              {/* status */}
              <div className="h-3 w-24 bg-slate-200 rounded mt-3" />
            </div>
          ))}
        </div>

        {/* ===== AI SECTION ===== */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="h-6 w-60 bg-slate-200 rounded mb-4" />

          <div className="p-5 rounded-xl bg-slate-100 border border-slate-200">
            <div className="h-3 w-full bg-slate-200 rounded mb-2" />
            <div className="h-3 w-5/6 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-4/6 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <ProfileWelcome />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded p-5  border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">AI Checks</p>

              <h2 className="text-xl font-bold mt-2 text-slate-800">
                {statsLoading ? "..." : stats?.totalAiChecks}
              </h2>
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

              <h2 className="text-xl font-bold mt-2 text-slate-800">
                {statsLoading ? "..." : stats?.pendingAppointments}
              </h2>
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
            Appointment History
          </h2>
        </div>

        {history.length === 0 ? (
          <p className="text-slate-500 mt-4">No appointment history</p>
        ) : (
          history.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="mt-5 p-5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer"
                onClick={() => toggle(item.id)}>
                {/* MAIN VIEW (UNCHANGED UI STYLE) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Dr. {item.doctorFirstName} {item.doctorSurname}
                    </h3>

                    <p className="text-slate-500 mt-1">General Physician</p>
                  </div>

                  <div>
                    <p className="text-slate-700 font-medium text-sm mb-2">
                      {formatAppointment(item.date, item.time)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
                {/* DROPDOWN (only shows on click) */}
                {isOpen && (
                  <div className="mt-4 border-t pt-3 text-sm text-slate-600 space-y-1">
                    {item.status === "rejected" && (
                      <p className="text-red-600 flex gap-2 items-center font-medium">
                        <BanknoteX size={14} /> Your appointment was rejected by
                        the doctor.
                      </p>
                    )}

                    {item.status === "cancelled" && (
                      <p className="text-gray-500 font-medium opacity-70">
                        ⚠️ Your appointment has been cancelled by Dr.{" "}
                        {item.doctorFirstName}.
                      </p>
                    )}

                    {item.status === "accepted" && (
                      <p className="text-green-600  gap-2 flex items-center font-medium">
                        <Signature size={14} /> Your appointment has been
                        scheduled successfully.
                      </p>
                    )}
                    <p>
                      <b>Symptoms:</b> {item.symptoms}
                    </p>
                    <p>
                      <b>Booked On:</b> {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI Suggestion */}
      <AIhistory />
    </div>
  );
}

export default PatientDashboard;
