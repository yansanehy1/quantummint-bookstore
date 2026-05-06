import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Eye, BookOpen } from 'lucide-react';
import { useEducationalSync } from '../hooks/useEducationalSync';

interface MediaSyncPlayerProps {
  bookId: string;
  audioUrl: string;
  token: string;
  onProgress?: (progress: number) => void;
  onCueTrigger?: (cue: any) => void;
}

interface MediaCue {
  id: number;
  timestamp_ms: number;
  cue_type: 'visual' | 'formula' | 'step' | 'highlight';
  content: string;
  metadata?: any;
}

export const MediaSyncPlayer: React.FC<MediaSyncPlayerProps> = ({
  bookId,
  audioUrl,
  token,
  onProgress,
  onCueTrigger
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeCues, setActiveCues] = useState<MediaCue[]>([]);
  const [currentCue, setCurrentCue] = useState<MediaCue | null>(null);

  const {
    cues,
    currentCue: syncCue,
    isConnected,
    progress,
    updateProgress,
    triggerCue,
    joinBook,
    leaveBook
  } = useEducationalSync(token);

  // Initialize audio player
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      
      // Calculate progress percentage
      const progressPercent = duration > 0 ? (time / duration) * 100 : 0;
      onProgress?.(progressPercent);

      // Check for media cues at current timestamp
      const currentMs = Math.floor(time * 1000);
      const activeCuesAtTime = cues.filter(
        cue => Math.abs(cue.timestamp_ms - currentMs) < 500 // Within 500ms tolerance
      );
      
      setActiveCues(activeCuesAtTime);
      
      // Set the most relevant cue
      if (activeCuesAtTime.length > 0) {
        const primaryCue = activeCuesAtTime[0];
        setCurrentCue(primaryCue);
        onCueTrigger?.(primaryCue);
        triggerCue(primaryCue.id);
      }

      // Auto-update progress every 5 seconds
      if (Math.floor(time) % 5 === 0 && Math.floor(time) !== Math.floor(currentTime)) {
        updateProgress(
          bookId,
          1, // Default page ID - should be tracked separately
          currentMs,
          progressPercent,
          Math.floor(time) // Time spent in seconds
        );
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Mark as completed
      updateProgress(bookId, 1, audio.duration * 1000, 100, Math.floor(audio.duration));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [cues, duration, onProgress, onCueTrigger, triggerCue, updateProgress, bookId, currentTime]);

  // Join book room when component mounts
  useEffect(() => {
    joinBook(bookId);
    return () => {
      leaveBook(bookId);
    };
  }, [bookId, joinBook, leaveBook]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
    const audio = audioRef.current;
    if (!audio) return;

    const skipTime = 10; // 10 seconds
    if (direction === 'forward') {
      audio.currentTime = Math.min(audio.currentTime + skipTime, duration);
    } else {
      audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(event.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Media Player</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        className="hidden"
      />

      {/* Current Cue Display */}
      {currentCue && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            {currentCue.cue_type === 'visual' && <Eye className="w-4 h-4 text-blue-600" />}
            {currentCue.cue_type === 'formula' && <BookOpen className="w-4 h-4 text-blue-600" />}
            {currentCue.cue_type === 'step' && <SkipForward className="w-4 h-4 text-blue-600" />}
            <span className="text-sm font-medium text-blue-900 capitalize">
              {currentCue.cue_type} Cue
            </span>
          </div>
          <p className="text-sm text-gray-700">{currentCue.content}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 font-mono">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={duration > 0 ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 font-mono">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={() => handleSkip('backward')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlay}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6" fill="currentColor" />
          )}
        </button>

        <button
          onClick={() => handleSkip('forward')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center justify-between">
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Playback Speed */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Speed:</span>
          <select
            value={playbackRate}
            onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>

      {/* Active Cues List */}
      {activeCues.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Active Cues</h4>
          <div className="space-y-1">
            {activeCues.map((cue) => (
              <div
                key={cue.id}
                className="text-xs text-gray-600 p-2 bg-gray-50 rounded"
              >
                <span className="font-medium capitalize">{cue.cue_type}:</span> {cue.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
