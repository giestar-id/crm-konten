# PRD — Social Post Hub

**Multi-Platform Posting, Scheduling & Content CRM untuk Produktivitas Pribadi**

Versi 1.0 · Status: Draft · Pemilik: Product Owner (pribadi) · Nama kerja: *Social Post Hub*

---

## 1. Ringkasan Eksekutif

Social Post Hub adalah aplikasi web pribadi (Next.js) yang memungkinkan pengguna membuat **Workspace** (batch), menghubungkan akun **YouTube, Instagram, TikTok, dan Facebook** ke dalam workspace tersebut, lalu **sekali upload & sekali klik** video terposting ke semua platform terhubung. Selain itu aplikasi menyediakan **manajemen konten ala CRM** (pipeline ide → publish), **penjadwalan**, **tracking performa**, dan **riset konsep/ide**.

**Value proposition:** satu tempat untuk merencanakan, memproduksi, menjadwalkan, memposting, dan melacak konten, tanpa buka empat aplikasi berbeda.

## 2. Latar Belakang & Masalah

| Masalah | Dampak |
| --- | --- |
| Posting video yang sama ke 4 platform dilakukan manual | Memakan waktu 15–30 menit per video |
| Judul, caption, hashtag, dan format beda tiap platform | Inkonsisten, mudah lupa |
| Ide, status produksi, dan jadwal tersebar di catatan/spreadsheet | Konten terlewat, tidak terorganisir |
| Performa konten dicek terpisah di tiap platform | Sulit membandingkan dan belajar dari data |

## 3. Tujuan, Non-Tujuan & Metrik Sukses

### 3.1 Tujuan

1. Posting satu video ke banyak platform dengan satu klik.
2. Mengelola seluruh siklus konten di satu dashboard (ide → draft → siap → terjadwal → terbit → dianalisis).
3. Menjadwalkan posting secara andal (terkirim sesuai waktu, ada retry jika gagal).
4. Melacak performa dasar per konten dan per platform.
5. Membantu riset ide dan konsep konten.

### 3.2 Non-Tujuan (di luar scope v1)

- Editor video (cukup upload file jadi).
- Menjadi SaaS publik multi-tenant berbayar (v1 untuk pemakaian pribadi, tetapi arsitektur disiapkan multi-user).
- Posting ke profil Facebook pribadi (tidak didukung API; hanya Facebook Page).
- Manajemen komentar/DM terpadu (kandidat v2).

### 3.3 Metrik Sukses

| Metrik | Target |
| --- | --- |
| Waktu dari upload sampai terposting ke 4 platform | < 3 menit klik-sampai-antrean, ditambah waktu proses platform |
| Success rate publish (setelah retry) | ≥ 95% |
| Posting terjadwal tepat waktu | ≥ 98% dalam toleransi ±1 menit |
| Waktu menyiapkan 1 konten (dari draft) | berkurang ≥ 60% dibanding manual |
| Konten terlacak statusnya di pipeline | 100% |

## 4. Persona & Use Case

**Persona utama: Solo Creator / Pemilik Personal Brand.** Membuat video pendek (Reels/Shorts/TikTok) dan sesekali video panjang. Mengelola beberapa brand/proyek dengan akun sosmed berbeda, sehingga butuh pemisahan lewat workspace.

**Use case utama:**

- UC1: Membuat workspace "Brand A" dan menghubungkan 4 akun.
- UC2: Upload 1 video, isi caption, pilih platform, klik **Publish Now**.
- UC3: Menjadwalkan video untuk besok pukul 19.00 WIB.
- UC4: Menyimpan ide konten di pipeline dan memindahkannya antar status.
- UC5: Melihat dashboard performa minggu ini per platform.
- UC6: Meriset ide: topik tren, ide judul, hook, dan caption dengan bantuan AI.

## 5. Ruang Lingkup & Fase Rilis

