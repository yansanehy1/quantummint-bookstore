"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const lucide_react_1 = require("lucide-react");
// Assuming the following components/hooks are available in your environment:
// import { useAuth } from "@/_core/hooks/useAuth";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useLocation } from "wouter";
// --- Mock Implementations for Canvas/Testing Environment ---
// NOTE: In a real environment, you would use the imported hooks/components.
const Button = ({ onClick, children, variant = 'default', size = 'default', className = '', type = 'button' }) => {
    const baseClasses = "rounded-xl font-semibold transition-all duration-200 shadow-sm flex items-center justify-center";
    let variantClasses = "";
    if (variant === 'outline') {
        variantClasses = "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-white";
    }
    else if (className.includes('bg-')) {
        variantClasses = `text-white hover:shadow-lg hover:shadow-opacity-20`;
    }
    else {
        variantClasses = "bg-amber-600 text-white hover:bg-amber-700";
    }
    let sizeClasses = "px-4 py-2";
    if (size === 'sm') {
        sizeClasses = "px-3 py-1.5 text-sm";
    }
    return (<button onClick={onClick} type={type} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {children}
    </button>);
};
const Card = ({ children, className = '' }) => (<div className={`bg-white p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}>
    {children}
  </div>);
// Mock Auth hook for the environment
const useAuth = () => {
    const router = (0, router_1.useRouter)();
    // Mock User Data
    const mockUser = {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
        role: "seller", // Can be 'learner', 'seller', or 'admin'
        id: "USER12345",
    };
    return {
        user: mockUser, logout: async () => {
            console.log("User logged out");
            // In a real app, you would also clear auth tokens here
            router.push('/login');
            return Promise.resolve();
        }
    };
};
const useLocation = () => [null, (path) => console.log(`Navigating to: ${path}`)];
// --- End Mock Implementations ---
function Dashboard() {
    const router = (0, router_1.useRouter)();
    const { user, logout } = useAuth();
    const [, setLocation] = useLocation();
    const handleLogout = async () => {
        await logout();
        // No need to navigate here as the logout function will handle it
    };
    // Helper for displaying a clean date
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'N/A';
    // Helper for role display
    const roleDisplay = user?.role === "admin" ? "Administrator" :
        user?.role === "seller" ? "Certified Seller" :
            "Learner";
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <lucide_react_1.BookOpen className="w-8 h-8 text-amber-700 stroke-2"/>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => router.push('/library')} className="hidden sm:inline text-gray-700 hover:text-amber-700 font-medium transition duration-150">Library</button>
            <button onClick={() => router.push('/wallet')} className="hidden sm:inline text-gray-700 hover:text-amber-700 font-medium transition duration-150">Wallet</button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="rounded-full px-5">
              <lucide_react_1.LogOut className="w-4 h-4 mr-2"/>
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-16">
        {/* Profile Section */}
        <section className="mb-14">
          <Card className="p-8 md:p-10 bg-gradient-to-br from-amber-600 to-orange-700 text-white overflow-hidden relative">
            {/* Background pattern overlay for aesthetic */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://api.unsplash.com/photos/a-close-up-of-a-book-cover-with-a-geometric-pattern-eU467_L8Jqg')] bg-cover bg-center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"><path d=\"M0 0h100v100H0zM100 100h100v100H100z\" fill=\"%23ffffff\" opacity=\"0.1\"/></svg>')" }}></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
              <div className="flex items-center gap-5">
                {/* Placeholder Avatar */}
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold border-4 border-white">
                  {user?.name?.[0].toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-4xl font-extrabold mb-1">{user?.name || "Welcome Back"}</h2>
                  <p className="text-amber-200 font-medium">{user?.email || "No email provided"}</p>
                  <p className="text-amber-200 text-sm mt-1">Member since {memberSince}</p>
                </div>
              </div>

              <div className="mt-6 md:mt-0 text-left md:text-right">
                <p className="text-amber-200 text-sm mb-1 uppercase tracking-wider">Current Role</p>
                <span className="inline-block px-5 py-2 bg-white text-orange-700 rounded-full font-bold shadow-md">
                  {roleDisplay}
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Stats */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <Card className="p-6 transition hover:scale-[1.02] border-b-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Books in Library</p>
                <p className="text-3xl font-extrabold text-gray-900">12</p>
              </div>
              <lucide_react_1.BookOpen className="w-10 h-10 text-amber-500"/>
            </div>
          </Card>

          <Card className="p-6 transition hover:scale-[1.02] border-b-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Wallet Balance (USD)</p>
                <p className="text-3xl font-extrabold text-gray-900">$125.50</p>
              </div>
              <lucide_react_1.Wallet className="w-10 h-10 text-green-500"/>
            </div>
          </Card>

          <Card className="p-6 transition hover:scale-[1.02] border-b-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Bookmarks Saved</p>
                <p className="text-3xl font-extrabold text-gray-900">47</p>
              </div>
              <lucide_react_1.TrendingUp className="w-10 h-10 text-blue-500"/>
            </div>
          </Card>

          <Card className="p-6 transition hover:scale-[1.02] border-b-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Referrals Earned</p>
                <p className="text-3xl font-extrabold text-gray-900">3</p>
              </div>
              <lucide_react_1.Users className="w-10 h-10 text-purple-500"/>
            </div>
          </Card>
        </section>

        {/* Reading Analytics Banner */}
        <section className="mb-14 p-6 md:p-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <lucide_react_1.BarChart3 className="w-8 h-8 text-teal-600 flex-shrink-0"/>
              <div>
                <h3 className="font-extrabold text-gray-900 text-xl flex items-center gap-2">
                  Reading Analytics <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">PRO</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">Track your reading time and costs in real-time with detailed charts and progress reports.</p>
              </div>
            </div>
            <Button onClick={() => setLocation("/reading-analytics")} className="bg-teal-600 hover:bg-teal-700 text-white whitespace-nowrap min-w-[150px] transition hover:shadow-teal-300">
              View Analytics
            </Button>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <section className="grid lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {/* Main Action Card: My Library */}
          <Card className="p-8 lg:col-span-2 xl:col-span-2 transition hover:shadow-2xl hover:border-amber-100 border-2 border-transparent">
            <h3 className="text-3xl font-extrabold mb-6 text-amber-700 flex items-center gap-3">
              <lucide_react_1.BookOpen className="w-8 h-8"/>
              My Digital Library
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-lg">You currently have **12 books** in your library. Ready to continue your learning journey?</p>

              {/* Mock Recent Book */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Continue Reading:</p>
                  <p className="font-bold text-amber-700">The Power of Habit</p>
                </div>
                <span className="text-sm text-amber-600 font-medium">Page 45/320</span>
              </div>

              <Button onClick={() => router.push("/library")} className="bg-amber-600 hover:bg-amber-700 w-full text-lg py-3 mt-4">
                Go To My Library
              </Button>
            </div>
          </Card>

          {/* Wallet Management */}
          <Card className="p-8 lg:col-span-1 xl:col-span-2">
            <h3 className="text-3xl font-extrabold mb-6 text-green-700 flex items-center gap-3">
              <lucide_react_1.Wallet className="w-8 h-8"/>
              Account Funds
            </h3>
            <div className="space-y-4">

              {/* USD Balance */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <p className="text-gray-600 text-sm mb-1">Available USD Balance</p>
                <p className="text-4xl font-extrabold text-green-700">$125.50</p>
              </div>

              {/* SLL Balance */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <p className="text-gray-600 text-sm mb-1">Secondary Currency (SLL)</p>
                <p className="text-4xl font-extrabold text-blue-700">Le 5,000.00</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button onClick={() => setLocation("/deposit")} className="bg-green-600 hover:bg-green-700">
                  Deposit
                </Button>
                <Button onClick={() => setLocation("/withdraw")} variant="outline">
                  Withdraw
                </Button>
              </div>
            </div>
          </Card>

          {/* Contextual Tile 1: Create Book (Seller/Admin) */}
          {(user?.role === "seller" || user?.role === "admin") && (<Card className="p-8 lg:col-span-1 bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-300 shadow-2xl transition hover:scale-[1.02]">
              <h3 className="text-2xl font-bold mb-6 text-amber-800 flex items-center gap-3">
                <lucide_react_1.BookOpen className="w-6 h-6"/>
                Publish a Book
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700">Upload and monetize your educational content with rich media support.</p>
                <ul className="text-sm text-gray-600 space-y-1 bg-white p-4 rounded-lg border border-amber-200">
                  <li><span className="text-amber-600 font-bold">✓</span> Integrated TTS Narration</li>
                  <li><span className="text-amber-600 font-bold">✓</span> Global Marketplace Access</li>
                  <li><span className="text-amber-600 font-bold">✓</span> Real-time Sales Analytics</li>
                </ul>
                <Button onClick={() => router.push("/create-book")} className="bg-amber-600 hover:bg-amber-700 w-full text-base py-2.5">
                  Start Publishing
                </Button>
              </div>
            </Card>)}

          {/* Contextual Tile 2: Become a Seller (Learner) */}
          {user?.role !== "seller" && user?.role !== "admin" && (<Card className="p-8 lg:col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-300 shadow-2xl transition hover:scale-[1.02]">
              <h3 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-3">
                <lucide_react_1.TrendingUp className="w-6 h-6"/>
                Become a Seller
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700">Monetize your expertise and reach thousands of learners globally.</p>
                <ul className="text-sm text-gray-600 space-y-1 bg-white p-4 rounded-lg border border-green-200">
                  <li><span className="text-green-600 font-bold">✓</span> Earn 70% of revenue</li>
                  <li><span className="text-green-600 font-bold">✓</span> Fast Approval Process</li>
                  <li><span className="text-green-600 font-bold">✓</span> Dedicated Support</li>
                </ul>
                <Button onClick={() => setLocation("/seller-request")} className="bg-green-600 hover:bg-green-700 w-full text-base py-2.5">
                  Request Seller Status
                </Button>
              </div>
            </Card>)}

          {/* Utility Tile: Referral Program */}
          <Card className="p-8 lg:col-span-1 bg-purple-50 border-4 border-purple-300 transition hover:shadow-xl hover:border-purple-400">
            <h3 className="text-2xl font-bold mb-6 text-purple-800 flex items-center gap-3">
              <lucide_react_1.Users className="w-6 h-6"/>
              Refer & Earn
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">Refer a friend and both of you get **$5** credit on their first purchase.</p>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Your Unique Code</p>
                <code className="font-mono text-xl font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded">
                  REF_{user?.id || "0000"}
                </code>
              </div>
              <Button onClick={() => setLocation("/referrals")} className="bg-purple-600 hover:bg-purple-700 w-full">
                Share Now
              </Button>
            </div>
          </Card>

          {/* Utility Tile: Gifts */}
          <Card className="p-8 lg:col-span-1 bg-pink-50 border-4 border-pink-300 transition hover:shadow-xl hover:border-pink-400">
            <h3 className="text-2xl font-bold mb-6 text-pink-800 flex items-center gap-3">
              <lucide_react_1.Gift className="w-6 h-6"/>
              Send a Gift
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">Instantly gift any book to friends or family via email or SMS.</p>
              <div className="bg-white p-4 rounded-lg border border-pink-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Gift History</p>
                <p className="text-gray-600 text-sm">You've gifted 0 books this month.</p>
              </div>
              <Button onClick={() => router.push("/gifts")} className="bg-pink-600 hover:bg-pink-700 w-full">
                Browse Books to Gift
              </Button>
            </div>
          </Card>

          {/* Utility Tile: Settings */}
          <Card className="p-8 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <lucide_react_1.Settings className="w-6 h-6 text-gray-600"/>
              Settings
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">Manage your profile, preferences, and account security in one place.</p>
              <div className="space-y-2">
                <Button onClick={() => setLocation("/profile")} variant="outline" className="w-full justify-start text-gray-700 hover:text-amber-700 hover:border-amber-400">
                  <span className="ml-2">Edit Profile & Preferences</span>
                </Button>
                <Button onClick={() => setLocation("/security")} variant="outline" className="w-full justify-start text-gray-700 hover:text-amber-700 hover:border-amber-400">
                  <span className="ml-2">Security & Devices</span>
                </Button>
              </div>
            </div>
          </Card>

        </section>
      </main>
    </div>);
}
