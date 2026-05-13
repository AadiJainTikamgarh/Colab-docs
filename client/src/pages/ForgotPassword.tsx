import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  AuthAlert,
  AuthShell,
  authInputClass,
  authPrimaryButtonClass,
  authSecondaryLinkClass,
} from "@/components/auth/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/resend-forgot-password-mail", {
        email,
      });
      setSuccess(
        response.data?.message ||
          "Password reset link has been sent to your email address."
      );
      setEmail("");
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email address and we will send you a secure reset link."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <AuthAlert tone="error">{error}</AuthAlert>}
        {success && <AuthAlert tone="success">{success}</AuthAlert>}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={authPrimaryButtonClass}
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </button>

        <div className="text-center text-sm">
          <Link to="/login" className={authSecondaryLinkClass}>
            Back to login
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
