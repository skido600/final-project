import CreateDoctor from "../components/CreateDoctor";
import ProfileWelcome from "../components/ProfileWelcome";

function AdminDashboard() {
  return (
    <>
      {" "}
      <ProfileWelcome />
      <CreateDoctor />
    </>
  );
}

export default AdminDashboard;
