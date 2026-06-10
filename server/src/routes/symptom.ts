import express from "express";
import type { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.ts";
import { AllowRoles } from "../middleware/access.ts";
import { validate } from "../middleware/zodmiddleware.ts";
import { AiSuggestionSchema } from "../validators/symptomval.ts";
import { SymptomChecker } from "../controllers/SymptomChecker_controller.ts";

const symptomroute: Router = express.Router();
symptomroute.post(
  "/symptom",
  verifyToken,
  //   AllowRoles("admin"),
  validate(AiSuggestionSchema),
  SymptomChecker,
);
export default symptomroute;
