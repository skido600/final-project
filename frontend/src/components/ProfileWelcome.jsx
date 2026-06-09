import { useQuery } from "@tanstack/react-query";
import { getDoctorProfile } from "../util/auth";

function ProfileWelcome() {
  const roleColor = {
    doctor: "text-green-600",
    patient: "text-blue-600",
    admin: "text-purple-600",
  };
  const { data, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getDoctorProfile,
  });
  const roleMessage = {
    doctor:
      "Check your patients, manage appointments, and respond to booking requests on time.",
    patient: "Manage your appointments, symptoms, and health records easily.",
    admin:
      "Hello Admin  You can now manage doctors, patients, and system settings.",
  };
  const user = data?.data;

  if (isLoading) {
    return <div className="h-16 bg-slate-100 animate-pulse rounded mb-4" />;
  }

  return (
    <div className="mb-4 bg-gradient-to-r from-green-50 to-white border border-green-100 rounded p-4">
      <h1 className="text-sm font-bold text-slate-800">
        Welcome back,{" "}
        <span className={roleColor[user?.role] || "text-slate-500"}>
          {user?.role}
        </span>{" "}
        {user?.firstName} {user?.surname}
      </h1>

      <p className="text-slate-500 text-sm mt-1">
        {roleMessage[user?.role] || "Welcome to your dashboard."}
      </p>
    </div>
  );
}

export default ProfileWelcome;
