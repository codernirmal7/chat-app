import rateLimit from "express-rate-limit";

const updateProfileLimiter = rateLimit({
  keyGenerator: (req) => req.userData.userId, // Use authenticated user's ID as the key
  windowMs: 15 * 60 * 1000,
  max: 10,
});

export default updateProfileLimiter