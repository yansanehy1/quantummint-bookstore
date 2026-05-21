import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { VoiceClone, VoiceRecording } from '../types';
import { ttsService } from '../services/ttsService';
import { Mic, Upload, StopCircle, CheckCircle, AlertCircle, Loader2, Music, Save, Trash2, Play, Pause, Sparkles, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface VoiceCloningProps {
    onVoiceCreated?: (voice: VoiceClone) => void;
}

export const VoiceCloning: React.FC<VoiceCloningProps> = ({ onVoiceCreated }) => {
    const { data: existingVoices, refetch: refetchVoices } = useQuery({
        queryKey: ['seller', 'voices'],
        queryFn: () => api.seller.getVoices()
    });

    const [isRecording, setIsRecording] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [recording, setRecording] = React.useState<VoiceRecording | null>(null);
    const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);
    const [voiceName, setVoiceName] = React.useState('');
    const [voiceDescription, setVoiceDescription] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);
    const [isPlayingPreview, setIsPlayingPreview] = React.useState(false);
    const audioPreviewRef = React.useRef<HTMLAudioElement | null>(null);
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
            refetchVoices();

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
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Voice Cloning Studio</h2>
                    <p className="text-slate-500 font-medium">Create a digital twin of your voice for personalized student learning.</p>
                </div>
                <div className="bg-quantum-50 p-3 rounded-2xl text-quantum-600">
                    <Mic size={32} />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} />
                    <span className="text-sm font-bold">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle size={20} />
                    <span className="text-sm font-bold">{success}</span>
                </div>
            )}

            {/* Existing Voices Section */}
            {existingVoices && existingVoices.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Your Cloned Voices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {existingVoices.map((voice) => (
                            <Card key={voice.id} className="p-4 bg-white border-slate-100 hover:border-quantum-200 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-quantum-50 flex items-center justify-center text-quantum-600">
                                            <Mic size={16} />
                                        </div>
                                        <span className="font-bold text-slate-900">{voice.name}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                        voice.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {voice.status}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">{voice.description || 'No description'}</p>
                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                                    <span>Created {new Date(voice.createdAt).toLocaleDateString()}</span>
                                    {voice.status === 'ready' && (
                                        <button className="text-quantum-600 hover:text-quantum-700 flex items-center gap-1">
                                            <Play size={10} /> Test
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <Card className="lg:col-span-2 p-8 bg-white shadow-xl rounded-3xl border-slate-200">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                Voice Identity
                            </label>
                            <input
                                type="text"
                                value={voiceName}
                                onChange={(e) => setVoiceName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-quantum-500 font-bold text-slate-700 placeholder-slate-300 transition-all"
                                placeholder="e.g., Professor Ibrahim - Physics"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                Voice Characteristics
                            </label>
                            <textarea
                                value={voiceDescription}
                                onChange={(e) => setVoiceDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-quantum-500 font-medium text-slate-600 placeholder-slate-300 transition-all"
                                rows={3}
                                placeholder="e.g., Calm, professional, and clear. Ideal for complex STEM derivations."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                Training Source
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Recording Option */}
                                <div className={`relative overflow-hidden rounded-2xl border-2 transition-all p-6 ${isRecording ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 hover:border-quantum-200'}`}>
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className={`p-4 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-400 shadow-sm'}`}>
                                            <Mic size={24} />
                                        </div>
                                        <div>
                                            <h3 className={`font-black text-sm ${isRecording ? 'text-red-700' : 'text-slate-700'}`}>
                                                {isRecording ? 'Recording Live...' : 'Record Samples'}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">30-60 seconds</p>
                                        </div>
                                        <Button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            variant={isRecording ? 'secondary' : 'primary'}
                                            className="w-full rounded-xl py-6"
                                        >
                                            {isRecording ? <StopCircle size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
                                            {isRecording ? 'Stop' : 'Start'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Upload Option */}
                                <div className="relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-quantum-200 transition-all p-6">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="p-4 rounded-full bg-white text-slate-400 shadow-sm">
                                            <Upload size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm text-slate-700">Upload File</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">MP3, WAV, WEBM</p>
                                        </div>
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
                                            className="w-full bg-quantum-600 text-white px-4 py-2.5 rounded-xl hover:bg-quantum-700 transition-all text-sm font-bold cursor-pointer shadow-md shadow-quantum-200"
                                        >
                                            Choose File
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Preview & Action Panel */}
                <div className="space-y-6">
                    <Card className="p-6 bg-slate-900 text-white rounded-3xl border-none shadow-2xl">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sample Preview</h3>
                        
                        {recording ? (
                            <div className="space-y-4">
                                <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Music className="text-quantum-400" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-white">Captured Sample</p>
                                            <p className="text-[10px] text-slate-400">{recording.duration.toFixed(1)}s • Clear Fidelity</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={togglePreview}
                                        className="w-10 h-10 rounded-full bg-quantum-500 flex items-center justify-center hover:bg-quantum-400 transition-all shadow-lg shadow-quantum-500/20"
                                    >
                                        {isPlayingPreview ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-1" />}
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={resetRecording}
                                        className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={14} /> Discard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-30">
                                <Music size={48} />
                                <p className="text-xs font-medium">No audio sample<br />ready for cloning</p>
                            </div>
                        )}
                    </Card>

                    <Button
                        onClick={uploadVoice}
                        isLoading={isUploading}
                        disabled={!recording || !voiceName.trim()}
                        className="w-full py-8 rounded-3xl shadow-xl shadow-quantum-200 flex flex-col gap-1"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles size={20} />
                            <span className="text-lg font-black">Begin Cloning</span>
                        </div>
                        <span className="text-[10px] opacity-70 uppercase font-black tracking-widest">Starts AI Training</span>
                    </Button>

                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                        <div className="flex gap-3">
                            <Info className="text-amber-600 shrink-0" size={18} />
                            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                <span className="font-black block mb-1 uppercase">Cloning Notice</span>
                                Your voice samples are encrypted and used only for training your personal model. Training usually takes 10-15 minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
