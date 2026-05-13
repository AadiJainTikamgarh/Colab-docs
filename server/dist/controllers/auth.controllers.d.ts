import type { Request, Response } from "express";
declare const registerUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const refreshAccessToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const verifyEmail: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const resendEmailVerificationMail: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const forgotPasswordRequest: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const resendForgotPasswordMail: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const currentUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
export { currentUser, logout, registerUser, login, refreshAccessToken, verifyEmail, resendEmailVerificationMail, forgotPasswordRequest, resendForgotPasswordMail, changePassword, };
//# sourceMappingURL=auth.controllers.d.ts.map