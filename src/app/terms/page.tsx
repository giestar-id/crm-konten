import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Social Post Hub",
  description: "Terms of Service for Social Post Hub CRM",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans p-6 sm:p-12 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dasbor</span>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="border-b border-[#EAEAEA] pb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-800 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Official Policy</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Terakhir diperbarui: 25 Oktober 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">1. Penerimaan Ketentuan</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Dengan mengakses dan menggunakan Social Post Hub (crm-konten), Anda menyetujui untuk terikat oleh Ketentuan Layanan ini serta kebijakan privasi kami. Layanan ini dirancang untuk membantu kreator mengelola alur kerja, menjadwalkan, dan menerbitkan konten media sosial ke platform pihak ketiga.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">2. Integrasi Layanan Pihak Ketiga</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Social Post Hub berintegrasi dengan API resmi pihak ketiga termasuk YouTube API Services (Google), Meta Graph API (Instagram & Facebook), dan TikTok Content Posting API. Penggunaan fitur-fitur ini tunduk pada syarat dan ketentuan masing-masing platform:
          </p>
          <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
            <li>Google & YouTube Terms of Service</li>
            <li>Meta Platform Terms & Community Standards</li>
            <li>TikTok Developer Terms of Service</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">3. Tanggung Jawab Konten</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Pengguna bertanggung jawab penuh atas segala materi, video, teks naskah, dan media yang diunggah, disimpan, atau dipublikasikan melalui platform ini. Pengguna menjamin bahwa konten tidak melanggar hak cipta, merek dagang, atau hukum yang berlaku.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">4. Kuota API & Batasan Layanan</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Penerbitan konten tunduk pada kuota harian dan batas kecepatan (rate limits) yang ditetapkan oleh masing-masing penyedia platform sosial. Social Post Hub tidak bertanggung jawab atas keterlambatan akibat kuota API platform yang habis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">5. Kontak</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Jika Anda memiliki pertanyaan mengenai Ketentuan Layanan ini, silakan hubungi tim kami melalui email resmi pengembang di <span className="font-mono text-neutral-900">giestarid@gmail.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
