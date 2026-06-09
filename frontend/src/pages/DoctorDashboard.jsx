import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptAppointment,
  rejectAppointment,
  getDoctorAppointment,
  cancelAppointment,
} from "../util/auth";
import {
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Calendar,
  Activity,
  //   Timer,
  Luggage,
} from "lucide-react";
import { formatDateTime } from "../util/createdAt";
import { formatAppointment } from "../util/formatedateTime";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import ProfileWelcome from "../components/ProfileWelcome";

function DoctorDashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["doctor-appointments", debouncedSearch],
    queryFn: () => getDoctorAppointment(debouncedSearch),
  });
  const acceptMutation = useMutation({
    mutationFn: acceptAppointment,
    onSuccess: () => {
      toast.success("Appointment accepted");
      queryClient.invalidateQueries(["doctor-appointments"]);
      queryClient.invalidateQueries(["patient-history"]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAppointment,
    onSuccess: () => {
      toast.success("Appointment rejected");
      queryClient.invalidateQueries(["doctor-appointments"]);
      queryClient.invalidateQueries(["patient-history"]);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries(["doctor-appointments"]);
      queryClient.invalidateQueries(["patient-history"]);
    },
  });

  const [openId, setOpenId] = useState(null);

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading appointments...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        {error.message}
        <button
          onClick={refetch}
          className="ml-3 px-3 py-1 bg-black text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  const appointments = data?.data || [];
  console.log("patinet det", appointments);
  const toggleDropdown = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-6 bg-white rounded border border-slate-200">
      <ProfileWelcome />
      <h1 className="text-xl font-bold mb-4">Doctor Appointments</h1>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient name..."
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appt) => {
            const isOpen = openId === appt.id;

            return (
              <div
                key={appt.id}
                className="border border-slate-200 rounded p-4 transition">
                {/* TOP SECTION */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {appt.patientFirstName} {appt.patientsurnameName}
                    </h2>

                    <p className="text-gray-600 flex gap-2 items-center text-sm">
                      <Calendar size={16} />
                      {formatAppointment(appt.date, appt.time)}
                    </p>
                    {/* <p className="text-gray-600 flex gap-2 items-center text-sm">
                      <Timer size={16} /> {appt.time || "No time"}
                    </p> */}
                  </div>

                  <button
                    onClick={() => toggleDropdown(appt.id)}
                    className="p-1 hover:bg-gray-100 rounded">
                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>

                {/* SYMPTOMS */}
                <p className="text-gray-600 text-sm flex gap-2 items-center mt-2">
                  <Luggage size={16} /> {appt.patientAge || "No symptoms"}
                </p>

                {/* STATUS */}
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                    appt.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : appt.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : appt.status === "cancelled"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                  }`}>
                  {appt.status || "pending"}
                </span>
                {/* ACTION BUTTONS */}
                <div className="flex gap-2 mt-3">
                  {appt.status === "pending" && (
                    <>
                      <button
                        onClick={() => acceptMutation.mutate(appt.id)}
                        className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700">
                        Accept
                      </button>

                      <button
                        onClick={() => rejectMutation.mutate(appt.id)}
                        className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">
                        Reject
                      </button>
                    </>
                  )}

                  {appt.status === "accepted" && (
                    <button
                      onClick={() => cancelMutation.mutate(appt.id)}
                      className="px-3 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-800">
                      Cancel
                    </button>
                  )}
                </div>
                {/* DROPDOWN PATIENT DETAILS */}
                {isOpen && (
                  <div className="mt-4 border-t pt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>ID: {appt.patientId}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Sex: {appt.patientSex}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{appt.patientPhone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Activity size={16} />
                      <span>Symptoms: {appt.symptoms}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        Time he/she make the post :{" "}
                        {formatDateTime(appt.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
