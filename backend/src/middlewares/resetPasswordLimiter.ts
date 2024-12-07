import rateLimit from "express-rate-limit";

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: {
    error: "Too many password reset attempts. Please try again later.",
    success: false,
  },
});

export default resetPasswordLimiter;