import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Social Post Hub",
  description: "Privacy Policy for Social Post Hub CRM",
};

export default function PrivacyPage() {
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
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Terakhir diperbarui: 25 Oktober 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">1. Data yang Kami Kumpulkan</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Social Post Hub menghargai privasi Anda. Kami hanya mengumpulkan informasi yang diperlukan untuk mengoperasikan fitur-fitur CRM dan publikasi konten otomatis:
          </p>
          <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
            <li><strong>Informasi Profil Akun Sosial:</strong> Nama channel/profil, handle, ID akun publik, dan foto profil yang diperoleh melalui OAuth resmi.</li>
            <li><strong>Token Akses OAuth:</strong> Token otorisasi terenkripsi untuk mengunggah video atas nama akun yang Anda setujui.</li>
            <li><strong>Konten & Media:</strong> Judul konten, naskah, tagar, dan file video yang Anda unggah ke sistem.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">2. Cara Kami Menggunakan Data</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Data Anda hanya digunakan secara eksklusif untuk:
          </p>
          <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
            <li>Menghubungkan akun media sosial Anda via OAuth 2.0 resmi.</li>
            <li>Mengunggah video dan metadata postingan ke platform yang Anda pilih (YouTube, Instagram, TikTok, Facebook).</li>
            <li>Menyajikan metrik performa konten di dasbor analitik Anda.</li>
          </ul>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Kami <strong>tidak pernah</strong> menjual data pengguna ke pihak ketiga atau memanfaatkan token akses Anda di luar tindakan yang Anda instruksikan.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">3. Keamanan & Penyimpanan Data</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Seluruh data tersimpan aman pada infrastruktur database PostgreSQL berstandar enterprise dengan Row Level Security (RLS) aktif. Token akses disimpan dengan pengamanan ketat dan diperbarui secara otomatis sesuai standar OAuth 2.0.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">4. Penghapusan Data (Data Deletion)</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Anda dapat mencabut izin akses kapan saja melalui pengaturan akun di Google, Meta, atau TikTok. Anda juga dapat meminta penghapusan seluruh data workspace Anda dengan menghubungi pengembang di <span className="font-mono text-neutral-900">giestarid@gmail.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
