import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stacked Time - Smart Time Tracking",
  description: "Track time efficiently across multiple projects",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} ${rubik.className} min-h-screen`}>
        <NextAuthProvider>{children}</NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
