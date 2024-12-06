import rateLimit from "express-rate-limit";

const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: "Too many login attempts. Please try again later.",
});

export default signinLimiter;