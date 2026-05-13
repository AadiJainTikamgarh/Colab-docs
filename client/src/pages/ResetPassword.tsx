import { useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import {
  AuthAlert,
  AuthShell,
  authPasswordInputClass,
  authPrimaryButtonClass,
  authSecondaryLinkClass,
} from "@/components/auth/AuthShell";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { unhashedToken } = useParams<{ unhashedToken: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/auth/reset-password/${unhashedToken}`, {
        newPassword,
      });
      setSuccess(response.data?.message || "Password reset successfully!");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link may be invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Choose a new password"
      description="Enter a new password for your Colab Docs account."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <AuthAlert tone="error">{error}</AuthAlert>}
        {success && <AuthAlert tone="success">{success}</AuthAlert>}

        <div className="space-y-4">
          <PasswordField
            id="newPassword"
            label="New password"
            value={newPassword}
            show={showNewPassword}
            onChange={setNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            show={showConfirmPassword}
            onChange={setConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || success !== ""}
          className={authPrimaryButtonClass}
        >
          {isLoading ? "Resetting..." : "Reset password"}
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

function PasswordField({
  id,
  label,
  value,
  show,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={authPasswordInputClass}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-900 focus:outline-none"
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
