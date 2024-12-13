import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { Route, Routes } from "react-router-dom";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Signin } from "./pages/Signin";
import { ForgetPassword } from "./pages/ForgetPassword";

function App() {

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/verify/:email" element={<VerifyEmail/>}/>
      <Route path="/forget-password" element={<ForgetPassword/>}/>
    </Routes>
    <Toaster />
    </>
  );
}

export default App;
