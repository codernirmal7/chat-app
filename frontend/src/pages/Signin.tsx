import { FormEvent, useState } from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import { FaLock } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { BiSolidHand } from "react-icons/bi";
import { FiEyeOff } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

export const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState({
    errors: false,
    message: "",
  });
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const validateForm = (): boolean => {
    const { identifier, password } = formData;
    const newErrors = {
      identifier: "",
      password: "",
    };

    if (!identifier.trim()) {
      newErrors.identifier = "Email/Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setResponseMessage({ errors: false, message: "" });

    try {
      setIsLoggingIn(true);

      const result = await dispatch(signIn(formData)).unwrap();
      toast.success(result.message);

      // Reset form and errors
      setErrors({
        identifier: "",
        password: "",
      });
      setIsLoggingIn(false);

      setFormData({
        identifier: "",
        password: "",
      });

      // Redirect to home page after successful signin
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (error: any) {
      setIsLoggingIn(false);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "An error occurred";
      setResponseMessage({
        errors: true,
        message: errorMessage,
      });
    }
  };
  return (
    <>
      <div className="h-screen grid lg:grid-cols-2 mt-7">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-14">
          <div className="w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
                >
                  <BiSolidHand className="w-6 h-6 text-primary animate-bounce" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                <p className="text-base-content/60">Sign in to your account</p>
              </div>
            </div>

            {responseMessage.errors && (
              <div className="w-full flex items-center justify-center text-center">
                <span className="w-full text-error border border-error/30 rounded-lg p-3">
                  {responseMessage.message}
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Identifier</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CiMail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 ${
                      errors.identifier ? "input-error" : ""
                    }`}
                    placeholder="Email or Username"
                    value={formData.identifier}
                    onChange={(e) =>
                      handleInputChange("identifier", e.target.value)
                    }
                    aria-invalid={!!errors.identifier}
                    aria-describedby={
                      errors.identifier ? "identifier-error" : undefined
                    }
                  />
                </div>
                {errors.identifier && (
                  <span className="text-error text-sm mt-1">
                    {errors.identifier}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-10 ${
                      errors.password ? "input-error" : ""
                    }`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-base-content/40" />
                    ) : (
                      <BsEye className="h-5 w-5 text-base-content/40" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-error text-sm mt-1">
                    {errors.password}
                  </span>
                )}
                {!errors.password && (
                  <div className="mt-2">
                    <Link to="/forget-password" className="link link-primary">
                      forget password?
                    </Link>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <TbLoader2 className="h-5 w-5 animate-spin" />
                    Sign in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="link link-primary">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Pattern */}
        <AuthImagePattern
          title={"Welcome back!"}
          subtitle={
            "Sign in to continue your conversations and catch up with your messages."
          }
        />
      </div>
    </>
  );
};
