import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const healthCheckController = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse(200, "Server is running"));
  }
);

export { healthCheckController };
