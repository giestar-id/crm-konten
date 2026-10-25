"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function LoginView() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginAsGuest } = useApp();

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
      setErrorMsg("Mohon isi email dan password Anda.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
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
          setSuccessMsg("Pendaftaran berhasil! Cek email Anda untuk konfirmasi akun atau gunakan Akses Demo.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat otentikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuka login Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none">
      <div className="w-full max-w-[420px] bg-white border border-[#EAEAEA] rounded-2xl shadow-xl p-7 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-800 tracking-wider uppercase mb-1">
            <Layers className="w-3.5 h-3.5 text-neutral-900" />
            <span>Social Post Hub · CRM</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Kreator Baru"}
          </h1>
          <p className="text-xs text-[#737373]">
            {mode === "login"
              ? "Masuk untuk mengelola postingan 4 platform dan CRM konten Anda."
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
            Masuk (Sign In)
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
            Daftar (Register)
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
            <label className="text-xs font-semibold text-neutral-700 block">
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
            <label className="text-xs font-semibold text-neutral-700 block">
              Kata Sandi (Password)
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
            className="w-full py-2.5 px-4 rounded-xl bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
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

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#EAEAEA] w-full"></div>
          <span className="bg-white px-3 text-[11px] text-neutral-400 uppercase tracking-wider absolute">
            atau
          </span>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2">
          {/* Google OAuth Login via Supabase */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl border border-[#EAEAEA] bg-white text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2.5 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          {/* Quick Demo Access for Solo Creator & Reviewers */}
          <button
            type="button"
            onClick={loginAsGuest}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 text-neutral-700 text-xs font-medium hover:bg-neutral-100 hover:text-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
            <span>Akses Cepat Sebagai Solo Creator (Demo)</span>
          </button>
        </div>

        {/* Security Trust Footnote */}
        <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
          <span>Keamanan Enterprise Supabase Auth & RLS Terlindungi</span>
        </div>
      </div>
    </div>
  );
}
