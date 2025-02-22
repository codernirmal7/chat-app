import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect, useRef, useState } from "react";
import {
  addMessage,
  getMessages,
  markMessageAsRead,
} from "../redux/slices/messageSlice";
import { getSocket } from "../socket/socket";

const ChatContainer = ({ setOpenSidebar }: { setOpenSidebar?: any }) => {
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state: RootState) => state.message
  );

  const [isUserTyping, setIsUserTyping] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const messageEndRef = useRef<HTMLDivElement | null>(null); // For scrolling

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;

    const handleTyping = () => {
      socket.emit("typing", {
        senderId: user?.userId,
        receiverId: selectedUser._id,
        isTyping: true,
      });

      setTimeout(() => {
        socket.emit("typing", {
          senderId: user?.userId,
          receiverId: selectedUser._id,
          isTyping: false,
        });
      }, 2000); // Stops typing after 2 seconds of inactivity
    };

    document.addEventListener("keydown", handleTyping);

    return () => {
      document.removeEventListener("keydown", handleTyping);
    };
  }, [user?.userId, selectedUser?._id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;
  
    let typingTimeout: any | null = null;
  
    const handleTyping = () => {
      socket.emit("typing", {
        senderId: user?.userId,
        receiverId: selectedUser._id,
        isTyping: true,
      });
  
      if (typingTimeout) clearTimeout(typingTimeout);
  
      typingTimeout = setTimeout(() => {
        socket.emit("typing", {
          senderId: user?.userId,
          receiverId: selectedUser._id,
          isTyping: false,
        });
      }, 2000); // Stops typing after 2 seconds of inactivity
    };
  
    const inputField = document.getElementById("messageInput");
  
    if (inputField) {
      inputField.addEventListener("input", handleTyping);
    }
  
    return () => {
      if (inputField) {
        inputField.removeEventListener("input", handleTyping);
      }
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [user?.userId, selectedUser?._id]);
  

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
  
    const handleUserTyping = ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
      if (senderId === selectedUser?._id) {
        setIsUserTyping(isTyping);
      }
    };
  
    const handleUserStoppedTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === selectedUser?._id) {
        setIsUserTyping(false);
      }
    };
  
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);
  
    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [selectedUser?._id]);
  

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (data: any) => {
      // Check if the received message belongs to the currently selected user
      if (
        data.senderId === selectedUser?._id ||
        data.receiverId === selectedUser?._id
      ) {
        dispatch(addMessage(data));
        // Mark the message as read only if it's from the selected user
        if (user?.userId) {
          dispatch(markMessageAsRead({ senderId: data.senderId }));
        }
        const audio = new Audio('/notification/message.mp3');
        audio.play();
  
      }
    };

   
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch, selectedUser?._id, user?.userId]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader setOpenSidebar={setOpenSidebar} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader setOpenSidebar={setOpenSidebar} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message, i) => (
          <div
            key={i}
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

      {isUserTyping && (
        <div className="text-gray-400 text-base pl-4">
          {user?.username} Typing...
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
