import { CalendarDays, Clock, User, FileText } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { bookAppointment, getDoctors } from "../util/auth";
import toast from "react-hot-toast";

function BookAppointment() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // GET DOCTORS (dropdown)
  const { data, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const doctors = data?.doctors || [];
  console.log("doctors", doctors);
  // BOOK APPOINTMENT
  const mutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      toast.success("Appointment booked successfully");
      reset();

      queryClient.invalidateQueries({
        queryKey: ["doctor-appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["doctors"],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-history"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-stats"],
      });
    },
    onError: (err) => {
      toast.error(err.message || "Error booking appointment");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <div className="space-y-6 mb-2">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Book Appointment</h1>

        <p className="text-slate-500 mt-2">
          Schedule an appointment with a doctor.
        </p>
      </div>

      {/* Appointment Form */}
      <div className="bg-white rounded-2xl shadow-sm border mb-3 border-slate-200 p-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Doctor */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Select Doctor
            </label>

            <div className="relative mt-2">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <select
                {...register("doctorId", { required: true })}
                className="w-full border border-slate-300 rounded-xl pl-11 py-3">
                <option value="">Choose Doctor</option>

                {isLoading ? (
                  <option>Loading doctors...</option>
                ) : (
                  doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.firstName} {doc.surname}
                    </option>
                  ))
                )}
              </select>

              {errors.doctorId && (
                <p className="text-red-500 text-sm">Doctor is required</p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Appointment Date
            </label>

            <div className="relative mt-2">
              <CalendarDays className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("date", { required: true })}
                type="date"
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.date && (
              <p className="text-red-500 text-sm">Date is required</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Appointment Time
            </label>

            <div className="relative mt-2">
              <Clock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("time", { required: true })}
                type="time"
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.time && (
              <p className="text-red-500 text-sm">Time is required</p>
            )}
          </div>

          {/* Symptoms */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Symptoms / Notes
            </label>

            <div className="relative mt-2">
              <FileText className="absolute left-3 top-4 w-5 h-5 text-slate-400" />

              <textarea
                rows={5}
                {...register("symptoms", {
                  validate: (value) => {
                    if (!value) return "Symptoms is required";

                    const length = value.trim().length;

                    if (length < 8) {
                      return "Symptoms must be at least 8 characters";
                    }

                    if (length > 500) {
                      return "Symptoms must not exceed 500 characters";
                    }

                    return true;
                  },
                })}
                placeholder="Describe your symptoms..."
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            {errors.symptoms && (
              <p className="text-red-500 text-sm">Symptoms required</p>
            )}
          </div>

          {/* Submit */}
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-sidebar-primary text-sidebar-primary-foreground transition text-white font-medium py-3 rounded-xl">
            {mutation.isPending
              ? "Booking Appointment...."
              : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
