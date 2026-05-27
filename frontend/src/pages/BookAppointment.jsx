import { CalendarDays, Clock, User, FileText } from "lucide-react";

function BookAppointment() {
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
        <form className="space-y-5">
          {/* Doctor */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Select Doctor
            </label>

            <div className="relative mt-2">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <select className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                <option>Choose Doctor</option>
                <option>Dr. John Doe</option>
                <option>Dr. Sarah Smith</option>
              </select>
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
                type="date"
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Appointment Time
            </label>

            <div className="relative mt-2">
              <Clock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                type="time"
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
                placeholder="Describe your symptoms..."
                className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-sidebar-primary text-sidebar-primary-foreground transition text-white font-medium py-3 rounded-xl">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
