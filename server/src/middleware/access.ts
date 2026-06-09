import type { Response, NextFunction } from "express";
import { HandleResponse } from "../util/response.ts";

export const AllowRoles =
  (...roles: string[]) =>
  (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return HandleResponse(res, false, 401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      return HandleResponse(res, false, 403, "Access denied");
    }

    next();
  };
