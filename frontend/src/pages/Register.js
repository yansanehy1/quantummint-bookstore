"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Register;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
const Header_1 = __importDefault(require("@/components/layout/Header"));
const Footer_1 = __importDefault(require("@/components/layout/Footer"));
function Register() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [step, setStep] = (0, react_1.useState)("role");
    const [formData, setFormData] = (0, react_1.useState)({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: null,
        agreedToTerms: false,
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const handleRoleSelect = (role) => {
        setFormData((prev) => ({ ...prev, role }));
        setStep("details");
    };
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
        if (!formData.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
            newErrors.lastName = "Last name is required";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            newErrors.email = "Valid email is required";
        if (formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (!formData.agreedToTerms)
            newErrors.agreedToTerms = "You must agree to the terms";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setIsSubmitting(true);
        try {
            // Save registration data to localStorage
            localStorage.setItem('userRegistration', JSON.stringify(formData));
            localStorage.setItem('userRole', formData.role || 'learner');
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            // Redirect based on role
            if (formData.role === "seller") {
                alert(`Welcome ${formData.firstName}! Complete your seller registration to start selling.`);
                // Redirect to advanced seller registration
                setLocation("/advanced-seller-registration");
            }
            else {
                alert(`Welcome ${formData.firstName}! Your learner account is ready. Start exploring books!`);
                setLocation("/library");
            }
        }
        catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col">
      <Header_1.default />

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Role Selection Step */}
        {step === "role" && (<div>
            <section className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Sierra Books
              </h1>
              <p className="text-xl text-gray-600">
                Choose your role to get started
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Learner Option */}
              <card_1.Card onClick={() => handleRoleSelect("learner")} className="p-8 cursor-pointer hover:shadow-xl transition border-2 border-transparent hover:border-blue-600">
                <div className="flex items-center justify-between mb-6">
                  <lucide_react_1.Users className="w-12 h-12 text-blue-600"/>
                  <lucide_react_1.ArrowRight className="w-6 h-6 text-gray-400"/>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Learner
                </h2>

                <p className="text-gray-600 mb-6">
                  Access thousands of educational books, audiobooks, and learning
                  materials created by expert educators.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Browse and purchase books from sellers
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Listen to synchronized audio while reading
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Save bookmarks and track reading progress
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Upgrade to seller anytime
                    </span>
                  </div>
                </div>

                <button_1.Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                  Continue as Learner
                  <lucide_react_1.ArrowRight className="w-4 h-4 ml-2"/>
                </button_1.Button>
              </card_1.Card>

              {/* Seller Option */}
              <card_1.Card onClick={() => handleRoleSelect("seller")} className="p-8 cursor-pointer hover:shadow-xl transition border-2 border-transparent hover:border-green-600">
                <div className="flex items-center justify-between mb-6">
                  <lucide_react_1.TrendingUp className="w-12 h-12 text-green-600"/>
                  <lucide_react_1.ArrowRight className="w-6 h-6 text-gray-400"/>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Seller/Educator
                </h2>

                <p className="text-gray-600 mb-6">
                  Share your educational expertise, create audiobooks, and earn
                  income from every purchase.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Create and publish books with audio narration
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Earn 70% from every book sale
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Access seller dashboard and analytics
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"/>
                    <span className="text-gray-700">
                      Also buy and read books from other sellers
                    </span>
                  </div>
                </div>

                <button_1.Button className="w-full bg-green-600 hover:bg-green-700 py-3">
                  Continue as Seller
                  <lucide_react_1.ArrowRight className="w-4 h-4 ml-2"/>
                </button_1.Button>
              </card_1.Card>
            </div>

            {/* Already have account */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button onClick={() => setLocation("/login")} className="text-amber-600 hover:text-amber-700 font-semibold">
                  Sign In
                </button>
              </p>
            </div>
          </div>)}

        {/* Details Form Step */}
        {step === "details" && (<div>
            <section className="mb-12">
              <button onClick={() => setStep("role")} className="text-amber-600 hover:text-amber-700 font-medium mb-4 flex items-center gap-2">
                ← Back to role selection
              </button>

              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </h1>
                <p className="text-xl text-gray-600">
                  You're registering as a{" "}
                  <span className="font-semibold">
                    {formData.role === "seller" ? "Seller/Educator" : "Learner"}
                  </span>
                </p>
              </div>
            </section>

            <card_1.Card className="p-8 max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input_1.Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="h-10"/>
                    {errors.firstName && (<p className="text-red-600 text-sm mt-1">
                        {errors.firstName}
                      </p>)}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input_1.Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="h-10"/>
                    {errors.lastName && (<p className="text-red-600 text-sm mt-1">
                        {errors.lastName}
                      </p>)}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input_1.Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="h-10"/>
                  {errors.email && (<p className="text-red-600 text-sm mt-1">{errors.email}</p>)}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input_1.Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="At least 8 characters" className="h-10 pr-10"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-600">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (<p className="text-red-600 text-sm mt-1">
                      {errors.password}
                    </p>)}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input_1.Input name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password" className="h-10"/>
                  {errors.confirmPassword && (<p className="text-red-600 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>)}
                </div>

                {/* Terms Agreement */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleInputChange} className="mt-1"/>
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 font-semibold">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 font-semibold">
                        Privacy Policy
                      </a>
                      *
                    </span>
                  </label>
                  {errors.agreedToTerms && (<p className="text-red-600 text-sm mt-2">
                      {errors.agreedToTerms}
                    </p>)}
                </div>

                {/* Submit Button */}
                <button_1.Button type="submit" disabled={isSubmitting} className={`w-full py-3 text-lg font-semibold ${formData.role === "seller"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"}`}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button_1.Button>

                {/* Sign In Link */}
                <p className="text-center text-gray-600">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setLocation("/login")} className="text-amber-600 hover:text-amber-700 font-semibold">
                    Sign In
                  </button>
                </p>
              </form>
            </card_1.Card>
          </div>)}
      </main>
      <Footer_1.default />
    </div>);
}