| Fase | Isi | Hasil |
| --- | --- | --- |
| **MVP (Fase 1)** | Auth, Workspace, koneksi akun (OAuth), media library, Publish Now multi-platform, status per platform, retry, log | Bisa posting 1 klik ke platform |
| **Fase 2** | Penjadwalan + kalender, pipeline konten (Kanban), template caption, per-platform override | Perencanaan konten lengkap |
| **Fase 3** | Analytics tracking, dashboard, laporan mingguan, notifikasi | Pelacakan performa |
| **Fase 4** | Riset ide AI, content ideas bank, trend notes, A/B caption, tim/kolaborator | Insight & kolaborasi |

## 6. Kebutuhan Fungsional

Prioritas: **P0** wajib MVP · **P1** penting · **P2** nice-to-have.

### 6.1 Autentikasi & Akun Pengguna

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| AUTH-1 | Registrasi & login email + password | P0 |
| AUTH-2 | Login dengan Google (OAuth) | P0 |
| AUTH-3 | Magic link / reset password via email | P1 |
| AUTH-4 | Sesi aman berbasis cookie (httpOnly), logout, proteksi route | P0 |
| AUTH-5 | Verifikasi email | P1 |
| AUTH-6 | 2FA (TOTP) | P2 |
| AUTH-7 | Halaman profil & pengaturan (zona waktu default WIB / Asia/Jakarta, bahasa) | P1 |

Implementasi: **Supabase Auth** dengan paket `@supabase/ssr` pada Next.js App Router.

### 6.2 Workspace (Batch)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| WS-1 | Buat workspace dengan nama (dan opsional deskripsi, warna, ikon); muncul sebagai satu baris di daftar workspace | P0 |
| WS-2 | Edit, arsipkan, hapus workspace (konfirmasi + soft delete) | P0 |
| WS-3 | Daftar workspace menampilkan nama, jumlah akun terhubung, jumlah konten, post terjadwal berikutnya | P0 |
| WS-4 | Setiap data (akun, konten, jadwal, analytics) terikat ke satu workspace | P0 |
| WS-5 | Duplikasi workspace (pengaturan & template saja) | P2 |
| WS-6 | Anggota workspace dengan peran (owner/editor/viewer) | P2 |

### 6.3 Koneksi Akun Sosial

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| ACC-1 | Hubungkan YouTube (channel), Instagram (Business/Creator), TikTok, Facebook (Page) via OAuth ke workspace | P0 |
| ACC-2 | Tampilkan akun terhubung: avatar, nama, platform, status token | P0 |
| ACC-3 | Token disimpan **terenkripsi**; refresh token otomatis | P0 |
| ACC-4 | Deteksi token kedaluwarsa/dicabut → status "Perlu hubungkan ulang" + notifikasi | P0 |
| ACC-5 | Putuskan koneksi akun | P0 |
| ACC-6 | Satu workspace dapat memiliki beberapa akun per platform (mis. 2 channel YouTube) | P1 |

### 6.4 Media Library & Upload

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| MED-1 | Upload video (drag & drop) dengan **resumable upload** dan progress bar | P0 |
| MED-2 | Validasi format, durasi, ukuran, rasio per platform sebelum publish (warning dini) | P0 |
| MED-3 | Thumbnail otomatis atau upload thumbnail kustom | P1 |
| MED-4 | Library media per workspace (cari, tag, pakai ulang) | P1 |
| MED-5 | Dukungan gambar/carousel | P2 |

