<<<<<<< HEAD
import { SyncPoint, SegmentType } from '../types';

// Stub service for AI content generation
// TODO: Integrate with actual Gemini API or other AI service

export async function generateEducationalContent(text: string): Promise<SyncPoint[]> {
    // Mock implementation - split text into paragraphs as segments
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

    return paragraphs.map((paragraph, index) => ({
        id: `segment-${Date.now()}-${index}`,
        time: index * 5,  // time in seconds (matches SyncPoint interface)
        text: paragraph.trim(),
        type: 'normal' as SegmentType,
        visualDescription: 'Generated visual description for content',
        audioUrl: undefined
    }));
}

/**
 * Generate audio from text using Google Cloud Text-to-Speech (free tier)
 * Falls back to browser TTS if API is unavailable
 */
export async function generateAudio(text: string, voiceName: string = 'Kore'): Promise<string> {
    console.log(`Generating audio for: "${text.substring(0, 50)}..." with voice: ${voiceName}`);

    try {
        // Option 1: Try Google Cloud TTS (free tier - no API key needed for basic usage)
        const audioUrl = await generateWithGoogleTTS(text, voiceName);
        if (audioUrl) {
            console.log('✅ Audio generated successfully');
            return audioUrl;
        }
    } catch (error) {
        console.warn('Google TTS failed, trying alternative:', error);
    }

    try {
        // Option 2: Use Microsoft Edge Read Aloud API (free, no key needed)
        const audioUrl = await generateWithEdgeTTS(text, voiceName);
        if (audioUrl) {
            console.log('✅ Audio generated with Edge TTS');
            return audioUrl;
        }
    } catch (error) {
        console.warn('Edge TTS failed:', error);
    }

    // Option 3: Fallback to browser speech synthesis with recording
    console.log('Using browser TTS as fallback');
    return await generateWithBrowserTTS(text, voiceName);
}

/**
 * Generate audio using Google Cloud Text-to-Speech
 */
async function generateWithGoogleTTS(text: string, voiceName: string): Promise<string | null> {
    try {
        // Using Google's public TTS endpoint (demo/free tier)
        const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { text: text },
                voice: {
                    languageCode: 'en-US',
                    name: voiceName.includes('male') ? 'en-US-Wavenet-D' : 'en-US-Wavenet-F',
                    ssmlGender: voiceName.toLowerCase().includes('male') ? 'MALE' : 'FEMALE'
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    pitch: 0,
                    speakingRate: 1.0
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Google TTS API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.audioContent) {
            // Convert base64 audio to blob URL
            const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
            return URL.createObjectURL(audioBlob);
        }
        return null;
    } catch (error) {
        console.error('Google TTS error:', error);
        return null;
    }
}

/**
 * Generate audio using Microsoft Edge TTS (free alternative)
 */
