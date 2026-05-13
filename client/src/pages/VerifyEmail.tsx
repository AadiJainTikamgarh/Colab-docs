import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";
import {
  AuthAlert,
  AuthShell,
  authPrimaryButtonClass,
  authSecondaryLinkClass,
} from "@/components/auth/AuthShell";

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

  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <AuthShell
      title={
        status === "loading"
          ? "Verifying your email"
          : isSuccess
            ? "Email verified"
            : "Verification failed"
      }
      description={
        status === "loading"
          ? "Please wait while we confirm your email address."
          : message
      }
    >
      <div className="space-y-5 text-center lg:text-left">
        <div className="flex justify-center lg:justify-start">
          {status === "loading" && (
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-slate-900 text-white">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
          )}
          {isSuccess && (
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <CheckCircle2 className="h-7 w-7" />
            </div>
          )}
          {isError && (
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-red-50 text-red-600 ring-1 ring-red-200">
              <XCircle className="h-7 w-7" />
            </div>
          )}
        </div>

        {isSuccess && <AuthAlert tone="success">{message}</AuthAlert>}
        {isError && <AuthAlert tone="error">{message}</AuthAlert>}

        {status !== "loading" && (
          <div className="space-y-3">
            {!isAuthenticated && (
              <Link to="/login" className={authPrimaryButtonClass}>
                {isSuccess ? "Sign in to your account" : "Go to login"}
              </Link>
            )}
            <Link
              to="/"
              className={`flex h-11 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm ${authSecondaryLinkClass}`}
            >
              Go to home
            </Link>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
