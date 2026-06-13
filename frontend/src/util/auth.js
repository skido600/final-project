import { getToken } from "./getToken";

const API_URL = import.meta.env.VITE_API_URL;

export async function SignupData(dataMain) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dataMain),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Verification failed");
  }

  return data;
}

export async function LoginData(dataMain) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dataMain),
  });

  const data = await res.json();
  console.log("login data check", res);
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Verification failed");
  }

  return data;
}

export async function verifyOtp(dataMain) {
  const res = await fetch(`${API_URL}/api/auth/verifyemail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataMain),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
}
export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/forgetpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  console.log((data, "forgetpass"));

  if (!res.ok || !data.success) {
    throw new Error(data.message);
  }

  return data;
}

export async function verifyResetOtp(email, otp) {
  const res = await fetch(`${API_URL}/api/auth/verifycode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message);
  }

  return data;
}

export async function resetPassword(resetToken, newPassword, confirmPassword) {
  const res = await fetch(`${API_URL}/api/auth/resetpassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resetToken,
      newPassword,
      confirmPassword,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message);
  }

  return data;
}
export const getDoctors = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/doctor/doctors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
};

export const bookAppointment = async (data) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/doctor/book-appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Booking failed");
  }

  return result;
};
export const getDoctorAppointment = async (search = "") => {
  const token = getToken();

  const res = await fetch(
    `${API_URL}/api/doctor/doctor-appointments?search=${encodeURIComponent(search)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
};

export const acceptAppointment = async (appointmentId) => {
  const token = getToken();

  const res = await fetch(
    `${API_URL}/api/doctor/appointments/${appointmentId}/accept`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to accept appointment");
  }

  return data;
};

export const rejectAppointment = async (appointmentId) => {
  const token = getToken();

  const res = await fetch(
    `${API_URL}/api/doctor/appointments/${appointmentId}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to reject appointment");
  }

  return data;
};

export const cancelAppointment = async (appointmentId) => {
  const token = getToken();

  const res = await fetch(
    `${API_URL}/api/doctor/appointments/${appointmentId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to cancel appointment");
  }

  return data;
};

export const getPatientHistory = async () => {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/doctor/patient-history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch history");
  }

  return data;
};

export const getPatientStats = async () => {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/doctor/patient-stat`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch history");
  }

  return data;
};

export const getDoctorProfile = async () => {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/doctor/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch doctor profile");
  }

  return data;
};

export const Aichecker = async (symptoms) => {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/ai/symptom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      symptoms,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch doctor profile");
  }

  return data;
};

export const getAIHistory = async () => {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/ai/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch history");
  }

  return data.data;
};

export const deleteAIHistory = async (id) => {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/ai/history/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete history");
  }
};

export const clearAIHistory = async () => {
  const token = getToken();

  const res = await fetch(`${API_URL}/api/ai/history`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to clear history");
  }

  return data;
};
