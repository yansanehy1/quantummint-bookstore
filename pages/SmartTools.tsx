import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { createAIClient } from '@/web-frontend/src/services/aiService';
import { Upload, ScanLine, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

type ToolType = 'chart' | 'receipt' | 'translation';

export const SmartTools: React.FC = () => {
   const [activeTool, setActiveTool] = useState<ToolType>('chart');
   const [image, setImage] = useState<string | null>(null);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [result, setResult] = useState<string>('');

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setImage(reader.result as string);
            setResult('');
         };
         reader.readAsDataURL(file);
      }
   };

   const analyzeImage = async () => {
      if (!image) return;
      setIsAnalyzing(true);
      setResult('');

      try {
         // Clean base64 string
         const base64Data = image.split(',')[1];
         const mimeType = image.split(';')[0].split(':')[1];

         const ai = createAIClient();

         let prompt = "";
         if (activeTool === 'chart') {
            prompt = "Analyze this educational chart or diagram. Explain the key concepts, data trends, and relationships shown in detail.";
         } else if (activeTool === 'receipt') {
            prompt = "Extract the merchant name, date, total amount, and list of items from this receipt. Format it as a clear summary.";
         } else {
            prompt = "Translate any text in this image to English and summarize the visual context.";
         }

         const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
               parts: [
                  { inlineData: { mimeType, data: base64Data } },
                  { text: prompt }
               ]
            }
         });

         setResult(response.text || "No analysis returned.");
      } catch (error) {
         console.error(error);
         setResult("Error analyzing image. Please try again.");
      } finally {
         setIsAnalyzing(false);
      }
   };

   return (
      <div className="p-8 max-w-6xl mx-auto min-h-full">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Smart Tools</h1>
            <p className="text-slate-500">Use AI vision to understand your world. Analyze charts, scan receipts, or translate text instantly.</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tool Selection */}
            <div className="space-y-4">
               <ToolOption
                  active={activeTool === 'chart'}
                  onClick={() => { setActiveTool('chart'); setResult(''); setImage(null); }}
                  icon={<ScanLine size={24} />}
                  title="Chart & Diagram Analyst"
                  desc="Understand complex visuals in your textbooks."
               />
               <ToolOption
                  active={activeTool === 'receipt'}
                  onClick={() => { setActiveTool('receipt'); setResult(''); setImage(null); }}
                  icon={<FileText size={24} />}
                  title="Receipt Scanner"
                  desc="Digitize expenses and receipts for your wallet."
               />
            </div>

            {/* Workspace */}
            <div className="lg:col-span-2 space-y-6">
               <Card className="min-h-[500px] flex flex-col">
                  <CardHeader className="border-b border-slate-100 flex justify-between items-center">
                     <CardTitle>{activeTool === 'chart' ? 'Study Helper' : 'Scanner'}</CardTitle>
                     {image && <Button variant="ghost" size="sm" onClick={() => { setImage(null); setResult('') }}>Clear</Button>}
                  </CardHeader>
                  <CardContent className="flex-1 p-6 flex flex-col">
                     {!image ? (
                        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 transition-colors">
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="img-upload" />
                           <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center">
                              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                 <Upload size={32} />
                              </div>
                              <span className="font-bold text-slate-700">Click to upload an image</span>
                              <span className="text-sm text-slate-400 mt-1">Supports JPG, PNG</span>
                           </label>
                        </div>
                     ) : (
                        <div className="flex flex-col gap-6 h-full">
                           <div className="h-64 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 relative">
                              <img src={image} alt="Upload" className="max-h-full max-w-full object-contain" />
                           </div>

                           {result ? (
                              <div className="flex-1 bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 overflow-y-auto">
                                 <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><CheckCircle size={16} /> Analysis Result</h4>
                                 <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">{result}</p>
                              </div>
                           ) : (
                              <div className="flex justify-center py-4">
                                 <Button onClick={analyzeImage} isLoading={isAnalyzing} size="lg" className="w-full md:w-auto min-w-[200px]">
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                                 </Button>
                              </div>
                           )}
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
};

const ToolOption = ({ active, onClick, icon, title, desc }: any) => (
   <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group ${active ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'}`}
   >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'}`}>
         {icon}
      </div>
      <div className="flex-1">
         <div className={`font-bold ${active ? 'text-emerald-900' : 'text-slate-900'}`}>{title}</div>
         <div className="text-xs text-slate-500">{desc}</div>
      </div>
      {active && <ChevronRight size={20} className="text-emerald-500" />}
   </button>
);



