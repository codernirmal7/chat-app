import { Router } from "express";
import { signup } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/signup").post(signup);

export default authRouter;