"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
const Header_1 = __importDefault(require("@/components/layout/Header"));
const Footer_1 = __importDefault(require("@/components/layout/Footer"));
function Login() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [formData, setFormData] = (0, react_1.useState)({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            newErrors.email = "Valid email is required";
        if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
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
            await new Promise((resolve) => setTimeout(resolve, 1500));
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', formData.email);
            // Redirect to dashboard
            setLocation("/dashboard");
        }
        catch (error) {
            console.error("Login error:", error);
            setErrors({ general: "Invalid email or password. Please try again." });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col">
            <Header_1.default />

            <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Branding */}
                    <div className="hidden lg:block">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-4 rounded-2xl shadow-xl">
                                    <lucide_react_1.BookOpen className="w-12 h-12 text-white"/>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-extrabold text-gray-900">
                                        Welcome Back!
                                    </h1>
                                    <p className="text-xl text-gray-600 mt-1">
                                        Sign in to continue your learning journey
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <lucide_react_1.BookOpen className="w-6 h-6 text-blue-600"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">
                                            Access Your Library
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Pick up where you left off with your purchased books and audiobooks
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
                                    <div className="bg-green-100 p-3 rounded-xl">
                                        <lucide_react_1.UserPlus className="w-6 h-6 text-green-600"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">
                                            Track Your Progress
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            View reading analytics, bookmarks, and learning achievements
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
                                    <div className="bg-purple-100 p-3 rounded-xl">
                                        <lucide_react_1.Lock className="w-6 h-6 text-purple-600"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">
                                            Secure & Private
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Your data is encrypted and protected with industry-standard security
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div>
                        <card_1.Card className="p-8 md:p-10 shadow-2xl border-0 bg-white">
                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                    Sign In
                                </h2>
                                <p className="text-gray-600">
                                    Enter your credentials to access your account
                                </p>
                            </div>

                            {errors.general && (<div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <div className="flex items-center gap-2">
                                        <lucide_react_1.AlertCircle className="w-5 h-5 text-red-500"/>
                                        <p className="text-red-700 text-sm">{errors.general}</p>
                                    </div>
                                </div>)}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <lucide_react_1.Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"/>
                                        <input_1.Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className="pl-10 h-12 text-base"/>
                                    </div>
                                    {errors.email && (<p className="text-red-600 text-sm mt-1">{errors.email}</p>)}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <lucide_react_1.Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"/>
                                        <input_1.Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="Enter your password" className="pl-10 pr-12 h-12 text-base"/>
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition-colors">
                                            {showPassword ? (<lucide_react_1.EyeOff className="w-5 h-5"/>) : (<lucide_react_1.Eye className="w-5 h-5"/>)}
                                        </button>
                                    </div>
                                    {errors.password && (<p className="text-red-600 text-sm mt-1">{errors.password}</p>)}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"/>
                                        <span className="text-sm text-gray-700">Remember me</span>
                                    </label>
                                    <button type="button" onClick={() => setLocation("/forgot-password")} className="text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button_1.Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                    {isSubmitting ? (<span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                            Signing In...
                                        </span>) : (<span className="flex items-center justify-center gap-2">
                                            <lucide_react_1.LogIn className="w-5 h-5"/>
                                            Sign In
                                        </span>)}
                                </button_1.Button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">
                                            Don't have an account?
                                        </span>
                                    </div>
                                </div>

                                {/* Register Link */}
                                <button_1.Button type="button" onClick={() => setLocation("/register")} variant="outline" className="w-full h-12 text-base font-semibold border-2 border-amber-600 text-amber-600 hover:bg-amber-50 transition-all duration-200">
                                    <lucide_react_1.UserPlus className="w-5 h-5 mr-2"/>
                                    Create New Account
                                </button_1.Button>
                            </form>
                        </card_1.Card>

                        {/* Mobile-only features */}
                        <div className="lg:hidden mt-8 space-y-4">
                            <div className="text-center text-sm text-gray-600">
                                <p>🔒 Secure login protected with encryption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer_1.default />
        </div>);
}
