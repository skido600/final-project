import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import AdminDashboard from "./AdminDashboard";
import { getUserRole } from "../util/decode";

export default function RoleDashboard() {
  const role = getUserRole()?.role;

  if (role === "doctor") return <DoctorDashboard />;
  if (role === "admin") return <AdminDashboard />;
  return <PatientDashboard />;
}
