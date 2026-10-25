"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  AtSign,
  ShieldAlert,
  Clock,
  Sparkles,
} from "lucide-react";

export function NotificationsView() {
  const { notifications, markAllNotificationsAsRead, unreadNotifCount } =
    useApp();
  const [activeTab, setActiveTab] = useState<
    "all" | "unread" | "publish" | "system"
  >("all");

  const filteredNotifs = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "publish")
      return (
        notif.type === "publish_success" || notif.type === "publish_failed"
      );
    if (activeTab === "system")
      return notif.type === "system" || notif.type === "token_alert";
    return true;
  });

  return (
    <div className="page-view space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Notifikasi
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Pemberitahuan aktivitas publikasi dan status akun sosial
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-3.5 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Tandai Semua Dibaca</span>
        </button>
      </div>

      {/* Filter Tabs matching minimalist reference */}
      <div className="flex items-center gap-2 border-b border-[#EAEAEA] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "all"
              ? "bg-[#0A0A0A] text-white"
              : "text-[#737373] hover:bg-neutral-100"
          }`}
        >
          Semua Aktivitas
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "unread"
              ? "bg-[#0A0A0A] text-white"
              : "text-[#737373] hover:bg-neutral-100"
          }`}
        >
          Belum Dibaca
        </button>
        <button
          onClick={() => setActiveTab("publish")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "publish"
              ? "bg-[#0A0A0A] text-white"
              : "text-[#737373] hover:bg-neutral-100"
          }`}
        >
          Publish Logs
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "system"
              ? "bg-[#0A0A0A] text-white"
              : "text-[#737373] hover:bg-neutral-100"
          }`}
        >
          Sistem & Token
        </button>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filteredNotifs.map((notif) => (
          <div
            key={notif.id}
            className={`border rounded-xl p-4 flex items-start gap-3.5 transition-colors ${
              !notif.read
                ? "bg-white border-neutral-900 shadow-sm"
                : "bg-white border-[#EAEAEA] opacity-80"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                notif.type === "publish_success"
                  ? "bg-[#2E7D47]"
                  : notif.type === "publish_failed"
                  ? "bg-[#C93B3B]"
                  : notif.type === "mention"
                  ? "bg-[#DF5835]"
                  : "bg-neutral-900"
              }`}
            >
              {notif.type === "publish_success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : notif.type === "publish_failed" ? (
                <AlertCircle className="w-4 h-4" />
              ) : notif.type === "mention" ? (
                <AtSign className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-neutral-900">
                  {notif.title}
                </h4>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {notif.time}
                </span>
              </div>
              <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                {notif.message}
              </p>
            </div>
          </div>
        ))}

        {filteredNotifs.length === 0 && (
          <div className="border border-dashed border-neutral-200 rounded-xl p-8 text-center text-xs text-neutral-400">
            Tidak ada notifikasi dalam filter ini.
          </div>
        )}
      </div>
    </div>
  );
}
