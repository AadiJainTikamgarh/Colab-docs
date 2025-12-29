import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError";
import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";

export const validate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractErrors: any[] = [];
    errors.array().map((err) => extractErrors.push({ [err?.path]: err.msg }));
    throw new ApiError(422, "received data is not valid", extractErrors);
  }
);
