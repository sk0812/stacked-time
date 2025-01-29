"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import VerificationCodeInput from "./VerificationCodeInput";
import PasswordInput from "./PasswordInput";

type SignUpStep = "initial" | "verification" | "password";

export default function SignUpForm() {
  const [step, setStep] = useState<SignUpStep>("initial");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setVerificationToken(data.token);
      setStep("verification");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("already registered")
      ) {
        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationComplete = async (code: string) => {
    setError("");
    setLoading(true);

    try {
      console.log("Verifying with token:", verificationToken);
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, token: verificationToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setStep("password");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
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
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setVerificationToken(data.token);
      console.log("New verification token set:", data.token);
      return data.token;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to resend code"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordComplete = async (password: string) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Sign in the user
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
        <p className="text-slate-600">Get started with your free account</p>
      </div>

      {step === "initial" && (
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="input input-bordered w-full"
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <div className="text-error text-sm">{error}</div>}

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            Create Account
          </button>
        </form>
      )}

      {step === "verification" && (
        <div className="space-y-4">
          <VerificationCodeInput
            onComplete={handleVerificationComplete}
            onResendCode={handleResendCode}
            onCodeChange={() => error && setError("")}
            email={email}
          />
          {error && (
            <div className="text-error text-sm text-center">
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {step === "password" && (
        <div className="space-y-4">
          <PasswordInput onComplete={handlePasswordComplete} />
          {error && (
            <div className="text-error text-sm">
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
