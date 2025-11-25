"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SellerRequest;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
function SellerRequest() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [formData, setFormData] = (0, react_1.useState)({
        expertise: "",
        experience: "",
        bookIdeas: "",
        targetAudience: "",
        qualifications: "",
        portfolio: "",
        motivation: "",
        agreedToTerms: false,
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [submitted, setSubmitted] = (0, react_1.useState)(false);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === "checkbox" ? e.target.checked : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.expertise.trim())
            newErrors.expertise = "Please describe your area of expertise";
        if (!formData.experience.trim())
            newErrors.experience = "Please share your experience";
        if (!formData.bookIdeas.trim())
            newErrors.bookIdeas = "Please describe your book ideas";
        if (!formData.targetAudience.trim())
            newErrors.targetAudience = "Please identify your target audience";
        if (!formData.motivation.trim())
            newErrors.motivation = "Please tell us why you want to become a seller";
        if (!formData.agreedToTerms)
            newErrors.agreedToTerms = "You must agree to the seller terms";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setSubmitted(true);
        }
        catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit request. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (submitted) {
        return (<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
              <lucide_react_1.BookOpen className="w-8 h-8 text-amber-600"/>
              <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
            </div>
            <nav className="flex gap-4 items-center">
              <button onClick={() => setLocation("/dashboard")} className="text-gray-700 hover:text-amber-600 font-medium">
                Dashboard
              </button>
            </nav>
          </div>
        </header>

        <main className="container max-w-2xl mx-auto px-4 py-12">
          <card_1.Card className="p-12 text-center">
            <lucide_react_1.CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6"/>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Request Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your interest in becoming a seller on Sierra Books.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8 text-left">
              <h2 className="font-bold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <lucide_react_1.Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Review Period (3-5 business days)
                    </p>
                    <p className="text-sm text-gray-600">
                      Our team will carefully review your application and
                      expertise.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <lucide_react_1.FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Email Notification
                    </p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email with the decision and next steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <lucide_react_1.TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"/>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Seller Onboarding
                    </p>
                    <p className="text-sm text-gray-600">
                      If approved, you'll complete seller registration and setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button_1.Button onClick={() => setLocation("/dashboard")} className="w-full bg-green-600 hover:bg-green-700 py-3">
                Go to Dashboard
              </button_1.Button>
              <button_1.Button onClick={() => setLocation("/library")} variant="outline" className="w-full py-3">
                Continue Browsing Books
              </button_1.Button>
            </div>

            <p className="text-sm text-gray-600 mt-8">
              Questions? Contact us at{" "}
              <a href="mailto:support@sierrabooks.com" className="text-blue-600 font-semibold">
                support@sierrabooks.com
              </a>
            </p>
          </card_1.Card>
        </main>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <lucide_react_1.BookOpen className="w-8 h-8 text-amber-600"/>
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => setLocation("/dashboard")} className="text-gray-700 hover:text-amber-600 font-medium">
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Become a Seller
          </h1>
          <p className="text-xl text-gray-600">
            Share your educational expertise and earn income. We're looking for
            passionate educators to join our community.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Benefits */}
          <card_1.Card className="p-6">
            <lucide_react_1.TrendingUp className="w-8 h-8 text-green-600 mb-3"/>
            <h3 className="font-bold text-gray-900 mb-2">Earn Income</h3>
            <p className="text-sm text-gray-600">
              Keep 70% of every sale. Payments processed weekly to your bank
              account.
            </p>
          </card_1.Card>

          <card_1.Card className="p-6">
            <lucide_react_1.BookOpen className="w-8 h-8 text-blue-600 mb-3"/>
            <h3 className="font-bold text-gray-900 mb-2">Easy Publishing</h3>
            <p className="text-sm text-gray-600">
              Use our audiobook creator to convert text to narrated audio
              instantly.
            </p>
          </card_1.Card>

          <card_1.Card className="p-6">
            <lucide_react_1.AlertCircle className="w-8 h-8 text-purple-600 mb-3"/>
            <h3 className="font-bold text-gray-900 mb-2">Full Support</h3>
            <p className="text-sm text-gray-600">
              Get help from our team and access seller resources and community.
            </p>
          </card_1.Card>
        </div>

        {/* Application Form */}
        <card_1.Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Seller Application
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expertise */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What is your area of expertise? *
              </label>
              <textarea name="expertise" value={formData.expertise} onChange={handleInputChange} placeholder="e.g., Mathematics, Biology, English Literature, Professional Development..." className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"/>
              {errors.expertise && (<p className="text-red-600 text-sm mt-1">{errors.expertise}</p>)}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tell us about your experience in this field *
              </label>
              <textarea name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Years of experience, qualifications, teaching background, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"/>
              {errors.experience && (<p className="text-red-600 text-sm mt-1">{errors.experience}</p>)}
            </div>

            {/* Book Ideas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe the books or content you plan to create *
              </label>
              <textarea name="bookIdeas" value={formData.bookIdeas} onChange={handleInputChange} placeholder="What topics will you cover? What makes your content unique?" className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"/>
              {errors.bookIdeas && (<p className="text-red-600 text-sm mt-1">{errors.bookIdeas}</p>)}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Who is your target audience? *
              </label>
              <textarea name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="e.g., High school students, University students, Professional learners..." className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20"/>
              {errors.targetAudience && (<p className="text-red-600 text-sm mt-1">
                  {errors.targetAudience}
                </p>)}
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Relevant qualifications or certifications (Optional)
              </label>
              <input_1.Input name="qualifications" value={formData.qualifications} onChange={handleInputChange} placeholder="e.g., Bachelor's in Computer Science, TEFL Certificate..." className="h-10"/>
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Portfolio or previous work (Optional)
              </label>
              <input_1.Input name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="Link to your website, blog, or previous publications..." className="h-10"/>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Why do you want to become a seller on Sierra Books? *
              </label>
              <textarea name="motivation" value={formData.motivation} onChange={handleInputChange} placeholder="Tell us about your motivation and goals..." className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"/>
              {errors.motivation && (<p className="text-red-600 text-sm mt-1">{errors.motivation}</p>)}
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleInputChange} className="mt-1"/>
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 font-semibold">
                    Seller Terms
                  </a>{" "}
                  and understand that my application will be reviewed by the
                  Sierra Books team. *
                </span>
              </label>
              {errors.agreedToTerms && (<p className="text-red-600 text-sm mt-2">
                  {errors.agreedToTerms}
                </p>)}
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button_1.Button type="button" onClick={() => setLocation("/dashboard")} variant="outline" className="flex-1 py-3">
                Cancel
              </button_1.Button>
              <button_1.Button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700 py-3">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button_1.Button>
            </div>
          </form>
        </card_1.Card>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
            {
                q: "How long does the review process take?",
                a: "Most applications are reviewed within 3-5 business days. You'll receive an email with the decision.",
            },
            {
                q: "What if my application is rejected?",
                a: "You can reapply after 30 days or contact us for feedback on how to improve your application.",
            },
            {
                q: "Do I need to be a professional educator?",
                a: "No! We welcome anyone with expertise and passion for teaching, including self-taught experts and hobbyists.",
            },
            {
                q: "Can I create content in local languages?",
                a: "Yes! We support content in English, Krio, and other local languages.",
            },
            {
                q: "What happens if I'm approved?",
                a: "You'll complete seller registration, set up your bank account, and can start creating and publishing books immediately.",
            },
        ].map((faq, idx) => (<card_1.Card key={idx} className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </card_1.Card>))}
          </div>
        </section>
      </main>
    </div>);
}
