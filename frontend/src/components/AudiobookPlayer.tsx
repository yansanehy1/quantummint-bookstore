import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings } from "lucide-react";
import { ProcessedSentence } from "@/lib/textProcessor";
import { ttsService, TTSOptions } from "@/lib/ttsService";

interface AudiobookPlayerProps {
  sentences: ProcessedSentence[];
  bookTitle: string;
  onSentenceChange?: (sentenceIndex: number) => void;
}

export default function AudiobookPlayer({ sentences, bookTitle, onSentenceChange }: AudiobookPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const currentSentence = sentences[currentSentenceIndex];
  const progress = sentences.length > 0 ? ((currentSentenceIndex + 1) / sentences.length) * 100 : 0;

  const availableVoices = ttsService.isAvailable() ? ttsService.getAvailableVoices() : [];

  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
      ttsService.stop();
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      ttsService.pause();
      setIsPlaying(false);
    } else {
      playSentence(currentSentenceIndex);
    }
  };

  const playSentence = (index: number) => {
    if (index < 0 || index >= sentences.length) return;

    setCurrentSentenceIndex(index);
    onSentenceChange?.(index);

    const sentence = sentences[index];
    const ttsOptions: TTSOptions = {
      rate: playbackRate,
      pitch,
      volume,
      voice: selectedVoice || undefined,
      lang: "en-US",
    };

    ttsService.speak(
      sentence.speechText,
      ttsOptions,
      () => {
        if (index + 1 < sentences.length) {
          playSentence(index + 1);
        } else {
          setIsPlaying(false);
        }
      },
      () => {
        setIsPlaying(true);
      }
    );
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentSentenceIndex - 1);
    ttsService.stop();
    playSentence(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(sentences.length - 1, currentSentenceIndex + 1);
    ttsService.stop();
    playSentence(newIndex);
  };

  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLInputElement>) => setPlaybackRate(parseFloat(e.target.value));
  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => setPitch(parseFloat(e.target.value));
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value));

  return (
    <div className="w-full">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 mb-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 mb-1">{bookTitle}</h3>
          <p className="text-sm text-gray-600">Sentence {Math.min(currentSentenceIndex + 1, Math.max(1, sentences.length))} of {sentences.length || 1}</p>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-2 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6 min-h-24">
          <p className="text-gray-700 text-lg leading-relaxed">{currentSentence?.text}</p>
          {currentSentence?.containsFormula && (
            <p className="text-sm text-blue-600 mt-3">📐 Contains formula: {currentSentence.formulas.map((f: { spoken: string }) => f.spoken).join(", ")}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <Button onClick={handlePrevious} disabled={currentSentenceIndex === 0} variant="outline" size="sm">
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button onClick={handlePlayPause} className="bg-blue-600 hover:bg-blue-700 px-6">
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Play
              </>
            )}
          </Button>

          <Button onClick={handleNext} disabled={currentSentenceIndex === sentences.length - 1} variant="outline" size="sm">
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {showSettings && (
          <Card className="p-4 bg-white border-2 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-4">Playback Settings</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="speed-range">Speed: {playbackRate.toFixed(1)}x</label>
                <input id="speed-range" aria-label="Playback speed" type="range" min="0.5" max="2" step="0.1" value={playbackRate} onChange={handlePlaybackRateChange} className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pitch-range">Pitch: {pitch.toFixed(1)}</label>
                <input id="pitch-range" aria-label="Pitch" type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={handlePitchChange} className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="volume-range">
                  <Volume2 className="w-4 h-4 inline mr-2" />
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input id="volume-range" aria-label="Volume" type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-full" />
              </div>

              {ttsService.isAvailable() && availableVoices.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="voice-select">Voice</label>
                  <select id="voice-select" aria-label="Voice selection" value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Default Voice</option>
                    {availableVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>
        )}
      </Card>

      <div>
        <h4 className="font-bold text-gray-900 mb-4">Sentences</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sentences.map((sentence, index) => (
            <Card
              key={sentence.id}
              onClick={() => playSentence(index)}
              className={`p-3 cursor-pointer transition ${index === currentSentenceIndex ? "bg-blue-100 border-2 border-blue-600" : "bg-white hover:bg-gray-50"}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-gray-600 min-w-6">{index + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{sentence.text}</p>
                  {sentence.containsFormula && (
                    <p className="text-xs text-blue-600 mt-1">📐 {sentence.formulas.map((f: { spoken: string }) => f.spoken).join(", ")}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
