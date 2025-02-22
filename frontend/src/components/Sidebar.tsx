import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getCurrentUserId, getOnlineUsers, getSocket } from "../socket/socket";
import {
  fetchUnseenMessages,
  getUsers,
  markMessageAsRead,
  setSelectedUser,
} from "../redux/slices/messageSlice";

const Sidebar = ({
  openSidebar,
  setOpenSidebar,
}: {
  openSidebar: boolean;
  setOpenSidebar: any;
}) => {
  const { users, selectedUser, isUsersLoading } = useSelector(
    (state: RootState) => state.message
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Change unseenMessages to an object that tracks unseen message counts by userId
  const [unseenMessages, setUnseenMessages] = useState<{
    [userId: string]: number;
  }>({});

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?.userId) return;
  
    const handleUpdateUnseen = (data: { senderId: string; unseenCount: number }) => {
      setUnseenMessages((prev) => ({
        ...prev,
        [data.senderId]: data.unseenCount, // Update with latest unseen count
      }));
    };
  
    socket.on("updateUnseenCount", handleUpdateUnseen);
  
    return () => {
      socket.off("updateUnseenCount", handleUpdateUnseen);
    };
  }, [user?.userId]);
  

  

  useEffect(() => {
    // You can initially set online users from the socket helper
    const onlineUsers = getOnlineUsers();

    const onlineUserExceptCurrentUser = onlineUsers.filter(
      (userId) => userId !== getCurrentUserId()
    );

    setOnlineUsers(onlineUserExceptCurrentUser);

    // Optionally, subscribe to socket events to update online users
    const socket = getSocket();
    socket?.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    // Cleanup listener on unmount
    return () => {
      socket?.off("getOnlineUsers");
    };
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUsers());
    }
  }, [dispatch]);

  // Filter users based on the online-only toggle
  const filteredUsers = showOnlineOnly
    ? Array.isArray(users)
      ? users.filter((user) => onlineUsers.includes(user._id))
      : []
    : Array.isArray(users)
    ? users
    : [];

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full ${
        openSidebar ? "w-full" : "w-0 opacity-0"
      } lg:opacity-100 z-10 bg-base-200/80 backdrop-blur-lg fixed lg:relative lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200`}
    >
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium block">Contacts</span>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1 <= 0 ? 0 : onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 flex flex-col gap-3">
        {filteredUsers.map((item) => (
          <button
            key={item._id}
            onClick={() => {
              dispatch(setSelectedUser(item));
              setOpenSidebar(false);
              user?.userId && dispatch(markMessageAsRead({senderId : item._id}));
              setUnseenMessages((prev : any) => ({...prev , [item._id] : 0}))
            }} // Dispatch selected user to Redux store
            className={`w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === item._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
          >
            <div className="relative mx-0">
             <div className="absolute top-0 right-0">
             
             {unseenMessages[item._id] > 0 && (
                <span className="bg-primary rounded-full text-base-300 p-3 w-4 h-4 flex items-center justify-center">
                  {unseenMessages[item._id] || 0}
                  
                </span>
               )} 
             </div>

              <img
                src={item.avatar || "/avatar.png"}
                alt={item.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(item._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="text-left min-w-0">
              <div className="font-medium truncate">{item.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(item._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
