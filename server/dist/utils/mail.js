import Mailgen from "mailgen";
import nodemailer from "nodemailer";
const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            // Adding header & footer
            // can add optional logo
            name: "Task Manager",
            link: "https://taskmanager.com",
        },
    });
    // generate textual version of email for those who doesn't support HTML
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    // generate HTMl version of email
    const emailHTML = mailGenerator.generate(options.mailgenContent);
    // setting up transport to send mail
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "aadijaintikamgarh@gmail.com",
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    // generate formate of mail to send mail
    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.mail,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML,
    };
    try {
        transport.sendMail(mail);
    }
    catch (error) {
        console.error("Email service failed siliently. Make sure that you have provided your MAILTRAP credetials is in the .env file");
        console.error("Error: ", error);
    }
};
const emailVerificationMailgenContent = (username, verficationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our App! we're excited to have you on board",
            action: {
                instructions: "To verify your email please click on the following botton",
                button: {
                    color: "#22BC66",
                    text: "verify your email",
                    link: verficationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
const forgetPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset the password of you account",
            action: {
                instructions: "To reset password click on the following button or link",
                button: {
                    color: "#22BC66",
                    text: "Reset password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
export { sendEmail, forgetPasswordMailgenContent, emailVerificationMailgenContent, };
//# sourceMappingURL=mail.js.map