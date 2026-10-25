"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Settings,
  User,
  Clock,
  Shield,
  Layers,
  Sparkles,
  Save,
  Check,
  Server,
} from "lucide-react";

export function SettingsView() {
  const { activeWorkspace, showToast, user } = useApp();

  const [creatorName, setCreatorName] = useState(
    user?.user_metadata?.full_name || "Aji Subekti"
  );
  const [email, setEmail] = useState(user?.email || "asa001991@gmail.com");
  const [timezone, setTimezone] = useState("Asia/Jakarta (WIB - UTC+7)");
  const [autoRetry, setAutoRetry] = useState(true);
  const [inngestConnected, setInngestConnected] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Pengaturan profil & preferensi workspace berhasil disimpan.");
  };

  return (
    <div className="page-view max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-neutral-100 text-neutral-800">
            System & Preferences
          </span>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight mt-1">
            Pengaturan Akun & Workspace
          </h1>
          <p className="text-xs text-[#737373]">
            Konfigurasi profil kreator, zona waktu penjadwalan, pilar konten & enkripsi token
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile & Timezone */}
        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-semibold text-neutral-900">
              Profil Kreator & Zona Waktu Utama
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">
                Nama Lengkap Kreator
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">
                Email Terdaftar (Supabase Auth)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-700 font-medium mb-1">
              Zona Waktu Penjadwalan (Default WIB)
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded-lg bg-white text-neutral-900"
            >
              <option value="Asia/Jakarta (WIB - UTC+7)">
                Asia/Jakarta (WIB - UTC+7) [Default Indonesia Barat]
              </option>
              <option value="Asia/Makassar (WITA - UTC+8)">
                Asia/Makassar (WITA - UTC+8)
              </option>
              <option value="Asia/Jayapura (WIT - UTC+9)">
                Asia/Jayapura (WIT - UTC+9)
              </option>
            </select>
            <p className="text-[11px] text-[#737373] mt-1">
              Semua jadwal posting di kalender akan mengikuti zona waktu yang dipilih.
            </p>
          </div>
        </div>

        {/* Content Pillars Configuration */}
        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-semibold text-neutral-900">
              Pilar Konten Workspace ({activeWorkspace.name})
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {["Tech Reviews", "Tutorials", "Personal Brand", "Sponsorships"].map(
              (p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 rounded-lg border border-[#EAEAEA] bg-[#FAFAFA] text-neutral-800 font-medium flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0A0A0A]"></span>
                  <span>{p}</span>
                </span>
              )
            )}
          </div>
        </div>

        {/* Background Job Runner & Security */}
        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-semibold text-neutral-900">
              Background Job Runner & Enkripsi Token
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA]">
              <div>
                <p className="font-semibold text-neutral-900">
                  Background Queue Engine (Inngest / Trigger.dev)
                </p>
                <p className="text-[11px] text-[#737373] mt-0.5">
                  Menjamin upload video berjalan asinkron tanpa terhalang serverless timeout
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#EAF5EE] text-[#2E7D47]">
                Online & Ready
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA]">
              <div>
                <p className="font-semibold text-neutral-900">
                  Enkripsi Token OAuth (AES-256-GCM)
                </p>
                <p className="text-[11px] text-[#737373] mt-0.5">
                  Access & Refresh token disimpan terenkripsi di server; tidak pernah terekspos ke client
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#EAF5EE] text-[#2E7D47]">
                Enkripsi Aktif
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA]">
              <div>
                <p className="font-semibold text-neutral-900">
                  Automatic Retry dengan Exponential Backoff
                </p>
                <p className="text-[11px] text-[#737373] mt-0.5">
                  Mencoba ulang publish otomatis hingga 3x jika platform mengalami network drop
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRetry}
                  onChange={(e) => setAutoRetry(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0A0A0A]"></div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
