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
  const { showToast } = useApp();
  const [selectedRange, setSelectedRange] = useState("30 Hari Terakhir");

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Platform,Title,Views,Likes,Comments,Shares,EngagementRate\n" +
      "YouTube Shorts,5 AI Tools That Save 20 Hours/Week,142000,12100,840,4300,12.1%\n" +
      "TikTok,5 AI Tools That Save 20 Hours/Week,78500,5200,410,2100,9.8%\n" +
      "Instagram Reels,Tips Menghubungkan 4 Platform,64200,4900,320,1400,10.2%\n" +
      "Facebook Page,Review Logitech MX Mechanical Mini,32400,1800,140,420,7.3%\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
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
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-neutral-100 text-neutral-800">
              Cross-Platform Analytics
            </span>
            <span className="text-xs text-[#737373]">
              Agregasi Metrik YouTube, TikTok, Instagram & Facebook
            </span>
          </div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight mt-1">
            Tracking & Laporan Performa
          </h1>
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
            <span className="text-2xl font-semibold text-neutral-900">842.5k</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-[#737373] mt-2">
            vs. 711.2k periode sebelumnya
          </p>
        </div>

        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
          <p className="text-xs text-[#737373] mb-1">Average Engagement Rate</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">9.84%</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
              +1.2%
            </span>
          </div>
          <p className="text-[11px] text-[#737373] mt-2">Industri rata-rata: 4.5%</p>
        </div>

        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
          <p className="text-xs text-[#737373] mb-1">Total Shares & Re-posts</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">14,290</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
              +32%
            </span>
          </div>
          <p className="text-[11px] text-[#737373] mt-2">Didominasi oleh TikTok & Reels</p>
        </div>

        <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
          <p className="text-xs text-[#737373] mb-1">Average Watch Duration</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">42.8 dtk</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
              79.2%
            </span>
          </div>
          <p className="text-[11px] text-[#737373] mt-2">Retensi video vertikal 54 dtk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Retention Curve Chart (7 Cols) */}
        <div className="lg:col-span-7 border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-neutral-900">
                Audience Retention & Drop-off Curve
              </h3>
              <p className="text-[11px] text-[#737373] mt-0.5">
                Rata-rata retensi detik ke detik pada video 60 detik
              </p>
            </div>
            <span className="px-2.5 py-1 rounded border border-[#EAEAEA] text-[11px] font-medium text-neutral-800">
              Viral Curve
            </span>
          </div>

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
            <span>15 dtk (85%)</span>
            <span>30 dtk (72%)</span>
            <span>45 dtk (64%)</span>
            <span>60 dtk (End 58%)</span>
          </div>
        </div>

        {/* Platform Share Breakdown (5 Cols) */}
        <div className="lg:col-span-5 border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-neutral-900">
            Perbandingan Kontribusi Antar Platform
          </h3>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-neutral-800">YouTube Shorts</span>
                <span className="font-semibold text-neutral-900">42% • 353.8k views</span>
              </div>
              <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0A0A0A] w-[42%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-neutral-800">TikTok Direct Post</span>
                <span className="font-semibold text-neutral-900">31% • 261.1k views</span>
              </div>
              <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4A4A4A] w-[31%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-neutral-800">Instagram Reels</span>
                <span className="font-semibold text-neutral-900">18% • 151.6k views</span>
              </div>
              <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#787878] w-[18%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-neutral-800">Facebook Page Video</span>
                <span className="font-semibold text-neutral-900">9% • 75.8k views</span>
              </div>
              <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#B0B0B0] w-[9%] rounded-full" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#737373] leading-relaxed pt-2 border-t border-[#EAEAEA]">
            Formula 1-Click Publishing menghemat sekitar <strong>12.5 jam kerja manual</strong> per bulan.
          </p>
        </div>
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
              {[
                {
                  title: "5 AI Tools That Save 20 Hours/Week",
                  pillar: "Tech Reviews",
                  views: "248.6k",
                  likes: "19.4k",
                  shares: "4.8k",
                  eng: "12.4%",
                  url: "https://youtube.com/shorts/sph_demo",
                },
                {
                  title: "Tips Menghubungkan 4 Platform Sekaligus dengan 1-Click",
                  pillar: "Tutorials",
                  views: "124.5k",
                  likes: "8.9k",
                  shares: "2.1k",
                  eng: "10.2%",
                  url: "https://youtube.com/shorts/sph_demo_849",
                },
                {
                  title: "Review Keyboard Low-Profile Logitech MX Mechanical Mini",
                  pillar: "Sponsorships",
                  views: "98.2k",
                  likes: "6.4k",
                  shares: "1.2k",
                  eng: "8.7%",
                  url: "https://instagram.com/reel/sph_demo",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    {row.title}
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{row.pillar}</td>
                  <td className="py-3 px-4 font-bold text-neutral-900">{row.views}</td>
                  <td className="py-3 px-4 text-neutral-700">{row.likes}</td>
                  <td className="py-3 px-4 text-neutral-700">{row.shares}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5EE] text-[#2E7D47]">
                      {row.eng}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-neutral-800 hover:text-neutral-900 font-medium hover:underline"
                    >
                      <span>Lihat Post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
