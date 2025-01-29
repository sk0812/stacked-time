"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import VerificationCodeInput from "@/components/auth/VerificationCodeInput";

interface FormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

interface FormSuccess {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

interface AccountSettingsProps {
  onClose: () => void;
}

export default function AccountSettings({ onClose }: AccountSettingsProps) {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formSuccess, setFormSuccess] = useState<FormSuccess>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
  });

  // Fetch latest user data once on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/update-profile");
        const data = await res.json();
        if (res.ok && data) {
          const newData = {
            name: data.name || "",
            email: data.email || "",
          };
          setFormData((prev) => ({
            ...prev,
            ...newData,
          }));
          setInitialValues(newData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Fallback to session data if API fails
        if (session?.user) {
          const sessionData = {
            name: session.user.name || "",
            email: session.user.email || "",
          };
          setFormData((prev) => ({
            ...prev,
            ...sessionData,
          }));
          setInitialValues(sessionData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  // Clear success messages after 5 seconds
  useEffect(() => {
    if (Object.keys(formSuccess).length > 0) {
      const timer = setTimeout(() => {
        setFormSuccess({});
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [formSuccess]);

  const updateUserSession = async (
    newData: Partial<{ name: string; email: string }>
  ) => {
    try {
      if (session?.user) {
        session.user = {
          ...session.user,
          ...newData,
        };
      }
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  const hasChanges = () => {
    const hasNameChange = formData.name !== initialValues.name;
    const hasEmailChange = formData.email !== initialValues.email;
    const hasPasswordChange = formData.currentPassword && formData.newPassword;
    return hasNameChange || hasEmailChange || hasPasswordChange;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    setFormSuccess({});
    const hasNameChange = formData.name !== initialValues.name;
    const hasEmailChange = formData.email !== initialValues.email;
    const hasPasswordChange = formData.currentPassword && formData.newPassword;

    // Validate form
    const errors: FormErrors = {};
    if (hasNameChange && !formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (hasEmailChange && !formData.email.trim()) {
      errors.email = "Email is required";
    }
    if (hasPasswordChange) {
      if (formData.newPassword !== formData.confirmPassword) {
        errors.password = "New passwords don't match";
      } else if (formData.newPassword.length < 6) {
        errors.password = "New password must be at least 6 characters long";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Update name if changed
      if (hasNameChange) {
        const res = await fetch("/api/user/update-profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name }),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update profile");

        // Update local state and session
        const newName = data.name;
        setInitialValues((prev) => ({ ...prev, name: newName }));
        await updateUserSession({ name: newName });
        setFormSuccess((prev) => ({
          ...prev,
          name: "Your profile name has been changed.",
        }));
      }

      // Update email if changed
      if (hasEmailChange) {
        const res = await fetch("/api/auth/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: initialValues.email,
            newEmail: formData.email,
            name: formData.name,
          }),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to send verification code");

        setVerificationToken(data.token);
        setIsVerifyingEmail(true);
        setFormSuccess((prev) => ({
          ...prev,
          email: "Please check your current email for the verification code.",
        }));
        return;
      }

      // Update password if changed
      if (hasPasswordChange) {
        const res = await fetch("/api/user/update-password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update password");

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        setFormSuccess((prev) => ({
          ...prev,
          password:
            "Your password has been changed. Please use your new password next time you sign in.",
        }));
      }

      if (!hasNameChange && !hasEmailChange && !hasPasswordChange) {
        setFormSuccess({
          general:
            "No changes detected. Make some changes to your profile before saving.",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setFormErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      // Verify the code
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: initialValues.email,
          newEmail: formData.email,
          code,
          token: verificationToken,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok)
        throw new Error(verifyData.error || "Invalid verification code");

      // Update email
      const updateRes = await fetch("/api/user/update-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEmail: initialValues.email,
          newEmail: formData.email,
          code,
          token: verificationToken,
        }),
        credentials: "include",
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok)
        throw new Error(updateData.error || "Failed to update email");

      // Update local state and session
      const newEmail = updateData.email;
      setInitialValues((prev) => ({ ...prev, email: newEmail }));
      await updateUserSession({ email: newEmail });

      setIsVerifyingEmail(false);
      setVerificationToken(null);
      setFormSuccess((prev) => ({
        ...prev,
        email:
          "Your email address has been changed. Please use your new email next time you sign in.",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setFormErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: initialValues.email,
          newEmail: formData.email,
          name: formData.name,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to send verification code");

      setVerificationToken(data.token);
      setFormSuccess((prev) => ({
        ...prev,
        general: "Verification code resent to your current email",
      }));
      return data.token;
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        general:
          error instanceof Error
            ? error.message
            : "Failed to send verification code",
      }));
      return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Account Settings</h3>
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
          <X className="w-5 h-5" />
        </button>
      </div>

      {isVerifyingEmail ? (
        <div className="space-y-4">
          <VerificationCodeInput
            onComplete={handleVerifyCode}
            onResendCode={handleResendCode}
            email={initialValues.email}
            newEmail={formData.email}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            {isLoading ? (
              <div className="h-12 bg-base-200 animate-pulse rounded-lg" />
            ) : (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                  setFormErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`input input-bordered ${
                  formErrors.name ? "input-error" : ""
                }`}
                placeholder="Enter your full name"
              />
            )}
          </div>

          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            {isLoading ? (
              <div className="h-12 bg-base-200 animate-pulse rounded-lg" />
            ) : (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                  setFormErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`input input-bordered ${
                  formErrors.email ? "input-error" : ""
                }`}
                placeholder="Enter your email"
              />
            )}
          </div>

          {/* Password Section */}
          <div className="divider">Change Password</div>

          {/* Current Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Current Password</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }));
                  setFormErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="input input-bordered w-full pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }));
                  setFormErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="input input-bordered w-full pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                  setFormErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="input input-bordered w-full pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-2">
            {Object.values(formSuccess).map(
              (message, index) =>
                message && (
                  <div key={index} className="text-success text-sm">
                    {message}
                  </div>
                )
            )}
            {Object.values(formErrors).map(
              (message, index) =>
                message && (
                  <div
                    key={index}
                    className="text-error text-sm flex items-center gap-1"
                  >
                    <AlertCircle size={14} />
                    {message}
                  </div>
                )
            )}
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!hasChanges()}
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
