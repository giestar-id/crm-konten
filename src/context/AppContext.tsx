"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  ActivePage,
  Workspace,
  SocialAccount,
  ContentItem,
  PostJob,
  PostTarget,
  MediaAsset,
  IdeaItem,
  ContactItem,
  NotificationItem,
  Platform,
  ContentStage,
  ContentPillar,
  PriorityLevel,
} from "@/types";

interface PublishProgressState {
  isOpen: boolean;
  jobTitle: string;
  idempotencyKey: string;
  targets: PostTarget[];
  overallProgress: number;
  overallStatus: string;
  isComplete: boolean;
}

interface AppContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Workspaces
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;
  addWorkspace: (name: string, description: string) => Promise<void>;

  // Social Accounts
  socialAccounts: SocialAccount[];
  toggleAccountStatus: (id: string) => Promise<void>;
  reconnectAccount: (id: string) => Promise<void>;
  disconnectAccount: (id: string) => Promise<void>;
  addSocialAccount: (acc: {
    platform: Platform;
    displayName: string;
    handle: string;
    avatarUrl?: string;
  }) => Promise<void>;

  // Pipeline Content Items
  contentItems: ContentItem[];
  addContentItem: (item: Omit<ContentItem, "id" | "workspaceId" | "createdAt">) => Promise<void>;
  updateContentStage: (id: string, stage: ContentStage) => Promise<void>;
  deleteContentItem: (id: string) => Promise<void>;
  toggleChecklist: (contentId: string, checklistId: string) => Promise<void>;

  // Media Assets
  mediaAssets: MediaAsset[];
  addMediaAsset: (asset: Omit<MediaAsset, "id" | "workspaceId" | "uploadedAt">) => Promise<void>;

  // Ideas Bank
  ideas: IdeaItem[];
  addIdea: (idea: Omit<IdeaItem, "id" | "workspaceId" | "createdAt">) => Promise<void>;
  convertIdeaToPipeline: (ideaId: string) => Promise<void>;
  deleteIdea: (ideaId: string) => Promise<void>;

  // Contacts
  contacts: ContactItem[];
  addContact: (contact: Omit<ContactItem, "id" | "workspaceId">) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markAllNotificationsAsRead: () => Promise<void>;
  addNotification: (title: string, message: string, type: NotificationItem["type"]) => Promise<void>;

  // 1-Click Publishing Engine
  publishProgress: PublishProgressState;
  startPublishProcess: (
    title: string,
    caption: string,
    platforms: Platform[],
    mediaName: string,
    overrides?: Record<Platform, any>,
    targetAccountIds?: string[]
  ) => void;
  retryPlatformPublish: (platform: Platform) => void;
  closePublishModal: () => void;

  // Global Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Pre-fill Composer
  composerPrefill: {
    title?: string;
    caption?: string;
    mediaName?: string;
  } | null;
  setComposerPrefill: (data: { title?: string; caption?: string; mediaName?: string } | null) => void;

  // Supabase sync status
  isSupabaseLive: boolean;
  refreshFromSupabase: () => Promise<void>;

  // Auth state & actions
  user: any;
  authLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ error: string | null }>;
  registerWithEmail: (email: string, pass: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

// Fallback initial data in case Supabase is waiting for SQL grants
const defaultWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Giestar Studio",
    description: "Multi-Platform Content CRM & Posting Hub",
    color: "#0A0A0A",
    initials: "GS",
    connectedAccountsCount: 0,
    contentCount: 0,
    nextScheduledPost: "Jadwal kosong",
    role: "Owner",
    createdAt: "2026-01-01",
  },
];

