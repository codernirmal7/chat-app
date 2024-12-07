import { sendPasswordResetEmailTemplate, sendPasswordResetSuccessfulEmailTemplate, sendVerificationEmailTemplate } from "./emailTemplates.nodemailer";
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

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {  
  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Password Reset Request",
    html: sendPasswordResetEmailTemplate(token)
  });
};

export const sendPasswordResetSuccessfulEmail = async (email: string): Promise<void> => {  
  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Password Reset Successful",
    html: sendPasswordResetSuccessfulEmailTemplate()
  });
};