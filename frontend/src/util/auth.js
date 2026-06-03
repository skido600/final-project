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
console.log((data,"forgetpass"));

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
