"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
// --- 1. Custom Button Component (Styled like shadcn/ui but with more warmth)
const Button = ({ children, onClick, className = '', variant = 'default', size = 'default' }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500';
    let variantClasses;
    switch (variant) {
        case 'warm':
            // Primary Warm Button: Amber fill
            variantClasses = 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/30';
            break;
        case 'outline':
            // Outline Secondary Button
            variantClasses = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm';
            break;
        default:
            // Default Primary Button: Slate/Blue fill
            variantClasses = 'bg-slate-700 text-white hover:bg-slate-800 shadow-md shadow-slate-500/20';
    }
    const sizeClasses = size === 'lg' ? 'h-12 px-8 text-lg' : 'h-10 px-4 text-base';
    return (<button onClick={onClick} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {children}
    </button>);
};
// --- 2. Custom Card Component
const Card = ({ children, className = '' }) => (<div className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100 ${className}`}>
    {children}
  </div>);
// --- 3. Custom Header Component
const Header = () => {
    const router = (0, router_1.useRouter)();
    return (<header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-amber-600 cursor-pointer" onClick={() => router.push('/')}>
          EduAudio <span className="text-slate-700">| Learn</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <button onClick={() => router.push('/library')} className="text-gray-600 hover:text-amber-600 font-medium transition">
            Library
          </button>
          <button onClick={() => router.push('/audiobook-creator')} className="text-gray-600 hover:text-amber-600 font-medium transition">
            Creator
          </button>
          <button onClick={() => router.push('/reading-analytics')} className="text-gray-600 hover:text-amber-600 font-medium transition">
            Analytics
          </button>
        </nav>
        <Button size="default" variant="default" onClick={() => router.push('/login')}>
          Sign In
        </Button>
      </div>
    </header>);
};
// --- 4. Custom Footer Component
const Footer = () => {
    const router = (0, router_1.useRouter)();
    return (<footer className="bg-slate-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <button onClick={() => router.push('/about')} className="text-slate-300 hover:text-amber-400">
            About
          </button>
          <button onClick={() => router.push('/privacy')} className="text-slate-300 hover:text-amber-400">
            Privacy
          </button>
          <button onClick={() => router.push('/terms')} className="text-slate-300 hover:text-amber-400">
            Terms
          </button>
          <button onClick={() => router.push('/contact')} className="text-slate-300 hover:text-amber-400">
            Contact
          </button>
        </div>
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} EduAudio Learning Platform. All rights reserved.
        </p>
      </div>
    </footer>);
};
// --- Main Component (Replacing 'Home' with 'App') ---
const App = () => {
    const router = (0, router_1.useRouter)();
    const handleNavigation = (path) => {
        router.push(path);
    };
    return (<div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header />

      {/* Hero Section - Highly Styled */}
      <section className="relative overflow-hidden pt-24 pb-32 bg-slate-900 text-white shadow-inner-lg">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-color-amber-500),_transparent_80%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Discover Your Next Great <span className="text-amber-400">Read</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Explore educational books with integrated audio support. Perfect for students, teachers, and lifelong learners seeking engaging content.
          </p>

          <div className="flex gap-4 justify-center">
            <Button variant="warm" size="lg" onClick={() => handleNavigation("/audiobook-creator")}>
              Start Creating Audiobooks
            </Button>
            <Button size="lg" variant="warm" className="px-8 py-4 text-lg font-bold" onClick={() => router.push('/library')}>
              Browse Library
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Access Card Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 flex-grow">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Feature Summary */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600 mb-2 block">
              Seamless Learning
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
              Read, Listen, and <span className='text-amber-600'>Master</span> the Material.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore a growing library of quality educational content with integrated audio narration and personalized reading analytics to track your progress and retention.
            </p>
            <div className="flex gap-4">
              <Button variant="default" size="default" onClick={() => router.push('/library')} className="w-full">
                Start Learning
              </Button>
              <Button variant="outline" onClick={() => handleNavigation("/reading-analytics")}>
                Check Your Progress
              </Button>
            </div>
          </div>

          {/* Action Card */}
          <Card className="p-8 md:p-10 shadow-2xl">
            <div className="mb-4">
              <span className="text-amber-600 text-3xl mb-2 block">📚</span>
              <h3 className="text-2xl font-bold text-slate-800">Jump Back In</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Continue reading your last book or quickly find new resources to aid your studies. Your progress is saved automatically.
            </p>
            <Button variant="default" className="w-full" onClick={() => handleNavigation("/library")}>
              Go to Your Library
            </Button>
          </Card>

        </div>
      </main>

      <Footer />
    </div>);
};
exports.default = App;
