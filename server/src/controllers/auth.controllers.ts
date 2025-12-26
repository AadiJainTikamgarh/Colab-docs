import type { Request, Response } from "express";
import { users } from "../models/user.models";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const generateRefreshandAccessToken = async (userId: string) => {
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
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
      [error]
    );
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = await req.body;

  const userExists = await users.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    throw new ApiError(409, "User with given email or username already exists");
  }

  const newUser = await users.create({ username, email, password });

  const { unhashedToken, hashedToken, tokenExpire } =
    await newUser.generateTemporaryToken();

  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationTokenExpiry = tokenExpire;
  await newUser.save({ validateBeforeSave: false });

  sendEmail({
    mail: newUser.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      newUser.username,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify-email/${unhashedToken}`
    ),
  });

  const createdUser = await users
    .findById(newUser._id)
    .select(
      "-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry"
    );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while user registration, Try Again"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "User Registered Successfully and verification email sent to your email",
      {
        user: createdUser,
      }
    )
  );
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } =
    await req.body;

  const existingUser = await users
    .findOne({ email })
    .select(
      "-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry"
    );

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await existingUser.isPasswordMatch(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const { refreshToken, accessToken } = await generateRefreshandAccessToken(
    String(existingUser._id)
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .status(200)
    .json(
      new ApiResponse(200, "User login successfully", { user: existingUser })
    );
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incommingToken = req.cookies.refreshToken || req.body?.refreshToken;

  if (!incommingToken) {
    throw new ApiError(400, "Unauthroized Request");
  }

  const decodedToken = jwt.verify(
    incommingToken,
    String(process.env.REFRESH_TOKEN_SECRET)
  ) as jwt.JwtPayload;

  const user = await users.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(400, "Unauthorized access");
  }

  const { refreshToken, accessToken } = await generateRefreshandAccessToken(
    String(user._id)
  );

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  const updatedUser = await users
    .findById(user._id)
    .select(
      "-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry"
    );

  return res
    .cookie("refreshToken", refreshToken)
    .cookie("accessToken", accessToken)
    .status(200)
    .json(
      new ApiResponse(200, "User refresh token updated successfully", {
        user: updatedUser,
      })
    );
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { unhashedToken } = req.params;

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

  if (user.isEmailVerified) {
    return res
      .status(200)
      .json(new ApiResponse(201, "User email already verified"));
  }

  if ((user.emailVerificationTokenExpiry as Date) < new Date()) {
    throw new ApiError(400, "Token has expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationTokenExpiry = null;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully"));
});

const resendEmailVerificationMail = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req?.user as { _id: string };

    if (!_id) {
      throw new ApiError(401, "Unauthorized Request");
    }
    const user = await users.findById(_id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isEmailVerified) {
      return res.status(201).json(new ApiError(201, "user already verified"));
    }

    const { unhashedToken, hashedToken, tokenExpire } =
      await user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpire;

    await user.save({ validateBeforeSave: false });

    sendEmail({
      mail: user.email,
      subject: "Please verifiy your email",
      mailgenContent: emailVerificationMailgenContent(
        user.username,
        `${req.protocol}://${req.get(
          "host"
        )}/api/v1/verify-email/${unhashedToken}`
      ),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Email verification resent successfully"));
  }
);

const verifyForotPasswordToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { unhashedToken } = req.params;
    const { newPassword } = req.body as { newPassword: string };

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

    return res
      .status(200)
      .json(new ApiResponse(200, "User password updated successfully"));
  }
);

export {
  registerUser,
  login,
  refreshAccessToken,
  verifyEmail,
  resendEmailVerificationMail,
  verifyForotPasswordToken
};