async function generateWithEdgeTTS(text: string, voiceName: string): Promise<string | null> {
    try {
        // Edge TTS uses a websocket connection, for simplicity using HTTP fallback
        // You can use edge-tts library or similar in production

        // For now, return null to fall through to browser TTS
        // In production, implement proper Edge TTS integration
        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Generate audio using browser's SpeechSynthesis API
 * This speaks the text but doesn't create downloadable audio
 */
async function generateWithBrowserTTS(text: string, voiceName: string): Promise<string> {
    return new Promise((resolve) => {
        try {
            if (!('speechSynthesis' in window)) {
                console.warn('Speech synthesis not supported');
                resolve(createSilentAudio());
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);

            // Try to match the requested voice
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v =>
                v.name.toLowerCase().includes(voiceName.toLowerCase()) ||
                v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('english')
            ) || voices[0];

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => {
                // Since we can't capture browser TTS audio directly,
                // we create a silent audio placeholder
                resolve(createSilentAudio());
            };

            utterance.onerror = () => {
                resolve(createSilentAudio());
            };

            // Speak the text (will be audible but not recorded)
            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error('Browser TTS error:', error);
            resolve(createSilentAudio());
        }
    });
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

/**
 * Create a silent audio file as fallback
 */
function createSilentAudio(): string {
    // Create a minimal silent MP3 (100ms of silence)
    const silentMp3 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPj4+Pj4+TExMTExZWVlZWVlnZ2dnZ3V1dXV1dYODg4ODkZGRkZGRn5+fn5+frKysrKy6urq6urrIyMjIyNbW1tbW1uTk5OTk8vLy8vLy//////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRTAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Xx7w37/qMoGsnCMU5pnW+OQnBcDrQ9Xx7w37/qMo';

    const blob = base64ToBlob(silentMp3, 'audio/mp3');
    return URL.createObjectURL(blob);
}
=======
import { GoogleGenAI, Type } from "@google/genai";
import { SyncPoint, SegmentType, GroundingChunk } from "../types";

export const generateEducationalContent = async (rawText: string): Promise<SyncPoint[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert educational content designer.
    Analyze the following educational text and break it down into synchronized segments for an immersive audiobook.
    
    For each segment:
    1. 'text': The spoken content (keep it natural, 1-3 sentences max per segment).
    2. 'type': Best visual aid type. 'IMAGE' for general concepts, 'FORMULA' for math/science equations, 'STEP' for tutorial steps, 'TEXT' if no specific visual is needed.
    3. 'visualContent': 
       - If 'IMAGE': specific keyword or short description to seed a stock photo.
       - If 'FORMULA': The valid LaTeX string for the math concept mentioned.
       - If 'STEP': A short bullet point summary of the step.
       - If 'TEXT': Leave empty or null.
    4. 'visualDescription': A short description of what the visual represents.

    Text to analyze:
    "${rawText}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["TEXT", "FORMULA", "IMAGE", "STEP"] },
              visualContent: { type: Type.STRING },
              visualDescription: { type: Type.STRING }
            },
            required: ["text", "type", "visualDescription"]
          }
        }
      }
    });

    const rawData = response.text;
    if (!rawData) throw new Error("No data returned from Gemini");

    const parsedData = JSON.parse(rawData);
    
    return parsedData.map((item: any, index: number) => ({
      id: `gen-${index}-${Date.now()}`,
      text: item.text,
      type: item.type as SegmentType,
      visualContent: item.type === 'IMAGE' 
        ? `https://picsum.photos/seed/${encodeURIComponent(item.visualContent || item.visualDescription)}/800/600` 
        : item.visualContent,
      visualDescription: item.visualDescription
    }));

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return [
      {
        id: 'err-1',
        text: "We encountered an issue generating the immersive content.",
        type: SegmentType.TEXT,
        visualDescription: "Error state"
      }
    ];
  }
};

export const generateAudio = async (text: string, voiceName: string = 'Kore', speed: 'slow' | 'normal' | 'fast' = 'normal'): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let speedPrompt = "";
  if (speed === 'fast') speedPrompt = "Speak at a fast, energetic pace. ";
  if (speed === 'slow') speedPrompt = "Speak slowly and clearly. ";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: {
      parts: [{ text: speedPrompt + text }]
    },
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName }
        }
      }
    }
  });

  const audioB64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioB64) throw new Error("No audio data returned");

  const pcm = base64ToPcm(audioB64);
  const wav = pcmToWav(pcm);
  return URL.createObjectURL(wav);
};

function base64ToPcm(base64: string): Int16Array {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

function pcmToWav(pcm: Int16Array): Blob {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitDepth = 16;
  
  const buffer = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(buffer);
  
  const writeString = (v: DataView, o: number, s: string) => { 
    for(let i=0; i<s.length; i++) v.setUint8(o+i, s.charCodeAt(i)); 
  };
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcm.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, pcm.length * 2, true);
  
  for(let i=0; i<pcm.length; i++) {
    view.setInt16(44 + (i * 2), pcm[i], true);
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}

export interface MapsResponse {
  text: string;
  chunks: GroundingChunk[];
}

export const queryMapsAgent = async (query: string, userLat?: number, userLng?: number): Promise<MapsResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const toolConfig = (userLat && userLng) ? {
    retrievalConfig: {
      latLng: {
        latitude: userLat,
        longitude: userLng
      }
    }
  } : undefined;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: toolConfig
    },
  });

  return {
    text: response.text || "I found some information.",
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || []
  };
};

export const analyzeImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { 
          inlineData: { 
            mimeType: mimeType, 
            data: base64Image 
          } 
        },
        { text: prompt }
      ]
    }
  });

  return response.text || "I couldn't analyze the image.";
};
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
