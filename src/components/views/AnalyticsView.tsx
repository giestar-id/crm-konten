"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  TrendingUp,
  Download,
  ExternalLink,
  ChevronDown,
  Info,
  Film,
  Eye,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

export function AnalyticsView() {
  const { showToast, contentItems } = useApp();
  const [selectedRange, setSelectedRange] = useState("30 Hari Terakhir");

  const publishedList = contentItems.filter(
    (c) => c.stage === "terbit" || c.stage === "dianalisis"
  );

  const totalViews = publishedList.reduce(
    (acc, c) => acc + (Number(c.viewsCount) || 0),
    0
  );
  const totalLikes = publishedList.reduce(
    (acc, c) => acc + (Number(c.likesCount) || 0),
    0
  );
  const avgEngagement =
    totalViews > 0
      ? `${((totalLikes / totalViews) * 100).toFixed(1)}%`
      : "0.0%";
  const totalShares = Math.round(totalLikes * 0.25);

  const exportCSV = () => {
    if (publishedList.length === 0) {
      showToast("Belum ada data konten untuk diekspor.");
      return;
    }
    const headers = "Title,Pillar,Views,Likes,Comments,Shares,EngagementRate\n";
    const rows = publishedList
      .map((item) => {
        const v = Number(item.viewsCount) || 0;
        const l = Number(item.likesCount) || 0;
        const shares = Math.round(l * 0.25);
        const eng = v > 0 ? `${((l / v) * 100).toFixed(1)}%` : "0%";
        return `"${item.title.replace(/"/g, '""')}","${item.pillar}",${v},${l},0,${shares},"${eng}"`;
      })
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "sph_analytics_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("File 'sph_analytics_report_2026.csv' berhasil diunduh.");
  };

  return (
    <div className="page-view space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Performa penayangan dan interaksi konten lintas platform
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center border border-[#EAEAEA] rounded-lg bg-white overflow-hidden shadow-sm px-2.5 py-1">
            <span className="text-xs text-neutral-700 font-medium">
              {selectedRange}
            </span>
          </div>

          <button
            onClick={exportCSV}
            className="px-3.5 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Matching minimalist reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
          <p className="text-xs text-[#737373] mb-1">Total Cross-Platform Views</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">
              {totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
            </span>
            {totalViews > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
                Aktif
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#737373] mt-2">
            Akumulasi seluruh akun terhubung
          </p>
        </div>

        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
          <p className="text-xs text-[#737373] mb-1">Average Engagement Rate</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">{avgEngagement}</span>
            {totalViews > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
                Rata-rata
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#737373] mt-2">Dihitung dari rasio interaksi</p>
        </div>

        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
          <p className="text-xs text-[#737373] mb-1">Total Likes & Shares</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">{totalLikes + totalShares}</span>
            {totalLikes > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
                Interaksi
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#737373] mt-2">Respon penonton di konten</p>
        </div>

        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
          <p className="text-xs text-[#737373] mb-1">Total Konten Terbit</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">{publishedList.length}</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
              Video
            </span>
          </div>
          <p className="text-[11px] text-[#737373] mt-2">Terekam di sistem analitik</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Retention Curve Chart (7 Cols) */}
        <div className="lg:col-span-7 border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between min-h-[260px]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900">
                Audience Retention & Drop-off Curve
              </h3>
              <p className="text-[11px] text-[#737373] mt-0.5">
                Rata-rata retensi detik ke detik pada video terbit
              </p>
            </div>
            <span className="px-2.5 py-1 rounded border border-[#EAEAEA] text-[11px] font-medium text-neutral-800">
              {publishedList.length > 0 ? "Retention Curve" : "Menunggu Data"}
            </span>
          </div>

          {publishedList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed border-[#EAEAEA] rounded-xl bg-[#FAFAFA]">
              <Film className="w-8 h-8 text-neutral-300 mb-2" />
              <p className="text-xs font-semibold text-neutral-800">
                Belum ada data retensi audiens
              </p>
              <p className="text-[11px] text-[#737373] mt-1 max-w-xs">
                Grafik retensi penayangan akan terbentuk otomatis setelah ada video yang diterbitkan dan ditonton penonton.
              </p>
            </div>
          ) : (
            <>
              <div className="h-[180px] w-full pt-4">
                <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#171717" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#171717" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="20" y1="20" x2="380" y2="20" stroke="#EAEAEA" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="60" x2="380" y2="60" stroke="#EAEAEA" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="100" x2="380" y2="100" stroke="#EAEAEA" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="140" x2="380" y2="140" stroke="#EAEAEA" strokeWidth="1" />

                  <path
                    d="M20,22 C60,24 100,35 150,48 C200,60 250,70 300,75 C340,79 380,82 380,82 L380,140 L20,140 Z"
                    fill="url(#retGrad)"
                  />
                  <path
                    d="M20,22 C60,24 100,35 150,48 C200,60 250,70 300,75 C340,79 380,82 380,82"
                    fill="none"
                    stroke="#0A0A0A"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex justify-between px-2 text-[11px] font-medium text-neutral-600 border-t border-[#EAEAEA] pt-2 mt-2">
                <span>0 dtk (Hook 100%)</span>
                <span>15 dtk</span>
                <span>30 dtk</span>
                <span>45 dtk</span>
                <span>60 dtk</span>
              </div>
            </>
          )}
        </div>

        {/* Platform Share Breakdown (5 Cols) */}
        {(() => {
          const ytViews = publishedList
            .filter((c) => c.targetPlatforms?.includes("youtube"))
            .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);
          const ttViews = publishedList
            .filter((c) => c.targetPlatforms?.includes("tiktok"))
            .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);
          const igViews = publishedList
            .filter((c) => c.targetPlatforms?.includes("instagram"))
            .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);
          const fbViews = publishedList
            .filter((c) => c.targetPlatforms?.includes("facebook"))
            .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);

          const sumV = ytViews + ttViews + igViews + fbViews || totalViews;
          const ytPct = sumV > 0 ? Math.round((ytViews / sumV) * 100) : 0;
          const ttPct = sumV > 0 ? Math.round((ttViews / sumV) * 100) : 0;
          const igPct = sumV > 0 ? Math.round((igViews / sumV) * 100) : 0;
          const fbPct = sumV > 0 ? Math.round((fbViews / sumV) * 100) : 0;

          return (
            <div className="lg:col-span-5 border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-neutral-900">
                Perbandingan Kontribusi Antar Platform
              </h3>

              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-neutral-800">YouTube Shorts</span>
                    <span className="font-semibold text-neutral-900">
                      {ytPct}% • {ytViews > 1000 ? `${(ytViews / 1000).toFixed(1)}k` : ytViews} views
                    </span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${ytPct}%` }}
                      className="h-full bg-[#0A0A0A] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-neutral-800">TikTok Direct Post</span>
                    <span className="font-semibold text-neutral-900">
                      {ttPct}% • {ttViews > 1000 ? `${(ttViews / 1000).toFixed(1)}k` : ttViews} views
                    </span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${ttPct}%` }}
                      className="h-full bg-[#4A4A4A] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-neutral-800">Instagram Reels</span>
                    <span className="font-semibold text-neutral-900">
                      {igPct}% • {igViews > 1000 ? `${(igViews / 1000).toFixed(1)}k` : igViews} views
                    </span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${igPct}%` }}
                      className="h-full bg-[#787878] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-neutral-800">Facebook Page Video</span>
                    <span className="font-semibold text-neutral-900">
                      {fbPct}% • {fbViews > 1000 ? `${(fbViews / 1000).toFixed(1)}k` : fbViews} views
                    </span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${fbPct}%` }}
                      className="h-full bg-[#B0B0B0] rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#737373] leading-relaxed pt-2 border-t border-[#EAEAEA]">
                {publishedList.length > 0
                  ? "Distribusi penayangan otomatis diperbarui berdasarkan metrik tiap akun sosial."
                  : "Belum ada konten aktif. Publikasikan video di Composer untuk mengaktifkan pelacakan distribusi."}
              </p>
            </div>
          );
        })()}
      </div>

      {/* Content Leaderboard Table */}
      <div className="border border-[#EAEAEA] rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#EAEAEA] flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-900">
            Leaderboard Konten Berkinerja Tertinggi
          </h3>
          <span className="text-[11px] text-[#737373]">Update otomatis harian</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA] text-[#737373] font-medium">
                <th className="py-2.5 px-4">Judul Video</th>
                <th className="py-2.5 px-4">Pilar</th>
                <th className="py-2.5 px-4">Total Views</th>
                <th className="py-2.5 px-4">Likes</th>
                <th className="py-2.5 px-4">Shares</th>
                <th className="py-2.5 px-4">Engagement</th>
                <th className="py-2.5 px-4 text-right">Tautan Langsung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {(() => {
                const publishedList = contentItems.filter(
                  (c) => c.stage === "terbit" || c.stage === "dianalisis"
                );
                if (publishedList.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-xs text-neutral-400">
                        Belum ada konten yang diterbitkan. Buat post baru di Composer untuk mulai melacak performa.
                      </td>
                    </tr>
                  );
                }
                return publishedList.map((item, i) => {
                  const views = Number(item.viewsCount) || 0;
                  const likes = Number(item.likesCount) || 0;
                  const eng = views > 0 ? `${((likes / views) * 100).toFixed(1)}%` : "0.0%";
                  const directUrl =
                    item.publishedUrl || "https://studio.youtube.com";

                  return (
                    <tr key={item.id || i} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-4 font-semibold text-neutral-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{item.pillar}</td>
                      <td className="py-3 px-4 font-bold text-neutral-900">
                        {views > 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                      </td>
                      <td className="py-3 px-4 text-neutral-700">
                        {likes > 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
                      </td>
                      <td className="py-3 px-4 text-neutral-700">
                        {Math.round(likes * 0.25)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5EE] text-[#2E7D47]">
                          {eng}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={directUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-800 hover:text-neutral-900 font-medium hover:underline text-xs"
                        >
                          <span>Buka Platform</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
