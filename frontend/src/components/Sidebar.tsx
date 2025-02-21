import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getCurrentUserId, getOnlineUsers, getSocket } from "../socket/socket";
import { getUsers, setSelectedUser } from "../redux/slices/messageSlice";

const Sidebar = ({ openSidebar , setOpenSidebar }: { openSidebar: boolean , setOpenSidebar : any }) => {
  const { users, selectedUser, isUsersLoading, } = useSelector((state: RootState) => state.message);
  const {isAuthenticated } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  // const onlineUsers = getOnlineUsers(); // Ensure this returns a valid array of online user IDs
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);



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
    if(isAuthenticated){
      dispatch(getUsers());
    }
  }, [dispatch]);

  // Filter users based on the online-only toggle
  const filteredUsers = showOnlineOnly
  ? Array.isArray(users) ? users.filter((user) => onlineUsers.includes(user._id)) : []
  : Array.isArray(users) ? users : [];


  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className={`h-full ${openSidebar ? "w-full" : "w-0 opacity-0"} lg:opacity-100 z-10 bg-base-200/80 backdrop-blur-lg fixed lg:relative lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200`}>
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
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1 <= 0 ? 0 : onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 flex flex-col gap-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              dispatch(setSelectedUser(user));
              setOpenSidebar(false)}
            } // Dispatch selected user to Redux store
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-0">
              <img
                src={user.avatar || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
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
