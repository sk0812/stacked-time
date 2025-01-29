"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface SignInFormProps {
  onForgotPasswordChange?: (show: boolean) => void;
}

export default function SignInForm({
  onForgotPasswordChange,
}: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    onForgotPasswordChange?.(showForgotPassword);
  }, [showForgotPassword, onForgotPasswordChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>
        <p className="text-slate-600">Track your time, maximize your success</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text text-slate-700 font-medium">Email</span>
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
        <div>
          <label className="label">
            <span className="label-text text-slate-700 font-medium">
              Password
            </span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="input input-bordered w-full pr-10 bg-slate-50"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {error && <div className="text-error text-sm">{error}</div>}
        <button
          type="submit"
          className="btn bg-blue-600 hover:bg-blue-700 text-white w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="btn btn-ghost btn-sm w-full text-slate-600 hover:text-blue-600"
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}
