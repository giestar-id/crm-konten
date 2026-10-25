"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Platform, PlatformOverrides } from "@/types";
import {
  UploadCloud,
  Film,
  Sparkles,
  Send,
  Calendar,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  Eye,
  Sliders,
  X,
} from "lucide-react";

export function ComposerView() {
  const {
    startPublishProcess,
    showToast,
    addContentItem,
    composerPrefill,
    setComposerPrefill,
    setActivePage,
    socialAccounts,
  } = useApp();

  // Base Form State
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  // Media File State
  const [mediaFile, setMediaFile] = useState<{
    name: string;
    size: string;
    duration: string;
    aspectRatio: "9:16" | "16:9";
    previewUrl?: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Platform Targets
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "youtube",
    "instagram",
    "tiktok",
    "facebook",
  ]);

  // Per-Platform Overrides State
  const [showOverrides, setShowOverrides] = useState(false);
  const [overrides, setOverrides] = useState<Record<Platform, PlatformOverrides>>({
    youtube: {
      title: "",
      caption: "",
      privacy: "public",
      category: "Science & Technology",
      isShorts: true,
    },
    instagram: {
      caption: "",
      shareToFeed: true,
    },
    tiktok: {
      caption: "",
      allowDuet: true,
      allowStitch: true,
      allowComments: true,
      isDirectPost: true,
    },
    facebook: {
      caption: "",
      privacy: "public",
    },
  });

  // Scheduling State
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-10-25");
  const [scheduleTime, setScheduleTime] = useState("19:00");

  // Load prefill if provided
  useEffect(() => {
    if (composerPrefill) {
      if (composerPrefill.title) setTitle(composerPrefill.title);
      if (composerPrefill.caption) setCaption(composerPrefill.caption);
      if (composerPrefill.mediaName) {
        setMediaFile({
          name: composerPrefill.mediaName,
          size: "Video Lampiran",
          duration: "0:58",
          aspectRatio: "9:16",
        });
      }
      setComposerPrefill(null);
    }
  }, [composerPrefill, setComposerPrefill]);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadProgress(40);

      const previewUrl = URL.createObjectURL(file);
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.onloadedmetadata = () => {
        const durationSec = Math.round(tempVideo.duration) || 0;
        const mins = Math.floor(durationSec / 60);
        const secs = durationSec % 60;
        const durationStr = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
        const isVertical = tempVideo.videoWidth < tempVideo.videoHeight;
        const ratio: "9:16" | "16:9" = isVertical ? "9:16" : "16:9";

        setMediaFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          duration: durationStr,
          aspectRatio: ratio,
          previewUrl,
        });
        setUploadProgress(100);
        setIsUploading(false);
        showToast(`Video "${file.name}" siap (${ratio}, durasi ${durationStr}).`);
      };
      tempVideo.onerror = () => {
        setMediaFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          duration: "--:--",
          aspectRatio: "9:16",
          previewUrl,
        });
        setUploadProgress(100);
        setIsUploading(false);
      };
      tempVideo.src = previewUrl;
    }
  };

  const addTag = (tag: string) => {
    const clean = tag.startsWith("#") ? tag : `#${tag}`;
    if (!selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handlePublishNow = () => {
    if (selectedPlatforms.length === 0) {
      showToast("Pilih minimal satu platform tujuan publikasi.");
      return;
    }
    if (!title.trim()) {
      showToast("Judul konten wajib diisi.");
      return;
    }

    startPublishProcess(
      title,
      caption,
      selectedPlatforms,
      mediaFile ? mediaFile.name : "unattached_video.mp4",
      overrides
    );
  };

  const handleSchedulePost = () => {
    if (selectedPlatforms.length === 0) {
      showToast("Pilih minimal satu platform tujuan.");
      return;
    }
    const scheduledAtString = `${scheduleDate}T${scheduleTime}:00+07:00`;
    addContentItem({
      title,
      stage: "terjadwal",
      pillar: "Tech Reviews",
      priority: "high",
      deadline: scheduleDate,
      notes: caption,
      tags: selectedTags,
      mediaName: mediaFile?.name,
      targetPlatforms: selectedPlatforms,
      scheduledAt: scheduledAtString,
      checklist: [
        { id: "ck-sch-1", text: "Verifikasi format video 9:16", done: true },
        { id: "ck-sch-2", text: "Automated trigger cron", done: true },
      ],
    });
    showToast(`Post berhasil dijadwalkan pada ${scheduleDate} ${scheduleTime} WIB.`);
    setActivePage("calendar");
  };

  const handleSaveDraft = () => {
    addContentItem({
      title,
      stage: "siap_posting",
      pillar: "Tech Reviews",
      priority: "medium",
      deadline: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      notes: caption,
      tags: selectedTags,
      mediaName: mediaFile?.name,
      targetPlatforms: selectedPlatforms,
      checklist: [{ id: "ck-draft-1", text: "Draft disimpan dari Composer", done: true }],
    });
    setActivePage("pipeline");
  };

  return (
    <div className="page-view max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Composer
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Unggah video dan publikasikan ke YouTube, Instagram, TikTok, dan Facebook
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draft</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Media Upload & Metadata (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Media Dropzone (Resumable Upload Simulator) */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">
                1. Media Video Aset
              </span>
              <span className="text-[11px] text-[#737373]">
                Rekomendasi 9:16 (Shorts, Reels, TikTok)
              </span>
            </div>

            {mediaFile ? (
              <div className="space-y-3">
                <div className="border border-[#EAEAEA] rounded-lg p-3.5 bg-[#FAFAFA] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0A0A0A] text-white flex items-center justify-center shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 truncate max-w-[280px]">
                        {mediaFile.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-[#737373] mt-0.5">
                        <span>{mediaFile.size}</span>
                        <span>•</span>
                        <span>Durasi: {mediaFile.duration}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800 font-mono text-[10px]">
                          {mediaFile.aspectRatio}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setMediaFile(null)}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-700"
                    title="Ganti Video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {mediaFile.previewUrl && (
                  <div className="rounded-xl overflow-hidden border border-[#EAEAEA] bg-black max-h-[260px] flex items-center justify-center">
                    <video
                      src={mediaFile.previewUrl}
                      controls
                      className="max-h-[260px] w-auto mx-auto"
                    />
                  </div>
                )}
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#D4D4D4] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neutral-900 transition-colors bg-[#FAFAFA]">
                <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
                <p className="text-xs font-semibold text-neutral-900">
                  Drag & drop video di sini, atau klik untuk memilih file
                </p>
                <p className="text-[11px] text-[#737373] mt-1">
                  Mendukung MP4, MOV (hingga 500MB). Pemutaran preview langsung aktif.
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-600 font-medium">
                  <span>Mengunggah video (chunked upload)...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0A0A0A] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Base Metadata (Universal Title, Universal Caption, Tags) */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
            <span className="text-xs font-semibold text-neutral-900 block">
              2. Metadata Universal
            </span>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Judul Konten Universal
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: 5 AI Tools Yang Mengubah Cara Kerja Solo Creator..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-700">
                  Universal Caption
                </label>
                <span className="text-[11px] text-[#737373]">
                  {caption.length} / 2,200 karakter
                </span>
              </div>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Tulis caption umum untuk seluruh platform..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 resize-none leading-relaxed"
              />
            </div>

            {/* Hashtag Presets */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Hashtags & Tagar Populer
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FAFAFA] border border-[#EAEAEA] text-neutral-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTagInput.trim()) {
                      e.preventDefault();
                      addTag(newTagInput.trim());
                      setNewTagInput("");
                    }
                  }}
                  placeholder="Ketik hashtag lalu Enter..."
                  className="px-3 py-1.5 text-xs border border-[#EAEAEA] rounded-lg w-48 text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
                <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                  <span>Preset:</span>
                  {["#Coding", "#TechReview", "#ViralShorts"].map((p) => (
                    <button
                      key={p}
                      onClick={() => addTag(p)}
                      className="hover:text-neutral-900 underline ml-1"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Platform Overrides Accordion (PUB-3 & PUB-8) */}
          <div className="border border-[#EAEAEA] rounded-xl bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setShowOverrides(!showOverrides)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-neutral-600" />
                <div>
                  <span className="text-xs font-semibold text-neutral-900 block">
                    3. Kustomisasi Spesifik Tiap Platform (Overrides)
                  </span>
                  <span className="text-[11px] text-[#737373] block mt-0.5">
                    Override judul YouTube, cover IG Reels, stitch TikTok, dan visibilitas
                  </span>
                </div>
              </div>
              {showOverrides ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>

            {showOverrides && (
              <div className="p-5 border-t border-[#EAEAEA] space-y-5 bg-[#FAFAFA]">
                {/* YouTube Overrides */}
                <div className="border border-[#EAEAEA] rounded-lg p-3.5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">
                      YouTube Data API v3
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      Target: Tech Pulse Studio
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">
                      Judul Khusus YouTube (Maks 100 Karakter)
                    </label>
                    <input
                      type="text"
                      value={overrides.youtube.title}
                      onChange={(e) =>
                        setOverrides({
                          ...overrides,
                          youtube: { ...overrides.youtube, title: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-[#EAEAEA] rounded text-neutral-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-1">
                        Format
                      </label>
                      <select
                        value={overrides.youtube.isShorts ? "shorts" : "video"}
                        onChange={(e) =>
                          setOverrides({
                            ...overrides,
                            youtube: {
                              ...overrides.youtube,
                              isShorts: e.target.value === "shorts",
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-[#EAEAEA] rounded bg-white text-neutral-800"
                      >
                        <option value="shorts">YouTube Shorts (Vertikal)</option>
                        <option value="video">Standard Video (16:9)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-1">
                        Visibilitas
                      </label>
                      <select
                        value={overrides.youtube.privacy}
                        onChange={(e) =>
                          setOverrides({
                            ...overrides,
                            youtube: {
                              ...overrides.youtube,
                              privacy: e.target.value as any,
                            },
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-[#EAEAEA] rounded bg-white text-neutral-800"
                      >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* TikTok Overrides */}
                <div className="border border-[#EAEAEA] rounded-lg p-3.5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">
                      TikTok Content Posting API
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      Target: {socialAccounts.find((a) => a.platform === "tiktok")?.handle || "TikTok"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-800">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overrides.tiktok.allowDuet}
                        onChange={(e) =>
                          setOverrides({
                            ...overrides,
                            tiktok: {
                              ...overrides.tiktok,
                              allowDuet: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Izinkan Duet</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overrides.tiktok.allowStitch}
                        onChange={(e) =>
                          setOverrides({
                            ...overrides,
                            tiktok: {
                              ...overrides.tiktok,
                              allowStitch: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Izinkan Stitch</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overrides.tiktok.allowComments}
                        onChange={(e) =>
                          setOverrides({
                            ...overrides,
                            tiktok: {
                              ...overrides.tiktok,
                              allowComments: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Buka Komentar</span>
                    </label>
                  </div>
                </div>

                {/* Instagram Reels Overrides */}
                <div className="border border-[#EAEAEA] rounded-lg p-3.5 bg-white space-y-2">
                  <span className="text-xs font-semibold text-neutral-900 block">
                    Instagram Reels Graph API
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={overrides.instagram.shareToFeed}
                      onChange={(e) =>
                        setOverrides({
                          ...overrides,
                          instagram: {
                            ...overrides.instagram,
                            shareToFeed: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span>Share Reel to Main Profile Feed</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Destination Platforms & Publishing CTA (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Target Platforms Checkboxes */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">
                Pilih Platform Tujuan ({selectedPlatforms.length}/4)
              </span>
              <button
                onClick={() =>
                  setSelectedPlatforms([
                    "youtube",
                    "instagram",
                    "tiktok",
                    "facebook",
                  ])
                }
                className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium"
              >
                Pilih Semua
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: "youtube" as Platform,
                  name: "YouTube Shorts & Video",
                },
                {
                  id: "instagram" as Platform,
                  name: "Instagram Reels",
                },
                {
                  id: "tiktok" as Platform,
                  name: "TikTok Video",
                },
                {
                  id: "facebook" as Platform,
                  name: "Facebook Page Video",
                },
              ].map((plat) => {
                const isChecked = selectedPlatforms.includes(plat.id);
                const acc = socialAccounts.find((a) => a.platform === plat.id);
                const isConnected = acc && acc.status === "active";
                const accountDisplay = isConnected
                  ? `${acc.displayName} (${acc.handle})`
                  : "Belum terhubung";
                const quotaDisplay = isConnected
                  ? "Terhubung"
                  : "Perlu koneksi";

                return (
                  <div
                    key={plat.id}
                    onClick={() => togglePlatform(plat.id)}
                    className={`border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? "border-neutral-900 bg-[#FAFAFA]"
                        : "border-[#EAEAEA] bg-white opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center text-white text-xs ${
                          isChecked ? "bg-[#0A0A0A]" : "border border-neutral-300"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-neutral-900">
                          {plat.name}
                        </p>
                        <p className="text-[11px] text-[#737373] mt-0.5 truncate max-w-[200px]">
                          {accountDisplay}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        isConnected
                          ? "bg-[#EAF5EE] text-[#2E7D47]"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {quotaDisplay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule or Instant Publish Selector */}
          <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm space-y-4">
            <span className="text-xs font-semibold text-neutral-900 block">
              Opsi Eksekusi
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsScheduling(false)}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  !isScheduling
                    ? "bg-[#0A0A0A] text-white"
                    : "border border-[#EAEAEA] text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Sekarang</span>
              </button>

              <button
                type="button"
                onClick={() => setIsScheduling(true)}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  isScheduling
                    ? "bg-[#0A0A0A] text-white"
                    : "border border-[#EAEAEA] text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Jadwalkan</span>
              </button>
            </div>

            {isScheduling ? (
              <div className="space-y-3 pt-2 border-t border-[#EAEAEA]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">
                      Tanggal Tayang
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[#EAEAEA] rounded bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">
                      Jam (WIB)
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[#EAEAEA] rounded bg-white text-neutral-900"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#EAF5EE] text-[#2E7D47] text-[11px] flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    Rekomendasi Waktu Terbaik: <strong>19:00 WIB</strong> (Tingkat engagement tertinggi penonton Indonesia).
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSchedulePost}
                  className="w-full py-2.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Konfirmasi Jadwal Posting</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2 border-t border-[#EAEAEA]">
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA] text-[11px] text-neutral-600 leading-relaxed">
                  Menekan tombol di bawah akan langsung membuat antrean paralel ke 4 platform via Inngest/Trigger.dev queue runner.
                </div>

                <button
                  type="button"
                  onClick={handlePublishNow}
                  className="w-full py-3 rounded-xl bg-[#0A0A0A] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Publish Now ke {selectedPlatforms.length} Platform</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
