
type sendVerificationEmailTemplateType = (token: string) => string;
type sendPasswordResetEmailTemplateType = (token: string) => string;

export const sendVerificationEmailTemplate : sendVerificationEmailTemplateType = (token: string) : string => {
  return `
      <h3>Welcome to Chat App!</h3>
        <p>Please verify your email the code is below:</p>
        <p>${token}</p>
        <p>If you didn’t request this email, you can safely ignore it.</p>
    `;
};

export const sendPasswordResetEmailTemplate : sendVerificationEmailTemplateType = (token: string) : string => {
  return `
      <h3>You requested a password reset</h3>
        <p>The code is below:</p>
        <p>${token}</p>
        <p>This link will expire in 24 hours.</p>
    `;
}

export const sendPasswordResetSuccessfulEmailTemplate = () : string => {
  return `
      <h3>Password reset successful</h3>
    `;
}