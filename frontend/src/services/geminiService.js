"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = exports.queryMapsAgent = exports.generateAudio = exports.generateEducationalContent = exports.setGeminiApiKey = void 0;
let API_KEY = '';
const setGeminiApiKey = (key) => {
    API_KEY = key;
};
exports.setGeminiApiKey = setGeminiApiKey;
const pcmToWav = (pcm) => {
    const sampleRate = 24000;
    const numChannels = 1;
    const bitDepth = 16;
    const buffer = new ArrayBuffer(44 + pcm.length * 2);
    const view = new DataView(buffer);
    const writeString = (v, o, s) => {
        for (let i = 0; i < s.length; i++)
            v.setUint8(o + i, s.charCodeAt(i));
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
    for (let i = 0; i < pcm.length; i++) {
        view.setInt16(44 + (i * 2), pcm[i], true);
    }
    return new Blob([buffer], { type: 'audio/wav' });
};
const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok)
                return response;
            const isRetryable = response.status === 429 || response.status >= 500;
            if (isRetryable && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            const errorBody = await response.text();
            throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorBody.substring(0, 200)}`);
        }
        catch (error) {
            if (i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw new Error("API call failed after all retries.");
};
const generateEducationalContent = async (text) => {
    if (!API_KEY)
        throw new Error("API Key not set");
    const prompt = `
    Act as an expert content analyzer. Analyze the following text and break it down into segments for an audiobook.
    Return a JSON array of objects with these fields:
    - "text": The text to be spoken.
    - "type": "text" (default), "heading", or "note".
    - "visualDescription": A short description for image generation.
    
    Text: "${text}"
    
    JSON Format: [{"text": "...", "type": "...", "visualDescription": "..."}]
  `;
    const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });
    const json = await response.json();
    let dataText = json.candidates[0].content.parts[0].text.trim();
    if (dataText.startsWith('```json')) {
        dataText = dataText.substring(7, dataText.lastIndexOf('```')).trim();
    }
    else if (dataText.startsWith('```')) {
        dataText = dataText.substring(3, dataText.lastIndexOf('```')).trim();
    }
    const segments = JSON.parse(dataText);
    return segments.map((s, idx) => ({
        id: `seg-${Date.now()}-${idx}`,
        text: s.text,
        type: s.type || 'text',
        visualDescription: s.visualDescription
    }));
};
exports.generateEducationalContent = generateEducationalContent;
const generateAudio = async (text, voiceName) => {
    if (!API_KEY)
        throw new Error("API Key not set");
    const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
            }
        })
    });
    const json = await response.json();
    const audioB64 = json.candidates[0].content.parts[0].inlineData.data;
    const bin = atob(audioB64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++)
        bytes[i] = bin.charCodeAt(i);
    const pcm = new Int16Array(bytes.buffer);
    const wav = pcmToWav(pcm);
    return URL.createObjectURL(wav);
};
exports.generateAudio = generateAudio;
const queryMapsAgent = async (query, lat, lng) => {
    if (!API_KEY)
        throw new Error("API Key not set");
    const tools = [{ google_search_retrieval: { dynamic_retrieval_config: { mode: "MODE_DYNAMIC", dynamic_threshold: 0.3 } } }];
    // If location is available, we could potentially pass it in the prompt or context, 
    // but standard Gemini API grounding handles location via the query context usually.
    // For this implementation, we'll append it to the query for better relevance.
    const locationContext = lat && lng ? ` (User location: ${lat}, ${lng})` : '';
    const finalQuery = `${query}${locationContext}`;
    const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: finalQuery }] }],
            tools: tools,
            generationConfig: { temperature: 0.7 }
        })
    });
    const json = await response.json();
    const candidate = json.candidates?.[0];
    if (!candidate)
        throw new Error("No response from Maps Agent");
    const text = candidate.content.parts.map((p) => p.text).join('') || "I found some information.";
    // Extract grounding chunks if available
    const chunks = candidate.groundingMetadata?.groundingChunks || [];
    return { text, chunks };
};
exports.queryMapsAgent = queryMapsAgent;
const analyzeImage = async (base64Image, mimeType, prompt) => {
    if (!API_KEY)
        throw new Error("API Key not set");
    const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: mimeType, data: base64Image } }
                    ]
                }]
        })
    });
    const json = await response.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "Could not analyze image.";
};
exports.analyzeImage = analyzeImage;
