import { users } from "../models/user.models";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
export const authorization = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken ||
        req.headers?.authorization?.toString().split(" ")[1];
    if (!accessToken) {
        throw new ApiError(401, "Token expired", ["TOKEN EXPIRED"]);
    }
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await users
            .findById(decodedToken?._id)
            .select("-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry");
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }
        console.log(user);
        req.user = {
            _id: String(user._id),
        };
        next();
    }
    catch (error) {
        throw new ApiError(401, "Invalid Access Token", [error]);
    }
});
//# sourceMappingURL=auth.middleware.js.map