import { HydratedDocument } from "mongoose";

declare global {
  namespace Mongoose {
    interface User {
      username: string;
      email: string;
      password: string;
      isEmailVerified: boolean;
      refreshToken?: string | null;
      forgotPasswordToken?: string | null;
      forgotPasswordTokenExpiry?: Date | null;
      emailVerificationToken?: string | null;
      emailVerificationTokenExpiry?: Date | null;
    }

    interface UserMethods {
      isPasswordMatch(password: string): Promise<boolean>;
      generateAccessToken(): Promise<string>;
      generateRefreshToken(): Promise<string>;
      generateTemporaryToken(): Promise<{
        unhashedToken: string;
        hashedToken: string;
        tokenExpire: Date;
      }>;
    }

    type UserDocument = HydratedDocument<User, UserMethods>;
  }
}

export {};
