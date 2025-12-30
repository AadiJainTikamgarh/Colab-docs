import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const { unhashedToken } = useParams<{ unhashedToken: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${unhashedToken}`);
        setStatus("success");
        setMessage(
          response.data?.message || "Your email has been verified successfully!"
        );
      } catch (err: any) {
        console.log(err);
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Failed to verify email. The link may be invalid or expired."
        );
      }
    };

    if (unhashedToken) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage(
        "Invalid verification link. Please check your email for the correct verification link or request a new one."
      );
    }
  }, [unhashedToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-4">
                <svg
                  className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Verifying your email...
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Please wait while we verify your email address
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3 sm:p-4">
                  <svg
                    className="h-12 w-12 sm:h-16 sm:w-16 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Email Verified!
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">{message}</p>
              <div className="mt-6 sm:mt-8 space-y-3">
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="block w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Sign in to your account
                  </Link>
                )}
                <Link
                  to="/"
                  className="block w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Go to home
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-red-100 p-3 sm:p-4">
                  <svg
                    className="h-12 w-12 sm:h-16 sm:w-16 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Verification Failed
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">{message}</p>
              <div className="mt-6 sm:mt-8 space-y-3">
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="block w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Go to login
                  </Link>
                )}
                <Link
                  to="/"
                  className="block w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Go to home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
