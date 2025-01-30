"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-slate-800 mt-4">
            Page Not Found
          </h2>
          <p className="text-slate-600 mt-2">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white gap-2"
            >
              <MoveLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/"
                className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white gap-2"
              >
                <MoveLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <Link
                href="/login"
                className="btn btn-ghost text-slate-600 hover:bg-slate-200"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
