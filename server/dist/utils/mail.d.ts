import Mailgen from "mailgen";
declare const sendEmail: (options: {
    mailgenContent: Mailgen.Content;
    mail: string;
    subject: string;
}) => Promise<void>;
declare const emailVerificationMailgenContent: (username: string, verficationUrl: string) => {
    body: {
        name: string;
        intro: string;
        action: {
            instructions: string;
            button: {
                color: string;
                text: string;
                link: string;
            };
        };
        outro: string;
    };
};
declare const forgetPasswordMailgenContent: (username: string, passwordResetUrl: string) => {
    body: {
        name: string;
        intro: string;
        action: {
            instructions: string;
            button: {
                color: string;
                text: string;
                link: string;
            };
        };
        outro: string;
    };
};
export { sendEmail, forgetPasswordMailgenContent, emailVerificationMailgenContent, };
//# sourceMappingURL=mail.d.ts.map