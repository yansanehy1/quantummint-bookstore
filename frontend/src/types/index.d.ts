import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
export declare enum SegmentType {
    TEXT = "text",
    HEADING = "heading",
    IMAGE = "image_prompt",
    NOTE = "note",
    FORMULA = "formula",
    STEP = "step"
}
export interface SyncPoint {
    id: string;
    text: string;
    audioUrl?: string;
    type: SegmentType | string;
    visualDescription?: string;
    visualContent?: string;
    startTime?: number;
    endTime?: number;
}
export interface VoiceProfile {
    id: string;
    name: string;
    accent: string;
    gender: 'male' | 'female';
    type?: 'PREMADE' | 'CLONED';
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
    voiceProfileId: string;
}
export interface StudioPage {
    id: string;
    title: string;
    rawText: string;
    segments: SyncPoint[];
}
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};
export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
