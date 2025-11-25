"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvancedSellerRegistration;
const react_1 = require("react");
const wouter_1 = require("wouter");
// Assuming these are Shadcn/ui components (or similar) with Tailwind applied
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const textarea_1 = require("@/components/ui/textarea");
const lucide_react_1 = require("lucide-react");
// Helper to get step details for navigation and display
const stepsConfig = [
    { key: "personal", label: "Personal", icon: lucide_react_1.User },
    { key: "business", label: "Business", icon: lucide_react_1.Briefcase },
    { key: "documents", label: "Documents", icon: lucide_react_1.FileText },
    { key: "tax", label: "Tax & Compliance", icon: lucide_react_1.Banknote },
    { key: "review", label: "Review", icon: lucide_react_1.ClipboardCheck },
];
// Helper to render file input with better styling
const FileInput = ({ label, onChange, fileName }) => (<div className="space-y-1">
    <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
    <div className="flex items-center space-x-3">
      <input aria-label={label} type="file" accept="image/*,.pdf" className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-amber-50 file:text-amber-700
          hover:file:bg-amber-100" onChange={(e) => onChange(e.target.files?.[0] || null)}/>
    </div>
    <p className="text-xs text-gray-500 truncate h-4">
        {fileName ? `Selected: ${fileName}` : "Max 10MB (PDF, JPG, PNG)"}
    </p>
  </div>);
