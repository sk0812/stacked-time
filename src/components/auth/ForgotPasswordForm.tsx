"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import VerificationCodeInput from "./VerificationCodeInput";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({
  onBack,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<{ email: string }>();
  const resetForm = useForm<{ password: string; confirmPassword: string }>();

  const handleEmailSubmit = async (data: { email: string }) => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, name: "User" }),
      });

      const result = await response.json();
      if (result.success) {
        setEmail(data.email);
        setVerificationToken(result.token);
        setStep("verify");
      } else {
        setError(result.error || "Failed to send verification code");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async (code: string) => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          token: verificationToken,
        }),
      });

      if (response.ok) {
        setStep("reset");
      } else {
        const data = await response.json();
        setError(data.error || "Invalid verification code");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "User" }),
      });

      const result = await response.json();
      if (result.success) {
        setVerificationToken(result.token);
        setSuccess("Verification code sent successfully");
        setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
        return result.token;
      }
      setError(result.error || "Failed to resend code");
      return null;
    } catch (error) {
      setError("An error occurred. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (data: { password: string }) => {
    setError("");
    setLoading(true);
    try {
      console.log("Resetting password with token:", verificationToken);
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: verificationToken,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(
          "Password reset successful! You can now sign in with your new password. Redirecting..."
        );
        setTimeout(() => {
          onBack(); // Return to sign in tab after showing success message
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Verify Email</h2>
          <p className="text-slate-600">
            We've sent a verification code to your email
          </p>
        </div>
        <div className="space-y-4">
          {error && <div className="alert alert-error text-sm">{error}</div>}
          {success && (
            <div className="alert alert-success text-sm">{success}</div>
          )}
          <VerificationCodeInput
            email={email}
            onComplete={handleVerificationComplete}
            onResendCode={handleResendCode}
          />
          <button
            onClick={() => setStep("email")}
            className="btn btn-link btn-sm w-full"
            disabled={loading}
          >
            Back to email
          </button>
        </div>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Reset Password</h2>
          <p className="text-slate-600">Enter your new password below</p>
        </div>
        <form
          onSubmit={resetForm.handleSubmit(handlePasswordReset)}
          className="space-y-4"
        >
          {error && <div className="alert alert-error text-sm">{error}</div>}
          {success && (
            <div className="alert alert-success text-sm">{success}</div>
          )}
          <div>
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              {...resetForm.register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              disabled={loading}
            />
            {resetForm.formState.errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {resetForm.formState.errors.password.message as string}
                </span>
              </label>
            )}
          </div>
          <div>
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              {...resetForm.register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === resetForm.watch("password") ||
                  "Passwords do not match",
              })}
              disabled={loading}
            />
            {resetForm.formState.errors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {resetForm.formState.errors.confirmPassword.message as string}
                </span>
              </label>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
          <button
            type="button"
            onClick={() => setStep("verify")}
            className="btn btn-link btn-sm w-full"
            disabled={loading}
          >
            Back
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Forgot Password</h2>
        <p className="text-slate-600">
          Enter your email to receive a verification code
        </p>
      </div>
      <form
        onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
        className="space-y-4"
      >
        {error && <div className="alert alert-error text-sm">{error}</div>}
        <div>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            {...emailForm.register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            disabled={loading}
          />
          {emailForm.formState.errors.email && (
            <label className="label">
              <span className="label-text-alt text-error">
                {emailForm.formState.errors.email.message as string}
              </span>
            </label>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Sending Code..." : "Send Reset Code"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-link btn-sm w-full"
          disabled={loading}
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
}
