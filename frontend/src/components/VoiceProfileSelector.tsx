import * as React from 'react';
import { VoiceProfile, FREE_VOICE_PROFILES } from '../types';

interface VoiceProfileSelectorProps {
    selectedVoiceId?: string;
    onVoiceSelect: (voice: VoiceProfile) => void;
    showPremium?: boolean;
    filterStyle?: string;
    filterGender?: string;
    compact?: boolean;
}

export const VoiceProfileSelector: React.FC<VoiceProfileSelectorProps> = ({
    selectedVoiceId,
    onVoiceSelect,
    showPremium = false,
    filterStyle,
    filterGender,
    compact = false
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isPlaying, setIsPlaying] = React.useState<string | null>(null);

    const filteredVoices = React.useMemo(() => {
        let voices = showPremium 
            ? [...FREE_VOICE_PROFILES] // In real app, include premium voices too
            : FREE_VOICE_PROFILES.filter(voice => !voice.isPremium);

        if (searchTerm) {
            voices = voices.filter(voice =>
                voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voice.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (filterStyle) {
            voices = voices.filter(voice => voice.style === filterStyle);
        }

        if (filterGender) {
            voices = voices.filter(voice => voice.gender === filterGender);
        }

        return voices;
    }, [searchTerm, filterStyle, filterGender, showPremium]);

    const handlePlaySample = (voiceId: string) => {
        if (isPlaying === voiceId) {
            // Stop playing
            const audio = document.querySelector(`#audio-${voiceId}`) as HTMLAudioElement;
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            setIsPlaying(null);
        } else {
            // Stop any currently playing audio
            if (isPlaying) {
                const currentAudio = document.querySelector(`#audio-${isPlaying}`) as HTMLAudioElement;
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
            }

            // Play new audio
            const audio = document.querySelector(`#audio-${voiceId}`) as HTMLAudioElement;
            if (audio) {
                audio.play();
                setIsPlaying(voiceId);
                
                audio.onended = () => {
                    setIsPlaying(null);
                };
            }
        }
    };

    const getGenderIcon = (gender: string) => {
        switch (gender) {
            case 'male': return '👨';
            case 'female': return '👩';
            case 'neutral': return '🎭';
            default: return '🎭';
        }
    };

    const getStyleIcon = (style: string) => {
        switch (style) {
            case 'narrative': return '📚';
            case 'conversational': return '💬';
            case 'professional': return '💼';
            case 'casual': return '😊';
            case 'dramatic': return '🎭';
            default: return '🎤';
        }
    };

    if (compact) {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Voice
                </label>
                <select
                    value={selectedVoiceId || ''}
                    onChange={(e) => {
                        const voice = filteredVoices.find(v => v.id === e.target.value);
                        if (voice) onVoiceSelect(voice);
                    }}
                    aria-label="Select voice profile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Choose a voice...</option>
                    {filteredVoices.map(voice => (
                        <option key={voice.id} value={voice.id}>
                            {voice.name} - {voice.gender} • {voice.style}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Choose Voice Profile
                </h2>
                
                {/* Search */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search voices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm text-gray-600">Styles:</span>
                    {['narrative', 'conversational', 'professional', 'casual', 'dramatic'].map(style => (
                        <button
                            key={style}
                            onClick={() => setSearchTerm(filterStyle === style ? '' : style)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                filterStyle === style
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {getStyleIcon(style)} {style}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Gender:</span>
                    {['male', 'female', 'neutral'].map(gender => (
                        <button
                            key={gender}
                            onClick={() => setSearchTerm(filterGender === gender ? '' : gender)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                filterGender === gender
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {getGenderIcon(gender)} {gender}
                        </button>
                    ))}
                </div>
            </div>

            {/* Voice List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredVoices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No voices found matching your criteria.
                    </div>
                ) : (
                    filteredVoices.map(voice => (
                        <div
                            key={voice.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedVoiceId === voice.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => onVoiceSelect(voice)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900">{voice.name}</h3>
                                        <span className="text-lg">{getGenderIcon(voice.gender)}</span>
                                        <span className="text-lg">{getStyleIcon(voice.style)}</span>
                                        {!voice.isPremium && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">{voice.description}</p>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{voice.language} • {voice.accent}</span>
                                        <span>•</span>
                                        <span>⭐ {voice.rating}</span>
                                        <span>•</span>
                                        <span>{voice.usageCount.toLocaleString()} uses</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {voice.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="ml-4 flex flex-col items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlaySample(voice.id);
                                        }}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                    >
                                        {isPlaying === voice.id ? '⏸️' : '▶️'}
                                    </button>
                                    <span className="text-xs text-gray-500">Sample</span>
                                </div>
                            </div>

                            {/* Hidden audio element */}
                            <audio
                                id={`audio-${voice.id}`}
                                src={voice.sampleAudioUrl}
                                preload="none"
                            />

                            {selectedVoiceId === voice.id && (
                                <div className="mt-3 pt-3 border-t border-blue-200">
                                    <span className="text-sm font-medium text-blue-700">✓ Selected</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
