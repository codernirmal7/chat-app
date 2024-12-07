import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { updateProfile, userData } from "../controllers/user.controller";

const userRouter = Router();

userRouter.route("/me").get(verifyToken, userData);
userRouter.route("/update-profile").post(verifyToken, updateProfile);

export default userRouter;