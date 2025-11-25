"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AIAssistantsPage;
const react_1 = __importDefault(require("react"));
const tabs_1 = require("@/components/ui/tabs");
const MapsAgent_1 = __importDefault(require("../components/agents/MapsAgent"));
const VisionAgent_1 = __importDefault(require("../components/agents/VisionAgent"));
const lucide_react_1 = require("lucide-react");
function AIAssistantsPage() {
    return (<div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="bg-white border-b border-slate-200 py-6 px-4 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800">QuantumMint AI Hub</h1>
                    <p className="text-slate-500 mt-2">Specialized agents for navigation and visual analysis.</p>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
                <tabs_1.Tabs defaultValue="maps" className="h-[calc(100vh-200px)] flex flex-col">
                    <tabs_1.TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
                        <tabs_1.TabsTrigger value="maps" className="flex items-center gap-2">
                            <lucide_react_1.MapPin className="w-4 h-4"/> QuantumNav
                        </tabs_1.TabsTrigger>
                        <tabs_1.TabsTrigger value="vision" className="flex items-center gap-2">
                            <lucide_react_1.Sparkles className="w-4 h-4"/> Vision Agent
                        </tabs_1.TabsTrigger>
                    </tabs_1.TabsList>

                    <tabs_1.TabsContent value="maps" className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <MapsAgent_1.default />
                    </tabs_1.TabsContent>

                    <tabs_1.TabsContent value="vision" className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <VisionAgent_1.default />
                    </tabs_1.TabsContent>
                </tabs_1.Tabs>
            </div>
        </div>);
}
