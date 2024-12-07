export const sendVerificationEmailTemplate = (token: string): string => {
  return `
      <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #e1e7f5;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
      background-color: #f9f9f9; 
      border: 1px solid #dddddd;
      padding : 10px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>Email Verification</h2>
    </div>
    <div class="content">
      <p>Thank you for signing up! Please use the following code to verify your email:</p>
      <p class="code">${token}</p>
    </div>
    <div class="footer">
      <p>If you didn't request this email, you can safely ignore it.</p>
    </div>
  </div>
</body>
</html>

    `;
};

export const sendWelcomeEmailTemplate = (fullName: string): string => {
  return `
      <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; }
    .email-container { max-width: 600px; margin: auto; background-color: #e1e7f5; padding: 20px; border-radius: 8px; }
    .header { text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888888; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to Chat App!</h1>
    </div>
    <div class="content">
      <p>Hi ${fullName},</p>
      <p>We're thrilled to have you on board. You can now explore and enjoy our platform!</p>
      <p>If you have any questions, feel free to contact us anytime.</p>
    </div>
    <div class="footer">
      <p>Thanks for joining Chat app!</p>
    </div>
  </div>
</body>
</html>

    `;
};

export const sendLoginSuccessfulEmailTemplate = (
  fullName: string,
  ipAddress: string,
  userAgent: string
): string => {
  return `
      <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .email-container { max-width: 600px; margin: auto; background-color: #e1e7f5; padding: 20px; border-radius: 8px; }
    .header { text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; }
    .details { margin-top: 20px; padding: 10px; background-color: #f9f9f9; border: 1px solid #dddddd; border-radius: 5px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666666; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>Login Successful</h2>
    </div>
    <div class="content">
      <p>Hello ${fullName},</p>
      <p>Your account was just accessed successfully. Here are the details:</p>
      <div class="details">
        <p><strong>IP Address:</strong> ${ipAddress}</p>
        <p><strong>Device:</strong> ${userAgent}</p>
      </div>
      <p>If this wasn’t you, please reset your password immediately.</p>
    </div>
    <div class="footer">
      <p>Stay secure</p>
    </div>
  </div>
</body>
</html>

    `;
};

export const sendPasswordResetEmailTemplate = (token: string): string => {
  return `
      <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; }
    .email-container { max-width: 600px; margin: auto; background-color: #e1e7f5; padding: 20px; border-radius: 8px; }
    .header { text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; text-align: center; }
    .code { font-size: 24px; font-weight: bold; color: #FF5722; }
    .footer { margin-top: 20px; font-size: 12px; color: #888888; text-align: center; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>Reset Password Request</h2>
    </div>
    <div class="content">
      <p>Use this code to reset your password:</p>
      <p class="code">${token}</p>
      <p>This code will expire in 24 hours.</p>
    </div>
    <div class="footer">
      <p>If you didn’t request this email, you can safely ignore it.</p>
    </div>
  </div>
</body>
</html>

    `;
};

export const sendPasswordResetSuccessfulEmailTemplate = (
  fullName: string
): string => {
  return `
    <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; }
    .email-container { max-width: 600px; margin: auto; background-color: #e1e7f5; padding: 20px; border-radius: 8px; }
    .header { text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; text-align: center; }
    .footer { margin-top: 20px; font-size: 12px; color: #888888; text-align: center; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>Password Reset Successful</h2>
    </div>
    <div class="content">
      <p>Hello ${fullName},</p>
      <p>Your password has been successfully reset. If this wasn’t you, please contact our support team immediately.</p>
    </div>
    <div class="footer">
      <p>Stay secure</p>
    </div>
  </div>
</body>
</html>


    `;
};
