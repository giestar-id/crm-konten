"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Contact2, Plus, Mail, DollarSign, X } from "lucide-react";

export function ContactsView() {
  const { contacts, addContact } = useApp();
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [dealStatus, setDealStatus] = useState<
    "Pitching" | "Negotiation" | "Signed" | "Sponsored" | "Paid"
  >("Negotiation");
  const [dealValue, setDealValue] = useState(2000);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;
    addContact({
      name: name.trim(),
      company: company.trim(),
      role: role.trim() || "Brand Specialist",
      email: email.trim(),
      dealStatus,
      dealValue: Number(dealValue) || 0,
    });
    setName("");
    setCompany("");
    setRole("");
    setEmail("");
    setIsOpenModal(false);
  };

  return (
    <div className="page-view space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Sponsor CRM
          </h1>
          <p className="text-xs text-[#737373] mt-0.5">
            Kelola kerja sama brand, sponsor, dan kolaborasi konten
          </p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Mitra</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {(() => {
        const totalPipeline = contacts.reduce((acc, c) => acc + (Number(c.dealValue) || 0), 0);
        const signedList = contacts.filter(
          (c) => c.dealStatus === "Signed" || c.dealStatus === "Paid" || c.dealStatus === "Sponsored"
        );
        const signedValue = signedList.reduce((acc, c) => acc + (Number(c.dealValue) || 0), 0);
        const negoList = contacts.filter(
          (c) => c.dealStatus === "Negotiation" || c.dealStatus === "Pitching"
        );
        const negoValue = negoList.reduce((acc, c) => acc + (Number(c.dealValue) || 0), 0);

        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
              <p className="text-xs text-[#737373] mb-1">Total Pipeline Nilai Deals</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-neutral-900">
                  ${totalPipeline.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
                  {contacts.length} Mitra
                </span>
              </div>
            </div>

            <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
              <p className="text-xs text-[#737373] mb-1">Deals Berstatus Signed / Paid</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-neutral-900">
                  ${signedValue.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#EAF5EE] text-[#2E7D47]">
                  {signedList.length} Kontrak
                </span>
              </div>
            </div>

            <div className="border border-[#EAEAEA] rounded-xl p-5 bg-white shadow-sm">
              <p className="text-xs text-[#737373] mb-1">Dalam Tahap Negosiasi</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-neutral-900">
                  ${negoValue.toLocaleString()}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#FEF3C7] text-[#B45309]">
                  {negoList.length} Prospek
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Contacts Table */}
      <div className="border border-[#EAEAEA] rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA] text-[#737373] font-medium">
                <th className="py-3 px-4">Nama Kontak</th>
                <th className="py-3 px-4">Perusahaan / Brand</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status Deal</th>
                <th className="py-3 px-4">Nilai Kontrak</th>
                <th className="py-3 px-4">Konten Terkait</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-neutral-400">
                    Belum ada mitra brand atau sponsor tersimpan. Klik &ldquo;Tambah Mitra&rdquo; untuk memulai.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-900">{contact.name}</p>
                      <p className="text-[11px] text-[#737373]">{contact.role}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-900">
                      {contact.company}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 font-mono text-[11px]">
                      {contact.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          contact.dealStatus === "Signed"
                            ? "bg-[#EAF5EE] text-[#2E7D47]"
                            : contact.dealStatus === "Sponsored"
                            ? "bg-neutral-100 text-neutral-800"
                            : "bg-[#FEF3C7] text-[#B45309]"
                        }`}
                      >
                        {contact.dealStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      ${contact.dealValue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 text-[11px] max-w-xs truncate">
                      {contact.linkedContentTitle || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-150">
          <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#EAEAEA] pb-3">
              <h3 className="text-base font-semibold text-neutral-900">
                Tambah Mitra Brand Sponsor
              </h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 mb-1">Nama Kontak</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Jessica Wong"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">Perusahaan / Brand</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Contoh: Figma, Notion, Rode Microphones"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Creator Partnerships"
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 mb-1">Nilai Deal ($)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@brand.com"
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">Status Deal</label>
                <select
                  value={dealStatus}
                  onChange={(e) => setDealStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg bg-white text-neutral-900"
                >
                  <option value="Pitching">Pitching</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Signed">Signed</option>
                  <option value="Sponsored">Sponsored</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#EAEAEA] text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0A0A0A] text-white font-medium hover:bg-neutral-800"
                >
                  Simpan Kontak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
