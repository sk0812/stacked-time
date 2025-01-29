"use client";

import { useSession } from "next-auth/react";

import AccountSettings from "@/components/dashboard/Settings/AccountSettings";
export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex bg-base-100">
      <div className="flex-1">
        <main className="p-6">
          <AccountSettings />
        </main>
      </div>
    </div>
  );
}
