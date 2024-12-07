import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import {
  updateProfile,
  updateProfileImage,
  userData,
} from "../controllers/user.controller";
import updateProfileLimiter from "../middlewares/updateProfileLimiter";
import { upload } from "../middlewares/multer.middleware";

const userRouter = Router();

userRouter.route("/me").get(verifyToken, userData);
userRouter
  .route("/update-profile")
  .post(updateProfileLimiter, verifyToken, updateProfile);
userRouter
  .route("/update-profile-image")
  .post(updateProfileLimiter,verifyToken, upload.single("avatar"), updateProfileImage);

export default userRouter;