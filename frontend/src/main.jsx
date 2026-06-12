import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import PatientLayout from "./layout/PatientLayout.jsx";

import BookAppointment from "./pages/BookAppointment.jsx";

import SymptomChecker from "./pages/SymptomChecker.jsx";
import Signup from "./components/Signup.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoleDashboard from "./pages/RoleDashboard.jsx";
import ProtectedRoute from "../helper/protectedRoute.jsx";

const queryClient = new QueryClient();
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
    element: <ProtectedRoute />,
    children: [
      {
        element: <PatientLayout />,
        children: [
          {
            path: "/dashboard",
            element: <RoleDashboard />,
          },
          {
            path: "/book-appointment",
            element: <BookAppointment />,
          },
          {
            path: "/symptom-checker",
            element: <SymptomChecker />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </StrictMode>
  </QueryClientProvider>,
);