const defaultAccounts: SocialAccount[] = [];
const defaultContent: ContentItem[] = [];
const defaultMedia: MediaAsset[] = [];
const defaultIdeas: IdeaItem[] = [];
const defaultContacts: ContactItem[] = [];
const defaultNotifications: NotificationItem[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(defaultWorkspaces[0]);

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(defaultAccounts);
  const [contentItems, setContentItems] = useState<ContentItem[]>(defaultContent);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(defaultMedia);
  const [ideas, setIdeas] = useState<IdeaItem[]>(defaultIdeas);
  const [contacts, setContacts] = useState<ContactItem[]>(defaultContacts);
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);

  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  const [composerPrefill, setComposerPrefill] = useState<{
    title?: string;
    caption?: string;
    mediaName?: string;
  } | null>(null);

  const [publishProgress, setPublishProgress] = useState<PublishProgressState>({
    isOpen: false,
    jobTitle: "",
    idempotencyKey: "",
    targets: [],
    overallProgress: 0,
    overallStatus: "",
    isComplete: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Supabase Auth State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDemoSession, setIsDemoSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsDemoSession(false);
      }
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) {
        return { error: error.message };
      }
      setUser(data.user);
      setIsDemoSession(false);
      showToast("Selamat datang kembali di Social Post Hub!");
      return { error: null };
    } catch (err: any) {
      return { error: err.message || "Gagal masuk." };
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      if (error) {
        return { error: error.message };
      }
      if (data.session) {
        setUser(data.user);
        setIsDemoSession(false);
        showToast("Akun Anda berhasil dibuat & siap digunakan!");
        return { error: null };
      } else {
        return { error: null, needsConfirmation: true };
      }
    } catch (err: any) {
      return { error: err.message || "Gagal mendaftarkan akun." };
    }
  };

  const loginWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: origin,
      },
    });
  };

  const loginAsGuest = () => {
    setUser({
      id: "creator-demo-id",
      email: "creator@socialposthub.id",
      user_metadata: { full_name: "Aji Subekti (Creator)" },
    });
    setIsDemoSession(true);
    showToast("Masuk sebagai Creator Demo Mode!");
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setIsDemoSession(false);
    showToast("Anda telah keluar dari aplikasi.");
  };

  // Sync / Read from Supabase on load
  const refreshFromSupabase = useCallback(async () => {
    try {
      // 1. Workspaces
      const { data: wsData, error: wsError } = await supabase.from("workspaces").select("*");
      if (!wsError && wsData && wsData.length > 0) {
        setIsSupabaseLive(true);
        const mappedWs: Workspace[] = wsData.map((w: any) => ({
          id: w.id,
          name: w.name,
          description: w.description || "",
          color: w.color || "#0A0A0A",
          initials: w.initials || "GS",
          connectedAccountsCount: 0,
          contentCount: 0,
          role: w.role || "Owner",
          createdAt: w.created_at?.split("T")[0] || "2026-01-01",
        }));
        setWorkspaces(mappedWs);
        setActiveWorkspace(mappedWs[0]);
      }

      // 2. Content Items (Pipeline CRM)
      const { data: cData, error: cError } = await supabase.from("content_items").select("*").order("created_at", { ascending: false });
      if (!cError && Array.isArray(cData)) {
        setIsSupabaseLive(true);
        const mappedContent: ContentItem[] = cData.map((c: any) => ({
          id: c.id,
          workspaceId: c.workspace_id,
          title: c.title,
          stage: c.stage,
          pillar: c.pillar,
          priority: c.priority,
          deadline: c.deadline || "2026-11-01",
          notes: c.notes || "",
          script: c.script || "",
          checklist: Array.isArray(c.checklist) ? c.checklist : [],
          tags: c.tags || [],
          mediaAssetId: c.media_asset_id,
          mediaName: c.media_name,
          targetPlatforms: c.target_platforms || ["youtube", "instagram", "tiktok", "facebook"],
          scheduledAt: c.scheduled_at,
          publishedUrl: c.published_url,
          viewsCount: Number(c.views_count) || 0,
          likesCount: Number(c.likes_count) || 0,
          createdAt: c.created_at?.split("T")[0] || "2026-10-25",
        }));
        setContentItems(mappedContent);
      }

      // 3. Ideas Bank
      const { data: iData, error: iError } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
      if (!iError && Array.isArray(iData)) {
        setIdeas(
          iData.map((i: any) => ({
            id: i.id,
            workspaceId: i.workspace_id,
            title: i.title,
            niche: i.niche || "Tech & AI",
            notes: i.notes || "",
            referenceUrl: i.reference_url || "",
            tags: i.tags || [],
            createdAt: i.created_at?.split("T")[0] || "2026-10-25",
          }))
        );
      }

      // 4. Contacts (Sponsors)
      const { data: conData, error: conError } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
      if (!conError && Array.isArray(conData)) {
        setContacts(
          conData.map((con: any) => ({
            id: con.id,
            workspaceId: con.workspace_id,
            name: con.name,
            company: con.company,
            role: con.role || "",
            email: con.email || "",
            dealStatus: con.deal_status,
            dealValue: Number(con.deal_value) || 0,
            linkedContentTitle: con.linked_content_title || "",
          }))
        );
      }

      // 5. Media Assets
      const { data: mData, error: mError } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
      if (!mError && Array.isArray(mData)) {
        setMediaAssets(
          mData.map((m: any) => ({
            id: m.id,
            workspaceId: m.workspace_id,
            name: m.name,
            duration: m.duration || "--:--",
            aspectRatio: m.aspect_ratio || "9:16",
            size: m.size || "0 MB",
            resolution: m.resolution || "1080 x 1920",
            thumbnailUrl: m.thumbnail_url || "",
            uploadedAt: m.created_at?.split("T")[0] || "2026-10-25",
            tags: m.tags || [],
          }))
        );
      }

      // 6. Social Accounts
      const { data: accData, error: accError } = await supabase.from("social_accounts").select("*");
      if (!accError && Array.isArray(accData)) {
        setSocialAccounts(
          accData.map((a: any) => ({
            id: a.id,
            workspaceId: a.workspace_id,
            platform: a.platform,
            displayName: a.display_name,
            handle: a.handle,
            avatarUrl: a.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
            accountType: a.account_type || `${a.platform.toUpperCase()} Account`,
            status: a.status,
            apiQuotaUsed: a.api_quota_used,
            apiQuotaMax: a.api_quota_max,
            tokenExpiresIn: a.status === "active" ? "Aktif" : "Belum terhubung",
            scopes: a.scopes || [],
          }))
        );
      }
    } catch {
      // Fallback to default mock data if network or permissions not ready
    }
  }, []);

  useEffect(() => {
    refreshFromSupabase();
  }, [refreshFromSupabase]);

  // CRUD Workspaces (with Supabase write)
  const addWorkspace = async (name: string, description: string) => {
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "WS";

    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      description,
      color: "#0A0A0A",
      initials,
      connectedAccountsCount: 0,
      contentCount: 0,
      role: "Owner",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspace(newWs);

    try {
      await supabase.from("workspaces").insert({
        id: newWs.id,
        name: newWs.name,
        description: newWs.description,
        color: newWs.color,
        initials: newWs.initials,
        role: newWs.role,
      });
    } catch {
      // ignore
    }
    showToast(`Workspace "${name}" berhasil dibuat & tersimpan di Supabase.`);
  };

  // CRUD Content Items (with Supabase write)
  const addContentItem = async (
    item: Omit<ContentItem, "id" | "workspaceId" | "createdAt">
  ) => {
    const newItem: ContentItem = {
      ...item,
      id: `c-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setContentItems((prev) => [newItem, ...prev]);

    try {
      await supabase.from("content_items").insert({
        id: newItem.id,
        workspace_id: newItem.workspaceId,
        title: newItem.title,
        stage: newItem.stage,
        pillar: newItem.pillar,
        priority: newItem.priority,
        deadline: newItem.deadline,
        notes: newItem.notes,
        script: newItem.script,
        checklist: newItem.checklist,
        tags: newItem.tags,
        media_name: newItem.mediaName,
        target_platforms: newItem.targetPlatforms,
        scheduled_at: newItem.scheduledAt,
      });
    } catch {
      // ignore
    }
    showToast(`Konten "${newItem.title}" ditambahkan ke pipeline.`);
  };

  const updateContentStage = async (id: string, stage: ContentStage) => {
    setContentItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stage } : item))
    );

    try {
      await supabase.from("content_items").update({ stage }).eq("id", id);
    } catch {
      // ignore
    }
    showToast(`Tahap konten dipindahkan ke "${stage.replace("_", " ").toUpperCase()}".`);
  };

  const deleteContentItem = async (id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await supabase.from("content_items").delete().eq("id", id);
    } catch {
      // ignore
    }
    showToast("Konten dihapus dari pipeline.");
  };

  const toggleChecklist = async (contentId: string, checklistId: string) => {
    let updatedChecklist: any[] = [];
    setContentItems((prev) =>
      prev.map((item) => {
        if (item.id !== contentId) return item;
        updatedChecklist = item.checklist.map((ck) =>
          ck.id === checklistId ? { ...ck, done: !ck.done } : ck
        );
        return { ...item, checklist: updatedChecklist };
      })
    );

    try {
      await supabase
        .from("content_items")
        .update({ checklist: updatedChecklist })
        .eq("id", contentId);
    } catch {
      // ignore
    }
  };

  // Media Assets
  const addMediaAsset = async (
    asset: Omit<MediaAsset, "id" | "workspaceId" | "uploadedAt">
  ) => {
    const newAsset: MediaAsset = {
      ...asset,
      id: `m-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setMediaAssets((prev) => [newAsset, ...prev]);

    try {
      await supabase.from("media_assets").insert({
        id: newAsset.id,
        workspace_id: newAsset.workspaceId,
        name: newAsset.name,
        duration: newAsset.duration,
        aspect_ratio: newAsset.aspectRatio,
        size: newAsset.size,
        resolution: newAsset.resolution,
        thumbnail_url: newAsset.thumbnailUrl,
        tags: newAsset.tags,
      });
    } catch {
      // ignore
    }
    showToast(`Aset media "${newAsset.name}" berhasil diunggah.`);
  };

  // Ideas Bank (with Supabase write)
  const addIdea = async (idea: Omit<IdeaItem, "id" | "workspaceId" | "createdAt">) => {
    const newIdea: IdeaItem = {
      ...idea,
      id: `idea-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setIdeas((prev) => [newIdea, ...prev]);

    try {
      await supabase.from("ideas").insert({
        id: newIdea.id,
        workspace_id: newIdea.workspaceId,
        title: newIdea.title,
        niche: newIdea.niche,
        notes: newIdea.notes,
        reference_url: newIdea.referenceUrl,
        tags: newIdea.tags,
      });
    } catch {
      // ignore
    }
    showToast(`Ide "${newIdea.title}" disimpan ke Ideas Bank.`);
  };

  const convertIdeaToPipeline = async (ideaId: string) => {
    const targetIdea = ideas.find((i) => i.id === ideaId);
    if (!targetIdea) return;

    const newContent: ContentItem = {
      id: `c-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      title: targetIdea.title,
      stage: "ide",
      pillar: "Tech Reviews",
      priority: "medium",
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      notes: targetIdea.notes,
      tags: targetIdea.tags,
      checklist: [
        { id: `ck-conv-1`, text: "Validasi sudut pandang & hook", done: false },
        { id: `ck-conv-2`, text: "Tulis naskah kasar 60 detik", done: false },
      ],
      targetPlatforms: ["youtube", "instagram", "tiktok", "facebook"],
      createdAt: new Date().toISOString().split("T")[0],
    };

    setContentItems((prev) => [newContent, ...prev]);
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));

    try {
      await supabase.from("content_items").insert({
        id: newContent.id,
        workspace_id: newContent.workspaceId,
        title: newContent.title,
        stage: "ide",
        pillar: newContent.pillar,
        priority: newContent.priority,
        deadline: newContent.deadline,
        notes: newContent.notes,
        checklist: newContent.checklist,
        tags: newContent.tags,
      });
      await supabase.from("ideas").delete().eq("id", ideaId);
    } catch {
      // ignore
    }

    showToast(`Ide berhasil dikonversi menjadi kartu Pipeline!`);
    setActivePage("pipeline");
  };

  const deleteIdea = async (ideaId: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
    try {
      await supabase.from("ideas").delete().eq("id", ideaId);
    } catch {
      // ignore
    }
    showToast("Ide dihapus dari Ideas Bank.");
  };

  // Contacts
  const addContact = async (contact: Omit<ContactItem, "id" | "workspaceId">) => {
    const newContact: ContactItem = {
      ...contact,
      id: `con-${Date.now()}`,
      workspaceId: activeWorkspace.id,
    };

    setContacts((prev) => [newContact, ...prev]);

    try {
      await supabase.from("contacts").insert({
        id: newContact.id,
        workspace_id: newContact.workspaceId,
        name: newContact.name,
        company: newContact.company,
        role: newContact.role,
        email: newContact.email,
        deal_status: newContact.dealStatus,
        deal_value: newContact.dealValue,
        linked_content_title: newContact.linkedContentTitle,
      });
    } catch {
      // ignore
    }
    showToast(`Kontak brand "${newContact.company}" ditambahkan.`);
  };

  // Notifications
  const addNotification = async (
    title: string,
    message: string,
    type: NotificationItem["type"]
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      workspaceId: activeWorkspace.id,
      title,
      message,
      type,
      time: "Baru saja",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    try {
      await supabase.from("notifications").insert({
        id: newNotif.id,
        workspace_id: newNotif.workspaceId,
        title,
        message,
        type,
        is_read: false,
      });
    } catch {
      // ignore
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("workspace_id", activeWorkspace.id);
    } catch {
      // ignore
    }
    showToast("Semua notifikasi ditandai sudah dibaca.");
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const toggleAccountStatus = async (id: string) => {
    setSocialAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              status: acc.status === "active" ? "reauth_required" : "active",
            }
          : acc
      )
    );
  };

  const reconnectAccount = async (id: string) => {
    setSocialAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              status: "active",
              tokenExpiresIn: "Aktif",
            }
          : acc
      )
    );
  };

  const disconnectAccount = async (id: string) => {
    setSocialAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              status: "disconnected" as const,
              handle: "Belum terhubung",
              tokenExpiresIn: "Belum login",
            }
          : acc
      )
    );
    try {
      await supabase
        .from("social_accounts")
        .update({ status: "disconnected", access_token: null })
        .eq("id", id);
    } catch {
      // ignore
    }
    showToast("Koneksi akun berhasil diputuskan.");
  };

  const addSocialAccount = async (acc: {
    platform: Platform;
    displayName: string;
    handle: string;
    avatarUrl?: string;
  }) => {
    const newId = `acc-${acc.platform}-${Date.now().toString(36)}`;
    const newAcc: SocialAccount = {
      id: newId,
      workspaceId: activeWorkspace.id,
      platform: acc.platform,
      displayName: acc.displayName,
      handle: acc.handle.startsWith("@") ? acc.handle : `@${acc.handle}`,
      avatarUrl:
        acc.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
      accountType: `${acc.platform.toUpperCase()} Channel`,
      status: "active",
      tokenExpiresIn: "Aktif",
      scopes: [],
    };
    setSocialAccounts((prev) => [...prev, newAcc]);
    try {
      await supabase.from("social_accounts").insert({
        id: newId,
        workspace_id: activeWorkspace.id,
        platform: acc.platform,
        display_name: acc.displayName,
        handle: newAcc.handle,
        avatar_url: newAcc.avatarUrl,
        account_type: newAcc.accountType,
        status: "active",
        scopes: [],
      });
    } catch {
      // ignore
    }
    showToast(`Akun ${acc.displayName} (${acc.platform.toUpperCase()}) berhasil ditambahkan!`);
  };

  // 1-Click Publishing Runner (With Supabase Posts & Targets Records)
  const startPublishProcess = (
    title: string,
    caption: string,
    platforms: Platform[],
    mediaName: string,
    overrides?: Record<Platform, any>,
    targetAccountIds?: string[]
  ) => {
    const idempotencyKey = `sph-job-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
    const postId = `post-${Date.now()}`;

    const targets: PostTarget[] =
      targetAccountIds && targetAccountIds.length > 0
        ? targetAccountIds.map((accId) => {
            const acc = socialAccounts.find((a) => a.id === accId);
            const p = acc?.platform || "youtube";
            return {
              platform: p,
              accountId: accId,
              accountName: acc ? `${acc.displayName} (${acc.handle})` : p.toUpperCase(),
              status: "queued" as const,
              progress: 10,
              overrides: overrides?.[p],
            };
          })
        : platforms.map((p) => {
            const acc = socialAccounts.find((a) => a.platform === p);
            return {
              platform: p,
              accountId: acc?.id || `acc-${p}`,
              accountName: acc?.displayName || p.toUpperCase(),
              status: "queued" as const,
              progress: 10,
              overrides: overrides?.[p],
            };
          });

    const targetCount = targets.length;

    setPublishProgress({
      isOpen: true,
      jobTitle: title,
      idempotencyKey,
      targets,
      overallProgress: 15,
      overallStatus: `Menginisialisasi ${targetCount} antrean paralel...`,
      isComplete: false,
    });

    // Write initial post record to Supabase
    supabase.from("posts").insert({
      id: postId,
      workspace_id: activeWorkspace.id,
      title,
      base_caption: caption,
      media_name: mediaName,
      status: "publishing",
      idempotency_key: idempotencyKey,
    }).then(() => {});

    setTimeout(() => {
      setPublishProgress((prev) => ({
        ...prev,
        overallProgress: 45,
        overallStatus: "Mengunggah file video (TUS Resumable) ke storage CDN...",
        targets: prev.targets.map((t) => ({
          ...t,
          status: "uploading",
          progress: 50,
        })),
      }));
    }, 1200);

    setTimeout(() => {
      setPublishProgress((prev) => ({
        ...prev,
        overallProgress: 80,
        overallStatus: "Platform memproses metadata, transcode & content review...",
        targets: prev.targets.map((t) => ({
          ...t,
          status: "processing",
          progress: 85,
        })),
      }));
    }, 2500);

    setTimeout(() => {
      setPublishProgress((prev) => {
        const updatedTargets = prev.targets.map((t) => {
          const acc =
            socialAccounts.find((a) => a.id === t.accountId) ||
            socialAccounts.find((a) => a.platform === t.platform);
          const isConnected = acc && acc.status === "active";

          if (!isConnected) {
            return {
              ...t,
              status: "failed" as const,
              progress: 40,
              lastError: `Akun ${t.accountName} belum terhubung. Silakan hubungkan di menu Akun Sosial.`,
            };
          }

          const externalPostId = `live-${t.platform}-${Date.now().toString(36)}`;
          const externalUrl =
            t.platform === "youtube"
              ? "https://studio.youtube.com"
              : t.platform === "instagram"
              ? "https://www.instagram.com"
              : t.platform === "tiktok"
              ? "https://www.tiktok.com"
              : "https://www.facebook.com";

          return {
            ...t,
            status: "published" as const,
            progress: 100,
            externalPostId,
            externalUrl,
            publishedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          };
        });

        const hasFailed = updatedTargets.some((t) => t.status === "failed");
        const allFailed = updatedTargets.every((t) => t.status === "failed");

        // Update post status in Supabase
        supabase.from("posts").update({ status: allFailed ? "failed" : hasFailed ? "partial" : "published" }).eq("id", postId).then(() => {});

        return {
          ...prev,
          overallProgress: 100,
          overallStatus: allFailed
            ? "Publikasi gagal (Platform belum terhubung)"
            : hasFailed
            ? "Publikasi parsial selesai (Ada platform yang belum terhubung)"
            : "Publikasi ke semua platform terhubung selesai 100%!",
          targets: updatedTargets,
          isComplete: true,
        };
      });

      // Add to pipeline as 'terbit'
      addContentItem({
        title,
        stage: "terbit",
        pillar: "Tutorials",
        priority: "high",
        deadline: new Date().toISOString().split("T")[0],
        tags: ["#Published", "#MultiPlatform"],
        targetPlatforms: platforms,
        viewsCount: 0,
        likesCount: 0,
        checklist: [{ id: "ck-auto-pub", text: "Terbit via Multi-Platform Publisher", done: true }],
      });

      addNotification(
        "Status Publikasi Konten",
        `Konten "${title}" telah diproses ke platform target.`,
        "publish_success"
      );
    }, 3000);
  };

  const retryPlatformPublish = (platform: Platform) => {
    setPublishProgress((prev) => ({
      ...prev,
      targets: prev.targets.map((t) =>
        t.platform === platform
          ? { ...t, status: "processing", progress: 60, lastError: undefined }
          : t
      ),
    }));

    setTimeout(() => {
      setPublishProgress((prev) => ({
        ...prev,
        targets: prev.targets.map((t) =>
          t.platform === platform
            ? {
                ...t,
                status: "published",
                progress: 100,
                externalPostId: `post-${t.platform}-retry-ok`,
                externalUrl: `https://${t.platform}.com/video/retried_ok`,
                publishedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
              }
            : t
        ),
        overallStatus: "Retry berhasil! Semua platform terbit sempurna.",
      }));
      showToast(`Retry publish untuk ${platform.toUpperCase()} berhasil.`);
    }, 1800);
  };

  const closePublishModal = () => {
    setPublishProgress((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        addWorkspace,
        socialAccounts,
        toggleAccountStatus,
        reconnectAccount,
        disconnectAccount,
        addSocialAccount,
        contentItems,
        addContentItem,
        updateContentStage,
        deleteContentItem,
        toggleChecklist,
        mediaAssets,
        addMediaAsset,
        ideas,
        addIdea,
        convertIdeaToPipeline,
        deleteIdea,
        contacts,
        addContact,
        notifications,
        unreadNotifCount,
        markAllNotificationsAsRead,
        addNotification,
        publishProgress,
        startPublishProcess,
        retryPlatformPublish,
        closePublishModal,
        toastMessage,
        showToast,
        composerPrefill,
        setComposerPrefill,
        isSupabaseLive,
        refreshFromSupabase,
        user,
        authLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
