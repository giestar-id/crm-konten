"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Layers, Plus } from "lucide-react";

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceModal({ isOpen, onClose }: WorkspaceModalProps) {
  const { addWorkspace } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addWorkspace(name.trim(), description.trim());
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-150">
      <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-[#EAEAEA] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#171717] flex items-center justify-center text-white">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">
              Create New Workspace
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Workspace / Brand Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Brand A, Tech Channel, Agency Client X"
              className="w-full px-3 py-2 text-xs bg-white border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 placeholder-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tujuan workspace, niche konten, atau catatan brand..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900 placeholder-neutral-400 resize-none"
            />
          </div>

          <p className="text-[11px] text-[#737373] leading-relaxed">
            Setiap workspace memiliki data terisolasi (koneksi akun sosial, pipeline konten,
            aset media, dan metrik analitik).
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Workspace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
