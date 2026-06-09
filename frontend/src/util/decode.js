import { getToken } from "./getToken";

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    console.log("decoded", decoded);
    return decoded;
  } catch (error) {
    return error;
  }
};
