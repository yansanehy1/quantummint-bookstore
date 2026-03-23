import * as React from 'react';
import { VoiceClone, VoiceRecording, VoiceUploadResponse } from '../types';
import { ttsService } from '../services/ttsService';


interface VoiceCloningProps {
    onVoiceCreated?: (voice: VoiceClone) => void;
}

export const VoiceCloning: React.FC<VoiceCloningProps> = ({ onVoiceCreated }) => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [recording, setRecording] = React.useState<VoiceRecording | null>(null);
    const [voiceName, setVoiceName] = React.useState('');
    const [voiceDescription, setVoiceDescription] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);

                audio.addEventListener('loadedmetadata', () => {
                    setRecording({
                        blob,
                        url,
                        duration: audio.duration,
                        sampleRate: 48000 // Default sample rate
                    });
                });

                stream.getTracks().forEach(track => track.stop());
                setAudioChunks([]);
            };

            setMediaRecorder(recorder);
            setAudioChunks(chunks);
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Failed to access microphone. Please check permissions.');
            console.error('Recording error:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                setError('File size must be less than 50MB');
                return;
            }

            if (!file.type.startsWith('audio/')) {
                setError('Please upload an audio file');
                return;
            }

            const url = URL.createObjectURL(file);
            const audio = new Audio(url);

            audio.addEventListener('loadedmetadata', () => {
                setRecording({
                    blob: file,
                    url,
                    duration: audio.duration,
                    sampleRate: 48000
                });
                setError(null);
            });
        }
    };

    const uploadVoice = async () => {
        if (!recording || !voiceName.trim()) {
            setError('Please provide a voice name and audio recording');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const response = await ttsService.uploadVoiceClone({
                name: voiceName,
                description: voiceDescription,
                audioBlob: recording.blob
            });

            const newVoice: VoiceClone = {
                id: response.voiceId,
                name: voiceName,
                description: voiceDescription,
                status: response.status,
                createdAt: new Date().toISOString(),
                creatorId: 'current_user',
                isDefault: false,
                trainingProgress: response.status === 'processing' ? 0 : 100
            };

            setSuccess(response.message || 'Voice clone submitted successfully!');
            onVoiceCreated?.(newVoice);

            // Reset form
            setVoiceName('');
            setVoiceDescription('');
            setRecording(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError('Failed to upload voice. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const resetRecording = () => {
        setRecording(null);
        setError(null);
        setSuccess(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Voice Clone</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voice Name *
                    </label>
                    <input
                        type="text"
                        value={voiceName}
                        onChange={(e) => setVoiceName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., My Professional Voice"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optional)
                    </label>
                    <textarea
                        value={voiceDescription}
                        onChange={(e) => setVoiceDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Describe the voice characteristics..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audio Source *
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recording Option */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-800 mb-3">Record Voice</h3>
                            <div className="space-y-3">
                                {!isRecording ? (
                                    <button
                                        onClick={startRecording}
                                        className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <circle cx="10" cy="10" r="8" />
                                        </svg>
                                        Start Recording
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopRecording}
                                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <rect x="6" y="6" width="8" height="8" />
                                        </svg>
                                        Stop Recording
                                    </button>
                                )}
                                <p className="text-xs text-gray-500">
                                    Record 30-60 seconds of clear speech for best results
                                </p>
                            </div>
                        </div>

                        {/* Upload Option */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-800 mb-3">Upload Audio File</h3>
                            <div className="space-y-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="audio-upload"
                                />
                                <label
                                    htmlFor="audio-upload"
                                    className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-center cursor-pointer"
                                >
                                    Choose File
                                </label>
                                <p className="text-xs text-gray-500">
                                    MP3, WAV, or M4A (max 50MB)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio Preview */}
                {recording && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-800">Audio Preview</h3>
                            <button
                                onClick={resetRecording}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Remove
                            </button>
                        </div>
                        <audio controls className="w-full" src={recording.url}>
                            Your browser does not support the audio element.
                        </audio>
                        <p className="text-xs text-gray-500 mt-2">
                            Duration: {Math.round(recording.duration)}s
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={uploadVoice}
                    disabled={!recording || !voiceName.trim() || isUploading}
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Processing...' : 'Create Voice Clone'}
                </button>
            </div>
        </div>
    );
};
