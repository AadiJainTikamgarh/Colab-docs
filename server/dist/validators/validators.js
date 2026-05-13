import { body } from "express-validator";
const registerValidator = () => {
    return [
        body("email").trim().isEmail().withMessage("Email is Invalid"),
        body("username")
            .trim()
            .isLowercase()
            .withMessage("username must be in lowercase")
            .isLength({ min: 3 })
            .withMessage("username must be greater than 8 character long"),
        body("password")
            .trim()
            .isLength({ min: 8 })
            .withMessage("password must be greater then 8 character long")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    ];
};
const loginValidator = () => {
    return [
        body("email").trim().isEmail().withMessage("Email is invalid"),
        body("password").trim().notEmpty().withMessage("password is required"),
    ];
};
const changePasswordValidator = () => {
    return [
        body("oldPassword")
            .trim()
            .notEmpty()
            .withMessage("old password is required"),
        body("newPassword")
            .trim()
            .notEmpty()
            .withMessage("new password is required"),
    ];
};
const forgotPasswordRequestValidator = () => {
    return [
        body("newPassword")
            .trim()
            .isLength({ min: 8 })
            .withMessage("password must be greater then 8 character long")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    ];
};
const resendForgotPasswordMailValidator = () => {
    return [body("email").trim().isEmail().withMessage("Email is Invalid")];
};
const createDocumentValidator = () => {
    return [body("title").trim().notEmpty().withMessage("Title is required")];
};
const updateDocumentValidator = () => {
    return [body("data").notEmpty().withMessage("Data is required")];
};
const addCollaborationValidator = () => {
    return [
        body("collaboratorId")
            .trim()
            .notEmpty()
            .withMessage("Collaborator ID is required"),
        body("role").trim().notEmpty().withMessage("Role is required"),
    ];
};
export { registerValidator, loginValidator, changePasswordValidator, forgotPasswordRequestValidator, resendForgotPasswordMailValidator, createDocumentValidator, updateDocumentValidator, addCollaborationValidator, };
//# sourceMappingURL=validators.js.map