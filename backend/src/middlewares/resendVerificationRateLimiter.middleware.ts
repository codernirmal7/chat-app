import rateLimit from "express-rate-limit";

const resendVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many resend requests from this IP, please try again later.",
});

export default resendVerificationRateLimiter;