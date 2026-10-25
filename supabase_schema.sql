-- ====================================================================
-- SOCIAL POST HUB — FULL PRODUCTION DATABASE SCHEMA (PRD BAGIAN 10)
-- 12 TABEL LENGKAP: WORKSPACES, SOCIAL ACCOUNTS, MEDIA, PIPELINE CRM,
-- IDEAS BANK, SPONSORS, POSTS, TARGETS, METRICS, TEMPLATES, AUDIT LOGS
-- ====================================================================

-- 0. BERSIHKAN TABEL LAMA (AGAR STRUKTUR BARU BISA DITERAPKAN DENGAN BERSIH)
DROP TABLE IF EXISTS public.job_logs CASCADE;
DROP TABLE IF EXISTS public.caption_templates CASCADE;
DROP TABLE IF EXISTS public.content_pillars CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.post_targets CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.ideas CASCADE;
DROP TABLE IF EXISTS public.content_items CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.social_accounts CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;

-- 1. TABEL WORKSPACES (PRD WS-1 s/d WS-6)
CREATE TABLE public.workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#0A0A0A',
  initials TEXT DEFAULT 'WS',
  role TEXT DEFAULT 'Owner',
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL SOCIAL ACCOUNTS (PRD ACC-1 s/d ACC-6)
CREATE TABLE public.social_accounts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'youtube', 'instagram', 'tiktok', 'facebook'
  external_account_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  handle TEXT,
  avatar_url TEXT,
  account_type TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] DEFAULT '{}',
  api_quota_used INTEGER DEFAULT 0,
  api_quota_max INTEGER DEFAULT 10000,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'reauth_required'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, platform, external_account_id)
);

