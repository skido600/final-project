import { User, Mail, VenusAndMars } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// you will create this API
import { createDoctor } from "../util/auth";

function CreateDoctor() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      toast.success("Doctor created successfully");
      reset();

      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create doctor");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6 mb-2">
      {/* HEADER (same style as BookAppointment) */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Create Doctor</h1>

        <p className="text-slate-500 mt-2">Add a new doctor to the system.</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm border mb-3 border-slate-200 p-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              First Name
            </label>

            <div className="relative mt-2">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("firstName", { required: true })}
                placeholder="First name"
                className="w-full border border-slate-300 rounded-xl pl-11 py-3"
              />
            </div>

            {errors.firstName && (
              <p className="text-red-500 text-sm">First name is required</p>
            )}
          </div>

          {/* Surname */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Surname
            </label>

            <div className="relative mt-2">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                {...register("surname", { required: true })}
                placeholder="Surname"
                className="w-full border border-slate-300 rounded-xl pl-11 py-3"
              />
            </div>

            {errors.surname && (
              <p className="text-red-500 text-sm">Surname is required</p>
            )}
          </div>

          {/* Sex */}
          <div>
            <label className="text-sm font-medium text-slate-700">Sex</label>

            <div className="relative mt-2">
              <VenusAndMars className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <select
                {...register("sex", { required: true })}
                className="w-full border border-slate-300 rounded-xl pl-11 py-3">
                <option value="">Select sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {errors.sex && (
              <p className="text-red-500 text-sm">Sex is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="doctor@email.com"
                className="w-full border border-slate-300 rounded-xl pl-11 py-3"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm">Email is required</p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            disabled={mutation.isPending}
            type="submit"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-sidebar-primary text-white font-medium py-3 rounded-xl">
            {mutation.isPending ? "Creating Doctor..." : "Create Doctor"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateDoctor;