### 6.5 Composer & Publish (Fitur Inti)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| PUB-1 | Composer: pilih video, judul, caption, hashtag, pilih platform/akun tujuan | P0 |
| PUB-2 | Tombol **Publish Now**: satu klik membuat job per platform dan memprosesnya paralel | P0 |
| PUB-3 | **Override per platform** (judul YouTube, caption IG, caption TikTok berbeda) | P1 |
| PUB-4 | Status real-time per platform: `queued → uploading → processing → published / failed` | P0 |
| PUB-5 | Hasil publish menyimpan URL/ID post di tiap platform | P0 |
| PUB-6 | Retry otomatis (exponential backoff) dan tombol retry manual per platform | P0 |
| PUB-7 | Kegagalan satu platform tidak membatalkan platform lain (partial success) | P0 |
| PUB-8 | Pengaturan spesifik platform: privasi YouTube (public/unlisted/private), kategori, Shorts; opsi TikTok (privacy, comment/duet/stitch); IG Reels (cover, share to feed); FB (Reels/video) | P1 |
| PUB-9 | Preview tampilan caption per platform (batas karakter, hashtag) | P2 |
| PUB-10 | Idempotency: klik ganda tidak membuat post ganda | P0 |

### 6.6 Penjadwalan & Kalender

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| SCH-1 | Jadwalkan posting pada tanggal & jam tertentu (zona waktu pengguna) | P0 |
| SCH-2 | Kalender (bulan/minggu) menampilkan konten terjadwal & terbit; drag-and-drop untuk ubah jadwal | P1 |
| SCH-3 | Batalkan/edit jadwal sebelum dieksekusi | P0 |
| SCH-4 | Saran waktu posting terbaik berdasarkan data analytics | P2 |
| SCH-5 | Antrean/slot rutin (mis. Senin–Jumat 19.00) agar konten otomatis mengisi slot kosong | P2 |
| SCH-6 | Notifikasi bila posting terjadwal gagal | P1 |

### 6.7 Manajemen Konten (CRM-style)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| CRM-1 | **Pipeline Kanban**: `Ide → Naskah → Produksi → Editing → Siap Posting → Terjadwal → Terbit → Dianalisis` (status dapat dikustomisasi) | P1 |
| CRM-2 | Kartu konten: judul, deskripsi/naskah, checklist, lampiran, tenggat, prioritas, pilar konten, tag, catatan | P1 |
| CRM-3 | Tampilan alternatif: tabel/list dengan filter, sort, pencarian | P1 |
| CRM-4 | **Content pillar & kampanye**: kelompokkan konten per tema/kampanye | P1 |
| CRM-5 | Template caption & hashtag set yang dapat dipakai ulang | P1 |
| CRM-6 | Riwayat aktivitas per konten (audit trail) | P2 |
| CRM-7 | **Kontak/kolaborator/sponsor** sederhana: nama, kanal, catatan, deal terkait konten (CRM relasi) | P2 |
| CRM-8 | Repurpose: tandai konten turunan dari konten induk | P2 |

### 6.8 Tracking & Analytics

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| ANA-1 | Tarik metrik dasar per post: views, likes, komentar, share (sesuai ketersediaan API) | P1 |
| ANA-2 | Snapshot berkala (mis. 1 jam, 24 jam, 7 hari setelah publish, lalu harian) agar tren dapat dilihat | P1 |
| ANA-3 | Dashboard: total views, engagement, top konten, perbandingan antar platform, filter rentang waktu | P1 |
| ANA-4 | Pertumbuhan followers/subscribers per akun | P2 |
| ANA-5 | Laporan mingguan via email / ringkasan di dashboard | P2 |
| ANA-6 | Export CSV | P2 |

### 6.9 Riset & Ide Konten

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| RES-1 | **Ideas Bank**: simpan ide cepat (teks, link referensi) dan ubah jadi kartu pipeline | P1 |
| RES-2 | Generator ide, judul, hook, caption, dan hashtag berbasis AI menurut niche workspace | P2 |
| RES-3 | Riset kompetitor sederhana: simpan akun/video referensi + catatan | P2 |
| RES-4 | Catatan tren (manual atau semi-otomatis) | P2 |
| RES-5 | Rekomendasi berdasarkan performa konten sebelumnya | P2 |

