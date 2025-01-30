"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // Only show home page content if user is not authenticated
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <Hero />
        <About />
        <Footer variant="light" />
      </main>
    );
  }

  // This return is technically not needed as authenticated users will be redirected,
  // but it's good practice to always have a return statement
  return null;
}
