"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Film,
  UploadCloud,
  Search,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Clock,
  Trash2,
} from "lucide-react";

export function MediaView() {
  const { mediaAssets, addMediaAsset, setComposerPrefill, setActivePage, showToast } =
    useApp();
  const [filterRatio, setFilterRatio] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filteredAssets = mediaAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesRatio = filterRatio === "All" || asset.aspectRatio === filterRatio;
    return matchesSearch && matchesRatio;
  });

  const handleUseInComposer = (asset: any) => {
    setComposerPrefill({
      mediaName: asset.name,
      title: asset.name.replace(".mp4", "").replace(/_/g, " "),
    });
    setActivePage("compose");
  };

  return (
    <div className="page-view space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Media Assets
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Penyimpanan aset video, thumbnail, dan materi kreatif
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              addMediaAsset({
                name: `creator_reel_${Date.now().toString().slice(-4)}.mp4`,
                duration: "0:45",
                aspectRatio: "9:16",
                size: "42.0 MB",
                resolution: "1080 x 1920 (FHD)",
                thumbnailUrl:
                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60",
                tags: ["Vertical", "Shorts"],
              });
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Video Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAEAEA] pb-4">
        <div className="flex items-center gap-2">
          <select
            value={filterRatio}
            onChange={(e) => setFilterRatio(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#EAEAEA] rounded-lg bg-white text-neutral-800"
          >
            <option value="All">Semua Rasio</option>
            <option value="9:16">Vertikal (9:16)</option>
            <option value="16:9">Horizontal (16:9)</option>
          </select>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari file video..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Media Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="border border-[#EAEAEA] rounded-xl bg-white shadow-sm overflow-hidden flex flex-col justify-between hover:border-neutral-400 transition-colors"
          >
            <div className="relative h-40 bg-neutral-900 overflow-hidden flex items-center justify-center">
              <img
                src={asset.thumbnailUrl}
                alt={asset.name}
                className="w-full h-full object-cover opacity-80"
              />
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white">
                {asset.duration}
              </span>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/90 text-neutral-900">
                {asset.aspectRatio}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 truncate">
                  {asset.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-[#737373] mt-1">
                  <span>{asset.size}</span>
                  <span>•</span>
                  <span>{asset.resolution}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-mono">
                  {asset.uploadedAt}
                </span>

                <button
                  onClick={() => handleUseInComposer(asset)}
                  className="px-2.5 py-1 rounded bg-[#0A0A0A] text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Use in Composer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
