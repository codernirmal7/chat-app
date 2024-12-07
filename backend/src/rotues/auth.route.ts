import { Router } from "express";
import {
  logout,
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
  signin,
  signup,
  verifyEmail,
} from "../controllers/auth.controller";
import signupRateLimiter from "../middlewares/signupRateLimiter.middleware";
import resendVerificationRateLimiter from "../middlewares/resendVerificationRateLimiter.middleware";
import resetPasswordLimiter from "../middlewares/resetPasswordLimiter";

const authRouter = Router();

authRouter.route("/signup").post(signupRateLimiter, signup);
authRouter.route("/verify-email").post(verifyEmail);
authRouter
  .route("/resend-verification-email")
  .post(resendVerificationRateLimiter, resendVerificationEmail);
authRouter.route("/signin").post(signupRateLimiter,signin);
authRouter.post("/request-password-reset",resetPasswordLimiter, requestPasswordReset);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/logout", logout);

export default authRouter;