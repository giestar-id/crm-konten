"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Menu,
  Search,
  Plus,
  HelpCircle,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
}

export function TopHeader({ onToggleMobileSidebar }: TopHeaderProps) {
  const {
    activeWorkspace,
    setActivePage,
    searchQuery,
    setSearchQuery,
    showToast,
    user,
    logout,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Aji Subekti";

  const userInitials =
    userDisplayName
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AS";

  return (
    <header className="h-16 border-b border-[#EAEAEA] bg-white px-4 lg:px-7 flex items-center justify-between shrink-0 select-none">
      {/* Left: Mobile Menu Trigger + Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg border border-[#EAEAEA] text-neutral-600 hover:bg-neutral-100 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative w-full max-w-[320px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content, ideas, platforms..."
            className="w-full pl-9 pr-14 py-1.5 text-[13px] bg-white border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-neutral-400 text-neutral-800 placeholder-neutral-400 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 bg-neutral-100 rounded border border-neutral-200/80">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 bg-neutral-100 rounded border border-neutral-200/80">
              F
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions, Help Center & User Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Workspace Pill */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAFAFA] border border-[#EAEAEA] text-xs text-neutral-600">
          <Layers className="w-3.5 h-3.5 text-neutral-500" />
          <span className="font-medium text-neutral-800">{activeWorkspace.name}</span>
        </div>

        {/* Quick Action: 1-Click Compose CTA */}
        <button
          onClick={() => setActivePage("compose")}
          className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Buat Post</span>
        </button>

        {/* Help Center */}
        <button
          onClick={() =>
            showToast("Social Post Hub v1.0 — Dokumentasi panduan API & Creator CRM")
          }
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[#737373] hover:text-[#171717] transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#171717] hover:text-neutral-700 transition-colors pl-1"
          >
            <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-medium">
              {userInitials}
            </div>
            <span className="hidden md:inline capitalize">{userDisplayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EAEAEA] rounded-xl shadow-xl py-1.5 z-50">
              <div className="px-4 py-2 border-b border-[#EAEAEA]">
                <p className="text-xs font-semibold text-neutral-900 capitalize">{userDisplayName}</p>
                <p className="text-[11px] text-neutral-500 font-mono truncate">{user?.email || "creator@crm-konten.id"}</p>
              </div>
              <button
                onClick={() => {
                  setActivePage("settings");
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
              >
                <span>Profile & Timezone</span>
              </button>
              <button
                onClick={() => {
                  setActivePage("accounts");
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
              >
                <span>OAuth Connected Accounts</span>
              </button>
              <div className="my-1 border-t border-[#EAEAEA]"></div>
              <button
                onClick={async () => {
                  setProfileDropdownOpen(false);
                  await logout();
                }}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center justify-between font-medium transition-colors"
              >
                <span>Keluar (Logout)</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
