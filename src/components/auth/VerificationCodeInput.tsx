"use client";

import { useState, useRef, useEffect } from "react";

interface VerificationCodeInputProps {
  onComplete: (code: string) => void;
  onResendCode: () => Promise<string | null>;
  onCodeChange?: () => void;
  email: string;
  newEmail?: string;
}

export default function VerificationCodeInput({
  onComplete,
  onResendCode,
  onCodeChange,
  email,
  newEmail,
}: VerificationCodeInputProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Start countdown timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    try {
      const newToken = await onResendCode();
      if (newToken) {
        // Clear the input fields and reset timer only if we got a new token
        setCode(["", "", "", "", "", ""]);
        setResendTimer(60);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]; // Only take the first character
    }

    // Call onCodeChange when user starts typing
    onCodeChange?.();

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // If a digit was entered, move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all digits are entered, call onComplete
    if (newCode.every((digit) => digit) && value) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // On backspace, clear current input and move to previous
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="text-sm font-medium text-gray-700">
        Enter verification code
      </label>
      <div className="flex gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="input input-bordered w-12 h-12 text-center text-xl"
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
        <p>
          {newEmail
            ? `Enter the 6-digit code sent to ${email} to verify your new email: ${newEmail}`
            : `Enter the 6-digit code sent to ${email}`}
        </p>
        {resendTimer > 0 ? (
          <p className="text-gray-400">
            Resend code in <span className="font-medium">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="text-primary hover:text-primary-focus hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </div>
  );
}
