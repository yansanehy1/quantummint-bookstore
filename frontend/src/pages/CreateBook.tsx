import { useState } from "react";
// Assuming these are imports from a shadcn-like UI library
// The user provided standard component names, so we keep the imports as-is.
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Save, Loader2, BookOpen, Eye, DollarSign, PenTool, Mic } from "lucide-react";
import { useLocation } from "wouter";

type Level = "JSS" | "SSS" | "beginner" | "intermediate" | "advanced" | "expert";

interface FormData {
  title: string;
  subtitle: string;
  category: string;
  level: Level;
  description: string;
  priceUSD: string;
  priceSLL: string;
  coverUrl: string;
  content: string;
  personalInfo: { authorName: string; bio: string };
  businessInfo: { publisher: string; website: string };
}

// Custom Input Field Component for better reuse and styling consistency
const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    {children}
  </div>
);

export default function CreateBook() {
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "The Fundamentals of Renewable Energy",
    subtitle: "A Sierra Leonean Guide to Sustainable Power",
    category: "Science & Technology",
    level: "intermediate",
    description: "This comprehensive guide introduces the core concepts of sustainable energy, focusing on solar, wind, and hydro power applications relevant to West Africa. Includes practical case studies and policy outlines.",
    priceUSD: "10.00",
    priceSLL: "150000",
    coverUrl: "https://placehold.co/400x550/fde047/a3a3a3?text=Cover+Image",
    content: "Chapter 1: The Energy Crisis\n\n\tThe need for sustainable power is more critical than ever...\n\nChapter 2: Solar Photovoltaics\n\n\tSolar power is the most accessible solution for the region...",
    personalInfo: { authorName: "Dr. Aminata Kabbah", bio: "Aminata is an environmental engineer with a PhD from Fourah Bay College. She specializes in rural electrification projects in Koinadugu District." },
    businessInfo: { publisher: "GreenLeaf Publishing", website: "https://greenleafpub.com" },
  });

  const handleAutoSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    await handleAutoSave();
    // Use a custom message box instead of alert()
    console.log("Your progress has been saved. You can continue later!");
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePersonalInfoChange = (field: 'authorName' | 'bio', value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleBusinessInfoChange = (field: 'publisher' | 'website', value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value,
      },
    }));
  };

  const publishDisabled =
    !formData.title || !formData.category || !formData.priceUSD || !formData.content;

  // Custom select component to match Input styling
  const SelectField = ({ value, onChange, options, ariaLabel }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; ariaLabel: string }) => (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out bg-white text-gray-900"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-amber-100">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">SIERRA BOOKS <span className="text-amber-500">CREATOR</span></h1>
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            {isSaving && <Loader2 className="w-5 h-5 animate-spin text-amber-500" />}
            {saveSuccess && (
              <span className="text-sm font-semibold text-green-600 flex items-center gap-1 transition duration-300">
                <CheckCircle className="w-4 h-4" /> Saved
              </span>
            )}

            <Button onClick={handleManualSave} variant="outline" className="text-gray-700 hover:bg-amber-50 border-amber-300">
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>

            <Button onClick={() => setLocation("/audiobook-studio")} variant="outline" className="text-indigo-600 hover:bg-indigo-50 border-indigo-200">
              <Mic className="w-4 h-4 mr-2" /> Audio Studio
            </Button>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-gray-700 hover:bg-amber-50 border-amber-300">
                  <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-6 rounded-xl shadow-2xl">
                <DialogHeader className="border-b pb-3 mb-4">
                  <DialogTitle className="text-2xl font-bold text-amber-700">{formData.title || "Untitled Book"}</DialogTitle>
                  <p className="text-sm text-gray-500">{formData.subtitle || "No Subtitle"}</p>
                </DialogHeader>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 border-b pb-3">
                    <p className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-amber-500" /> Category: <span className="font-semibold text-gray-800">{formData.category || "-"}</span></p>
                    <p className="flex items-center gap-1"><PenTool className="w-4 h-4 text-amber-500" /> Level: <span className="font-semibold text-gray-800">{formData.level}</span></p>
                    <p className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-amber-500" /> Price: <span className="font-semibold text-gray-800">${formData.priceUSD}</span></p>
                  </div>

                  <h4 className="text-xl font-semibold text-gray-700 border-l-4 border-amber-500 pl-3">Description</h4>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{formData.description || "No description provided."}</p>

                  {formData.coverUrl && (
                    <div className="flex justify-center py-4">
                      <img
                        src={formData.coverUrl}
                        alt="Book Cover Preview"
                        className="w-40 h-auto object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://placehold.co/400x550/fca311/ffffff?text=Image+Load+Failed';
                        }}
                      />
                    </div>
                  )}

                  <h4 className="text-xl font-semibold text-gray-700 border-l-4 border-amber-500 pl-3 pt-4">Content Preview</h4>
                  <div className="text-gray-900 prose max-w-none whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-200 leading-normal">{formData.content || "No content written yet."}</div>
                </div>
              </DialogContent>
            </Dialog>

            <Button disabled={publishDisabled} className="bg-amber-600 hover:bg-amber-700 font-bold text-white shadow-md hover:shadow-lg transition duration-200 disabled:bg-gray-400">
              Publish Book
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-10">
        <Card className="p-8 shadow-2xl border border-amber-100/70 bg-white rounded-xl">
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            {/* Enhanced Horizontal TabsList */}
            <TabsList className="flex flex-wrap gap-2 bg-gradient-to-r from-gray-100 to-gray-50 p-2 rounded-lg mb-8 shadow-inner border border-gray-200">
              <TabsTrigger
                value="details"
                className="flex-1 min-w-[120px] px-4 py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 font-semibold transition-all duration-200 rounded-md shadow-sm"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="flex-1 min-w-[120px] px-4 py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 font-semibold transition-all duration-200 rounded-md shadow-sm"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="flex-1 min-w-[120px] px-4 py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 font-semibold transition-all duration-200 rounded-md shadow-sm"
              >
                Pricing
              </TabsTrigger>
              <TabsTrigger
                value="author"
                className="flex-1 min-w-[120px] px-4 py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 font-semibold transition-all duration-200 rounded-md shadow-sm"
              >
                Author
              </TabsTrigger>
              <TabsTrigger
                value="publisher"
                className="flex-1 min-w-[120px] px-4 py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 font-semibold transition-all duration-200 rounded-md shadow-sm"
              >
                Publisher
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="pt-4 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Title (Mandatory)">
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="The complete guide to..."
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
                <FormField label="Subtitle (Optional)">
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    placeholder="A detailed look into the subject."
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
                <FormField label="Category (e.g., Science, History, Fiction)">
                  <Input
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder="Mathematics, Literature, Health"
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
                <FormField label="Target Level">
                  <SelectField
                    value={formData.level}
                    onChange={(e) => handleInputChange("level", e.target.value as Level)}
                    ariaLabel="Book level"
                    options={[
                      { value: "JSS", label: "JSS (Junior Secondary)" },
                      { value: "SSS", label: "SSS (Senior Secondary)" },
                      { value: "beginner", label: "Beginner" },
                      { value: "intermediate", label: "Intermediate" },
                      { value: "advanced", label: "Advanced" },
                      { value: "expert", label: "Expert" },
                    ]}
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Book Description (Required)">
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={5}
                      placeholder="Write a brief, compelling description that will attract readers..."
                      className="focus:ring-amber-500 focus:border-amber-500"
                    />
                  </FormField>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="pt-4 space-y-6">
              <FormField label="Cover Image URL (Recommended)">
                <Input
                  value={formData.coverUrl}
                  onChange={(e) => handleInputChange("coverUrl", e.target.value)}
                  placeholder="Paste URL here (e.g., https://image.com/cover.png)"
                  className="focus:ring-amber-500 focus:border-amber-500"
                />
              </FormField>
              <FormField label="Main Book Content (Required)">
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows={15}
                  placeholder="Paste or write your full chapter content here. Use paragraphs and headings for structure."
                  className="font-mono text-sm focus:ring-amber-500 focus:border-amber-500"
                />
              </FormField>
              <div className="flex gap-3 pt-2 items-center">
                <Button variant="default" onClick={handleAutoSave} disabled={isSaving} className="bg-amber-100 text-amber-700 hover:bg-amber-200 font-semibold">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Auto Save Now
                </Button>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="pt-4 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-amber-500 pl-3">Set Your Price</h3>
              <p className="text-sm text-gray-600">Note: All prices are subject to platform fees and local tax regulations.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Price (USD)">
                  <Input
                    type="number"
                    value={formData.priceUSD}
                    onChange={(e) => handleInputChange("priceUSD", e.target.value)}
                    placeholder="e.g., 4.99"
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
                <FormField label="Price (SLL - Sierra Leone Leone)">
                  <Input
                    type="number"
                    value={formData.priceSLL}
                    onChange={(e) => handleInputChange("priceSLL", e.target.value)}
                    placeholder="e.g., 150000"
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
              </div>
            </TabsContent>

            {/* Author Tab */}
            <TabsContent value="author" className="pt-4 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-amber-500 pl-3">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Author Name (as it should appear)">
                  <Input
                    value={formData.personalInfo.authorName}
                    onChange={(e) => handlePersonalInfoChange("authorName", e.target.value)}
                    placeholder="Your Full Name"
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Author Biography (Tell your readers about yourself)">
                    <Textarea
                      value={formData.personalInfo.bio}
                      onChange={(e) => handlePersonalInfoChange("bio", e.target.value)}
                      rows={4}
                      placeholder="Describe your background, expertise, and motivation for writing this book."
                      className="focus:ring-amber-500 focus:border-amber-500"
                    />
                  </FormField>
                </div>
              </div>
            </TabsContent>

            {/* Publisher Tab */}
            <TabsContent value="publisher" className="pt-4 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-amber-500 pl-3">Business/Publisher Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Publisher Name (Optional)">
                  <Input
                    value={formData.businessInfo.publisher}
                    onChange={(e) => handleBusinessInfoChange("publisher", e.target.value)}
                    placeholder="Your Publishing House"
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
                <FormField label="Publisher Website/Link">
                  <Input
                    value={formData.businessInfo.website}
                    onChange={(e) => handleBusinessInfoChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="focus:ring-amber-500 focus:border-amber-500"
                  />
                </FormField>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      {/* Footer for extra polish */}
      <footer className="w-full py-4 bg-white border-t border-gray-100 mt-10">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 Sierra Books Creator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}