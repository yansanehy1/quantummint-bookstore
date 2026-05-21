
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

export interface WordTimestamp {
  word: string;
  startMs: number;
  endMs: number;
  sentenceIndex?: number;
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
  role: 'learner' | 'seller' | 'admin' | 'support';
  walletBalance: {
    sll: number;
    usd: number;
  };
  avatarUrl?: string;
  status?: 'Active' | 'Suspended' | 'Pending';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'payout' | 'admin_adjustment';
  amount: number;
  currency: 'USD' | 'SLL';
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  method?: string;
  accountNumber?: string;
  description?: string;
  rejectionReason?: string;
  createdAt: string;
  User?: { name: string; email: string };
}

export interface Subscription {
  id: string;
  userId: string;
  groupId?: string;
  sponsorId?: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  amount: number;
  currency: 'USD' | 'SLL';
  allowedBookIds?: string[] | null;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  targetId: string;
  details: Record<string, any>;
  createdAt: string;
  User: { name: string; email: string };
}

export interface FormulaBreakdown {
  id: string;
  latex: string;
  explanation: string;
  concepts: string[];
}

export interface ConceptDefinition {
  id: string;
  name: string;
  description: string;
  visualUrl?: string;
}

export interface SearchResults {
  query: string;
  results: {
    books: Book[];
    formulas: FormulaBreakdown[];
    concepts: ConceptDefinition[];
  };
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  bio?: string;
  status: 'pending' | 'active' | 'rejected';
  logoUrl?: string;
  User: { name: string; email: string };
}

export interface Note {
  id: string;
  bookId: string;
  pageId: number;
  content: string;
  color?: string;
  highlightText?: string;
  createdAt: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  type: 'CUG' | 'ORGANIZATION' | 'GOVERNMENT' | 'PRIVATE';
  sponsorId?: string;
  status: 'pending' | 'active' | 'inactive';
  maxMembers: number;
  prepaidBalance: number;
  currency: 'USD' | 'SLL';
  allowedBookIds?: string[] | null;
  GroupSponsor?: { name: string; email: string };
  GroupMembers?: Array<{ id: string }>;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: { reviewSnippets: { text: string }[] }[];
  };
}

