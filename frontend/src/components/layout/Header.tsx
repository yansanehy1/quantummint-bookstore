import { BookOpen, Home, Library, LayoutDashboard, Wallet, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-3 text-white hover:text-amber-100 transition-colors duration-200 group"
            aria-label="Sierra Books Home"
          >
            <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-all duration-200 group-hover:scale-110">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight hidden sm:inline">
              Sierra Books
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-2 md:gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base"
              onClick={() => setLocation("/")}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base"
              onClick={() => setLocation("/library")}
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base"
              onClick={() => setLocation("/dashboard")}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 font-medium text-sm md:text-base"
              onClick={() => setLocation("/wallet")}
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/30 text-white hover:bg-white/40 rounded-xl transition-all duration-200 font-semibold text-sm md:text-base shadow-md"
              onClick={() => setLocation("/reading-analytics")}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200 font-bold text-sm md:text-base shadow-md"
              onClick={() => setLocation("../../pages/login")}
            >
              <span>Sign In</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
