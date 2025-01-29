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
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Create an account</h2>
        <p className="text-slate-600">Start tracking time efficiently</p>
      </div>

      {step === "initial" && (
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-slate-700 font-medium">
                Full Name
              </span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full bg-slate-50"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-slate-700 font-medium">
                Email
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="input input-bordered w-full bg-slate-50"
              placeholder="you@example.com"
              required
            />
          </div>

          {error && <div className="text-error text-sm">{error}</div>}

          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 text-white w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Continue"}
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
