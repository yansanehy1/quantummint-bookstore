import * as React from 'react';
const { useState } = React;

type Cue = { type: 'visual' | 'formula' | 'step'; atMs: number; payload: any };

export function CueTimelineEditor({
    onSave,
    audioDuration = 10000
}: {
    onSave: (cues: Cue[]) => void;
    audioDuration?: number;
}) {
    const [cues, setCues] = useState<Cue[]>([]);
    const [selectedType, setSelectedType] = useState<Cue['type']>('formula');
    const [timestamp, setTimestamp] = useState(0);
    const [payload, setPayload] = useState('');

    function addCue() {
        const newCue: Cue = {
            type: selectedType,
            atMs: timestamp,
            payload: selectedType === 'step' ? payload.split(',').map(s => s.trim()) : payload
        };
        setCues([...cues, newCue].sort((a, b) => a.atMs - b.atMs));
        setPayload('');
    }

    function removeCue(index: number) {
        setCues(cues.filter((_, i) => i !== index));
    }

    return (
        <div className="p-6 border rounded-lg bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-4">Cue Timeline Editor</h2>

            {/* Add Cue Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
                <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as Cue['type'])}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="formula">Formula</option>
                            <option value="visual">Visual</option>
                            <option value="step">Steps</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Time (ms) - Max: {audioDuration}
                        </label>
                        <input
                            type="number"
                            value={timestamp}
                            onChange={(e) => setTimestamp(Number(e.target.value))}
                            min={0}
                            max={audioDuration}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Payload {selectedType === 'step' && '(comma-separated)'}
                        </label>
                        <input
                            type="text"
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            placeholder={
                                selectedType === 'formula' ? 'E = mc^2' :
                                    selectedType === 'visual' ? 'image.png' :
                                        'Step 1, Step 2, Step 3'
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <button
                    onClick={addCue}
                    disabled={!payload}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
                >
                    + Add Cue
                </button>
            </div>

            {/* Timeline Visualization */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Timeline ({cues.length} cues)</h3>
                <div className="relative h-16 bg-gray-100 rounded border">
                    {cues.map((cue, i) => {
                        const left = (cue.atMs / audioDuration) * 100;
                        const colors = { formula: 'bg-purple-500', visual: 'bg-green-500', step: 'bg-blue-500' };
                        return (
                            <div
                                key={i}
                                className={`absolute top-2 w-2 h-12 ${colors[cue.type]} cursor-pointer`}
                                style={{ left: `${left}%` }}
                                title={`${cue.type} @ ${cue.atMs}ms`}
                                onClick={() => removeCue(i)}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0ms</span>
                    <span>{audioDuration}ms</span>
                </div>
            </div>

            {/* Cue List */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Cues</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cues.map((cue, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                            <div className="flex-1">
                                <span className="font-medium capitalize">{cue.type}</span>
                                <span className="text-gray-600 mx-2">@</span>
                                <span className="text-blue-600">{cue.atMs}ms</span>
                                <span className="text-gray-400 mx-2">→</span>
                                <span className="text-sm">{JSON.stringify(cue.payload)}</span>
                            </div>
                            <button
                                onClick={() => removeCue(i)}
                                className="text-red-600 hover:text-red-800 px-3 py-1"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={() => onSave(cues)}
                disabled={cues.length === 0}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300"
            >
                Save Cue Map ({cues.length} cues)
            </button>
        </div>
    );
}
