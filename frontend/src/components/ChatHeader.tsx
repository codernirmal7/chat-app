import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getOnlineUsers } from "../socket/socket";
import { setSelectedUser } from "../redux/slices/messageSlice";

const ChatHeader = ({ setOpenSidebar }: { setOpenSidebar?: any }) => {
  const { selectedUser } = useSelector((state: RootState) => state.message);
  const dispatch = useDispatch<AppDispatch>();
  const onlineUsers = getOnlineUsers();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.avatar} alt={selectedUser?.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            dispatch(setSelectedUser(null));
            setOpenSidebar(true);
          }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
