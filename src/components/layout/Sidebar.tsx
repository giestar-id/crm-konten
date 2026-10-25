"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ActivePage, Workspace } from "@/types";
import {
  PieChart,
  Send,
  Kanban,
  Calendar,
  TrendingUp,
  Lightbulb,
  Film,
  Share2,
  Contact2,
  Bell,
  Settings,
  ChevronsUpDown,
  Plus,
  Check,
  Code,
  X,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenWorkspaceModal: () => void;
}

export function Sidebar({
  mobileOpen,
  setMobileOpen,
  onOpenWorkspaceModal,
}: SidebarProps) {
  const {
    activePage,
    setActivePage,
    activeWorkspace,
    workspaces,
    setActiveWorkspace,
    unreadNotifCount,
    logout,
  } = useApp();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: <PieChart className="w-4 h-4 stroke-[2]" /> },
    { id: "compose", label: "Composer (1-Click)", icon: <Send className="w-4 h-4" /> },
    { id: "pipeline", label: "Content Pipeline", icon: <Kanban className="w-4 h-4" /> },
    { id: "calendar", label: "Calendars & Schedule", icon: <Calendar className="w-4 h-4" /> },
  ];

  const databaseItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "ideas", label: "Ideas Bank & AI", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "media", label: "Media Assets", icon: <Film className="w-4 h-4" /> },
    { id: "accounts", label: "Social Accounts", icon: <Share2 className="w-4 h-4" /> },
    { id: "contacts", label: "Sponsor CRM", icon: <Contact2 className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
    },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-[1px] transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[240px] bg-[#FAFAFA] border-r border-[#EAEAEA] flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out select-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="overflow-y-auto">
          {/* Brand Header matching minimalist reference */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-transparent">
            <button
              onClick={() => handleNavClick("dashboard")}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-6 h-6 rounded bg-[#171717] flex items-center justify-center text-white text-[11px] font-bold tracking-tight">
                S
              </div>
              <div>
                <span className="text-[14px] font-bold tracking-tight text-[#171717] block leading-none">
                  SOCIAL POST HUB
                </span>
                <span className="text-[10px] text-[#737373] tracking-wide block mt-0.5">
                  Multi-Platform & CRM
                </span>
              </div>
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-neutral-200 text-neutral-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Navigation List */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-[#EFEFEF] text-[#171717] font-semibold"
                      : "text-[#737373] hover:bg-neutral-200/50 hover:text-[#171717]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-2 border-t border-[#EAEAEA]"></div>

          {/* Database Section */}
          <div className="px-3 py-1">
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              DATABASE & ASSETS
            </p>
            <nav className="space-y-1">
              {databaseItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-[#EFEFEF] text-[#171717] font-semibold"
                        : "text-[#737373] hover:bg-neutral-200/50 hover:text-[#171717]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#171717] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-[#EAEAEA]"></div>

          {/* Settings */}
          <nav className="px-3 py-1 space-y-1">
            <button
              onClick={() => handleNavClick("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                activePage === "settings"
                  ? "bg-[#EFEFEF] text-[#171717] font-semibold"
                  : "text-[#737373] hover:bg-neutral-200/50 hover:text-[#171717]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={async () => {
                setMobileOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </nav>
        </div>

        {/* Bottom Workspace Switcher matching minimalist reference */}
        <div className="p-3 border-t border-[#EAEAEA] shrink-0 relative">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-neutral-200/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                style={{ backgroundColor: activeWorkspace.color || "#0A0A0A" }}
              >
                {activeWorkspace.initials}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-medium text-[#171717] block truncate">
                  {activeWorkspace.name}
                </span>
                <span className="text-[10px] text-[#737373] block truncate">
                  {activeWorkspace.connectedAccountsCount} Accounts • {activeWorkspace.role}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-neutral-500 shrink-0 ml-1" />
          </button>

          {/* Workspace Switcher Popover */}
          {workspaceMenuOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-white border border-[#EAEAEA] rounded-xl shadow-xl p-2 z-50">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase px-2 py-1">
                Workspaces (Batches)
              </div>
              <div className="space-y-1 my-1 max-h-48 overflow-y-auto">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspace(ws);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      activeWorkspace.id === ws.id
                        ? "bg-neutral-100 font-semibold text-neutral-900"
                        : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-white shrink-0 font-medium"
                        style={{ backgroundColor: ws.color }}
                      >
                        {ws.initials}
                      </div>
                      <span className="truncate">{ws.name}</span>
                    </div>
                    {activeWorkspace.id === ws.id && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#EAEAEA] pt-1 mt-1">
                <button
                  onClick={() => {
                    setWorkspaceMenuOpen(false);
                    onOpenWorkspaceModal();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
