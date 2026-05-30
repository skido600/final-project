import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import PatientLayout from "./layout/PatientLayout.jsx";
import Appointments from "./pages/Appointments.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import SymptomChecker from "./pages/SymptomChecker.jsx";
import Signup from "./components/Signup.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: <PatientLayout />,
    children: [
      {
        path: "/dashboard",
        element: <PatientDashboard />,
      },
      {
        path: "/book-appointment",
        element: <BookAppointment />,
      },
      {
        path: "/symptom-checker",
        element: <SymptomChecker />,
      },
      {
        path: "/appointments",
        element: <Appointments />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </StrictMode>,
);
