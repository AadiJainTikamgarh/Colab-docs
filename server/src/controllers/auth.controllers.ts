import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import {
  emailVerificationMailgenContent,
  forgetPasswordMailgenContent,
  sendEmail,
} from "../utils/mail";
import {
  changePasswordService,
  forgotPasswordRequestService,
  getCurrentUserService,
  loginService,
  logoutService,
  refreshAccessTokenService,
  registerService,
  resendEmailVerificationMailService,
  resendForgotPasswordService,
  verifyEmailService,
} from "../services/auth.services";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = await req.body;

  const { user, unhashedToken } = await registerService(
    username,
    email,
    password
  );

  sendEmail({
    mail: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify-email/${unhashedToken}`
    ),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "User Registered Successfully and verification email sent to your email",
      {
        user,
      }
    )
  );
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  const { user, refreshToken, accessToken } = await loginService(
    email,
    password
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .status(200)
    .json(new ApiResponse(200, "User login successfully", { user }));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incommingToken = req.cookies.refreshToken || req.body?.refreshToken;

  const { user, refreshToken, accessToken } = await refreshAccessTokenService(
    incommingToken
  );

  return res
    .cookie("refreshToken", refreshToken)
    .cookie("accessToken", accessToken)
    .status(200)
    .json(
      new ApiResponse(200, "User refresh token updated successfully", {
        user,
      })
    );
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { unhashedToken } = req.params;

  await verifyEmailService(unhashedToken as string);

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully"));
});

const resendEmailVerificationMail = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req?.user as { _id: string };

    const { user, unhashedToken } = await resendEmailVerificationMailService(
      _id
    );

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

const forgotPasswordRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { unhashedToken } = req.params;
    const { newPassword } = req.body as { newPassword: string };

    await forgotPasswordRequestService(unhashedToken as string, newPassword);

    return res
      .status(200)
      .json(new ApiResponse(200, "User password updated successfully"));
  }
);

const resendForgotPasswordMail = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req?.user as { _id: string };

    const { user, unhashedToken } = await resendForgotPasswordService(_id);

    sendEmail({
      mail: user.email,
      subject: "Change your password",
      mailgenContent: forgetPasswordMailgenContent(
        user.username,
        `${process.env.CLIENT_URL}/forgot-password/${unhashedToken}`
      ),
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Forgot password mail send successfully"));
  }
);

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req?.user as { _id: string };

  const { user } = await changePasswordService(oldPassword, newPassword, _id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully", { user }));
});

const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req?.user as { _id: string };
  const { user } = await getCurrentUserService(_id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Current user fetched successfully", { user }));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req?.user as { _id: string };
  await logoutService(_id);

  return res
    .cookie("refreshToken", "", { maxAge: 1 })
    .cookie("accessToken", "", { maxAge: 1 })
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export {
  currentUser,
  logout,
  registerUser,
  login,
  refreshAccessToken,
  verifyEmail,
  resendEmailVerificationMail,
  forgotPasswordRequest,
  resendForgotPasswordMail,
  changePassword,
};