### 6.10 Notifikasi & Log

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| NOT-1 | Notifikasi in-app: publish sukses/gagal, token kedaluwarsa | P0 |
| NOT-2 | Notifikasi email (opsional) | P1 |
| NOT-3 | Activity log & error log per job publish (pesan error platform terbaca) | P0 |

## 7. Alur Pengguna Utama

**Alur A — Onboarding & Workspace**

1. Daftar/login → dashboard kosong dengan CTA "Buat Workspace".
2. Isi nama workspace → baris baru muncul di daftar.
3. Masuk workspace → tab **Akun** → hubungkan YouTube/IG/TikTok/FB (OAuth).

**Alur B — Publish 1 Klik**

1. Di workspace → **Buat Post** → upload video (resumable) → isi judul & caption.
2. Centang platform tujuan → opsional override per platform.
3. Klik **Publish Now** (atau **Schedule**).
4. Sistem membuat `post` + satu `post_target` per platform → job masuk antrean.
5. Halaman status menampilkan progres real-time per platform; hasil berisi link tiap post.

**Alur C — Pipeline ke Publish**

Ide (Ideas Bank) → kartu Kanban → naskah/produksi → attach video → **Siap Posting** → jadwalkan → otomatis terbit → status **Terbit** → data analytics masuk → **Dianalisis**.

## 8. Batasan Platform API (Kritis, Verifikasi Sebelum Build)

Bagian ini yang paling menentukan kelayakan proyek. Aturan API berubah; **wajib dicek ulang di dokumentasi resmi** sebelum implementasi.

| Platform | API | Syarat & batasan utama |
| --- | --- | --- |
| **YouTube** | YouTube Data API v3 (`videos.insert`, scope `youtube.upload`) | Kuota default 10.000 unit/hari; satu upload memakan sekitar 1.600 unit (± 6 upload/hari) kecuali minta kenaikan kuota. Project API yang belum lolos audit membuat video terkunci **private**; perlu **API compliance audit** agar upload bisa publik. |
| **Instagram** | Instagram Graph API / Instagram API (login Business) – publish Reels via container lalu `media_publish` | Hanya akun **Business/Creator**. Butuh izin `instagram_content_publish`; di luar mode development perlu **App Review**. Video harus dapat diakses lewat URL publik atau resumable upload. Ada batas jumlah post via API per 24 jam. |
| **TikTok** | TikTok Content Posting API (Direct Post / Upload ke inbox) | Perlu developer app + persetujuan produk. Klien yang belum **diaudit** hanya bisa posting dengan visibilitas **private**. Opsi "upload ke draft/inbox" lebih mudah, tetapi pengguna menyelesaikan posting di app TikTok. |
| **Facebook** | Graph API Pages (video/Reels ke **Page**) | Hanya **Page**, bukan profil pribadi. Butuh izin seperti `pages_manage_posts`, token Page, dan **App Review** untuk akses lanjutan. |

**Implikasi desain:**

- Arsitektur memakai **adapter per platform** (interface seragam) agar mudah mengganti implementasi.
- **Mode Development** dapat dipakai lebih dulu untuk akun milik sendiri (peran tester/admin di app), sehingga MVP pribadi bisa jalan sambil menunggu audit/review.
- **Rencana cadangan:** pakai layanan agregator pihak ketiga (mis. Ayrshare, atau proyek open source seperti Postiz) untuk platform yang audit-nya belum lolos. Adapter dibuat swappable.
- Siapkan **Privacy Policy, Terms of Service, dan domain terverifikasi** sejak awal karena diminta saat app review.
- Polling status processing: TikTok, IG, dan YouTube memproses video secara asinkron; job harus menunggu hingga status final.

## 9. Arsitektur & Tech Stack

| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| Framework | **Next.js (App Router)** + TypeScript | Full-stack, Server Actions, Route Handlers |
| UI | Tailwind CSS + shadcn/ui | Cepat dan konsisten |
| Form & validasi | React Hook Form + Zod | Validasi di client dan server |
| State/data fetching | TanStack Query (client), Server Components (server) | Cache & optimistic update |
| Auth | **Supabase Auth** (`@supabase/ssr`) | Terintegrasi dengan database & RLS |
| Database | **Supabase Postgres** | Sesuai permintaan |
| ORM | **Drizzle ORM** + `drizzle-kit` (migrasi) | Ringan, type-safe, cocok Next.js |
| File storage | **Supabase Storage** (resumable/TUS) | Satu ekosistem. *Catatan:* paket gratis membatasi ukuran file; video besar butuh paket berbayar atau alternatif (Cloudflare R2) |
| Background jobs | **Inngest** atau **Trigger.dev** | Upload video ke platform berjalan lama dan tidak cocok untuk serverless biasa; butuh retry, delay, cron |
| Realtime status | Supabase Realtime | Progres publish langsung di UI |
| Deploy | Vercel (web) + Supabase (backend) | Sederhana |
| Observability | Sentry + log tabel `job_logs` | Debugging kegagalan publish |

**Alur teknis publish:**

1. Client upload video ke Storage (resumable) → dapat `media_id`.
2. Server Action membuat `post` dan `post_targets` (status `queued`) dengan idempotency key → mengirim event ke job runner.
3. Job runner menjalankan satu job per target secara paralel: ambil token (dekripsi) → refresh bila perlu → panggil adapter platform → polling status → simpan `external_post_id` dan URL.
4. Hasil ditulis ke DB → Realtime memperbarui UI → notifikasi dikirim.
5. Penjadwalan: `scheduled_at` disimpan; job runner memakai delayed event/cron untuk eksekusi tepat waktu.
6. Analytics: job cron mengambil metrik dan menyimpan snapshot.

## 10. Model Data (Supabase Postgres + Drizzle)

### 10.1 Entitas

| Tabel | Fungsi |
| --- | --- |
| `profiles` | Data pengguna (id = `auth.users.id`), zona waktu, preferensi |
| `workspaces` | Workspace/batch milik pengguna |
| `workspace_members` | Anggota & peran (disiapkan untuk v2) |
| `social_accounts` | Akun platform terhubung per workspace; token terenkripsi |
| `media_assets` | File video/gambar di Storage + metadata |
| `content_items` | Kartu konten CRM (status pipeline, naskah, tenggat) |
| `content_pillars`, `campaigns` | Pengelompokan konten |
| `posts` | Satu aksi posting (judul, caption dasar, jadwal, status agregat) |
| `post_targets` | Satu baris per platform/akun tujuan (override, status, external id/URL, error) |
| `post_metrics` | Snapshot analytics per target |
| `caption_templates` | Template caption/hashtag |
| `ideas` | Ideas Bank & referensi riset |
| `contacts` | Kolaborator/sponsor (CRM relasi) |
| `notifications` | Notifikasi in-app |
| `job_logs` | Log eksekusi & error |

### 10.2 Contoh Skema Drizzle (inti)

```ts
// db/schema.ts
import { pgTable, uuid, text, timestamp, jsonb, integer, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const platformEnum = pgEnum("platform", ["youtube", "instagram", "tiktok", "facebook"]);
export const targetStatusEnum = pgEnum("target_status", [
  "queued", "uploading", "processing", "published", "failed", "cancelled",
]);
export const postStatusEnum = pgEnum("post_status", [
  "draft", "scheduled", "publishing", "published", "partial", "failed",
]);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull(), // = auth.users.id
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  externalAccountId: text("external_account_id").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  accessTokenEnc: text("access_token_enc").notNull(),   // AES-256-GCM
  refreshTokenEnc: text("refresh_token_enc"),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  scopes: text("scopes").array(),
  status: text("status").default("active").notNull(),     // active | reauth_required
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex("uniq_ws_platform_ext").on(t.workspaceId, t.platform, t.externalAccountId)]);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  contentItemId: uuid("content_item_id"),
  mediaId: uuid("media_id").notNull(),
  title: text("title"),
  caption: text("caption"),
  status: postStatusEnum("status").default("draft").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const postTargets = pgTable("post_targets", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  socialAccountId: uuid("social_account_id").notNull().references(() => socialAccounts.id),
  overrides: jsonb("overrides"),            // judul/caption/opsi per platform
  status: targetStatusEnum("status").default("queued").notNull(),
  externalPostId: text("external_post_id"),
  externalUrl: text("external_url"),
  attempts: integer("attempts").default(0).notNull(),
  lastError: text("last_error"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});
```

