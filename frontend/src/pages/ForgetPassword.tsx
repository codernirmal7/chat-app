import React, { useState } from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { CiMail } from "react-icons/ci";
import { TbLoader2 } from "react-icons/tb";
import { BiLock, BiMailSend } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";
import {
  resetPassword,
  sendResetPasswordToken,
} from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const ForgetPassword = () => {
  const [errors, setErrors] = useState({
    resetPasswordToken: "",
    email: "",
    newPassword: "",
    newConfirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    errors: false,
    message: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  const [
    isResetPasswordTokenSendingLoading,
    setIsResetPasswordTokenSendingLoading,
  ] = useState(false);

  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);

  const [isCodeSent, setIsCodeSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    resetPasswordToken: "",
    newPassword: "",
    newConfirmPassword: "",
  });

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const { resetPasswordToken, email, newPassword, newConfirmPassword } =
      formData;
    const newErrors = {
      resetPasswordToken: "",
      email: "",
      newPassword: "",
      newConfirmPassword: "",
    };

    if (!resetPasswordToken.trim()) {
      newErrors.resetPasswordToken = "Code is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (newPassword !== newConfirmPassword) {
      newErrors.newConfirmPassword = "Passwords do not match";
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

  const handleSendResetPasswordTokenRequest = async () => {
    setResponseMessage({
      errors: false,
      message: "",
    });
    try {
      setIsResetPasswordTokenSendingLoading(true);
      const result = await dispatch(
        sendResetPasswordToken({
          email: formData.email,
        })
      ).unwrap();
      toast.success(result.message);

      setIsResetPasswordTokenSendingLoading(false);
      setIsCodeSent(true);
    } catch (error: any) {
      setIsResetPasswordTokenSendingLoading(false);
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

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setResponseMessage({ errors: false, message: "" });
    try {
      setIsResetPasswordLoading(true);
      const result = await dispatch(
        resetPassword({
          email: formData.email,
          token: formData.resetPasswordToken,
          newConfirmPassword: formData.newConfirmPassword,
          newPassword: formData.newPassword,
        })
      ).unwrap();

      toast.success(result.message);

      // Reset form and errors
      setErrors({
        email: "",
        resetPasswordToken: "",
        newConfirmPassword: "",
        newPassword: "",
      });
      setIsResetPasswordLoading(false);

      setFormData({
        email: "",
        resetPasswordToken: "",
        newPassword: "",
        newConfirmPassword: "",
      });

      setIsCodeSent(false);

      // Redirect to sign in page after successful reset password
      setTimeout(() => {
        navigate("/signin", { replace: true });
      }, 1000);
    } catch (error: any) {
      setIsResetPasswordLoading(false);
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
      <div className="min-h-screen grid lg:grid-cols-2 mt-12">
        {/* Left side */}
        <div className="flex items-center justify-center bg-base-200 p-6 sm:p-12 flex-col">
          <div className="max-w-md text-center">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
                >
                  <CiMail className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Reset Password</h1>
                <p className="text-base-content/60">
                  Enter your email and we will send you a link to reset your
                  password
                </p>
              </div>
              {responseMessage.errors && (
                <div className="w-full flex items-center justify-center text-center mt-4">
                  <span className="w-full text-error border border-error/30 rounded-lg p-5">
                    {responseMessage.message}
                  </span>
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4 mt-5">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CiMail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={"email"}
                      className={`input input-bordered w-full pl-10 ${
                        errors.email ? "input-error" : ""
                      }`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      disabled={
                        isCodeSent || isResetPasswordTokenSendingLoading
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={handleSendResetPasswordTokenRequest}
                      disabled={
                        isCodeSent || isResetPasswordTokenSendingLoading
                      }
                    >
                      {isResetPasswordTokenSendingLoading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <div className="flex items-center gap-2">
                          send code
                          <BiMailSend className="size-5 text-primary" />
                        </div>
                      )}
                    </button>
                  </div>
                  {errors.email && (
                    <span className="text-error text-start text-sm mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* verificationCode */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Code</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CiMail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10 ${
                        errors.resetPasswordToken ? "input-error" : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.resetPasswordToken}
                      onChange={(e) =>
                        handleInputChange("resetPasswordToken", e.target.value)
                      }
                      aria-invalid={!!errors.resetPasswordToken}
                      aria-describedby={
                        errors.resetPasswordToken
                          ? "resetPasswordToken-error"
                          : undefined
                      }
                    />
                  </div>
                  {errors.resetPasswordToken && (
                    <span className="text-error text-start text-sm mt-1">
                      {errors.resetPasswordToken}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiLock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10 ${
                        errors.newPassword ? "input-error" : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                      aria-invalid={!!errors.newPassword}
                      aria-describedby={
                        errors.newPassword ? "password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <BsEye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <span className="text-error text-start text-sm mt-1">
                      {errors.newPassword}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Confirm Password
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiLock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10 ${
                        errors.newConfirmPassword ? "input-error" : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.newConfirmPassword}
                      onChange={(e) =>
                        handleInputChange("newConfirmPassword", e.target.value)
                      }
                      aria-invalid={!!errors.newConfirmPassword}
                      aria-describedby={
                        errors.newConfirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                  </div>
                  {errors.newConfirmPassword && (
                    <span className="text-error text-start text-sm mt-1">
                      {errors.newConfirmPassword}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isResetPasswordLoading}
                >
                  {isResetPasswordLoading ? (
                    <>
                      <TbLoader2 className="size-5 animate-spin" />
                      Resetting new password...
                    </>
                  ) : (
                    <span className="font-circular-web">Verify</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right side */}
        <AuthImagePattern
          title="Forget Password"
          subtitle="Please enter your email address to receive a verification code."
        />
      </div>
    </>
  );
};
