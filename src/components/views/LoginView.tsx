"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Mail,
  KeyRound,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function LoginView() {
  const { loginWithEmail, registerWithEmail } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Mohon masukkan email dan kata sandi Anda.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await loginWithEmail(email, password);
        if (error) {
          setErrorMsg(error);
        }
      } else {
        const { error, needsConfirmation } = await registerWithEmail(email, password);
        if (error) {
          setErrorMsg(error);
        } else if (needsConfirmation) {
          setSuccessMsg("Pendaftaran berhasil! Silakan periksa inbox/spam email Anda untuk konfirmasi.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat otentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none">
      <div className="w-full max-w-[400px] bg-white border border-[#EAEAEA] rounded-2xl shadow-lg p-7 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-800 tracking-wider uppercase mb-1">
            <Layers className="w-3.5 h-3.5 text-neutral-900" />
            <span>Social Post Hub</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">
            {mode === "login" ? "Masuk ke Dashboard" : "Buat Akun Baru"}
          </h1>
          <p className="text-xs text-[#737373]">
            {mode === "login"
              ? "Kelola jadwal posting multi-platform dan CRM konten Anda."
              : "Daftar untuk mulai mengotomasi publikasi multi-platform."}
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex bg-[#F5F5F5] p-1 rounded-xl border border-[#EAEAEA]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "login"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "register"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-start gap-2.5 text-xs text-[#991B1B] animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#EAF5EE] border border-[#86EFAC] rounded-xl flex items-start gap-2.5 text-xs text-[#166534] animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 block">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-neutral-900 text-neutral-900 placeholder-neutral-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 block">
              Kata Sandi
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-neutral-900 text-neutral-900 placeholder-neutral-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Masuk ke Dashboard" : "Daftarkan Akun"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Minimal Footer */}
        <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-center text-[11px] text-neutral-400">
          <span>Social Post Hub · giestar.web.id</span>
        </div>
      </div>
    </div>
  );
}
