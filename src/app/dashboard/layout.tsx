"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
