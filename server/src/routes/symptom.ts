import express from "express";
import type { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.ts";
import { AllowRoles } from "../middleware/access.ts";
import { validate } from "../middleware/zodmiddleware.ts";
import { AiSuggestionSchema } from "../validators/symptomval.ts";
import {
  SymptomChecker,
  GetAiHistory,
  DeleteAiHistory,
  ClearAiHistory,
} from "../controllers/SymptomChecker_controller.ts";

const symptomroute: Router = express.Router();
symptomroute.post(
  "/symptom",
  verifyToken,
  AllowRoles("patient"),
  validate(AiSuggestionSchema),
  SymptomChecker,
);

symptomroute.get("/history", verifyToken, AllowRoles("patient"), GetAiHistory);

symptomroute.delete(
  "/history/:id",

  verifyToken,
  AllowRoles("patient"),
  DeleteAiHistory,
);

symptomroute.delete(
  "/history",

  verifyToken,
  AllowRoles("patient"),
  ClearAiHistory,
);
export default symptomroute;
