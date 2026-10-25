"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { LivePublishModal } from "@/components/modals/LivePublishModal";
import { WorkspaceModal } from "@/components/modals/WorkspaceModal";

// Views
import { LoginView } from "@/components/views/LoginView";
import { DashboardView } from "@/components/views/DashboardView";
import { ComposerView } from "@/components/views/ComposerView";
import { PipelineView } from "@/components/views/PipelineView";
import { CalendarView } from "@/components/views/CalendarView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { IdeasView } from "@/components/views/IdeasView";
import { MediaView } from "@/components/views/MediaView";
import { AccountsView } from "@/components/views/AccountsView";
import { ContactsView } from "@/components/views/ContactsView";
import { NotificationsView } from "@/components/views/NotificationsView";
import { SettingsView } from "@/components/views/SettingsView";
import { Loader2 } from "lucide-react";

function MainContent() {
  const {
    user,
    authLoading,
    activePage,
    setActivePage,
    toastMessage,
    showToast,
    refreshFromSupabase,
  } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);

  // Handle OAuth Redirect URL Params
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const handle = params.get("handle");
    const oauthError = params.get("oauth_error");

    if (connected) {
      showToast(`Berhasil! Akun ${connected.toUpperCase()} (${handle || ""}) telah terhubung.`);
      setActivePage("accounts");
      refreshFromSupabase();
      window.history.replaceState({}, "", window.location.pathname);
    } else if (oauthError) {
      showToast(`Gagal otorisasi: ${oauthError}`);
      setActivePage("accounts");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [showToast, setActivePage, refreshFromSupabase]);

  // 1. Loading state while checking Supabase session
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-800" />
          <p className="text-xs text-neutral-500 font-medium">Memuat sesi autentikasi...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state -> Show Luxury LoginView
  if (!user) {
    return <LoginView />;
  }

  // 3. Authenticated state -> Show full CRM Dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-white select-none">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171717] text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-neutral-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#2E7D47]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <LivePublishModal />
      <WorkspaceModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
      />

      {/* Left Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onOpenWorkspaceModal={() => setWorkspaceModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-7 py-6">
          <div className="max-w-[1280px] mx-auto">
            {activePage === "dashboard" && <DashboardView />}
            {activePage === "compose" && <ComposerView />}
            {activePage === "pipeline" && <PipelineView />}
            {activePage === "calendar" && <CalendarView />}
            {activePage === "analytics" && <AnalyticsView />}
            {activePage === "ideas" && <IdeasView />}
            {activePage === "media" && <MediaView />}
            {activePage === "accounts" && <AccountsView />}
            {activePage === "contacts" && <ContactsView />}
            {activePage === "notifications" && <NotificationsView />}
            {activePage === "settings" && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
