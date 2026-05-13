import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
export const validate = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractErrors = [];
    errors.array().map((err) => extractErrors.push({ [err?.path]: err.msg }));
    throw new ApiError(422, "received data is not valid", extractErrors);
});
//# sourceMappingURL=validator.middleware.js.map