import { useDispatch, useSelector } from "react-redux";
import { ThemeController } from "./ThemeController";
import { AppDispatch, RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { getUserData, logout } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const handleLogout = async() => {
    try {
     await dispatch(logout()).unwrap();
     toast.success("Logout successfully");
     setTimeout(() => {
      navigate("/signin");
     },1000)
     await dispatch(getUserData()).unwrap();

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-12 rounded-lg bg-primary/10 p-2 flex items-center justify-center">
                <img src="/vite.svg" alt="logo" />
              </div>
              <h1 className="text-lg font-bold">Chat App</h1>
            </a>
          </div>

         

          <div className="flex items-center gap-5">
          {isAuthenticated ? (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center"onClick={handleLogout} >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )
            :
            (
              <Link to="/signin" className={`btn btn-sm gap-2`}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )
          
          }
            <ThemeController/>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
