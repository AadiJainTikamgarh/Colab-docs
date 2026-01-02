import { Router } from "express";
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordRequestValidator,
  resendForgotPasswordMailValidator,
} from "../validators/validators";
import { authorization } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
  registerUser,
  login,
  refreshAccessToken,
  changePassword,
  forgotPasswordRequest,
  resendEmailVerificationMail,
  resendForgotPasswordMail,
  verifyEmail,
  logout,
  currentUser,
} from "../controllers/auth.controllers";

/*
 registerUser - post
 login - post
 changePassword - post
 forgotPasswordRequest - post
 verifyEmail - get
 resendForgotPasswordMail - get
 resendEmailVerificationMail - get
 refreshAccessToken - get
*/

const router = Router();

router.route("/register").post(registerValidator(), validate, registerUser);
router.route("/login").post(loginValidator(), validate, login);
router
  .route("/change-password")
  .post(authorization, changePasswordValidator(), validate, changePassword);
router
  .route("/reset-password/:unhashedToken")
  .post(forgotPasswordRequestValidator(), validate, forgotPasswordRequest);

router.route("/verify-email/:unhashedToken").get(verifyEmail);
router
  .route("/resend-verification-mail")
  .get(authorization, resendEmailVerificationMail);
router
  .route("/resend-forgot-password-mail")
  .post(
    resendForgotPasswordMailValidator(),
    validate,
    resendForgotPasswordMail
  );
router.route("/refresh-access-token").get(authorization, refreshAccessToken);
router.route("/current-user").get(authorization, currentUser);
router.route("/logout").post(authorization, logout);

export default router;
