"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Platform } from "@/types";
import {
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";

export function LivePublishModal() {
  const { publishProgress, closePublishModal, retryPlatformPublish, setActivePage } =
    useApp();

  if (!publishProgress.isOpen) return null;

  const platformIcons: Record<Platform, { name: string; color: string; badge: string }> = {
    youtube: { name: "YouTube", color: "#FF0000", badge: "Shorts & Video" },
    instagram: { name: "Instagram", color: "#E1306C", badge: "Reels" },
    tiktok: { name: "TikTok", color: "#000000", badge: "Direct Post" },
    facebook: { name: "Facebook", color: "#1877F2", badge: "Page Video" },
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EAEAEA] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-neutral-100 text-neutral-800">
                1-Click Parallel Publisher
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Key: {publishProgress.idempotencyKey}
              </span>
            </div>
            <h3 className="text-base font-semibold text-neutral-900 mt-1">
              Publishing &ldquo;{publishProgress.jobTitle}&rdquo;
            </h3>
            <p className="text-xs text-[#737373] mt-0.5">
              Mengunggah file sekali dan mendistribusikan ke 4 platform secara simultan
            </p>
          </div>
          <button
            onClick={closePublishModal}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Progress */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-neutral-800 flex items-center gap-1.5">
              {!publishProgress.isComplete && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600" />
              )}
              {publishProgress.overallStatus}
            </span>
            <span className="font-semibold text-neutral-900">
              {publishProgress.overallProgress}%
            </span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0A0A0A] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${publishProgress.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Individual Platform Progress Cards */}
        <div className="space-y-3 pt-1">
          {publishProgress.targets.map((target) => {
            const info = platformIcons[target.platform];
            return (
              <div
                key={target.platform}
                className="border border-[#EAEAEA] rounded-xl p-3.5 bg-[#FAFAFA] flex flex-col gap-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0A0A0A]" />
                    <span className="text-xs font-semibold text-neutral-900">
                      {info.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/60 text-neutral-700 font-medium">
                      {info.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {target.status === "queued" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                        <Clock className="w-3 h-3" /> Queued
                      </span>
                    )}
                    {target.status === "uploading" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700">
                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading (50%)
                      </span>
                    )}
                    {target.status === "processing" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-800">
                        <Loader2 className="w-3 h-3 animate-spin" /> Transcoding...
                      </span>
                    )}
                    {target.status === "published" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EAF5EE] text-[#2E7D47]">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    )}
                    {target.status === "failed" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FCECEC] text-[#C93B3B]">
                        <AlertCircle className="w-3 h-3" /> Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar per target */}
                <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      target.status === "failed"
                        ? "bg-[#C93B3B]"
                        : target.status === "published"
                        ? "bg-[#2E7D47]"
                        : "bg-[#0A0A0A]"
                    }`}
                    style={{ width: `${target.progress}%` }}
                  />
                </div>

                {/* Status message, Link or Retry */}
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  {target.status === "published" && target.externalUrl ? (
                    <a
                      href={target.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neutral-700 hover:text-neutral-900 font-medium inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Lihat Post di {info.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : target.status === "failed" ? (
                    <span className="text-[#C93B3B] font-medium truncate max-w-[340px]">
                      {target.lastError || "Koneksi terputus saat publish"}
                    </span>
                  ) : (
                    <span className="text-neutral-500">
                      Processing async container webhook
                    </span>
                  )}

                  {target.status === "failed" && (
                    <button
                      onClick={() => retryPlatformPublish(target.platform)}
                      className="px-2.5 py-1 rounded bg-[#171717] text-white hover:bg-neutral-800 font-medium text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EAEAEA]">
          <span className="text-xs text-[#737373]">
            {publishProgress.isComplete
              ? "Semua status tercatat dalam Audit Log & Pipeline."
              : "Jangan tutup jendela ini saat proses unggah berlangsung."}
          </span>
          <div className="flex items-center gap-2">
            {publishProgress.isComplete && (
              <button
                onClick={() => {
                  closePublishModal();
                  setActivePage("pipeline");
                }}
                className="px-3 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                Lihat di Pipeline
              </button>
            )}
            <button
              onClick={closePublishModal}
              className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
            >
              {publishProgress.isComplete ? "Tutup" : "Minimize ke Background"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
