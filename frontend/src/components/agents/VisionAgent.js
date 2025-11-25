"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const geminiService_1 = require("../../services/geminiService");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const VisionAgent = () => {
    const [image, setImage] = (0, react_1.useState)(null);
    const [prompt, setPrompt] = (0, react_1.useState)('');
    const [result, setResult] = (0, react_1.useState)('');
    const [isAnalyzing, setIsAnalyzing] = (0, react_1.useState)(false);
    const fileInputRef = (0, react_1.useRef)(null);
    const videoRef = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const [showCamera, setShowCamera] = (0, react_1.useState)(false);
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setShowCamera(false);
            };
            reader.readAsDataURL(file);
        }
    };
    const startCamera = async () => {
        setShowCamera(true);
        setImage(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }
        catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera");
            setShowCamera(false);
        }
    };
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setImage(dataUrl);
                // Stop stream
                const stream = videoRef.current.srcObject;
                stream?.getTracks().forEach(track => track.stop());
                setShowCamera(false);
            }
        }
    };
    const handleAnalyze = async () => {
        if (!image)
            return;
        setIsAnalyzing(true);
        setResult('');
        // Extract base64 data and mime type
        const mimeType = image.split(';')[0].split(':')[1];
        const base64Data = image.split(',')[1];
        const userPrompt = prompt || "Analyze this image in detail. Identify text, data, or key objects.";
        try {
            const text = await (0, geminiService_1.analyzeImage)(base64Data, mimeType, userPrompt);
            setResult(text);
        }
        catch (e) {
            setResult("Error analyzing image. Please try again.");
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    return (<div className="h-full bg-slate-50 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                        <lucide_react_1.Sparkles className="text-indigo-600"/>
                        Visual Intelligence Agent
                    </h1>
                    <p className="text-slate-500">Upload charts, receipts, menus, or photos for instant AI analysis.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    {/* Image Input Area */}
                    <div className="mb-6">
                        {!image && !showCamera ? (<div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                                <lucide_react_1.Image className="w-16 h-16 mb-4 text-slate-300"/>
                                <div className="flex gap-4">
                                    <button_1.Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                        <lucide_react_1.Upload className="w-4 h-4 mr-2"/> Upload File
                                    </button_1.Button>
                                    <button_1.Button variant="outline" onClick={startCamera}>
                                        <lucide_react_1.Camera className="w-4 h-4 mr-2"/> Take Photo
                                    </button_1.Button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}/>
                            </div>) : showCamera ? (<div className="relative rounded-xl overflow-hidden bg-black">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-auto"/>
                                <canvas ref={canvasRef} className="hidden"/>
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                    <button_1.Button variant="outline" onClick={() => {
                const stream = videoRef.current?.srcObject;
                stream?.getTracks().forEach(track => track.stop());
                setShowCamera(false);
            }}>Cancel</button_1.Button>
                                    <button onClick={capturePhoto} className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 hover:border-indigo-500 transition-colors"/>
                                </div>
                            </div>) : (<div className="relative rounded-xl overflow-hidden bg-slate-900 flex justify-center">
                                <img src={image} alt="To analyze" className="max-h-96 object-contain"/>
                                <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full">
                                    <lucide_react_1.X size={20}/>
                                </button>
                            </div>)}
                    </div>

                    {/* Analysis Controls */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">What should I look for?</label>
                            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'Summarize the nutritional info', 'Extract the total from this receipt', 'Explain this chart'..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24 resize-none"/>
                        </div>
                        <button_1.Button onClick={handleAnalyze} disabled={!image || isAnalyzing} className="w-full">
                            <lucide_react_1.Sparkles className="w-4 h-4 mr-2"/>
                            {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                        </button_1.Button>
                    </div>
                </div>

                {/* Results Area */}
                {result && (<div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 animate-fade-in">
                        <h3 className="font-bold text-lg text-slate-800 mb-3 border-b border-slate-100 pb-2">Analysis Result</h3>
                        <div className="prose prose-slate max-w-none text-slate-700">
                            <p className="whitespace-pre-wrap">{result}</p>
                        </div>
                    </div>)}
            </div>
        </div>);
};
exports.default = VisionAgent;
