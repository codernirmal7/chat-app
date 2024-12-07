import rateLimit from "express-rate-limit";

const updateProfileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later.",
});

export default updateProfileLimiter