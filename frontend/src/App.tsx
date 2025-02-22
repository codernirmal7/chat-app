import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { Navigate, Route, Routes } from "react-router-dom";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Signin } from "./pages/Signin";
import { ForgetPassword } from "./pages/ForgetPassword";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { useEffect } from "react";
import { getUserData } from "./redux/slices/authSlice";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { connectSocket, disconnectSocket } from "./socket/socket";

function App() {

  const {isAuthenticated, user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=>{
    dispatch(getUserData())
  },[])

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect the socket when the user is authenticated
      connectSocket(user.userId);
      console.log(user.userId)
    } else {
      // Disconnect socket when user is not authenticated
      disconnectSocket();
    }
    
    return () => {
      // Disconnect the socket when the component unmounts
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/verify/:email" element={<VerifyEmail/>}/>
      <Route path="/forget-password" element={<ForgetPassword/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    <Toaster />
    </>
  );
}

export default App;