### 10.3 Catatan Drizzle + Supabase

- Koneksi memakai `postgres-js` ke **Supabase connection pooler** (mode transaction, set `prepare: false`).
- Migrasi dengan `drizzle-kit generate` dan `drizzle-kit migrate`; skema disimpan di repo.
- **Row Level Security (RLS) aktif di semua tabel** dengan kebijakan berbasis `auth.uid()` (owner/anggota workspace) sebagai lapisan pertahanan kedua. Koneksi Drizzle langsung memakai role `postgres` yang melewati RLS, sehingga **otorisasi wajib juga dilakukan di server** (cek kepemilikan workspace di setiap query/Server Action), atau gunakan fitur RLS Drizzle dengan role terbatas.
- Foreign key `owner_id` merujuk ke `auth.users` melalui `profiles`; trigger membuat `profiles` saat user baru mendaftar.

## 11. Keamanan & Privasi

| Area | Kebutuhan |
| --- | --- |
| Token OAuth | Dienkripsi at-rest (AES-256-GCM, kunci di environment/secret manager, atau Supabase Vault); tidak pernah dikirim ke client |
| Otorisasi | Setiap query difilter berdasarkan workspace milik user + RLS |
| OAuth | Parameter `state` + PKCE; validasi redirect URI |
| Secrets | Hanya di server env; `service_role` key tidak pernah di client |
| Upload | Signed URL, validasi MIME & ukuran, bucket privat |
| Rate limiting | Pada endpoint auth, publish, dan upload |
| Audit | Log aksi sensitif (connect/disconnect akun, hapus workspace) |
| Kepatuhan | Privacy Policy, Terms of Service, mekanisme hapus data & revoke token (syarat app review platform) |
| Header | CSP, HSTS, proteksi CSRF pada Server Actions |

## 12. Struktur Halaman (Route)

| Route | Fungsi |
| --- | --- |
| `/login`, `/register`, `/forgot-password` | Autentikasi |
| `/dashboard` | Daftar workspace (satu baris per workspace) + ringkasan |
| `/w/[id]` | Overview workspace |
| `/w/[id]/accounts` | Hubungkan/kelola akun sosial |
| `/w/[id]/compose` | Composer & Publish Now / Schedule |
| `/w/[id]/posts` | Daftar post + status per platform + retry |
| `/w/[id]/calendar` | Kalender penjadwalan |
| `/w/[id]/pipeline` | Kanban & tabel konten (CRM) |
| `/w/[id]/media` | Media library |
| `/w/[id]/analytics` | Dashboard performa |
| `/w/[id]/research` | Ideas Bank, referensi, generator AI |
| `/w/[id]/settings` | Template, pilar, kampanye, anggota |
| `/settings` | Profil & preferensi akun |
| `/api/oauth/[platform]/callback` | Callback OAuth |
| `/api/webhooks/*` | Webhook platform & job runner |

## 13. Kebutuhan Non-Fungsional

