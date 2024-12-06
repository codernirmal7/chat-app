import { Router } from "express";
import {
  resendVerificationEmail,
  signin,
  signup,
  verifyEmail,
} from "../controllers/auth.controller";
import signupRateLimiter from "../middlewares/signupRateLimiter.middleware";
import resendVerificationRateLimiter from "../middlewares/resendVerificationRateLimiter.middleware";

const authRouter = Router();

authRouter.route("/signup").post(signupRateLimiter, signup);
authRouter.route("/verify-email").post(verifyEmail);
authRouter
  .route("/resend-verification-email")
  .post(resendVerificationRateLimiter, resendVerificationEmail);
authRouter.route("/signin").post(signupRateLimiter,signin);

export default authRouter;