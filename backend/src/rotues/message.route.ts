import express from "express";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsRead,
  sendMessage,
  unseenMessageCount,
} from "../controllers/message.controller";
import verifyToken from "../middlewares/verifyToken";
import { upload } from "../middlewares/multer.middleware";

const messageRouter = express.Router();

messageRouter.route("/users").get(verifyToken, getUsersForSidebar);
messageRouter.route("/:id").get(verifyToken, getMessages);

messageRouter
  .route("/send/:id")
  .post(verifyToken, upload.single("image"), sendMessage);
messageRouter.route("/unseen-message/:userId").get( verifyToken,unseenMessageCount);

messageRouter.route("/mark-seen/:receiverId").put(verifyToken, markMessageAsRead);



export default messageRouter;