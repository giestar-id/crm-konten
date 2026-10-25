"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  ExternalLink,
  Film,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function CalendarView() {
  const { contentItems, setActivePage, setComposerPrefill, showToast } = useApp();

  const [currentMonth, setCurrentMonth] = useState("Oktober 2026");

  // Scheduled & published items with dates
  const scheduledItems = contentItems.filter(
    (item) => item.stage === "terjadwal" || item.stage === "terbit"
  );

  // 35 Calendar cells simulation (5 weeks: Oct 1 to Nov 4)
  const daysInMonth = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i >= 3 && i <= 33 ? i - 2 : i < 3 ? 28 + i : i - 33;
    const isCurrentMonth = i >= 3 && i <= 33;
    const isToday = i === 26; // Oct 25

    // Check if there are posts on this day from actual scheduledItems
    const dayPosts = isCurrentMonth
      ? scheduledItems.filter((s) => {
          if (!s.deadline) return false;
          const parts = s.deadline.split("-");
          if (parts.length === 3) {
            return parseInt(parts[2], 10) === dayNumber;
          }
          return false;
        })
      : [];

    return {
      cellIndex: i,
      dayNumber,
      isCurrentMonth,
      isToday,
      posts: dayPosts,
    };
  });

  return (
    <div className="page-view space-y-6">
      {/* Title & Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Kalender Konten
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Jadwal publikasi konten lintas platform (WIB)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center border border-[#EAEAEA] rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => showToast("Bulan sebelumnya")}
              className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-neutral-900">
              {currentMonth}
            </span>
            <button
              onClick={() => showToast("Bulan berikutnya")}
              className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setActivePage("compose")}
            className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Jadwalkan Konten</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Grid & Upcoming Schedule Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* 7-Col Month Grid (9 Cols) */}
        <div className="xl:col-span-9 border border-[#EAEAEA] rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-[#EAEAEA] bg-[#FAFAFA] text-center py-2.5 text-xs font-semibold text-neutral-700">
            <span>Minggu</span>
            <span>Senin</span>
            <span>Selasa</span>
            <span>Rabu</span>
            <span>Kamis</span>
            <span>Jumat</span>
            <span>Sabtu</span>
          </div>

          {/* 35 Calendar Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#EAEAEA] flex-1">
            {daysInMonth.map((cell) => (
              <div
                key={cell.cellIndex}
                className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors ${
                  cell.isCurrentMonth ? "bg-white" : "bg-[#FAFAFA]/70 opacity-60"
                } ${cell.isToday ? "ring-2 ring-neutral-900 ring-inset" : "hover:bg-neutral-50/50"}`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                      cell.isToday
                        ? "bg-[#0A0A0A] text-white"
                        : cell.isCurrentMonth
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {cell.isToday && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800">
                      Hari Ini
                    </span>
                  )}
                </div>

                {/* Posts in this cell */}
                <div className="space-y-1.5 my-1">
                  {cell.posts.map((post: any, idx: number) => {
                    const isPublished = post.stage === "terbit";
                    return (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-md text-[10px] leading-tight font-medium border cursor-pointer hover:opacity-90 ${
                          isPublished
                            ? "bg-[#EAF5EE] border-[#2E7D47]/30 text-[#2E7D47]"
                            : "bg-[#FAFAFA] border-neutral-300 text-neutral-900"
                        }`}
                        title={post.title}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate max-w-[85px]">
                            {isPublished ? "Terbit" : "19:00 WIB"}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-mono">
                            4 Hubs
                          </span>
                        </div>
                        <p className="truncate mt-0.5">{post.title}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Best Time Suggestion Indicator */}
                {cell.dayNumber === 25 || cell.dayNumber === 26 || cell.dayNumber === 28 ? (
                  <div className="text-[9px] text-[#737373] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-neutral-400" />
                    <span>Prime: 19:00</span>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule Sidebar (3 Cols) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Best Time to Post Banner */}
          <div className="border border-[#EAEAEA] rounded-xl p-4 bg-[#FAFAFA] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-neutral-700" />
              <span>Smart Posting Slots</span>
            </div>
            <p className="text-[11px] text-[#737373] leading-relaxed">
              Berdasarkan performa 248.6k views lampau, waktu upload paling tinggi interaksi:
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between p-1.5 bg-white rounded border border-[#EAEAEA]">
                <span className="text-neutral-700">Senin - Jumat</span>
                <span className="font-semibold text-neutral-900">19:00 WIB</span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded border border-[#EAEAEA]">
                <span className="text-neutral-700">Sabtu - Minggu</span>
                <span className="font-semibold text-neutral-900">20:00 WIB</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="border border-[#EAEAEA] rounded-xl p-4 bg-white shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-neutral-900">
              Antrean Terjadwal Mendatang
            </h3>

            {(() => {
              const scheduledQueue = contentItems.filter((i) => i.stage === "terjadwal");
              if (scheduledQueue.length === 0) {
                return (
                  <div className="py-6 text-center text-xs text-neutral-400 space-y-2">
                    <p>Belum ada antrean jadwal konten.</p>
                    <button
                      onClick={() => setActivePage("compose")}
                      className="text-neutral-900 font-medium hover:underline text-[11px]"
                    >
                      + Jadwalkan di Composer
                    </button>
                  </div>
                );
              }
              return (
                <div className="space-y-3">
                  {scheduledQueue.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#EAEAEA] rounded-lg p-3 bg-[#FAFAFA] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#FEF3C7] text-[#B45309]">
                          {item.deadline || "Terjadwal"}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {item.targetPlatforms?.length || 1} Akun
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-900 leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-neutral-500">{item.pillar}</span>
                        <button
                          onClick={() => {
                            setComposerPrefill({
                              title: item.title,
                              caption: item.notes || "",
                              mediaName: item.mediaName,
                            });
                            setActivePage("compose");
                          }}
                          className="text-neutral-900 font-semibold hover:underline"
                        >
                          Buka Composer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
