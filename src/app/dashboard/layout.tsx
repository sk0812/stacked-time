"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import DashboardNavbar from "@/components/dashboard/Navbar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.replace("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <DashboardNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <Footer variant="dark" />
    </div>
  );
}
