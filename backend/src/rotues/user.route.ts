import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { updateProfile, userData } from "../controllers/user.controller";
import updateProfileLimiter from "../middlewares/updateProfileLimiter";

const userRouter = Router();

userRouter.route("/me").get(verifyToken, userData);
userRouter.route("/update-profile").post(updateProfileLimiter,verifyToken, updateProfile);

export default userRouter;