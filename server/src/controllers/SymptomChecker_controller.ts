import type { Request, Response, NextFunction } from "express";
import { CheckSymptoms } from "../util/groqAi.ts";
import { HandleResponse } from "../util/response.ts";
import { aiSuggestions } from "../db/schema.ts";
import { db } from "../configs/db.ts";
import { desc, eq, and } from "drizzle-orm";

export async function SymptomChecker(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const { symptoms } = req.body;

    const result = await CheckSymptoms(symptoms);

    if (!result) {
      return HandleResponse(res, false, 400, "Invalid AI response");
    }

    const parsedResult = JSON.parse(result);
    if (parsedResult.error) {
      return HandleResponse(res, true, 200, parsedResult.error, {
        error: true,
        message: parsedResult.error,
      });
    }
    await db.insert(aiSuggestions).values({
      patientId: req.user.id,
      symptoms: parsedResult.symptoms,
      possibleConditions: JSON.stringify(parsedResult.possibleConditions),
      recommendation: parsedResult.recommendation,
    });
    return HandleResponse(res, true, 200, "Suggestion generated", parsedResult);
  } catch (error) {
    next(error);
  }
}

export async function GetAiHistory(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const history = await db
      .select()
      .from(aiSuggestions)
      .where(eq(aiSuggestions.patientId, req.user.id))
      .orderBy(desc(aiSuggestions.createdAt));

    const formattedHistory = history.map((item) => ({
      ...item,
      possibleConditions: JSON.parse(item.possibleConditions || "[]"),
    }));

    return HandleResponse(
      res,
      true,
      200,
      "AI history fetched successfully",
      formattedHistory,
    );
  } catch (error) {
    next(error);
  }
}

export async function ClearAiHistory(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    await db
      .delete(aiSuggestions)
      .where(eq(aiSuggestions.patientId, req.user.id));

    return HandleResponse(
      res,
      true,
      200,
      "All AI history cleared successfully",
    );
  } catch (error) {
    next(error);
  }
}
export async function DeleteAiHistory(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    await db
      .delete(aiSuggestions)
      .where(
        and(eq(aiSuggestions.id, id), eq(aiSuggestions.patientId, req.user.id)),
      );

    return HandleResponse(res, true, 200, "History deleted successfully");
  } catch (error) {
    next(error);
  }
}
