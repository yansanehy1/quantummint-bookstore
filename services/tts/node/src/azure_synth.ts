import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';

/**
 * Synthesize speech using Azure Cognitive Services
 */
export async function azureSynthesizeToFile(
    ssml: string,
    outPath: string,
    voiceName: string = 'en-US-AndrewMultilingualNeural'
): Promise<{ durationMs: number }> {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.AZURE_SPEECH_KEY || '',
        process.env.AZURE_SPEECH_REGION || 'eastus'
    );
    
    // Set output format to 24khz Mono WAV for compatibility
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outPath);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
        synthesizer.speakSsmlAsync(
            ssml,
            (result) => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    const durationMs = Math.round(result.audioDuration / 10000); // Ticks to ms
                    synthesizer.close();
                    resolve({ durationMs });
                } else {
                    synthesizer.close();
                    reject(new Error(`Azure TTS failed: ${result.errorDetails}`));
                }
            },
            (err) => {
                synthesizer.close();
                reject(err);
            }
        );
    });
}
