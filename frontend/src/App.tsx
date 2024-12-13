import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { Navigate, Route, Routes } from "react-router-dom";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Signin } from "./pages/Signin";
import { ForgetPassword } from "./pages/ForgetPassword";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./redux/store";
import { useEffect } from "react";
import { getUserData } from "./redux/slices/authSlice";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=>{
    dispatch(getUserData())
  },[])

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
