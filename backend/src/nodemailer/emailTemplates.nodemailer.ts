
type sendVerificationEmailTemplateType = (token: string) => string;

export const sendVerificationEmailTemplate : sendVerificationEmailTemplateType = (code: string) : string => {
  return `
      <h3>Welcome to Chat App!</h3>
        <p>Please verify your email the code is below:</p>
        <p>${code}</p>
        <p>If you didn’t request this email, you can safely ignore it.</p>
    `;
};
