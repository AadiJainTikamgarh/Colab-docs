declare const registerService: (username: string, email: string, password: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    unhashedToken: string;
}>;
declare const getCurrentUserService: (userId: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
}>;
declare const logoutService: (userId: string) => Promise<void>;
declare const loginService: (email: string, password: string) => Promise<{
    user: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null;
    refreshToken: string;
    accessToken: string;
}>;
declare const refreshAccessTokenService: (incommingToken: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    refreshToken: string;
    accessToken: string;
}>;
declare const verifyEmailService: (unhashedToken: string) => Promise<void>;
declare const resendEmailVerificationMailService: (userId: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    unhashedToken: string;
}>;
declare const forgotPasswordRequestService: (unhashedToken: string, newPassword: string) => Promise<void>;
declare const resendForgotPasswordService: (email: string) => Promise<{
    user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    unhashedToken: string;
}>;
declare const changePasswordService: (oldPassword: string, newPassword: string, userId: string) => Promise<{
    user: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Mongoose.User, {}, import("mongoose").DefaultSchemaOptions> & Omit<Mongoose.User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, keyof Mongoose.UserMethods> & Mongoose.UserMethods & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null;
}>;
export { getCurrentUserService, logoutService, registerService, loginService, refreshAccessTokenService, verifyEmailService, resendEmailVerificationMailService, resendForgotPasswordService, changePasswordService, forgotPasswordRequestService, };
//# sourceMappingURL=auth.services.d.ts.map