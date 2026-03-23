
export enum SegmentType {
  TEXT = 'TEXT',
  FORMULA = 'FORMULA',
  STEP = 'STEP',
  IMAGE = 'IMAGE'
}

export interface SyncPoint {
  id: string;
  text: string;
  type: SegmentType;
  visualContent?: string; // URL for image, LaTeX for formula, Step text
  visualDescription?: string; // For generating images or alt text
  duration?: number; // Estimated duration in seconds (optional)
  audioUrl?: string; // URL for generated audio
}

export interface VoiceProfile {
  id: string;
  name: string;
  type?: 'PREMADE' | 'CLONED';
  description?: string;
  language?: string;
  accent: string;
  gender?: 'male' | 'female' | 'neutral';
  age?: 'young' | 'adult' | 'mature';
  style?: 'narrative' | 'conversational' | 'professional' | 'casual' | 'dramatic';
  previewUrl?: string;
  sampleAudioUrl?: string;
  isPremium?: boolean;
  isCustom?: boolean;
  creatorId?: string;
  tags?: string[];
  rating?: number;
  usageCount?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Chapter {
  id: string;
  title: string;
  content?: string; // HTML or Markdown
  text?: string;
  audioUrl?: string;
  duration?: number; // in seconds
  order?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  coverImage?: string;
  description: string;
  price?: number;
  rating: number;
  category: string;
  genre?: string;
  reviews: Review[];
  chapters: Chapter[];
  content?: SyncPoint[];
  voiceProfileId?: string; // ID of the voice to use for TTS
  aiSummary?: string;
  totalDuration?: number; // in seconds
  creatorId?: string;
  createdAt?: string;
}

export type ViewState = 'HOME' | 'LOGIN' | 'MARKETPLACE' | 'LIBRARY' | 'STUDIO' | 'READER' | 'MAPS' | 'VISION' | 'CHECKOUT' | 'WALLET' | 'SELLER_DASHBOARD' | 'SELLER_ONBOARDING' | 'SELLER_REGISTRATION' | 'SELLER_REQUEST' | 'REGISTER' | 'REFERRALS' | 'READING_ANALYTICS' | 'NOT_FOUND' | 'ADMIN_DASHBOARD' | 'ADMIN_BOOK_MANAGEMENT' | 'ADMIN_WALLET_MANAGEMENT' | 'PRIVACY' | 'TERMS' | 'ABOUT' | 'CONTACT' | 'FAQ' | 'SUPPORT' | 'BOOK_EDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  walletBalance: {
    sll: number;
    usd: number;
  };
  avatarUrl?: string;
  status?: 'Active' | 'Suspended' | 'Pending';
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: { reviewSnippets: { text: string }[] }[];
  };
}

