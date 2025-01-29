"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import Container from "../ui/Container";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`absolute w-full top-0 z-50 ${!isHomePage && "bg-primary"}`}
    >
      <Container>
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-white hover:text-blue-200 transition-colors"
          >
            <Clock className="w-6 h-6" />
            Stacked Time
          </Link>
          <Link
            href="/login"
            className="btn btn-ghost border border-white/20 text-white hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>
      </Container>
      {/* Divider - always show but with different styles based on page */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
}
