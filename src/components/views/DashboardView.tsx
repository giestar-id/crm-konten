"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ChevronRight,
  TrendingUp,
  ChevronDown,
  Info,
  Sparkles,
  ExternalLink,
  Film,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export function DashboardView() {
  const { setActivePage, contentItems, setComposerPrefill, showToast } = useApp();
  const [timeframe, setTimeframe] = useState<"Week" | "Month" | "Quarter">("Week");

  // Heatmap values dynamically derived from published items (zero when empty)
  const publishedItems = contentItems.filter(
    (c) => c.stage === "terbit" || c.stage === "dianalisis"
  );
  const heatmapData = Array.from({ length: 35 }, (_, i) => {
    if (publishedItems.length === 0) return 0;
    return i === 25 ? Math.min(publishedItems.length, 4) : 0;
  });

  // Helper color for heatmap
  const getHeatmapColor = (val: number) => {
    if (val === 0) return "#EFEFEF";
    if (val === 1) return "#D4D4D4";
    if (val === 2) return "#9E9E9E";
    if (val === 3) return "#474747";
    return "#0A0A0A";
  };

  return (
    <div className="page-view space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#171717] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Ringkasan performa konten & jadwal posting multi-platform
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage("compose")}
            className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Post</span>
          </button>
          <button
            onClick={() => setActivePage("pipeline")}
            className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            Pipeline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT & CENTER COLUMN (8 Cols) */}
        <div className="xl:col-span-8 space-y-5">
          {/* ROW 1: Post Goal & Total Views */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Content Publishing Goal */}
            <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white flex items-center justify-between hover:border-neutral-300 transition-colors shadow-sm">
              <div className="flex items-center gap-5">
                {/* SVG Radial Donut Gauge */}
                {(() => {
                  const publishedCount = contentItems.filter(
                    (c) => c.stage === "terbit" || c.stage === "dianalisis"
                  ).length;
                  const targetCount = 30;
                  const pct = Math.min(100, Math.round((publishedCount / targetCount) * 100));
                  const strokeOffset = 238.76 - (238.76 * pct) / 100;
                  return (
                    <>
                      <div className="relative w-[86px] h-[86px] flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke="#E5E5E5"
                            strokeWidth="14"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke="#111111"
                            strokeWidth="14"
                            strokeDasharray="238.76"
                            strokeDashoffset={strokeOffset}
                            strokeLinecap="butt"
                            className="transition-all duration-700 ease-out"
                          />
                        </svg>
                        <span className="absolute text-xs font-semibold text-neutral-900">
                          {pct}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#737373] mb-1">
                          Monthly Post Target
                        </p>
                        <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900 leading-snug">
                          {publishedCount} / {targetCount} Posts
                        </h2>
                        <p className="text-xs text-[#737373] mt-1">Bulan Ini (Oktober)</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setActivePage("pipeline")}
                className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors self-start mt-1 shrink-0"
                title="Kelola Pipeline"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Total Cross-Platform Views */}
            <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white flex items-center justify-between gap-4 hover:border-neutral-300 transition-colors shadow-sm">
              <div className="w-[125px] h-[82px] shrink-0 relative">
                <svg viewBox="0 0 130 85" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#171717" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#171717" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="10" y1="10" x2="10" y2="80" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="2.5,2.5" />
                  <line x1="33" y1="10" x2="33" y2="80" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="2.5,2.5" />
                  <line x1="56" y1="10" x2="56" y2="80" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="2.5,2.5" />
                  <line x1="79" y1="10" x2="79" y2="80" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="2.5,2.5" />
                  <line x1="102" y1="10" x2="102" y2="80" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="2.5,2.5" />
                  <line x1="122" y1="10" x2="122" y2="80" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="2.5,2.5" />
                  <path
                    d="M5,20 L25,8 L58,36 L82,25 L103,15 L114,19 L123,13 L123,80 L5,80 Z"
                    fill="url(#expGrad)"
                  />
                  <path
                    d="M5,20 L25,8 L58,36 L82,25 L103,15 L114,19 L123,13"
                    fill="none"
                    stroke="#111111"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#737373] mb-1">Total Cross-Platform Views</p>
                {(() => {
                  const totalV = contentItems.reduce((acc, c) => acc + (Number(c.viewsCount) || 0), 0);
                  return (
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900 leading-snug">
                        {totalV > 1000 ? `${(totalV / 1000).toFixed(1)}k` : totalV}
                      </h2>
                      {totalV > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF5EE] text-[#2E7D47]">
                          <TrendingUp className="w-3 h-3" />
                          Aktif
                        </span>
                      )}
                    </div>
                  );
                })()}
                <p className="text-xs text-[#737373] mt-1">Akumulasi Seluruh Platform</p>
              </div>
            </div>
          </div>

          {/* ROW 2: Multi-Platform Activity Stacked Bars */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-medium text-[#737373] mb-1.5">
                  Multi-Platform Activity & Impressions
                </p>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900">
                    {(() => {
                      const totalV = contentItems.reduce(
                        (acc, c) => acc + (Number(c.viewsCount) || 0),
                        0
                      );
                      return totalV > 0 ? `${(totalV / 7).toFixed(1)}k Views / Day` : "0 Views / Day";
                    })()}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF5EE] text-[#2E7D47]">
                    <TrendingUp className="w-3 h-3" />
                    {contentItems.some((c) => Number(c.viewsCount) > 0) ? "Optimal" : "Aktif"}
                  </span>
                </div>
                <p className="text-xs text-[#737373] mt-1">Rata-rata Penayangan 7 Hari</p>
              </div>

              {/* Timeframe selector matching reference */}
              <div className="flex items-center gap-2.5 self-start sm:mt-2">
                <button
                  onClick={() => showToast("Menampilkan rentang 7 hari aktif")}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 flex items-center gap-2 hover:bg-neutral-50 transition-colors"
                >
                  <span>19 Okt - 25 Okt</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    setTimeframe(timeframe === "Week" ? "Month" : "Week")
                  }
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 flex items-center gap-2 hover:bg-neutral-50 transition-colors"
                >
                  <span>{timeframe}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Platform Legend Matching Reference Monochrome Gradient */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-xs font-medium text-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A0A0A]"></span>
                <span>YouTube Shorts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4A4A4A]"></span>
                <span>TikTok</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#787878]"></span>
                <span>Instagram Reels</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B0B0B0]"></span>
                <span>Facebook Page</span>
              </div>
            </div>

            {/* Stacked Chart SVG Canvas */}
            <div className="relative pl-8 pr-2 pt-2 pb-7">
              <div className="h-[190px] flex flex-col justify-between relative">
                {/* Horizontal grid lines */}
                <div className="relative w-full border-b border-dashed border-neutral-200">
                  <span className="absolute -left-8 -top-2 text-[11px] text-neutral-600 font-medium">50k</span>
                </div>
                <div className="relative w-full border-b border-dashed border-neutral-200">
                  <span className="absolute -left-8 -top-2 text-[11px] text-neutral-600 font-medium">35k</span>
                </div>
                <div className="relative w-full border-b border-dashed border-neutral-200">
                  <span className="absolute -left-8 -top-2 text-[11px] text-neutral-600 font-medium">15k</span>
                </div>
                <div className="relative w-full border-b border-dashed border-neutral-200">
                  <span className="absolute -left-7 -top-2 text-[11px] text-neutral-600 font-medium">0</span>
                </div>

                {/* 7 Stacked Bars */}
                <div className="absolute inset-x-0 -top-2 -bottom-3 grid grid-cols-7 items-end justify-items-center z-10">
                  {(() => {
                    const hasViews = contentItems.some((c) => Number(c.viewsCount) > 0);
                    return Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-7 flex flex-col-reverse group cursor-pointer transition-transform hover:scale-105"
                        title={hasViews ? "Aktivitas penayangan" : "0 views"}
                      >
                        <div
                          style={{ height: hasViews ? "36px" : "4px" }}
                          className={`${
                            hasViews ? "bg-[#0A0A0A]" : "bg-neutral-200"
                          } rounded-[2px] transition-all`}
                        />
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 text-center mt-5 text-[11px] font-medium text-neutral-800">
                <span>Min, 19</span>
                <span>Sen, 20</span>
                <span>Sel, 21</span>
                <span>Rab, 22</span>
                <span>Kam, 23</span>
                <span>Jum, 24</span>
                <span>Sab, 25</span>
              </div>
            </div>
          </div>

          {/* ROW 3: Views Growth & Distribution Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 4: Views Growth Trendline */}
            <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-[#737373] mb-1">
                    Monthly Impressions Trend
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900">
                      {(() => {
                        const totalV = contentItems.reduce(
                          (acc, c) => acc + (Number(c.viewsCount) || 0),
                          0
                        );
                        return totalV > 1000 ? `${(totalV / 1000).toFixed(1)}k Views` : `${totalV} Views`;
                      })()}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF5EE] text-[#2E7D47]">
                      <TrendingUp className="w-3 h-3" />
                      Aktif
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Filter rentang tahunan")}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 flex items-center gap-1.5 hover:bg-neutral-50 transition-colors"
                >
                  <span>2026</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2">
                <div className="h-[115px] w-full">
                  <svg viewBox="0 0 320 115" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#171717" stopOpacity="0.14" />
                        <stop offset="100%" stopColor="#171717" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="16" y1="8" x2="16" y2="108" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="88" y1="8" x2="88" y2="108" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="160" y1="8" x2="160" y2="108" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="232" y1="8" x2="232" y2="108" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="304" y1="8" x2="304" y2="108" stroke="#D4D4D4" strokeWidth="1" strokeDasharray="3,3" />
                    <path
                      d="M2,58 L30,12 L60,25 L88,20 L122,30 L150,43 L175,49 L210,20 L236,8 L270,15 L298,24 L318,20 L318,108 L2,108 Z"
                      fill="url(#revGrad)"
                    />
                    <path
                      d="M2,58 L30,12 L60,25 L88,20 L122,30 L150,43 L175,49 L210,20 L236,8 L270,15 L298,24 L318,20"
                      fill="none"
                      stroke="#111111"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex justify-between px-1 mt-2 text-[11px] font-medium text-neutral-800">
                  <span>Mei</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Agu</span>
                  <span>Okt</span>
                </div>
              </div>
            </div>

            {/* Card 5: Platform Distribution Allocation */}
            <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-[#737373] mb-1">
                    Platform Distribution Share
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900">
                      {contentItems.some((c) => Number(c.viewsCount) > 0) ? "100% Synced" : "0% Aktif"}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF5EE] text-[#2E7D47]">
                      4 Hubs
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage("accounts")}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 flex items-center gap-1.5 hover:bg-neutral-50 transition-colors"
                >
                  <span>Accounts</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {(() => {
                const totalV = contentItems.reduce((acc, c) => acc + (Number(c.viewsCount) || 0), 0);
                const ytV = contentItems
                  .filter((c) => c.targetPlatforms?.includes("youtube"))
                  .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);
                const ttV = contentItems
                  .filter((c) => c.targetPlatforms?.includes("tiktok"))
                  .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);
                const igV = contentItems
                  .filter((c) => c.targetPlatforms?.includes("instagram"))
                  .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);
                const fbV = contentItems
                  .filter((c) => c.targetPlatforms?.includes("facebook"))
                  .reduce((a, b) => a + (Number(b.viewsCount) || 0), 0);

                const sum = ytV + ttV + igV + fbV || totalV;
                const ytP = sum > 0 ? Math.round((ytV / sum) * 100) : 0;
                const ttP = sum > 0 ? Math.round((ttV / sum) * 100) : 0;
                const igP = sum > 0 ? Math.round((igV / sum) * 100) : 0;
                const fbP = sum > 0 ? Math.round((fbV / sum) * 100) : 0;

                return (
                  <div className="space-y-3.5 my-1">
                    {/* YouTube */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <span className="col-span-4 text-[11px] font-medium text-neutral-800">
                        YouTube
                      </span>
                      <div className="col-span-8 h-3.5 bg-neutral-100 rounded-[3px] overflow-hidden">
                        <div
                          style={{ width: `${ytP}%` }}
                          className="h-full bg-[#0A0A0A] rounded-[3px] transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* TikTok */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <span className="col-span-4 text-[11px] font-medium text-neutral-800">
                        TikTok
                      </span>
                      <div className="col-span-8 h-3.5 bg-neutral-100 rounded-[3px] overflow-hidden">
                        <div
                          style={{ width: `${ttP}%` }}
                          className="h-full bg-[#0A0A0A] rounded-[3px] transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <span className="col-span-4 text-[11px] font-medium text-neutral-800">
                        Instagram
                      </span>
                      <div className="col-span-8 h-3.5 bg-neutral-100 rounded-[3px] overflow-hidden">
                        <div
                          style={{ width: `${igP}%` }}
                          className="h-full bg-[#0A0A0A] rounded-[3px] transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <span className="col-span-4 text-[11px] font-medium text-neutral-800">
                        Facebook Page
                      </span>
                      <div className="col-span-8 h-3.5 bg-neutral-100 rounded-[3px] overflow-hidden">
                        <div
                          style={{ width: `${fbP}%` }}
                          className="h-full bg-[#0A0A0A] rounded-[3px] transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-12 gap-2 mt-3">
                <div className="col-span-4"></div>
                <div className="col-span-8 flex justify-between text-[11px] font-medium text-neutral-800">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Cols) */}
        <div className="xl:col-span-4 space-y-5">
          {/* Consistency Heatmap Card */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-[#737373] mb-1">
                  Posting Consistency Cadence
                </p>
                <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900">
                  {(() => {
                    const pubCount = contentItems.filter(
                      (c) => c.stage === "terbit" || c.stage === "dianalisis"
                    ).length;
                    return pubCount > 0 ? `± ${(pubCount / 35).toFixed(1)} Posts / Day` : "0 Posts / Day";
                  })()}
                </h2>
                <p className="text-xs text-[#737373] mt-1">35 Hari Terakhir</p>
              </div>
              <button
                onClick={() => showToast("Ritme posting dihitung dari rekaman publikasi")}
                className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 flex items-center gap-1.5 hover:bg-neutral-50 transition-colors"
              >
                <span>35 Hari</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Heatmap Grid 7 x 5 */}
            <div className="grid grid-cols-7 text-center text-[11px] font-medium text-neutral-700 mb-3">
              <span>Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            <div className="grid grid-cols-7 gap-2 justify-items-center mb-5">
              {heatmapData.map((val, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: getHeatmapColor(val) }}
                  className="w-7 h-7 rounded-[4px] cursor-pointer transition-transform hover:scale-115"
                  title={`${val} video terbit pada hari ini`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-[#737373] leading-tight max-w-[140px]">
                Pelacak ritme & frekuensi publikasi.
              </span>
              <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                <span>Less</span>
                <span className="w-2.5 h-2.5 bg-[#D4D4D4] inline-block rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-[#9E9E9E] inline-block rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-[#474747] inline-block rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-[#0A0A0A] inline-block rounded-[2px]" />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Highlighted Top Content Card */}
          {(() => {
            const published = contentItems
              .filter((c) => c.stage === "terbit" || c.stage === "dianalisis")
              .sort((a, b) => (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0));
            const topItem = published[0];

            return (
              <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-[#737373]">
                    Top Performing Video
                  </span>
                  <button
                    onClick={() => setActivePage("analytics")}
                    className="text-neutral-400 hover:text-neutral-700 transition-colors"
                    title="Lihat Detail Analitik"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {topItem ? (
                  <>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#DF5835] flex items-center justify-center text-white text-xl font-bold mb-3 shadow-sm">
                        {topItem.title.substring(0, 2).toUpperCase()}
                      </div>
                      <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug px-2">
                        {topItem.title}
                      </h3>
                      <p className="text-[11px] text-[#737373] mt-1">
                        {topItem.pillar}
                      </p>
                      <div className="text-[28px] font-semibold text-neutral-900 tracking-tight mt-3 mb-1">
                        {Number(topItem.viewsCount) > 1000
                          ? `${(Number(topItem.viewsCount) / 1000).toFixed(1)}k`
                          : Number(topItem.viewsCount) || 0}
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed max-w-[200px]">
                        Total views & {Number(topItem.likesCount) || 0} likes
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Status di Pipeline:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5EE] text-[#2E7D47]">
                        {topItem.stage.toUpperCase()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-400 space-y-2">
                    <p>Belum ada video yang diterbitkan.</p>
                    <button
                      onClick={() => setActivePage("compose")}
                      className="text-neutral-900 font-medium hover:underline inline-block text-[11px]"
                    >
                      + Buat konten pertama
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Ready to Publish Quick Tile */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
            <p className="text-xs font-medium text-[#737373] mb-2">
              Ready to Publish in Pipeline
            </p>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-semibold tracking-tight text-neutral-900">
                  {contentItems.filter((c) => c.stage === "siap_posting").length} Video
                </h2>
                <p className="text-[11px] text-[#737373]">Menunggu 1-click publish</p>
              </div>
              <button
                onClick={() => {
                  const readyItem = contentItems.find(
                    (c) => c.stage === "siap_posting"
                  );
                  if (readyItem) {
                    setComposerPrefill({
                      title: readyItem.title,
                      caption: readyItem.notes || "",
                      mediaName: readyItem.mediaName,
                    });
                  }
                  setActivePage("compose");
                }}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Buka Composer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
