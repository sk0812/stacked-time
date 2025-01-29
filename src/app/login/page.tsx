"use client";

import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Pass this to SignInForm to track when forgot password is shown
  const handleForgotPasswordToggle = (show: boolean) => {
    setShowForgotPassword(show);
  };

  return (
    <div className="flex min-h-screen">
      {/* Right Section - Auth Forms */}
      <div className="w-full bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          {/* Brand Link */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-3xl font-bold text-slate-800 hover:text-blue-600 transition-colors"
          >
            <Clock className="w-8 h-8" />
            Stacked Time
          </Link>

          {/* Toggle Switch */}
          {!showForgotPassword && (
            <div className="bg-slate-100 p-1 rounded-full flex relative">
              <div
                className="absolute h-full top-0 w-1/2 bg-blue-600 rounded-full transition-transform duration-200"
                style={{
                  transform: `translateX(${isSignIn ? "0%" : "100%"})`,
                }}
              />
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 relative z-10 py-2 text-sm font-medium rounded-full transition-colors ${
                  isSignIn ? "text-white" : "text-slate-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 relative z-10 py-2 text-sm font-medium rounded-full transition-colors ${
                  !isSignIn ? "text-white" : "text-slate-600"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Auth Forms */}
          <div className="transition-all duration-200">
            {isSignIn ? (
              <SignInForm onForgotPasswordChange={handleForgotPasswordToggle} />
            ) : (
              <SignUpForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
