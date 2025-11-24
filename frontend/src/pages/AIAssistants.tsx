import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MapsAgent from '../components/agents/MapsAgent';
import VisionAgent from '../components/agents/VisionAgent';
import { MapPin, Sparkles } from 'lucide-react';

export default function AIAssistantsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="bg-white border-b border-slate-200 py-6 px-4 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800">QuantumMint AI Hub</h1>
                    <p className="text-slate-500 mt-2">Specialized agents for navigation and visual analysis.</p>
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
                <Tabs defaultValue="maps" className="h-[calc(100vh-200px)] flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
                        <TabsTrigger value="maps" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> QuantumNav
                        </TabsTrigger>
                        <TabsTrigger value="vision" className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Vision Agent
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="maps" className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <MapsAgent />
                    </TabsContent>

                    <TabsContent value="vision" className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <VisionAgent />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
