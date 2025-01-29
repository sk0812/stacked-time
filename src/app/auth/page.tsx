"use client";

import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

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
          {/* Toggle Switch */}
          {!showForgotPassword && (
            <div className="bg-base-200 p-1 rounded-full flex relative">
              <div
                className="absolute h-full top-0 w-1/2 bg-primary rounded-full transition-transform duration-200"
                style={{
                  transform: `translateX(${isSignIn ? "0%" : "100%"})`,
                }}
              />
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 relative z-10 py-2 text-sm font-medium rounded-full transition-colors ${
                  isSignIn ? "text-white" : "text-base-content"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 relative z-10 py-2 text-sm font-medium rounded-full transition-colors ${
                  !isSignIn ? "text-white" : "text-base-content"
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
