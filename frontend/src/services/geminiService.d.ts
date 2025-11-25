import { SyncPoint } from '../types';
export declare const setGeminiApiKey: (key: string) => void;
export declare const generateEducationalContent: (text: string) => Promise<SyncPoint[]>;
export declare const generateAudio: (text: string, voiceName: string) => Promise<string>;
export interface MapsResponse {
    text: string;
    chunks: any[];
}
export declare const queryMapsAgent: (query: string, lat?: number, lng?: number) => Promise<MapsResponse>;
export declare const analyzeImage: (base64Image: string, mimeType: string, prompt: string) => Promise<string>;
