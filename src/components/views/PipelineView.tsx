"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ContentItem,
  ContentStage,
  ContentPillar,
  PriorityLevel,
} from "@/types";
import {
  Kanban,
  List,
  Plus,
  ArrowRight,
  CheckSquare,
  Film,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";

export function PipelineView() {
  const {
    contentItems,
    addContentItem,
    updateContentStage,
    deleteContentItem,
    toggleChecklist,
    setActivePage,
    setComposerPrefill,
    searchQuery,
  } = useApp();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedPillar, setSelectedPillar] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item modal form state
  const [newTitle, setNewTitle] = useState("");
  const [newStage, setNewStage] = useState<ContentStage>("ide");
  const [newPillar, setNewPillar] = useState<ContentPillar>("Tech Reviews");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("medium");
  const [newDeadline, setNewDeadline] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]
  );
  const [newNotes, setNewNotes] = useState("");

  const stages: { id: ContentStage; label: string; count: number }[] = [
    { id: "ide", label: "1. Ide", count: 0 },
    { id: "naskah", label: "2. Naskah", count: 0 },
    { id: "produksi", label: "3. Produksi", count: 0 },
    { id: "editing", label: "4. Editing", count: 0 },
    { id: "siap_posting", label: "5. Siap Posting", count: 0 },
    { id: "terjadwal", label: "6. Terjadwal", count: 0 },
    { id: "terbit", label: "7. Terbit", count: 0 },
    { id: "dianalisis", label: "8. Dianalisis", count: 0 },
  ];

  // Filter content
  const filteredItems = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPillar =
      selectedPillar === "All" || item.pillar === selectedPillar;
    const matchesPriority =
      selectedPriority === "All" || item.priority === selectedPriority;
    return matchesSearch && matchesPillar && matchesPriority;
  });

  const stageOrder: ContentStage[] = [
    "ide",
    "naskah",
    "produksi",
    "editing",
    "siap_posting",
    "terjadwal",
    "terbit",
    "dianalisis",
  ];

  const advanceStage = (id: string, currentStage: ContentStage) => {
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      updateContentStage(id, stageOrder[currentIndex + 1]);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addContentItem({
      title: newTitle.trim(),
      stage: newStage,
      pillar: newPillar,
      priority: newPriority,
      deadline: newDeadline,
      notes: newNotes,
      checklist: [
        { id: `ck-new-1`, text: "Briefing konsep dasar", done: false },
        { id: `ck-new-2`, text: "Review naskah & hook", done: false },
      ],
      tags: [`#${newPillar.replace(/\s+/g, "")}`, "#ContentCRM"],
      targetPlatforms: ["youtube", "instagram", "tiktok", "facebook"],
    });
    setNewTitle("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="page-view space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-neutral-100 text-neutral-800">
              Content CRM
            </span>
            <span className="text-xs text-[#737373]">
              8 Tahap Siklus Hidup Konten
            </span>
          </div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight mt-1">
            Pipeline Konten
          </h1>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View switcher matching minimalist reference */}
          <div className="inline-flex rounded-lg border border-[#EAEAEA] p-0.5 bg-[#FAFAFA]">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "kanban"
                  ? "bg-white shadow-sm text-neutral-900 font-semibold"
                  : "text-[#737373] hover:text-neutral-900"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-neutral-900 font-semibold"
                  : "text-[#737373] hover:text-neutral-900"
              }`}
            >
              List
            </button>
          </div>

          {/* Pillar Filter */}
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#EAEAEA] rounded-lg bg-white text-neutral-800 focus:outline-none"
          >
            <option value="All">Semua Pilar</option>
            <option value="Tech Reviews">Tech Reviews</option>
            <option value="Tutorials">Tutorials</option>
            <option value="Personal Brand">Personal Brand</option>
            <option value="Sponsorships">Sponsorships</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-[#EAEAEA] rounded-lg bg-white text-neutral-800 focus:outline-none"
          >
            <option value="All">Semua Prioritas</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kartu</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start min-h-[600px]">
          {stages.map((stage) => {
            const stageItems = filteredItems.filter((i) => i.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="w-[280px] shrink-0 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-3 flex flex-col max-h-[80vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#EAEAEA]">
                  <span className="text-xs font-semibold text-neutral-900">
                    {stage.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-200 text-neutral-800">
                    {stageItems.length}
                  </span>
                </div>

                {/* Card Stack */}
                <div className="space-y-3 overflow-y-auto pr-0.5 flex-1">
                  {stageItems.map((item) => {
                    const doneChecklists = item.checklist.filter((c) => c.done).length;
                    const isSiapPosting = item.stage === "siap_posting";
                    return (
                      <div
                        key={item.id}
                        className="kanban-card border border-[#EAEAEA] rounded-xl p-3.5 bg-white shadow-sm hover:border-neutral-400 transition-colors space-y-2.5"
                      >
                        {/* Tags & Priority */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                              item.priority === "high"
                                ? "bg-[#FCECEC] text-[#C93B3B]"
                                : item.priority === "medium"
                                ? "bg-[#FEF3C7] text-[#B45309]"
                                : "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {item.priority}
                          </span>
                          <span className="text-[10px] font-medium text-neutral-500">
                            {item.pillar}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h4 className="text-xs font-semibold text-neutral-900 leading-snug">
                          {item.title}
                        </h4>

                        {/* Script / Notes snippet */}
                        {(item.notes || item.script) && (
                          <p className="text-[11px] text-[#737373] line-clamp-2 leading-relaxed">
                            {item.notes || item.script}
                          </p>
                        )}

                        {/* Checklist Counter */}
                        {item.checklist.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-neutral-600">
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-neutral-400" />
                                <span>Checklist</span>
                              </span>
                              <span>
                                {doneChecklists} / {item.checklist.length}
                              </span>
                            </div>
                            <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-neutral-900 rounded-full"
                                style={{
                                  width: `${
                                    (doneChecklists / item.checklist.length) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Video Asset or Platforms Indicator */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#EAEAEA] text-[10px] text-neutral-500">
                          {item.mediaName ? (
                            <span className="flex items-center gap-1 font-medium text-neutral-800">
                              <Film className="w-3 h-3 text-neutral-600" />
                              <span className="truncate max-w-[110px]">
                                {item.mediaName}
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{item.deadline}</span>
                            </span>
                          )}

                          {item.viewsCount !== undefined && (
                            <span className="font-semibold text-neutral-900">
                              {(item.viewsCount / 1000).toFixed(1)}k views
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => deleteContentItem(item.id)}
                            className="p-1 rounded text-neutral-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            {isSiapPosting && (
                              <button
                                onClick={() => {
                                  setComposerPrefill({
                                    title: item.title,
                                    caption: item.notes || "",
                                    mediaName: item.mediaName || "ai_tools_2026.mp4",
                                  });
                                  setActivePage("compose");
                                }}
                                className="px-2 py-0.8 rounded bg-[#0A0A0A] text-white text-[10px] font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Publish Now</span>
                              </button>
                            )}

                            {item.stage !== "dianalisis" && (
                              <button
                                onClick={() => advanceStage(item.id, item.stage)}
                                className="px-2 py-0.8 rounded border border-neutral-700 text-neutral-900 hover:bg-neutral-900 hover:text-white text-[10px] font-medium transition-colors flex items-center gap-1"
                                title="Pindah ke Tahap Berikutnya"
                              >
                                <span>Next</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {stageItems.length === 0 && (
                    <div className="border border-dashed border-neutral-200 rounded-lg p-6 text-center text-[11px] text-neutral-400">
                      Tidak ada kartu pada tahap ini
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="border border-[#EAEAEA] rounded-xl bg-white overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA] text-[#737373] font-medium">
                <th className="py-3 px-4">Judul Konten</th>
                <th className="py-3 px-4">Tahap Pipeline</th>
                <th className="py-3 px-4">Pilar</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Tenggat</th>
                <th className="py-3 px-4">Media</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-neutral-900">{item.title}</p>
                    <div className="flex gap-1.5 mt-0.5">
                      {item.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] text-neutral-500">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-800">
                      {item.stage.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-700">{item.pillar}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                        item.priority === "high"
                          ? "bg-[#FCECEC] text-[#C93B3B]"
                          : item.priority === "medium"
                          ? "bg-[#FEF3C7] text-[#B45309]"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{item.deadline}</td>
                  <td className="py-3 px-4">
                    {item.mediaName ? (
                      <span className="text-[11px] font-mono text-neutral-800">
                        {item.mediaName}
                      </span>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => advanceStage(item.id, item.stage)}
                      className="px-2.5 py-1 rounded border border-neutral-700 text-[11px] font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      Advance &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE NEW CARD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#EAEAEA] pb-3">
              <h3 className="text-base font-semibold text-neutral-900">
                Tambah Kartu Konten Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Judul Konten / Topik Utama
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Mengapa Desain Monokrom Lebih Menjual..."
                  className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1">Tahap Awal</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as ContentStage)}
                    className="w-full px-2.5 py-1.5 border border-[#EAEAEA] rounded-lg bg-white text-neutral-900"
                  >
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">Pilar Konten</label>
                  <select
                    value={newPillar}
                    onChange={(e) => setNewPillar(e.target.value as ContentPillar)}
                    className="w-full px-2.5 py-1.5 border border-[#EAEAEA] rounded-lg bg-white text-neutral-900"
                  >
                    <option value="Tech Reviews">Tech Reviews</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="Personal Brand">Personal Brand</option>
                    <option value="Sponsorships">Sponsorships</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1">Prioritas</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-2.5 py-1.5 border border-[#EAEAEA] rounded-lg bg-white text-neutral-900"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">Target Tenggat</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#EAEAEA] rounded-lg bg-white text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Catatan / Draft Ide Kasar
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Catatan hook, referensi link, checklist awal..."
                  className="w-full px-3 py-2 text-xs border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800"
                >
                  Simpan ke Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