| Kategori | Target |
| --- | --- |
| Performa | Halaman utama < 2 dtk (LCP); aksi Publish Now merespons < 1 dtk (job diproses async) |
| Keandalan | Retry otomatis hingga 3–5 kali dengan backoff; job idempotent; tidak ada post ganda |
| Skalabilitas | Dirancang multi-user; indeks pada `workspace_id`, `scheduled_at`, `status` |
| Ketersediaan | Mengikuti SLA Vercel/Supabase; penjadwalan toleran terhadap downtime singkat (catch-up) |
| Aksesibilitas | Responsif (desktop & mobile), kontras warna memadai, keyboard friendly |
| Lokalisasi | UI Bahasa Indonesia (default) dan Inggris; zona waktu per pengguna |
| Testing | Unit test (adapter, util), integration test (Server Actions), E2E (Playwright) untuk alur publish dengan mock platform |
| Observability | Error tracking, log job, dashboard kegagalan |

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Audit/App Review platform lama atau ditolak (TikTok, YouTube, Meta) | Tidak bisa posting publik | Mulai dari mode development untuk akun sendiri; siapkan dokumen review; fallback agregator pihak ketiga |
| Kuota YouTube terbatas | Batas jumlah upload per hari | Ajukan kenaikan kuota; tampilkan sisa kuota; antrekan upload |
| Perubahan/pembatasan API platform | Fitur rusak | Pola adapter; monitoring error; pembaruan berkala |
| Ukuran video besar | Upload lambat/gagal, biaya storage | Resumable upload; batas ukuran; kompres opsional; R2 sebagai alternatif |
| Kebocoran token | Akun sosial diambil alih | Enkripsi, RLS, rotasi kunci, revoke on disconnect |
| Serverless timeout | Job terhenti | Job runner khusus (Inngest/Trigger.dev) |
| Scope membengkak | Proyek tidak selesai | Rilis bertahap; MVP fokus pada Publish Now |
| Risiko pelanggaran ToS platform | Akun dibatasi | Gunakan API resmi saja; hindari automasi scraping/bot |

## 15. Roadmap Indikatif

| Minggu | Deliverable |
| --- | --- |
| 1 | Setup proyek (Next.js, Supabase, Drizzle), auth, skema dasar, CRUD workspace |
| 2 | Daftarkan developer app 4 platform; OAuth connect untuk YouTube & Facebook |
| 3 | OAuth Instagram & TikTok; enkripsi token; media upload resumable |
| 4 | Adapter publish + job runner + status real-time + retry (**MVP Publish Now**) |
| 5 | Penjadwalan + kalender + notifikasi |
| 6 | Pipeline Kanban, template, pilar & kampanye |
| 7 | Analytics snapshot + dashboard |
| 8 | Ideas Bank + riset AI, polishing, testing, hardening keamanan |

*Catatan: proses audit/review platform berjalan paralel dan sering menjadi jalur kritis.*

## 16. Kriteria Penerimaan MVP

- Pengguna dapat mendaftar, login, dan logout dengan aman.
- Pengguna dapat membuat workspace dan melihatnya sebagai satu baris di daftar.
- Pengguna dapat menghubungkan minimal akun YouTube, Instagram, TikTok, dan Facebook Page ke workspace.
- Satu video dapat diupload sekali dan dipublikasikan ke semua platform terhubung dengan satu klik.
- Status per platform tampil real-time; kegagalan satu platform tidak memblokir lainnya dan dapat di-retry.
- Token tersimpan terenkripsi, dan data antar pengguna terisolasi (RLS + otorisasi server).

## 17. Pertanyaan Terbuka

1. Apakah akan dipakai sendiri saja atau nanti dibuka untuk orang lain (menentukan urgensi audit, billing, dan multi-user)?
2. Format utama: video pendek vertikal saja, atau juga video panjang YouTube?
3. Berapa perkiraan jumlah video per hari/minggu (menentukan kuota YouTube dan kebutuhan storage)?
4. Akun IG sudah Business/Creator dan FB sudah berbentuk Page?
5. Perlu fitur AI (riset/caption) sejak MVP, dan penyedia model mana yang dipakai?
6. Apakah mau memakai agregator pihak ketiga sebagai jalan pintas untuk MVP?

---

*Dokumen ini hidup dan akan diperbarui seiring keputusan produk dan hasil verifikasi API platform.*