function AdvancedSellerRegistration() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [activeStep, setActiveStep] = (0, react_1.useState)("personal");
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [saveSuccess, setSaveSuccess] = (0, react_1.useState)(false);
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({
        personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            country: "",
            bio: "",
        },
        businessInfo: {
            businessName: "",
            registrationNumber: "",
            address: "",
            website: "",
            industry: "",
        },
        taxInfo: {
            tin: "",
            vatRegistered: "no",
        },
        documents: {
            idDoc: null,
            proofOfAddress: null,
            businessCert: null,
        },
    });
    // --- Auto-Save & Submission Logic (Unchanged) ---
    const handleAutoSave = async () => {
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        catch (error) {
            console.error("Auto-save failed:", error);
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleManualSave = async () => {
        await handleAutoSave();
        // Using custom toast/modal logic instead of alert()
        document.getElementById('save-toast')?.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('save-toast')?.classList.add('hidden');
        }, 3000);
    };
    // Generic handler for input components (Textarea, Input)
    const handleInputChange = (section, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };
    // Specific handler for document files
    const handleDocChange = (field, file) => {
        setFormData((prev) => ({
            ...prev,
            documents: {
                ...prev.documents,
                [field]: file,
            },
        }));
    };
    const canSubmit = !!formData.personalInfo.fullName &&
        !!formData.personalInfo.email &&
        !!formData.businessInfo.businessName &&
        !!formData.taxInfo.tin;
    const submitApplication = async () => {
        if (!canSubmit) {
            // Using custom modal logic instead of alert()
            document.getElementById('error-toast')?.classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('error-toast')?.classList.add('hidden');
            }, 3000);
            return;
        }
        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 700));
            // In a real app, this would be a redirect to a success page
            setLocation("/submission-success");
        }
        catch (e) {
            // Handle submission failure (e.g., show error message)
            setSubmitting(false);
        }
    };
    // --- UI Components ---
    const getStepHeader = (step) => {
        const config = stepsConfig.find(s => s.key === step);
        return (<div className="mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
          {config?.label} Information
        </h2>
        <p className="text-gray-500">
          {step === "personal" && "Provide your key personal details and background."}
          {step === "business" && "Tell us about your organization and operations."}
          {step === "documents" && "Upload necessary verification files for compliance."}
          {step === "tax" && "Complete your tax and regulatory identification."}
          {step === "review" && "Final check before submitting your advanced seller application."}
        </p>
      </div>);
    };
    const getFieldDisplay = (label, value, isUrl = false) => (<div className="flex justify-between items-start py-2 border-b last:border-b-0">
      <span className="font-medium text-gray-600 w-1/3">{label}</span>
      <span className="text-gray-800 w-2/3 text-right break-words">
        {value || <span className="text-red-400 font-normal italic">Missing</span>}
        {isUrl && value ? <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 ml-2">Open</a> : null}
      </span>
    </div>);
    return (<div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-md">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer transition transform hover:scale-[1.02]" onClick={() => setLocation("/")}> 
            <lucide_react_1.BookOpen className="w-7 h-7 text-amber-600"/>
            <h1 className="text-xl font-bold text-gray-900">Sierra Books Seller Portal</h1>
          </div>
          <div className="flex items-center gap-3">
            <button_1.Button onClick={handleManualSave} variant="outline" className="hover:bg-amber-50 text-amber-700 border-amber-300 transition-colors" disabled={isSaving}>
              {isSaving ? (<><lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</>) : (<>Save Draft</>)}
            </button_1.Button>
          </div>
        </div>
      </header>

      {/* Save Toast (Replaces Alert) */}
      <div id="save-toast" className="hidden fixed top-20 right-5 z-[100] p-4 rounded-lg bg-green-500 text-white shadow-xl transition-opacity duration-300">
        <lucide_react_1.CheckCircle className="w-5 h-5 inline mr-2"/> Progress Saved!
      </div>
      
      {/* Error Toast (Replaces Alert for submission) */}
      <div id="error-toast" className="hidden fixed top-20 right-5 z-[100] p-4 rounded-lg bg-red-500 text-white shadow-xl transition-opacity duration-300">
        <lucide_react_1.FileText className="w-5 h-5 inline mr-2"/> Please complete all required fields.
      </div>


      <main className="container max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Advanced Seller Registration</h1>
        
        {/* Step Navigation Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
            <div className="flex flex-wrap sm:flex-row justify-between items-center -mx-2">
                {stepsConfig.map((s, index) => {
            const isActive = activeStep === s.key;
            const isCompleted = stepsConfig.findIndex(c => c.key === activeStep) > index;
            const StepIcon = s.icon;
            return (<div key={s.key} className="relative flex flex-1 items-center px-2 py-3 sm:py-0 min-w-[20%]">
                            <button onClick={() => setActiveStep(s.key)} className={`flex flex-col sm:flex-row items-center w-full transition-all duration-300 ${isActive ? "text-amber-700 font-bold" : isCompleted ? "text-green-600 hover:text-green-700" : "text-gray-500 hover:text-gray-700"}`}>
                                <div className={`p-2 rounded-full border-2 ${isActive ? "border-amber-600 bg-amber-50" : isCompleted ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}>
                                    <StepIcon className="w-5 h-5"/>
                                </div>
                                <span className="mt-1 sm:mt-0 sm:ml-3 text-sm text-center sm:text-left">{s.label}</span>
                            </button>
                            {/* Connector line */}
                            {index < stepsConfig.length - 1 && (<div className={`absolute top-1/2 right-[-50%] w-[100%] h-0.5 bg-gray-200 hidden sm:block ${isCompleted && 'bg-green-500'}`}></div>)}
                        </div>);
        })}
            </div>
        </div>

        {/* Content Card */}
        <card_1.Card className="p-8 rounded-xl shadow-2xl border-t-4 border-amber-500 bg-white">

          {/* Personal */}
          {activeStep === "personal" && (<div className="space-y-6">
              {getStepHeader("personal")}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input_1.Input value={formData.personalInfo.fullName} onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)} placeholder="Your full legal name"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input_1.Input type="email" value={formData.personalInfo.email} onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)} placeholder="you@example.com"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone</label>
                  <input_1.Input value={formData.personalInfo.phone} onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)} placeholder="+232 77 XXX XXX"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Country</label>
                  <select aria-label="Country" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-150" value={formData.personalInfo.country} onChange={(e) => handleInputChange("personalInfo", "country", e.target.value)}>
                    <option value="">Select country</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Short Bio / Expertise</label>
                  <textarea_1.Textarea rows={4} value={formData.personalInfo.bio} onChange={(e) => handleInputChange("personalInfo", "bio", e.target.value)} placeholder="Briefly describe your background or expertise relevant to your products."/>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button_1.Button onClick={() => setActiveStep("business")} className="bg-amber-600 hover:bg-amber-700 font-semibold text-lg py-6 px-8 rounded-xl transition duration-300">
                  Continue to Business <span className="ml-2">&rarr;</span>
                </button_1.Button>
              </div>
            </div>)}

          {/* Business */}
          {activeStep === "business" && (<div className="space-y-6">
              {getStepHeader("business")}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Business Name <span className="text-red-500">*</span></label>
                  <input_1.Input value={formData.businessInfo.businessName} onChange={(e) => handleInputChange("businessInfo", "businessName", e.target.value)} placeholder="Company or Brand Name"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Registration No.</label>
                  <input_1.Input value={formData.businessInfo.registrationNumber} onChange={(e) => handleInputChange("businessInfo", "registrationNumber", e.target.value)} placeholder="Official Registration Number"/>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Business Address</label>
                  <input_1.Input value={formData.businessInfo.address} onChange={(e) => handleInputChange("businessInfo", "address", e.target.value)} placeholder="Full physical street address"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Website</label>
                  <input_1.Input value={formData.businessInfo.website} onChange={(e) => handleInputChange("businessInfo", "website", e.target.value)} placeholder="https://..."/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Industry</label>
                  <select aria-label="Industry" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-150" value={formData.businessInfo.industry} onChange={(e) => handleInputChange("businessInfo", "industry", e.target.value)}>
                    <option value="">Select industry</option>
                    <option value="Education">Education</option>
                    <option value="Publishing">Publishing</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button_1.Button variant="outline" onClick={() => setActiveStep("personal")} className="text-gray-600 hover:bg-gray-100">
                  &larr; Back
                </button_1.Button>
                <button_1.Button onClick={() => setActiveStep("documents")} className="bg-amber-600 hover:bg-amber-700 font-semibold text-lg py-6 px-8 rounded-xl transition duration-300">
                  Continue to Documents <span className="ml-2">&rarr;</span>
                </button_1.Button>
              </div>
            </div>)}

          {/* Documents */}
          {activeStep === "documents" && (<div className="space-y-6">
              {getStepHeader("documents")}
              <div className="grid md:grid-cols-3 gap-6">
                <FileInput label="Government ID (Passport/License)" onChange={(file) => handleDocChange("idDoc", file)} fileName={formData.documents.idDoc?.name || null}/>
                <FileInput label="Proof of Address (Utility Bill/Bank Statement)" onChange={(file) => handleDocChange("proofOfAddress", file)} fileName={formData.documents.proofOfAddress?.name || null}/>
                <FileInput label="Business Registration Certificate" onChange={(file) => handleDocChange("businessCert", file)} fileName={formData.documents.businessCert?.name || null}/>
              </div>
              <div className="flex justify-between pt-4">
                <button_1.Button variant="outline" onClick={() => setActiveStep("business")} className="text-gray-600 hover:bg-gray-100">
                  &larr; Back
                </button_1.Button>
                <button_1.Button onClick={() => setActiveStep("tax")} className="bg-amber-600 hover:bg-amber-700 font-semibold text-lg py-6 px-8 rounded-xl transition duration-300">
                  Continue to Tax <span className="ml-2">&rarr;</span>
                </button_1.Button>
              </div>
            </div>)}

          {/* Tax */}
          {activeStep === "tax" && (<div className="space-y-6">
              {getStepHeader("tax")}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">TIN (Tax ID Number) <span className="text-red-500">*</span></label>
                  <input_1.Input value={formData.taxInfo.tin} onChange={(e) => handleInputChange("taxInfo", "tin", e.target.value)} placeholder="e.g., SL-123456789"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">VAT Registered</label>
                  <select aria-label="VAT Registered" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-150" value={formData.taxInfo.vatRegistered} onChange={(e) => handleInputChange("taxInfo", "vatRegistered", e.target.value)}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button_1.Button variant="outline" onClick={() => setActiveStep("documents")} className="text-gray-600 hover:bg-gray-100">
                  &larr; Back
                </button_1.Button>
                <button_1.Button onClick={() => setActiveStep("review")} className="bg-amber-600 hover:bg-amber-700 font-semibold text-lg py-6 px-8 rounded-xl transition duration-300">
                  Continue to Review <span className="ml-2">&rarr;</span>
                </button_1.Button>
              </div>
            </div>)}

          {/* Review */}
          {activeStep === "review" && (<div className="space-y-6">
              {getStepHeader("review")}
              
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-amber-700 mb-4 border-b pb-2">1. Personal Information</h3>
                {getFieldDisplay("Full Name", formData.personalInfo.fullName)}
                {getFieldDisplay("Email", formData.personalInfo.email)}
                {getFieldDisplay("Phone", formData.personalInfo.phone)}
                {getFieldDisplay("Country", formData.personalInfo.country)}
                {getFieldDisplay("Bio", formData.personalInfo.bio)}
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-amber-700 mb-4 border-b pb-2">2. Business Information</h3>
                {getFieldDisplay("Business Name", formData.businessInfo.businessName)}
                {getFieldDisplay("Registration No.", formData.businessInfo.registrationNumber)}
                {getFieldDisplay("Address", formData.businessInfo.address)}
                {getFieldDisplay("Website", formData.businessInfo.website, true)}
                {getFieldDisplay("Industry", formData.businessInfo.industry)}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-amber-700 mb-4 border-b pb-2">3. Tax & Compliance</h3>
                {getFieldDisplay("TIN (Tax ID)", formData.taxInfo.tin)}
                {getFieldDisplay("VAT Registered", formData.taxInfo.vatRegistered === "yes" ? "Yes" : "No")}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h3 className="text-xl font-bold text-amber-700 mb-4 border-b pb-2">4. Documents Uploaded</h3>
                {getFieldDisplay("Government ID", formData.documents.idDoc ? formData.documents.idDoc.name : null)}
                {getFieldDisplay("Proof of Address", formData.documents.proofOfAddress ? formData.documents.proofOfAddress.name : null)}
                {getFieldDisplay("Business Cert.", formData.documents.businessCert ? formData.documents.businessCert.name : null)}
              </div>

              <div className="flex justify-between pt-4">
                <button_1.Button variant="outline" onClick={() => setActiveStep("tax")} className="text-gray-600 hover:bg-gray-100">
                  &larr; Back to Tax
                </button_1.Button>
                <button_1.Button onClick={submitApplication} disabled={!canSubmit || submitting} className={`font-semibold text-lg py-6 px-8 rounded-xl transition duration-300 ${!canSubmit ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
                  {submitting ? <lucide_react_1.Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <lucide_react_1.ClipboardCheck className="w-5 h-5 mr-2"/>}
                  {canSubmit ? "Submit Final Application" : "Complete Required Fields"}
                </button_1.Button>
              </div>
            </div>)}
        </card_1.Card>
      </main>
    </div>);
}
