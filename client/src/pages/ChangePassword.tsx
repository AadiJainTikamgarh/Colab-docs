import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Info } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import {
  AuthAlert,
  AuthShell,
  authPasswordInputClass,
  authPrimaryButtonClass,
  authSecondaryLinkClass,
} from "@/components/auth/AuthShell";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePassword = useAuthStore((state) => state.changePassword);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({ oldPassword, newPassword });
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Change your password"
      description="Confirm your current password and choose a stronger one."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <AuthAlert tone="error">{error}</AuthAlert>}
        {success && <AuthAlert tone="success">{success}</AuthAlert>}

        <div className="space-y-4">
          <PasswordField
            id="oldPassword"
            label="Current password"
            value={oldPassword}
            show={showOldPassword}
            autoComplete="current-password"
            onChange={setOldPassword}
            onToggle={() => setShowOldPassword(!showOldPassword)}
          />

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700"
              >
                New password
              </label>
              <button
                type="button"
                onClick={() => setShowPasswordInfo(!showPasswordInfo)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
                aria-label="Password requirements"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <PasswordFieldBody
              id="newPassword"
              value={newPassword}
              show={showNewPassword}
              onChange={setNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
            />
            {showPasswordInfo && (
              <AuthAlert tone="info">
                Use at least 8 characters. Mixing uppercase letters, lowercase
                letters, and numbers is recommended.
              </AuthAlert>
            )}
          </div>

          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            value={confirmPassword}
            show={showConfirmPassword}
            autoComplete="new-password"
            onChange={setConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || success !== ""}
          className={authPrimaryButtonClass}
        >
          {isLoading ? "Changing password..." : "Change password"}
        </button>

        <div className="text-center text-sm">
          <Link to="/" className={authSecondaryLinkClass}>
            Back to home
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
  autoComplete,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  show: boolean;
  autoComplete: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <PasswordFieldBody
        id={id}
        value={value}
        show={show}
        autoComplete={autoComplete}
        onChange={onChange}
        onToggle={onToggle}
      />
    </div>
  );
}

function PasswordFieldBody({
  id,
  value,
  show,
  autoComplete = "new-password",
  onChange,
  onToggle,
}: {
  id: string;
  value: string;
  show: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
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
        aria-label="Toggle password visibility"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
