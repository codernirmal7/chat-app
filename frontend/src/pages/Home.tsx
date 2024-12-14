// import { useChatStore } from "../store/useChatStore";

// import NoChatSelected from "../components/NoChatSelected";
import { useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { RootState } from "../redux/store";
import NoChatSelected from "../components/NoChatSelected";

const Home = () => {

  const {selectedUser} = useSelector((state : RootState)=> state.message)

  return (
    <div className="h-screen bg-base-200">
      <div className="flex h-full items-center justify-center  ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;