import { FormEvent, useEffect, useState } from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import { CiMail } from "react-icons/ci";
import { TbLoader2 } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  resendVerificationCodeEmail,
  verifyEmail,
} from "../redux/slices/authSlice";
import toast from "react-hot-toast";

export const VerifyEmail = () => {
  const [errors, setErrors] = useState({
    verificationCode: "",
  });
  const [responseMessage, setResponseMessage] = useState({
    errors: false,
    message: "",
  });
  const { email } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const [isVerificationSendingLoading, setIsVerificationSendingLoading] =
    useState(false);

  const [isResendingEmailLoading, setIsResendingEmailLoading] = useState(false);

  const [formData, setFormData] = useState({
    verificationCode: "",
  });

  const navigate = useNavigate();
  const fromRedirect = sessionStorage.getItem("fromRedirect");

  useEffect(() => {
    if (!fromRedirect) {
      navigate("/");
    } else {
      sessionStorage.removeItem("fromRedirect");
    }
  }, []);

  const validateForm = (): boolean => {
    const { verificationCode } = formData;
    const newErrors = {
      verificationCode: "",
    };

    if (!verificationCode.trim()) {
      newErrors.verificationCode = "Code is required";
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
      setIsVerificationSendingLoading(true);
      // send verification code to backend
      const result = await dispatch(
        verifyEmail({
          email: email as string,
          token: formData.verificationCode,
        })
      ).unwrap();
      toast.success(result.message);

      // If success then navigate to sign in page and reset form
      setIsVerificationSendingLoading(false);

      setFormData({
        verificationCode: "",
      });

      setTimeout(() => {
        navigate("/signin", { replace: true });
      }, 1000);
    } catch (error: any) {
      setIsVerificationSendingLoading(false);
      setResponseMessage({
        errors: true,
        message: error,
      });
    }
  };

  const handleResendVerificationCode = async () => {
    setResponseMessage({ errors: false, message: "" });
    try {
      setIsResendingEmailLoading(true);
      // send verification code to backend
      const result = await dispatch(
        resendVerificationCodeEmail({
          email: email as string,
        })
      ).unwrap();

      toast.success(result.message);

      setIsResendingEmailLoading(false);
    } catch (error: any) {
      setIsResendingEmailLoading(false);
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
                <h1 className="text-2xl font-bold mt-2">Verify your Email</h1>
                <p className="text-base-content/60">
                  We've sent a verification code to your email address.
                </p>
              </div>
              {responseMessage.errors && (
                <div className="w-full flex items-center justify-center text-center mt-4">
                  <span className="w-full text-error border border-error/30 rounded-lg p-5">
                    {responseMessage.message}
                  </span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 mt-5">
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
                        errors.verificationCode ? "input-error" : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.verificationCode}
                      onChange={(e) =>
                        handleInputChange("verificationCode", e.target.value)
                      }
                      aria-invalid={!!errors.verificationCode}
                      aria-describedby={
                        errors.verificationCode
                          ? "verificationCode-error"
                          : undefined
                      }
                    />
                  </div>
                  {errors.verificationCode && (
                    <span className="text-error text-start text-sm mt-1">
                      {errors.verificationCode}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isVerificationSendingLoading}
                >
                  {isVerificationSendingLoading ? (
                    <>
                      <TbLoader2 className="size-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <span className="font-circular-web">Verify</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="text-center ">
            <p className="text-base-content/60 flex gap-2 items-center">
              Request a new code?{" "}
              {isResendingEmailLoading ? (
                <TbLoader2 className="size-5 animate-spin" />
              ) : (
                <button
                  className="link link-primary link-hover"
                  onClick={handleResendVerificationCode}
                >
                  resend
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Right side */}
        <AuthImagePattern
          title="Join our community"
          subtitle="Get started by verifying your email address."
        />
      </div>
    </>
  );
};
