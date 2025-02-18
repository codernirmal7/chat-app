import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect, useRef } from "react";
import {
  getMessages,
  subscribeToMessages,
  unsubscribeFromMessages,
} from "../redux/slices/messageSlice";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state: RootState) => state.message
  );

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const messageEndRef = useRef<HTMLDivElement | null>(null); // For scrolling


  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id));
      dispatch(subscribeToMessages());
    }

    return () => {
      dispatch(unsubscribeFromMessages());
    };
  }, [selectedUser?._id, dispatch ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === user?.userId ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === user?.userId
                      ? user.avatar
                      : selectedUser?.avatar
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.createdAt).toLocaleTimeString()}{" "}
                {/* Format date/time */}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} /> {/* Scroll to the bottom */}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
