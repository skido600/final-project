// import { decodeToken } from "./decodeToken";
import { getUserRole } from "./decode";
import { logout } from "./logout";

export const isTokenValid = () => {
  const decoded = getUserRole();
  if (!decoded) return false;

  const currentTime = Date.now() / 1000;

  if (decoded.exp && decoded.exp < currentTime) {
    logout(); // auto logout
    return false;
  }

  return true;
};
