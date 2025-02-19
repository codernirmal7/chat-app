// import { useChatStore } from "../store/useChatStore";

// import NoChatSelected from "../components/NoChatSelected";
import { useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import { RootState } from "../redux/store";
import NoChatSelected from "../components/NoChatSelected";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const {selectedUser} = useSelector((state : RootState)=> state.message)
  const {isAuthenticated} = useSelector((state : RootState)=> state.auth)
  const [openSidebar, setOpenSidebar] = useState(true);


  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated){
      navigate("/signin" ,{replace : true} )
    }
  }, []);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex h-full items-center justify-center  ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}/>

            {!selectedUser ? <NoChatSelected /> : <ChatContainer setOpenSidebar={setOpenSidebar}/>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;