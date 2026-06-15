import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    console.log("zod", result);
    if (!result.success) {
      //   const errors = (result.error as ZodError).issues.map((err) => ({
      //     field: err.path.join("."),
      //     message: err.message,
      //   }));
      const firstError = result.error.issues[0];
      if (!firstError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: {
            field: "unknown",
            message: "Unknown validation error",
          },
        });
      }
      return res.status(400).json({
        success: false,
        message: firstError.message,
        error: {
          field: firstError.path.join("."),
          message: firstError.message,
        },
      });
    }

    req.body = result.data;
    next();
  };
