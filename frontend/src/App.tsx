import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
    </Routes>
    <Toaster />
    </>
  );
}

export default App;
