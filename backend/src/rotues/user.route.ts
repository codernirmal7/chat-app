import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { userData } from "../controllers/user.controller";

const userRouter = Router();

userRouter.route("/me").get(verifyToken, userData);

export default userRouter;