-- 3. TABEL MEDIA ASSETS (PRD MED-1 s/d MED-5)
CREATE TABLE public.media_assets (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration TEXT,
  aspect_ratio TEXT DEFAULT '9:16', -- '9:16' atau '16:9'
  size TEXT,
  resolution TEXT DEFAULT '1080 x 1920 (FHD)',
  thumbnail_url TEXT,
  storage_path TEXT,
  tags TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL CONTENT ITEMS / PIPELINE CRM (PRD CRM-1 s/d CRM-8)
CREATE TABLE public.content_items (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'ide', -- 'ide','naskah','produksi','editing','siap_posting','terjadwal','terbit','dianalisis'
  pillar TEXT NOT NULL DEFAULT 'Tech Reviews',
  priority TEXT NOT NULL DEFAULT 'medium', -- 'high','medium','low'
  deadline DATE,
  script TEXT,
  notes TEXT,
  checklist JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  media_asset_id TEXT,
  media_name TEXT,
  target_platforms TEXT[] DEFAULT '{youtube,instagram,tiktok,facebook}',
  scheduled_at TIMESTAMPTZ,
  published_url TEXT,
  views_count BIGINT DEFAULT 0,
  likes_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL IDEAS BANK (PRD RES-1 s/d RES-5)
CREATE TABLE public.ideas (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  niche TEXT NOT NULL DEFAULT 'Tech & AI',
  notes TEXT,
  reference_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL CONTACTS & SPONSOR CRM (PRD CRM-7)
CREATE TABLE public.contacts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  email TEXT,
  deal_status TEXT NOT NULL DEFAULT 'Negotiation', -- 'Pitching','Negotiation','Signed','Sponsored','Paid'
  deal_value NUMERIC DEFAULT 0,
  linked_content_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL POSTS (PUBLISH JOBS - PRD PUB-1 s/d PUB-10)
CREATE TABLE public.posts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  content_item_id TEXT,
  media_id TEXT,
  title TEXT NOT NULL,
  base_caption TEXT,
  tags TEXT[] DEFAULT '{}',
  media_name TEXT,
  media_size TEXT,
  aspect_ratio TEXT DEFAULT '9:16',
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft','scheduled','publishing','published','partial','failed'
  scheduled_at TIMESTAMPTZ,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL POST TARGETS (STATUS PER PLATFORM - PRD PUB-4, PUB-5, PUB-6)
CREATE TABLE public.post_targets (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'youtube','instagram','tiktok','facebook'
  account_id TEXT,
  account_name TEXT,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued','uploading','processing','published','failed','cancelled'
  progress INTEGER DEFAULT 0,
  external_post_id TEXT,
  external_url TEXT,
  last_error TEXT,
  overrides JSONB DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL NOTIFICATIONS (PRD NOT-1 s/d NOT-3)
CREATE TABLE public.notifications (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system', -- 'publish_success','publish_failed','mention','system','token_alert'
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL CAPTION TEMPLATES (PRD CRM-5)
CREATE TABLE public.caption_templates (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL CONTENT PILLARS (PRD CRM-4)
CREATE TABLE public.content_pillars (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#0A0A0A',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABEL JOB EXECUTION AUDIT LOGS (PRD NOT-3)
CREATE TABLE public.job_logs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  job_id TEXT,
  platform TEXT,
  status TEXT,
  log_message TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- SEED DATA AWAL (AGAR APLIKASI LANGSUNG BERISI DATA NYATA DI SUPABASE)
-- ====================================================================

-- Seed Workspace Utama
INSERT INTO public.workspaces (id, name, description, color, initials, role)
VALUES 
  ('ws-1', 'Tech Pulse Studio', 'Main personal brand for AI, SaaS & Tech Reviews', '#0A0A0A', 'TP', 'Owner'),
  ('ws-2', 'Aji Creative Hub', 'Client projects, design systems & developer tutorials', '#DF5835', 'AC', 'Owner'),
  ('ws-3', 'Developer Bites', 'Short coding tips, JavaScript & Next.js micro-lessons', '#4A4A4A', 'DB', 'Editor')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed Akun Sosial Default
INSERT INTO public.social_accounts (id, workspace_id, platform, external_account_id, display_name, handle, avatar_url, account_type, access_token, api_quota_used, api_quota_max, status)
VALUES
  ('acc-yt-1', 'ws-1', 'youtube', 'yt-techpulse-main', 'Tech Pulse Studio', '@TechPulseOfficial', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60', 'YouTube Channel (Verified)', 'mock-yt-token', 1600, 10000, 'active'),
  ('acc-ig-1', 'ws-1', 'instagram', 'ig-techpulse-main', 'Tech Pulse Indonesia', '@techpulse.id', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', 'Instagram Business Creator', 'mock-ig-token', 0, 0, 'active'),
  ('acc-tt-1', 'ws-1', 'tiktok', 'tt-techpulse-main', 'Tech Pulse Official', '@techpulse_official', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', 'TikTok Direct Post API', 'mock-tt-token', 0, 0, 'active'),
  ('acc-fb-1', 'ws-1', 'facebook', 'fb-techpulse-main', 'Tech Pulse Official Page', 'Tech Pulse Page', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60', 'Facebook Page (Verified)', 'mock-fb-token', 0, 0, 'active')
ON CONFLICT (workspace_id, platform, external_account_id) DO NOTHING;

-- Seed Media Assets
INSERT INTO public.media_assets (id, workspace_id, name, duration, aspect_ratio, size, resolution, thumbnail_url, tags)
VALUES
  ('m-1', 'ws-1', 'ai_tools_2026.mp4', '0:54', '9:16', '48.2 MB', '1080 x 1920 (FHD)', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60', '{Vertical,Shorts,Reels,4K-Source}'),
  ('m-2', 'ws-1', 'logitech_mx_review.mp4', '1:12', '9:16', '64.5 MB', '1080 x 1920 (FHD)', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=60', '{Sponsorship,Hardware,B-Roll}'),
  ('m-3', 'ws-1', 'monochrome_ui_guide.mp4', '14:20', '16:9', '420.0 MB', '3840 x 2160 (4K UHD)', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=60', '{Longform,YouTube Masterclass}')
ON CONFLICT (id) DO NOTHING;

-- Seed Content Items (Pipeline 8 Tahap)
INSERT INTO public.content_items (id, workspace_id, title, stage, pillar, priority, deadline, notes, checklist, tags, target_platforms, views_count, likes_count)
VALUES
  ('c-1', 'ws-1', 'DeepSeek vs Claude 3.7: Perbandingan Coding Benchmark Nyata', 'ide', 'Tech Reviews', 'high', '2026-11-02', 'Fokus pada efisiensi token, kecepatan penulisan regex, dan akurasi Next.js App Router.', '[{"id":"ck-1","text":"Kumpulkan 3 kasus uji","done":true},{"id":"ck-2","text":"Screen recording stopwatch","done":false}]'::jsonb, '{#AI,#Coding,#NextJS}', '{youtube,instagram,tiktok,facebook}', 0, 0),
  ('c-2', 'ws-1', 'Framework Desain UI Monokrom: Mengapa Brand Mewah Memakainya?', 'naskah', 'Personal Brand', 'medium', '2026-10-29', 'Hook: Perhatikan Apple, Linear, dan Vercel.', '[{"id":"ck-3","text":"Riset Apple vs kompetitor","done":true},{"id":"ck-4","text":"Finalisasi naskah 60s","done":true}]'::jsonb, '{#DesignSystem,#Minimalism}', '{youtube,instagram,tiktok}', 0, 0),
  ('c-3', 'ws-1', '5 Setup Desk Minimalis Solo Creator 2026', 'produksi', 'Personal Brand', 'high', '2026-10-28', 'Shooting setup pencahayaan malam.', '[{"id":"ck-5","text":"Take b-roll video","done":true},{"id":"ck-6","text":"Voiceover Shure SM7B","done":true}]'::jsonb, '{#DeskSetup,#Workspace}', '{youtube,instagram,tiktok,facebook}', 0, 0),
  ('c-4', 'ws-1', 'Next.js 16 Server Actions & Parallel Queue Masterclass', 'editing', 'Tutorials', 'high', '2026-10-26', 'Editing potongan tutorial Turbopack.', '[{"id":"ck-7","text":"Cut filler words","done":true},{"id":"ck-8","text":"Pop-up syntax highlight","done":true}]'::jsonb, '{#NextJS,#WebDev}', '{youtube,facebook}', 0, 0),
  ('c-5', 'ws-1', '5 AI Tools That Save 20 Hours/Week (Solo Creator Edition)', 'siap_posting', 'Tech Reviews', 'high', '2026-10-25', 'Video vertikal final 9:16 terlampir. Siap 1-click publish.', '[{"id":"ck-9","text":"Render MP4 1080x1920","done":true},{"id":"ck-10","text":"Verifikasi copyright audio","done":true}]'::jsonb, '{#AITools,#Productivity}', '{youtube,instagram,tiktok,facebook}', 0, 0),
  ('c-6', 'ws-1', 'Review Keyboard Low-Profile Logitech MX Mechanical Mini', 'terjadwal', 'Sponsorships', 'high', '2026-10-25', 'Sponsorship brand Logitech.', '[{"id":"ck-11","text":"Approval brand manager","done":true}]'::jsonb, '{#Logitech,#MechanicalKeyboard}', '{youtube,instagram,tiktok,facebook}', 0, 0),
  ('c-7', 'ws-1', 'Tips Menghubungkan 4 Platform Sekaligus dengan 1-Click Publishing', 'terbit', 'Tutorials', 'medium', '2026-10-24', 'Telah terbit via multi-platform publisher.', '[]'::jsonb, '{#Automation,#ContentCRM}', '{youtube,instagram,tiktok,facebook}', 124500, 8920),
  ('c-8', 'ws-1', 'Cara Mengotomasi Workflow Konten CRM Tanpa Buka 4 Tab', 'dianalisis', 'Tech Reviews', 'high', '2026-10-22', 'Analisis performa retention 24 jam.', '[]'::jsonb, '{#ContentCRM,#Productivity}', '{youtube,instagram,tiktok,facebook}', 248600, 19400)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, stage = EXCLUDED.stage;

-- Seed Ideas Bank
INSERT INTO public.ideas (id, workspace_id, title, niche, notes, reference_url, tags)
VALUES
  ('idea-1', 'ws-1', 'A/B Testing Thumbnail Monokrom vs Vibrant Colors di YouTube Shorts', 'Creative Strategy', 'Uji coba 2 akun identik: satu dengan gaya monokrom editorial, satu dengan font kuning bold.', 'https://linear.app/method/design', '{#Experiments,#Thumbnail,#CTR}'),
  ('idea-2', 'ws-1', 'Cara Menolak Tawaran Sponsor Murah & Menaikkan Rate Card 3x Lipat', 'Creator Business', 'Template email negosiasi, value-based pricing, dan bundling multi-platform.', '', '{#Sponsorships,#Pricing}'),
  ('idea-3', 'ws-1', 'Behind the Scenes: Cara Saya Batching 12 Video Vertikal dalam 1 Hari', 'Productivity', 'Workflow rekaman audio dan template auto-caption cut.', '', '{#Productivity,#Batching}')
ON CONFLICT (id) DO NOTHING;

-- Seed Contacts (Sponsor Deals)
INSERT INTO public.contacts (id, workspace_id, name, company, role, email, deal_status, deal_value, linked_content_title)
VALUES
  ('con-1', 'ws-1', 'Sarah Jenkins', 'Vercel', 'Developer Relations Partner', 'sarah.j@vercel.com', 'Signed', 4500, 'Next.js 16 Server Actions & Parallel Queue Masterclass'),
  ('con-2', 'ws-1', 'Alex Rivera', 'Supabase', 'Growth Marketing Lead', 'alex@supabase.io', 'Signed', 3200, 'Cara Mengotomasi Workflow Konten CRM'),
  ('con-3', 'ws-1', 'Elena Rostova', 'Linear', 'Brand Partnership', 'elena@linear.app', 'Negotiation', 2800, ''),
  ('con-4', 'ws-1', 'Dimas Wicaksono', 'Logitech Indonesia', 'Creator Specialist', 'dimas@logitech.co.id', 'Sponsored', 1500, 'Review Keyboard Low-Profile Logitech MX Mechanical Mini')
ON CONFLICT (id) DO NOTHING;

-- Seed Notifications
INSERT INTO public.notifications (id, workspace_id, title, message, type, is_read)
VALUES
  ('notif-1', 'ws-1', '1-Click Publish Sukses!', 'Konten "5 AI Tools That Save 20 Hours/Week" berhasil terbit ke YouTube Shorts, IG Reels, TikTok, dan Facebook Page.', 'publish_success', false),
  ('notif-2', 'ws-1', 'Penjadwalan Aktif (19:00 WIB)', 'Konten sponsorship "Review Logitech MX Mechanical Mini" siap dipublikasikan secara otomatis tepat waktu.', 'system', false),
  ('notif-3', 'ws-1', 'Token OAuth Segar', 'Kuota harian API YouTube: 8,400 dari 10,000 unit tersedia.', 'system', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- HAK AKSES PRIVILEGES (CRITICAL: MEMBUAT API SUPABASE BERFUNGSI PENUH)
-- ====================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- Row Level Security (RLS) Policies
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caption_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all workspaces" ON public.workspaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all social_accounts" ON public.social_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all media_assets" ON public.media_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all content_items" ON public.content_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all ideas" ON public.ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all post_targets" ON public.post_targets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all caption_templates" ON public.caption_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all content_pillars" ON public.content_pillars FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all job_logs" ON public.job_logs FOR ALL USING (true) WITH CHECK (true);
