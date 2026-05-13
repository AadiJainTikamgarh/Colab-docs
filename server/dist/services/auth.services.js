import { users } from "../models/user.models";
import ApiError from "../utils/ApiError";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
const generateRefreshandAccessToken = async (userId) => {
    try {
        const user = await users.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();
        user.refreshToken = String(refreshToken);
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating refresh and access token", [error]);
    }
};
const registerService = async (username, email, password) => {
    if (!username || !email || !password) {
        throw new ApiError(404, "All fields are required");
    }
    const userExists = await users.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        throw new ApiError(409, "User with given email or username already exists");
    }
    const newUser = await users.create({ username, email, password });
    const { unhashedToken, hashedToken, tokenExpire } = await newUser.generateTemporaryToken();
    newUser.emailVerificationToken = hashedToken;
    newUser.emailVerificationTokenExpiry = tokenExpire;
    await newUser.save({ validateBeforeSave: false });
    const user = await users.findById(newUser._id);
    if (!user) {
        throw new ApiError(500, "Something went wrong while registering, Try Again");
    }
    return { user, unhashedToken };
};
const getCurrentUserService = async (userId) => {
    if (!userId) {
        throw new ApiError(401, "Unauthorized Request");
    }
    const user = await users
        .findById(userId)
        .select("-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return { user };
};
const logoutService = async (userId) => {
    if (!userId) {
        throw new ApiError(401, "Unauthorized Request");
    }
    const user = await users.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    return;
};
const loginService = async (email, password) => {
    if (!email || !password) {
        throw new ApiError(404, "All fields are required");
    }
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await existingUser.isPasswordMatch(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Credentials");
    }
    const { refreshToken, accessToken } = await generateRefreshandAccessToken(String(existingUser._id));
    const user = await users
        .findById(existingUser._id)
        .select("-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry");
    return { user, refreshToken, accessToken };
};
const refreshAccessTokenService = async (incommingToken) => {
    if (!incommingToken) {
        throw new ApiError(400, "Unauthroized Request");
    }
    const decodedToken = jwt.verify(incommingToken, String(process.env.REFRESH_TOKEN_SECRET));
    const user = await users
        .findById(decodedToken._id)
        .select("-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry");
    if (!user) {
        throw new ApiError(400, "Unauthorized access");
    }
    const { refreshToken, accessToken } = await generateRefreshandAccessToken(String(user._id));
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { user, refreshToken, accessToken };
};
const verifyEmailService = async (unhashedToken) => {
    if (!unhashedToken) {
        throw new ApiError(400, "Invalid Token");
    }
    const hashedToken = crypto
        .createHash("sha256")
        .update(unhashedToken)
        .digest("hex");
    const user = await users.findOne({ emailVerificationToken: hashedToken });
    if (!user) {
        throw new ApiError(400, "Invalid Token");
    }
    if (user.emailVerificationTokenExpiry < new Date(Date.now())) {
        throw new ApiError(400, "Token has expired");
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save({ validateBeforeSave: false });
};
const resendEmailVerificationMailService = async (userId) => {
    if (!userId) {
        throw new ApiError(401, "Unauthorized Request");
    }
    const user = await users.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.isEmailVerified) {
        throw new ApiError(400, "User is already verified");
    }
    const { unhashedToken, hashedToken, tokenExpire } = await user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpire;
    await user.save({ validateBeforeSave: false });
    return { user, unhashedToken };
};
const forgotPasswordRequestService = async (unhashedToken, newPassword) => {
    if (!unhashedToken) {
        throw new ApiError(401, "Invalid Token");
    }
    if (!newPassword) {
        throw new ApiError(404, "New password required");
    }
    const hashedToken = crypto
        .createHash("sha256")
        .update(unhashedToken)
        .digest("hex");
    const user = await users.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: {
            $gt: Date.now(),
        },
    });
    if (!user) {
        throw new ApiError(401, "Invalid Token");
    }
    user.password = newPassword;
    user.forgotPasswordToken = null;
    user.forgotPasswordTokenExpiry = null;
    await user.save({ validateBeforeSave: false });
    return;
};
const resendForgotPasswordService = async (email) => {
    if (!email) {
        throw new ApiError(401, "Email is required");
    }
    const user = await users
        .findOne({ email })
        .select("-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const { unhashedToken, hashedToken, tokenExpire } = await user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpire;
    await user.save({ validateBeforeSave: false });
    return {
        user,
        unhashedToken,
    };
};
const changePasswordService = async (oldPassword, newPassword, userId) => {
    if (!oldPassword || !newPassword || !userId) {
        throw new ApiError(404, "All fields are required");
    }
    const user = await users.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.isPasswordMatch(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(409, "Invalid password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    const updatedUser = await users
        .findById(user._id)
        .select("-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry");
    return { user: updatedUser };
};
export { getCurrentUserService, logoutService, registerService, loginService, refreshAccessTokenService, verifyEmailService, resendEmailVerificationMailService, resendForgotPasswordService, changePasswordService, forgotPasswordRequestService, };
//# sourceMappingURL=auth.services.js.map