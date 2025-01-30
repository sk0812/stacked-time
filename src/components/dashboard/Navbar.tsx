"use client";

import { Clock, Settings, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Container from "../ui/Container";
import { useState } from "react";
import AccountSettings from "./AccountSettings";

export default function DashboardNavbar() {
  const [showSettings, setShowSettings] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-200 transition-colors"
          >
            <Clock className="w-5 h-5" />
            Stacked Time
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden btn btn-ghost btn-sm text-slate-200 hover:text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-ghost btn-sm text-slate-200 hover:text-white"
            >
              <Settings className="w-4 h-4" />
              <span className="ml-2">Settings</span>
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn btn-ghost btn-sm text-slate-200 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-2">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowSettings(true);
                  setIsMenuOpen(false);
                }}
                className="btn btn-ghost btn-sm text-slate-200 hover:text-white justify-start"
              >
                <Settings className="w-4 h-4" />
                <span className="ml-2">Settings</span>
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-ghost btn-sm text-slate-200 hover:text-white justify-start"
              >
                <LogOut className="w-4 h-4" />
                <span className="ml-2">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </Container>

      {/* Account Settings Modal */}
      <dialog
        id="account_settings_modal"
        className={`modal modal-bottom sm:modal-middle ${
          showSettings ? "modal-open" : ""
        }`}
      >
        <div className="modal-box">
          <AccountSettings onClose={() => setShowSettings(false)} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowSettings(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
