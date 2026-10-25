"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Platform } from "@/types";
import {
  PlatformLogo,
  YouTubeIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
} from "@/components/common/PlatformIcons";
import {
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowRight,
  ExternalLink,
  X,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface PlatformConfig {
  id: Platform;
  name: string;
  badge: string;
  desc: string;
  connectRoute: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "youtube",
    name: "YouTube",
    badge: "Shorts & Video VOD",
    desc: "Publikasi video panjang & Shorts ke channel YouTube",
    connectRoute: "/api/oauth/youtube",
  },
  {
    id: "instagram",
    name: "Instagram",
    badge: "Reels & Post Feed",
    desc: "Otomasi Reels & Feed ke akun Instagram Business / Creator",
    connectRoute: "/api/oauth/instagram",
  },
  {
    id: "tiktok",
    name: "TikTok",
    badge: "Content Posting API",
    desc: "Direct video posting langsung ke akun TikTok",
    connectRoute: "/api/oauth/tiktok",
  },
  {
    id: "facebook",
    name: "Facebook",
    badge: "Fanpage Video",
    desc: "Publikasi video & Reel ke Halaman Facebook resmi",
    connectRoute: "/api/oauth/instagram",
  },
];

export function AccountsView() {
  const { socialAccounts, disconnectAccount, addSocialAccount, showToast } =
    useApp();

  const [modalPlatform, setModalPlatform] = useState<Platform | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualHandle, setManualHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectOAuth = (platform: Platform) => {
    const route =
      platform === "youtube"
        ? "/api/oauth/youtube"
        : platform === "tiktok"
        ? "/api/oauth/tiktok"
        : "/api/oauth/instagram";
    window.location.href = route;
  };

  const handleManualAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPlatform || !manualName.trim() || !manualHandle.trim()) {
      showToast("Mohon lengkapi nama akun dan handle.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addSocialAccount({
        platform: modalPlatform,
        displayName: manualName.trim(),
        handle: manualHandle.trim(),
      });
      setModalPlatform(null);
      setManualName("");
      setManualHandle("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-view space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Koneksi Akun Sosial
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Kelola channel dan akun multi-platform yang terhubung ke CRM
          </p>
        </div>
      </div>

      {/* PLATFORM BLOCKS */}
      <div className="space-y-6">
        {PLATFORMS.map((plat) => {
          const accountsForPlat = socialAccounts.filter(
            (a) => a.platform === plat.id
          );
          const activeCount = accountsForPlat.filter(
            (a) => a.status === "active"
          ).length;

          return (
            <div
              key={plat.id}
              className="border border-[#EAEAEA] rounded-2xl bg-white shadow-sm overflow-hidden"
            >
              {/* Block Header */}
              <div className="p-4 sm:p-5 border-b border-[#EAEAEA] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EAEAEA] flex items-center justify-center shadow-xs shrink-0">
                    <PlatformLogo platform={plat.id} className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-neutral-900">
                        {plat.name}
                      </h2>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-800">
                        {plat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] mt-0.5">
                      {activeCount > 0
                        ? `${activeCount} akun aktif terhubung`
                        : "Belum ada akun terhubung"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalPlatform(plat.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Akun</span>
                  </button>

                  <button
                    onClick={() => handleConnectOAuth(plat.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Login OAuth</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Accounts List for this Platform */}
              <div className="p-4 sm:p-5">
                {accountsForPlat.length === 0 ? (
                  <div className="text-center py-8 px-4 border border-dashed border-[#EAEAEA] rounded-xl bg-[#FAFAFA]">
                    <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-2.5">
                      <PlatformLogo platform={plat.id} className="w-5 h-5 opacity-50" />
                    </div>
                    <p className="text-xs font-semibold text-neutral-800">
                      Belum ada akun {plat.name} yang terhubung
                    </p>
                    <p className="text-[11px] text-[#737373] mt-1 max-w-sm mx-auto">
                      Hubungkan channel atau profil {plat.name} Anda untuk mengaktifkan distribusi konten otomatis.
                    </p>
                    <button
                      onClick={() => handleConnectOAuth(plat.id)}
                      className="mt-3.5 px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Hubungkan Akun {plat.name}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {accountsForPlat.map((acc) => {
                      const isActive = acc.status === "active";

                      return (
                        <div
                          key={acc.id}
                          className="border border-[#EAEAEA] rounded-xl p-4 bg-white hover:border-neutral-300 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={acc.avatarUrl}
                                alt={acc.displayName}
                                className="w-10 h-10 rounded-full object-cover border border-[#EAEAEA] shrink-0"
                              />
                              <div className="min-w-0">
                                <h3 className="text-xs font-bold text-neutral-900 truncate">
                                  {acc.displayName}
                                </h3>
                                <p className="text-[11px] text-[#737373] truncate">
                                  {acc.handle}
                                </p>
                              </div>
                            </div>

                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5EE] text-[#2E7D47] shrink-0">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Terhubung</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF3C7] text-[#B45309] shrink-0">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Belum Terhubung</span>
                              </span>
                            )}
                          </div>

                          {/* Action footer */}
                          <div className="pt-2.5 border-t border-[#F0F0F0] flex items-center justify-between text-xs">
                            <span className="text-[11px] text-[#737373]">
                              {isActive ? "Status: Aktif" : "Perlu Otorisasi"}
                            </span>

                            <div className="flex items-center gap-2">
                              {isActive ? (
                                <button
                                  onClick={() => disconnectAccount(acc.id)}
                                  className="text-[11px] text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Putuskan</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleConnectOAuth(plat.id)}
                                  className="px-2.5 py-1 rounded-md bg-[#0A0A0A] text-white text-[11px] font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1"
                                >
                                  <span>Hubungkan</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: TAMBAH AKUN BARU / OAUTH */}
      {modalPlatform && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <div className="flex items-center gap-2.5">
                <PlatformLogo platform={modalPlatform} className="w-5 h-5" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Tambah Akun {modalPlatform.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setModalPlatform(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option 1: Automatic OAuth */}
              <div className="p-3.5 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">
                    Otorisasi Otomatis (OAuth 2.0)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-200/70 text-neutral-700 font-medium">
                    Resmi
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Login langsung ke akun {modalPlatform.toUpperCase()} Anda melalui jendela otorisasi resmi platform.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const p = modalPlatform;
                    setModalPlatform(null);
                    handleConnectOAuth(p);
                  }}
                  className="w-full mt-1 py-2 px-3 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Mulai Otorisasi OAuth</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option 2: Add Account Entry Manually */}
              <div className="p-3.5 border border-[#EAEAEA] rounded-xl space-y-3">
                <span className="font-semibold text-neutral-900 block">
                  Atau Daftarkan Identitas Akun / Channel
                </span>
                <form onSubmit={handleManualAddAccount} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-neutral-700 font-medium mb-1">
                      Nama Akun / Channel
                    </label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="Contoh: Giestar Official"
                      required
                      className="w-full px-3 py-1.5 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-700 font-medium mb-1">
                      Handle / Username
                    </label>
                    <input
                      type="text"
                      value={manualHandle}
                      onChange={(e) => setManualHandle(e.target.value)}
                      placeholder="Contoh: @giestarofficial"
                      required
                      className="w-full px-3 py-1.5 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalPlatform(null)}
                      className="px-3 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50"
                    >
                      Simpan Akun
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
