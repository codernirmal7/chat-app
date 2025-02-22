import React, { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { markMessageAsRead, sendMessage } from "../redux/slices/messageSlice";
import { TbLoader2 } from "react-icons/tb";
import { getCurrentUserId, getSocket } from "../socket/socket";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const { selectedUser } = useSelector((state: RootState) => state.message);

  const dispatch = useDispatch<AppDispatch>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | any = e.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      // 2 MB limit
      toast.error("File size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Avoid sending empty messages or images
    if (!text.trim() && !imagePreview) return;

    try {
      setIsMessageSending(true);
      // Get the image from the file input
      const image = fileInputRef.current?.files?.[0];

      await dispatch(sendMessage({ text: text.trim(), image: image })).unwrap();

      getSocket()?.emit("sendMessage", {
        senderId: getCurrentUserId(), // Replace with your current user's id
        receiverId: selectedUser?._id, // active chat holds the receiver's id
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsMessageSending(false);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Failed to send message:", error);
      setIsMessageSending(false);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <button
            type="button"
            className={`flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload image"
          >
            <Image size={20} />
          </button>
          <input
            type="text"
            className="w-full input input-bordered rounded-lg sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Message input"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            aria-label="Attach an image"
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
          aria-label="Send message"
        >
          {isMessageSending ? (
            <TbLoader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
