import { Request, Response } from "express";
import { uploadToCloudinary } from "../cloudinary/cloudinary.config";
import Message from "../models/Message.model";
import { getReceiverSocketId, io } from "../socket.io/socket";
import User from "../models/User.model";
import { deleteLocalFile } from "../utils/deleteLocalFile";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.userData?.userId;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    });

    res.status(200).json(filteredUsers);
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.userData?.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userData?.userId;

    let fileUrl;
    if (req.file) {
      // Upload file to Cloudinary
      const uploadResponseUrl = await uploadToCloudinary(req.file.path);
      fileUrl = uploadResponseUrl;
      console.log(uploadResponseUrl);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: fileUrl,
    });

    await newMessage.save();

    // Emit "newMessage" event to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Delete local file after successful upload
    if (req.file) deleteLocalFile(req.file?.path);

    res.status(201).json(newMessage);
  } catch (error: any) {
    // Delete local file in case of failure
    if (req.file) deleteLocalFile(req.file?.path);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiverId } = req.params; // receiverId is actually the sender of the unread messages
    const userId = req.userData?.userId; // The logged-in user (receiver)


    const updatedMessages = await Message.updateMany(
      { senderId: receiverId, receiverId: userId, seen: false }, // Corrected filter
      { $set: { seen: true } }
    );

    if (updatedMessages.modifiedCount === 0) {
      res.status(404).json({ success: false, error: "No messages found to update" });
      return;
    }

    const unseenCount = await Message.countDocuments({ receiverId: userId, seen: false });
    io.to(userId).emit("updateUnseenCount", { senderId: receiverId, unseenCount });


    res.status(200).json({ success: true, message: "Messages marked as seen" });
  } catch (error: any) {
    console.error("Error marking messages as read:", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



export const unseenMessageCount = async (req: Request, res: Response) : Promise<void> => {

  try {
    const { userId } = req.params;

    if (!userId) {
       res.status(400).json({ success: false, error: "User ID is required" });
       return;
    }

    const count = await Message.countDocuments({ receiverId: userId, seen: false });
    res.status(200).json({ success: true, count });
  } catch (error: any) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};