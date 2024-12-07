import { sendLoginSuccessfulEmailTemplate, sendPasswordResetEmailTemplate, sendPasswordResetSuccessfulEmailTemplate, sendVerificationEmailTemplate, sendWelcomeEmailTemplate } from "./emailTemplates.nodemailer";
import transporter from "./nodemailer.config";


const sender: string | undefined = process.env.NODEMAILER_EMAIL;

if (!sender) {
  throw new Error("Sender email is not provided.");
}


export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {

  const mailOptions = {
    from: sender,
    to: email,
    subject: "Email Verification",
    html: sendVerificationEmailTemplate(token),
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (
  email: string,
  fullName: string
): Promise<void> => {

  const mailOptions = {
    from: sender,
    to: email,
    subject: "Welcome to Chat App",
    html: sendWelcomeEmailTemplate(fullName),
  };

  await transporter.sendMail(mailOptions);
};

export const sendLoginSuccessfulEmail = async (
  email: string,
  fullName: string,
  ipAddress : string,
  userAgent : string
): Promise<void> => {

  const mailOptions = {
    from: sender,
    to: email,
    subject: "Login Successful",
    html: sendLoginSuccessfulEmailTemplate(fullName , ipAddress , userAgent),
  };

  await transporter.sendMail(mailOptions);
};



export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {  
  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Password Reset Request",
    html: sendPasswordResetEmailTemplate(token)
  });
};

export const sendPasswordResetSuccessfulEmail = async (email: string , fullName: string): Promise<void> => {  
  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Password Reset Successful",
    html: sendPasswordResetSuccessfulEmailTemplate(fullName)
  });
};