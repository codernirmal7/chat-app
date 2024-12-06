import rateLimit from "express-rate-limit";

// Configure rate limiter middleware
const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many signup requests from this IP, please try again later.",
});

export default signupRateLimiter;