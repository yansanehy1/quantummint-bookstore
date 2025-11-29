
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
  type: 'PREMADE' | 'CLONED';
  accent: string;
  previewUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  price: number;
  category: string;
  content: SyncPoint[];
  voiceProfileId?: string; // ID of the voice to use for TTS
}

export type ViewState = 'HOME' | 'LOGIN' | 'MARKETPLACE' | 'LIBRARY' | 'STUDIO' | 'READER' | 'MAPS' | 'VISION' | 'CHECKOUT' | 'WALLET' | 'SELLER_DASHBOARD' | 'SELLER_ONBOARDING' | 'SELLER_REGISTRATION' | 'SELLER_REQUEST' | 'REGISTER' | 'REFERRALS' | 'READING_ANALYTICS' | 'NOT_FOUND' | 'ADMIN_DASHBOARD' | 'ADMIN_BOOK_MANAGEMENT' | 'ADMIN_WALLET_MANAGEMENT' | 'PRIVACY' | 'TERMS' | 'ABOUT' | 'CONTACT' | 'FAQ' | 'SUPPORT' | 'BOOK_EDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'educator';
  balance: number;
  avatarUrl?: string;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: { reviewSnippets: { text: string }[] }[];
  };
}