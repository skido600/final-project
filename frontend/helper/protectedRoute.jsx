import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../src/util/isTokenValid";

const ProtectedRoute = () => {
  const valid = isTokenValid();

  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
