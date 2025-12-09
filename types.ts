
export enum UserRole {
  LEARNER = 'LEARNER',
  EDUCATOR = 'EDUCATOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  email?: string; // Added for management
  status?: 'Active' | 'Suspended' | 'Pending'; // Added for management
  joinedDate?: string; // Added for management
  walletBalance: {
    usd: number;
    sll: number; // Sierra Leonean Leone
  };
}

export type CueType = 'visual' | 'formula' | 'step';

export interface Cue {
  type: CueType;
  atMs: number;
  payload: any;
  duration?: number; // How long to show it, if applicable
}

export interface BookChapter {
  id: string;
  title: string;
  audioUrl: string; // Mock URL
  durationMs: number;
  cues: Cue[];
  transcript: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  price: number;
  category: string;
  educationalLevel?: 'JSS' | 'SSS' | 'Tertiary' | 'General';
  chapters: BookChapter[];
  description: string;
  rating: number;
  reviews: Review[];
  aiSummary?: string;
}

export interface AnalyticsData {
  date: string;
  sessions: number;
  avgDuration: number;
  completionRate: number;
}

export interface AppSystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  withdrawalFeePercent: number;
  exchangeRateUsdSll: number;
  enableAiFeatures: boolean;
  defaultTtsModel: string;
  paymentProviders: {
    stripe: boolean;
    orange: boolean;
    afri: boolean;
    qmoney: boolean;
  };
}

export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  startTime: string;
  endTime?: string;
  duration: number; // seconds
  cost: number;
  type: 'reading' | 'listening';
  progress: number; // percentage
}

export interface FinancialTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'royalty';
  amount: number;
  currency: 'USD' | 'SLL';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
}

// Studio types
export type SegmentType = 'title' | 'normal' | 'formula' | 'emphasis' | 'step';

export interface SyncPoint {
  id: string;
  time: number;
  text: string;
  type: SegmentType;
  visualDescription?: string;
  audioUrl?: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  accent: string;
  gender: 'male' | 'female';
  language: string;
  sampleUrl?: string;
}

// Extended Book interface for Studio
export interface StudioBook extends Book {
  content?: SyncPoint[];
  voiceProfileId?: string;
}
