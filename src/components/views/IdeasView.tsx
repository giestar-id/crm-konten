"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Lightbulb,
  Sparkles,
  Plus,
  ArrowRight,
  ExternalLink,
  Trash2,
  Send,
  Copy,
  Check,
  Wand2,
  Tag,
} from "lucide-react";

export function IdeasView() {
  const {
    ideas,
    addIdea,
    convertIdeaToPipeline,
    deleteIdea,
    setComposerPrefill,
    setActivePage,
    showToast,
  } = useApp();

  // Quick Idea Capture Form State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickNiche, setQuickNiche] = useState("Tech & AI");
  const [quickNotes, setQuickNotes] = useState("");
  const [quickRef, setQuickRef] = useState("");

  // AI Content Generator State
  const [aiTopic, setAiTopic] = useState("Next.js 16 & DeepSeek Coding Workflow");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    hooks: string[];
    scriptOutline: string;
    captionIG: string;
    captionTT: string;
    youtubeTitle: string;
    hashtags: string[];
  } | null>({
    hooks: [
      "1. Berhenti tulis boilerplate manual di Next.js 16. Pakai trik Server Actions ini!",
      "2. Mengapa workflow coding ini memangkas waktu deploy saya dari 1 jam jadi 5 menit?",
      "3. 3 Alasan kenapa framework monokrom bikin konversi landing page naik 40%.",
    ],
    scriptOutline:
      "0-5s: Hook visual perbandingan sebelum & sesudah.\n5-20s: Live demo command npx & setup parallel runner.\n20-40s: Breakdown kode Server Action tanpa state berbelit.\n40-50s: Call to action cek source code di bio.",
    captionIG:
      "Arsitektur modern Next.js 16 + parallel background runner terbukti paling cepat untuk scale up project solo creator. Cek tips lengkapnya di bio! #NextJS #Fullstack #Developer",
    captionTT:
      "Trik coding solo dev yang wajib lu tau tahun 2026. Jangan coding manual lagi! #CodingTips #TechTok #WebDev",
    youtubeTitle:
      "Masterclass Next.js 16 Server Actions: Fullstack dalam Hitungan Menit!",
    hashtags: ["#NextJS", "#Fullstack", "#AIWorkflow", "#SoloCreator"],
  });

  const handleCaptureIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addIdea({
      title: quickTitle.trim(),
      niche: quickNiche,
      notes: quickNotes.trim(),
      referenceUrl: quickRef.trim(),
      tags: [`#${quickNiche.replace(/\s+/g, "")}`, "#IdeasBank"],
    });
    setQuickTitle("");
    setQuickNotes("");
    setQuickRef("");
  };

  const handleRunAiGenerator = () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAiResult({
        hooks: [
          `1. Inilah rahasia kenapa ${aiTopic} lagi viral di kalangan creator luar negeri!`,
          `2. Jangan mulai bikin video sebelum tau konsep ${aiTopic} ini.`,
          `3. Studi kasus nyata: Mengapa ${aiTopic} bisa tembus 200k views dalam 48 jam?`,
        ],
        scriptOutline: `0-7s: Hook kontras masalah vs solusi seputar ${aiTopic}.\n7-25s: 3 Poin penting dan breakdown langkah demi langkah.\n25-45s: Kesimpulan tajam & CTA ajak follow untuk tutorial berikutnya.`,
        captionIG: `Membahas ${aiTopic} secara tuntas untuk kreator yang mau kerja lebih efisien. Simpan postingan ini biar gak lupa! #CreatorLife #Automation`,
        captionTT: `Kreator wajib tau hal ini sebelum terlambat! Bahas ${aiTopic} 45 detik. #TechTok #Creator`,
        youtubeTitle: `Panduan Lengkap ${aiTopic} untuk Solo Creator (Terbukti Efektif!)`,
        hashtags: ["#Productivity", "#CreatorEconomy", "#ViralTips"],
      });
      showToast("AI berhasil men-generate Hook, Script, dan Caption multi-platform!");
    }, 1200);
  };

  const sendAiToComposer = () => {
    if (!aiResult) return;
    setComposerPrefill({
      title: aiResult.youtubeTitle,
      caption: aiResult.captionIG,
    });
    setActivePage("compose");
  };

  return (
    <div className="page-view space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Ideas Bank
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Koleksi ide konten, hook viral, dan outline naskah video
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Ideas Bank & Quick Capture (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Quick Idea Capture Form */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-semibold text-neutral-900">
                Tambah Ide Cepat
              </h3>
            </div>

            <form onSubmit={handleCaptureIdea} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="Judul ide / konsep video..."
                  className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={quickNiche}
                  onChange={(e) => setQuickNiche(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#EAEAEA] rounded-lg bg-white text-neutral-900"
                >
                  <option value="Tech & AI">Niche: Tech & AI</option>
                  <option value="Productivity">Niche: Productivity</option>
                  <option value="Coding Tutorials">Niche: Coding Tutorials</option>
                  <option value="Personal Brand">Niche: Personal Brand</option>
                  <option value="Creator Business">Niche: Creator Business</option>
                </select>

                <input
                  type="url"
                  value={quickRef}
                  onChange={(e) => setQuickRef(e.target.value)}
                  placeholder="URL Referensi (opsional)..."
                  className="px-2.5 py-1.5 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none"
                />
              </div>

              <textarea
                rows={2}
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder="Catatan hook atau sudut pandang unik..."
                className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simpan ke Ideas Bank</span>
                </button>
              </div>
            </form>
          </div>

          {/* Ideas Repository List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">
                Daftar Ide Tersimpan ({ideas.length})
              </span>
              <span className="text-[11px] text-[#737373]">
                1-Klik konversi ke Pipeline
              </span>
            </div>

            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="border border-[#EAEAEA] rounded-xl p-4 bg-white shadow-sm space-y-2.5 hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-800">
                    {idea.niche}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {idea.createdAt}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-neutral-900 leading-snug">
                  {idea.title}
                </h4>

                {idea.notes && (
                  <p className="text-[11px] text-[#737373] leading-relaxed">
                    {idea.notes}
                  </p>
                )}

                {idea.referenceUrl && (
                  <a
                    href={idea.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-neutral-700 hover:text-neutral-900 font-medium hover:underline"
                  >
                    <span>Referensi Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#EAEAEA]">
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => convertIdeaToPipeline(idea.id)}
                    className="px-3 py-1 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Jadikan Kartu Pipeline</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Creative Studio (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-neutral-800" />
                <h3 className="text-xs font-semibold text-neutral-900">
                  AI Creative Studio (Hook, Script & Caption Generator)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF5EE] text-[#2E7D47]">
                AI Ready
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Topik / Niche yang Ingin Dibuat Kontennya
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Contoh: 5 Tools AI Menghemat Waktu, Next.js 16..."
                  className="flex-1 px-3 py-2 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
                <button
                  onClick={handleRunAiGenerator}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? "Menyusun..." : "Generate AI"}</span>
                </button>
              </div>
            </div>

            {aiResult && (
              <div className="space-y-4 pt-2 border-t border-[#EAEAEA]">
                {/* 3 Viral Hooks */}
                <div className="border border-[#EAEAEA] rounded-lg p-3.5 bg-[#FAFAFA] space-y-2">
                  <span className="text-[11px] font-semibold text-neutral-900 block">
                    Pilihan 3 Viral Hook (0-5 Detik Pertama):
                  </span>
                  <div className="space-y-1.5 text-xs text-neutral-800">
                    {aiResult.hooks.map((h, i) => (
                      <div
                        key={i}
                        className="p-2 bg-white rounded border border-[#EAEAEA] flex items-start justify-between gap-2"
                      >
                        <span className="leading-snug">{h}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(h);
                            showToast("Hook disalin.");
                          }}
                          className="text-neutral-400 hover:text-neutral-700 shrink-0"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Script Outline */}
                <div className="border border-[#EAEAEA] rounded-lg p-3.5 bg-[#FAFAFA] space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-900 block">
                    Struktur Naskah Video 45 Detik:
                  </span>
                  <pre className="text-[11px] font-sans text-neutral-700 whitespace-pre-wrap leading-relaxed bg-white p-2.5 rounded border border-[#EAEAEA]">
                    {aiResult.scriptOutline}
                  </pre>
                </div>

                {/* Multi-Platform Caption Drafts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="border border-[#EAEAEA] rounded-lg p-3 bg-white space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-neutral-500">
                      Instagram Caption
                    </span>
                    <p className="text-[11px] text-neutral-800 leading-snug line-clamp-3">
                      {aiResult.captionIG}
                    </p>
                  </div>

                  <div className="border border-[#EAEAEA] rounded-lg p-3 bg-white space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-neutral-500">
                      TikTok Caption
                    </span>
                    <p className="text-[11px] text-neutral-800 leading-snug line-clamp-3">
                      {aiResult.captionTT}
                    </p>
                  </div>
                </div>

                {/* Send directly to Composer CTA */}
                <button
                  onClick={sendAiToComposer}
                  className="w-full py-2.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Hasil Ini Langsung ke Composer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
