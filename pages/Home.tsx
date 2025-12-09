import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

// --- 3. Custom Header Component
const Header = () => {
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div
          className="text-2xl font-bold text-amber-600 cursor-pointer"
          onClick={() => setLocation('/')}
        >
          QuantumMint <span className="text-slate-700">| Learn</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => setLocation('/library')}
            className="text-gray-600 hover:text-amber-600 font-medium transition"
          >
            Library
          </button>
          <button
            onClick={() => setLocation('/seller-dashboard')}
            className="text-gray-600 hover:text-amber-600 font-medium transition"
          >
            Creator
          </button>
          <button
            onClick={() => setLocation('/reading-analytics')}
            className="text-gray-600 hover:text-amber-600 font-medium transition"
          >
            Analytics
          </button>
        </nav>
        <Button
          size="md"
          variant="primary"
          onClick={() => setLocation('/login')}
        >
          Sign In
        </Button>
      </div>
    </header>
  );
};

// --- 4. Custom Footer Component
const Footer = () => {
  const [, setLocation] = useLocation();

  return (
    <footer className="bg-slate-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <button className="text-slate-300 hover:text-amber-400">About</button>
          <button className="text-slate-300 hover:text-amber-400">Privacy</button>
          <button className="text-slate-300 hover:text-amber-400">Terms</button>
          <button className="text-slate-300 hover:text-amber-400">Contact</button>
        </div>
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} QuantumMint Learning Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};


// --- Main Component ---
export const Home = () => {
  const [, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
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
            <Button className="bg-amber-600 hover:bg-amber-700 h-12 px-8 text-lg" onClick={() => handleNavigation("/seller-dashboard")}>
              Start Creating Audiobook
            </Button>
            <Button
              className="px-8 h-12 text-lg font-bold bg-maroon text-red-900 hover:bg-slate-500  hover:border-red-800"
              onClick={() => setLocation('/library')}
            >
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
              <Button
                onClick={() => setLocation('/library')}
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Start Learning
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleNavigation("/reading-analytics")}>
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
            <Button className="w-full bg-amber-600 text-white hover:bg-amber-700" onClick={() => handleNavigation("/library")}>
              Go to Your Library
            </Button>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
};



