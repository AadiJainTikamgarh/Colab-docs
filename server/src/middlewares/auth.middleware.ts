import { users } from "../models/user.models";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authorization = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      req.headers?.authorization?.toString().split(" ")[1];

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;

      const user = await users
        .findById(decodedToken?._id)
        .select(
          "-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry"
        );

      if (!user) {
        throw new ApiError(401, "Unauthorized request");
      }

      console.log(user);

      req.user = {
        _id: String(user._id),
      };

      next();
    } catch (error) {
      throw new ApiError(401, "Invalid Access Token", [error]);
    }
  }
);
