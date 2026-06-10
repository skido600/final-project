import type { Request, Response, NextFunction } from "express";
import { CheckSymptoms } from "../util/groqAi.ts";
import { HandleResponse } from "../util/response.ts";
export async function SymptomChecker(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { symptoms } = req.body;

    const result = await CheckSymptoms(symptoms);

    if (typeof result !== "string") {
      return HandleResponse(res, false, 400, "Invalid AI response");
    }

    const parsedResult = JSON.parse(result);

    return HandleResponse(res, true, 200, "Suggestion generated", parsedResult);
  } catch (error) {
    next(error);
  }
}
