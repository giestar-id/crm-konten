"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  ShieldCheck,
  Info,
  ExternalLink,
  Power,
  Database,
  Key,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function AccountsView() {
  const { socialAccounts, toggleAccountStatus, reconnectAccount, showToast } =
    useApp();

  const [realIgAccount, setRealIgAccount] = useState<any>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"supabase" | "meta" | "google" | "tiktok">("supabase");

  // Check if real IG account is connected in Supabase
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/oauth/instagram/status");
        const json = await res.json();
        if (json.connected && json.account) {
          setRealIgAccount(json.account);
        }
      } catch {
        // ignore
      }
    }
    checkStatus();
  }, []);

  const handleConnectOAuth = async (platform: "instagram" | "youtube" | "tiktok" | "facebook") => {
    const route =
      platform === "youtube"
        ? "/api/oauth/youtube"
        : platform === "tiktok"
        ? "/api/oauth/tiktok"
        : "/api/oauth/instagram"; // FB & IG both use Meta OAuth

    try {
      const res = await fetch(route);
      if (res.status === 400) {
        const data = await res.json();
        if (data.status === "need_configuration") {
          setModalTab(platform === "youtube" ? "google" : platform === "tiktok" ? "tiktok" : "meta");
          setIsSetupModalOpen(true);
          return;
        }
      }
      window.location.href = route;
    } catch {
      window.location.href = route;
    }
  };

  return (
    <div className="page-view space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Koneksi Akun Sosial
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Hubungkan akun YouTube, TikTok, Instagram, dan Facebook untuk publikasi otomatis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSetupModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Panduan API</span>
          </button>
        </div>
      </div>

      {/* Real Instagram Account Banner if Connected */}
      {realIgAccount && (
        <div className="border-2 border-[#2E7D47]/40 rounded-xl p-5 bg-[#EAF5EE]/40 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-bold text-lg">
              IG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2E7D47] text-white">
                  Akun Asli Terhubung (Supabase)
                </span>
                <h3 className="text-sm font-semibold text-neutral-900">
                  {realIgAccount.display_name} ({realIgAccount.handle})
                </h3>
              </div>
              <p className="text-xs text-neutral-700 mt-1">
                Token OAuth Long-Lived tersimpan di tabel <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded border border-[#2E7D47]/20">social_accounts</code> Supabase.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#2E7D47] text-white shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Live Active</span>
          </span>
        </div>
      )}

      {/* Connected Accounts Cards with Real Login Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {socialAccounts.map((acc) => {
          const isActive = acc.status === "active";
          return (
            <div
              key={acc.id}
              className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4 hover:border-neutral-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={acc.avatarUrl}
                      alt={acc.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-[#EAEAEA]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900">
                          {acc.displayName}
                        </h3>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-neutral-100 text-neutral-700 rounded">
                          {acc.platform}
                        </span>
                      </div>
                      <p className="text-xs text-[#737373] mt-0.5">{acc.handle}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {acc.accountType}
                      </p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#EAF5EE] text-[#2E7D47]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#FEF3C7] text-[#B45309]">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Belum Login</span>
                    </span>
                  )}
                </div>

                {/* API Quota if YouTube */}
                {acc.apiQuotaMax && (
                  <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#EAEAEA] space-y-1.5 mt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-700 font-medium">
                        Pemakaian Kuota API Harian:
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {acc.apiQuotaUsed} / {acc.apiQuotaMax} unit ({((acc.apiQuotaUsed! / acc.apiQuotaMax!) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full"
                        style={{
                          width: `${(acc.apiQuotaUsed! / acc.apiQuotaMax!) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Login Asli Real OAuth button per platform */}
              <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                <span className="text-[11px] text-[#737373]">
                  OAuth 2.0 Direct
                </span>

                <button
                  onClick={() => handleConnectOAuth(acc.platform)}
                  className="px-3 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Login ke {acc.platform.toUpperCase()} Asli</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPREHENSIVE SETUP GUIDE MODAL */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-neutral-800" />
                <h3 className="text-base font-semibold text-neutral-900">
                  Panduan Kunci API & OAuth Semua Platform
                </h3>
              </div>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#EAEAEA] gap-2 pb-2">
              <button
                onClick={() => setModalTab("supabase")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  modalTab === "supabase" ? "bg-[#0A0A0A] text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                1. Supabase (DB)
              </button>
              <button
                onClick={() => setModalTab("meta")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  modalTab === "meta" ? "bg-[#0A0A0A] text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                2. Meta (IG & FB)
              </button>
              <button
                onClick={() => setModalTab("google")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  modalTab === "google" ? "bg-[#0A0A0A] text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                3. Google (YouTube)
              </button>
              <button
                onClick={() => setModalTab("tiktok")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  modalTab === "tiktok" ? "bg-[#0A0A0A] text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                4. TikTok
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="space-y-3 text-xs text-neutral-700 leading-relaxed">
              {modalTab === "supabase" && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#EAEAEA] space-y-1">
                    <h4 className="font-semibold text-neutral-900">Langkah Supabase:</h4>
                    <p>1. Buka <strong>supabase.com/dashboard</strong> project <code className="font-mono text-neutral-900">sifohydpetakfsczfsfm</code>.</p>
                    <p>2. Ke <strong>SQL Editor</strong> &rarr; jalankan file skrip <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#EAEAEA]">supabase_schema.sql</code>.</p>
                    <p>3. Ke <strong>Project Settings &rarr; API</strong> &rarr; copy kunci <strong>`anon public`</strong>.</p>
                  </div>
                </div>
              )}

              {modalTab === "meta" && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#EAEAEA] space-y-1.5">
                    <h4 className="font-semibold text-neutral-900">Instagram & Facebook Page (developers.facebook.com):</h4>
                    <p>1. Buat App bertipe <strong>Business</strong> di Meta Developers.</p>
                    <p>2. Di <strong>Facebook Login &rarr; Settings</strong>, isi Valid OAuth Redirect URI:</p>
                    <code className="font-mono text-[10px] bg-white p-1.5 rounded border border-[#EAEAEA] block select-all">
                      http://localhost:3000/api/oauth/instagram/callback
                    </code>
                    <p>3. Ambil <strong>App ID</strong> dan <strong>App Secret</strong> di menu Basic.</p>
                  </div>
                </div>
              )}

              {modalTab === "google" && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#EAEAEA] space-y-1.5">
                    <h4 className="font-semibold text-neutral-900">YouTube Data API (console.cloud.google.com):</h4>
                    <p>1. Buka <strong>Google Cloud Console</strong> &rarr; Buat Project Baru.</p>
                    <p>2. Masuk ke <strong>APIs & Services &rarr; Library</strong> &rarr; Cari dan aktifkan <strong>YouTube Data API v3</strong>.</p>
                    <p>3. Masuk ke <strong>Credentials &rarr; Create Credentials &rarr; OAuth client ID</strong> (Web application).</p>
                    <p>4. Masukkan Authorized redirect URI:</p>
                    <code className="font-mono text-[10px] bg-white p-1.5 rounded border border-[#EAEAEA] block select-all">
                      http://localhost:3000/api/oauth/youtube/callback
                    </code>
                    <p>5. Copy <strong>Client ID</strong> dan <strong>Client Secret</strong>.</p>
                  </div>
                </div>
              )}

              {modalTab === "tiktok" && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#EAEAEA] space-y-1.5">
                    <h4 className="font-semibold text-neutral-900">TikTok Content Posting API (developers.tiktok.com):</h4>
                    <p>1. Buka <strong>developers.tiktok.com</strong> &rarr; Buat App.</p>
                    <p>2. Aktifkan produk <strong>Content Posting API</strong>.</p>
                    <p>3. Masukkan Redirect URI:</p>
                    <code className="font-mono text-[10px] bg-white p-1.5 rounded border border-[#EAEAEA] block select-all">
                      http://localhost:3000/api/oauth/tiktok/callback
                    </code>
                    <p>4. Copy <strong>Client Key</strong> dan <strong>Client Secret</strong>.</p>
                  </div>
                </div>
              )}

              {/* Preview .env.local file */}
              <div className="pt-2">
                <span className="font-semibold text-neutral-900 block mb-1">
                  Semua kunci dimasukkan ke file <code className="font-mono text-neutral-900">.env.local</code>:
                </span>
                <pre className="font-mono text-[10px] bg-neutral-900 text-neutral-100 p-2.5 rounded-lg overflow-x-auto leading-relaxed">
{`NEXT_PUBLIC_SUPABASE_URL=https://sifohydpetakfsczfsfm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
META_APP_ID=...
META_APP_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...`}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#EAEAEA]">
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
