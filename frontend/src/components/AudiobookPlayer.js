"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AudiobookPlayer;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const ttsService_1 = require("@/lib/ttsService");
function AudiobookPlayer({ sentences, bookTitle, onSentenceChange }) {
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [currentSentenceIndex, setCurrentSentenceIndex] = (0, react_1.useState)(0);
    const [playbackRate, setPlaybackRate] = (0, react_1.useState)(1.0);
    const [pitch, setPitch] = (0, react_1.useState)(1.0);
    const [volume, setVolume] = (0, react_1.useState)(1.0);
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    const [selectedVoice, setSelectedVoice] = (0, react_1.useState)("");
    const audioRef = (0, react_1.useRef)(null);
    const playbackIntervalRef = (0, react_1.useRef)(undefined);
    const currentSentence = sentences[currentSentenceIndex];
    const progress = sentences.length > 0 ? ((currentSentenceIndex + 1) / sentences.length) * 100 : 0;
    const availableVoices = ttsService_1.ttsService.isAvailable() ? ttsService_1.ttsService.getAvailableVoices() : [];
    (0, react_1.useEffect)(() => {
        return () => {
            if (playbackIntervalRef.current)
                clearInterval(playbackIntervalRef.current);
            ttsService_1.ttsService.stop();
        };
    }, []);
    const handlePlayPause = () => {
        if (isPlaying) {
            ttsService_1.ttsService.pause();
            setIsPlaying(false);
        }
        else {
            playSentence(currentSentenceIndex);
        }
    };
    const playSentence = (index) => {
        if (index < 0 || index >= sentences.length)
            return;
        setCurrentSentenceIndex(index);
        onSentenceChange?.(index);
        const sentence = sentences[index];
        const ttsOptions = {
            rate: playbackRate,
            pitch,
            volume,
            voice: selectedVoice || undefined,
            lang: "en-US",
        };
        ttsService_1.ttsService.speak(sentence.speechText, ttsOptions, () => {
            if (index + 1 < sentences.length) {
                playSentence(index + 1);
            }
            else {
                setIsPlaying(false);
            }
        }, () => {
            setIsPlaying(true);
        });
    };
    const handlePrevious = () => {
        const newIndex = Math.max(0, currentSentenceIndex - 1);
        ttsService_1.ttsService.stop();
        playSentence(newIndex);
    };
    const handleNext = () => {
        const newIndex = Math.min(sentences.length - 1, currentSentenceIndex + 1);
        ttsService_1.ttsService.stop();
        playSentence(newIndex);
    };
    const handlePlaybackRateChange = (e) => setPlaybackRate(parseFloat(e.target.value));
    const handlePitchChange = (e) => setPitch(parseFloat(e.target.value));
    const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
    return (<div className="w-full">
      <card_1.Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 mb-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 mb-1">{bookTitle}</h3>
          <p className="text-sm text-gray-600">Sentence {Math.min(currentSentenceIndex + 1, Math.max(1, sentences.length))} of {sentences.length || 1}</p>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-2 transition-all duration-300" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6 min-h-24">
          <p className="text-gray-700 text-lg leading-relaxed">{currentSentence?.text}</p>
          {currentSentence?.containsFormula && (<p className="text-sm text-blue-600 mt-3">📐 Contains formula: {currentSentence.formulas.map((f) => f.spoken).join(", ")}</p>)}
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button_1.Button onClick={handlePrevious} disabled={currentSentenceIndex === 0} variant="outline" size="sm">
            <lucide_react_1.SkipBack className="w-4 h-4"/>
          </button_1.Button>

          <button_1.Button onClick={handlePlayPause} className="bg-blue-600 hover:bg-blue-700 px-6">
            {isPlaying ? (<>
                <lucide_react_1.Pause className="w-5 h-5 mr-2"/>
                Pause
              </>) : (<>
                <lucide_react_1.Play className="w-5 h-5 mr-2"/>
                Play
              </>)}
          </button_1.Button>

          <button_1.Button onClick={handleNext} disabled={currentSentenceIndex === sentences.length - 1} variant="outline" size="sm">
            <lucide_react_1.SkipForward className="w-4 h-4"/>
          </button_1.Button>

          <button_1.Button onClick={() => setShowSettings(!showSettings)} variant="outline" size="sm">
            <lucide_react_1.Settings className="w-4 h-4"/>
          </button_1.Button>
        </div>

        {showSettings && (<card_1.Card className="p-4 bg-white border-2 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-4">Playback Settings</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="speed-range">Speed: {playbackRate.toFixed(1)}x</label>
                <input id="speed-range" aria-label="Playback speed" type="range" min="0.5" max="2" step="0.1" value={playbackRate} onChange={handlePlaybackRateChange} className="w-full"/>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pitch-range">Pitch: {pitch.toFixed(1)}</label>
                <input id="pitch-range" aria-label="Pitch" type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={handlePitchChange} className="w-full"/>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="volume-range">
                  <lucide_react_1.Volume2 className="w-4 h-4 inline mr-2"/>
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input id="volume-range" aria-label="Volume" type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-full"/>
              </div>

              {ttsService_1.ttsService.isAvailable() && availableVoices.length > 0 && (<div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="voice-select">Voice</label>
                  <select id="voice-select" aria-label="Voice selection" value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Default Voice</option>
                    {availableVoices.map((voice) => (<option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>))}
                  </select>
                </div>)}
            </div>
          </card_1.Card>)}
      </card_1.Card>

      <div>
        <h4 className="font-bold text-gray-900 mb-4">Sentences</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sentences.map((sentence, index) => (<card_1.Card key={sentence.id} onClick={() => playSentence(index)} className={`p-3 cursor-pointer transition ${index === currentSentenceIndex ? "bg-blue-100 border-2 border-blue-600" : "bg-white hover:bg-gray-50"}`}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-gray-600 min-w-6">{index + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{sentence.text}</p>
                  {sentence.containsFormula && (<p className="text-xs text-blue-600 mt-1">📐 {sentence.formulas.map((f) => f.spoken).join(", ")}</p>)}
                </div>
              </div>
            </card_1.Card>))}
        </div>
      </div>

      <audio ref={audioRef} className="hidden"/>
    </div>);
}
