import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
const healthCheckController = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, "Server is running"));
});
export { healthCheckController };
//# sourceMappingURL=healthcheck.controllers.js.map