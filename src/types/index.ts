export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook';

export type TargetPublishStatus = 'queued' | 'uploading' | 'processing' | 'published' | 'failed' | 'cancelled';

export type PostOverallStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'partial' | 'failed';

export type ContentStage = 
  | 'ide' 
  | 'naskah' 
  | 'produksi' 
  | 'editing' 
  | 'siap_posting' 
  | 'terjadwal' 
  | 'terbit' 
  | 'dianalisis';

export type ContentPillar = 'Tech Reviews' | 'Tutorials' | 'Personal Brand' | 'Sponsorships';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  color: string;
  initials: string;
  connectedAccountsCount: number;
  contentCount: number;
  nextScheduledPost?: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  createdAt: string;
}

export interface SocialAccount {
  id: string;
  workspaceId: string;
  platform: Platform;
  displayName: string;
  handle: string;
  avatarUrl: string;
  accountType: string;
  status: 'active' | 'reauth_required' | 'disconnected';
  apiQuotaUsed?: number;
  apiQuotaMax?: number;
  tokenExpiresIn?: string;
  scopes: string[];
}

export interface PlatformOverrides {
  title?: string;
  caption?: string;
  privacy?: 'public' | 'unlisted' | 'private';
  category?: string;
  isShorts?: boolean;
  allowDuet?: boolean;
  allowStitch?: boolean;
  allowComments?: boolean;
  shareToFeed?: boolean;
  isDirectPost?: boolean;
}

export interface PostTarget {
  platform: Platform;
  accountId: string;
  accountName: string;
  status: TargetPublishStatus;
  progress: number;
  externalPostId?: string;
  externalUrl?: string;
  lastError?: string;
  overrides?: PlatformOverrides;
  publishedAt?: string;
}

export interface PostJob {
  id: string;
  workspaceId: string;
  title: string;
  baseCaption: string;
  tags: string[];
  mediaId: string;
  mediaName: string;
  mediaSize: string;
  aspectRatio: '9:16' | '16:9';
  status: PostOverallStatus;
  scheduledAt?: string;
  idempotencyKey: string;
  targets: PostTarget[];
  createdAt: string;
}

export interface ContentChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ContentItem {
  id: string;
  workspaceId: string;
  title: string;
  stage: ContentStage;
  pillar: ContentPillar;
  priority: PriorityLevel;
  deadline: string;
  script?: string;
  notes?: string;
  checklist: ContentChecklistItem[];
  tags: string[];
  mediaAssetId?: string;
  mediaName?: string;
  targetPlatforms: Platform[];
  scheduledAt?: string;
  publishedUrl?: string;
  viewsCount?: number;
  likesCount?: number;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  workspaceId: string;
  name: string;
  duration: string;
  aspectRatio: '9:16' | '16:9';
  size: string;
  resolution: string;
  thumbnailUrl: string;
  uploadedAt: string;
  tags: string[];
}

export interface IdeaItem {
  id: string;
  workspaceId: string;
  title: string;
  niche: string;
  notes: string;
  referenceUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface ContactItem {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  role: string;
  email: string;
  dealStatus: 'Pitching' | 'Negotiation' | 'Signed' | 'Sponsored' | 'Paid';
  dealValue: number;
  linkedContentTitle?: string;
}

export interface NotificationItem {
  id: string;
  workspaceId: string;
  title: string;
  message: string;
  type: 'publish_success' | 'publish_failed' | 'mention' | 'system' | 'token_alert';
  time: string;
  read: boolean;
  linkUrl?: string;
}

export type ActivePage = 
  | 'dashboard' 
  | 'compose' 
  | 'pipeline' 
  | 'calendar' 
  | 'analytics' 
  | 'ideas' 
  | 'media' 
  | 'accounts' 
  | 'contacts' 
  | 'notifications' 
  | 'settings';
