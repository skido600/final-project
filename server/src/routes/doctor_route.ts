import express from "express";
import type { Router } from "express";
import {
  CreateDoctor,
  BookAppointment,
  GetMyAppointments,
  GetDoctors,
  GetDoctorAppointments,
  AcceptAppointment,
  RejectAppointment,
  CancelAppointment,
  GetPatientDashboardStats,
  GetPatientAppointmentHistory,
  GetDoctorProfile,
} from "../controllers/doctor_controller.ts";
import { AllowRoles } from "../middleware/access.ts";
import {
  createDoctorSchema,
  bookAppointmentSchema,
} from "../validators/doctor.validator.ts";
import { validate } from "../middleware/zodmiddleware.ts";
import { verifyToken } from "../middleware/verifyToken.ts";

const doctorroute: Router = express.Router();

doctorroute.post(
  "/createdoctor",
  verifyToken,
  //   AllowRoles("admin"),
  validate(createDoctorSchema),
  CreateDoctor,
);

doctorroute.post(
  "/book-appointments",

  verifyToken,
  AllowRoles("patient"),
  validate(bookAppointmentSchema),
  BookAppointment,
);

doctorroute.get(
  "/my-appointments",
  verifyToken,
  AllowRoles("patient"),
  GetMyAppointments,
);

doctorroute.get("/doctors", verifyToken, AllowRoles("patient"), GetDoctors);
doctorroute.get("/doctor-appointments", verifyToken, GetDoctorAppointments);

doctorroute.patch(
  "/appointments/:appointmentId/accept",
  verifyToken,
  AllowRoles("doctor"),
  AcceptAppointment,
);

doctorroute.patch(
  "/appointments/:appointmentId/reject",
  verifyToken,
  AllowRoles("doctor"),
  RejectAppointment,
);

doctorroute.patch(
  "/appointments/:appointmentId/cancel",
  verifyToken,
  AllowRoles("doctor"),
  CancelAppointment,
);

doctorroute.get(
  "/patient-stat",
  verifyToken,
  AllowRoles("patient"),
  GetPatientDashboardStats,
);
doctorroute.get(
  "/patient-history",
  verifyToken,
  AllowRoles("patient"),
  GetPatientAppointmentHistory,
);

doctorroute.get(
  "/profile",
  verifyToken,
  AllowRoles("doctor", "admin", "patient"),
  GetDoctorProfile,
);
export default doctorroute;
