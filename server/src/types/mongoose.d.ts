import { HydratedDocument, Mongoose } from "mongoose";

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

    interface Collaborator {
      userId: Types.ObjectId;
      role: "viewer" | "editor";
      addedAt?: Date = Date.now();
    }

    interface IDocument {
      title: string;
      owner: Types.ObjectId;
      collaborators: Mongoose.Collaborator[];
      content: Record<string, any>;
      version: number;
    }
  }
}

export {};
