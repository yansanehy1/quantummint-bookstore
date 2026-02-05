import { GoogleGenAI, Type } from "@google/genai";
import { SyncPoint, SegmentType, GroundingChunk } from "../types";

const getGeminiApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Set VITE_GEMINI_API_KEY in your environment.");
  }
  return apiKey;
};

export const generateEducationalContent = async (rawText: string): Promise<SyncPoint[]> => {
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

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
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

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
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });
  
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
  const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

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

