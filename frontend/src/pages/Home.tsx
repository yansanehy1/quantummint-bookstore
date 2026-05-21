import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BrainCircuit, BookOpen, Sigma, Mic } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import api from '../utils/api';
import type { SearchResults, Book, ConceptDefinition } from '../types/types';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        document.title = 'QuantumMint - Educational Audiobooks Platform';
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await api.search.deepSearch(searchQuery);
            setSearchResults(response);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Header/Navbar */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
                        <img src="/logo.png" alt="QuantumMint Logo" className="w-10 h-10 rounded-lg object-contain" />
                        <div className="text-2xl font-bold">
                            <span className="text-amber-600">Quantummint Bookstore</span>{' '}
                            <span className="text-slate-700">- QuantumMint</span>
                        </div>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        <button onClick={() => handleNavigation('/library')} className="text-gray-600 hover:text-amber-600 font-medium transition">
                            Library
                        </button>
                        <button onClick={() => handleNavigation('/studio')} className="text-gray-600 hover:text-amber-600 font-medium transition">
                            Creator
                        </button>
                        <button onClick={() => handleNavigation('/analytics')} className="text-gray-600 hover:text-amber-600 font-medium transition">
                            Analytics
                        </button>
                    </nav>
                    <Button size="md" variant="secondary" onClick={() => handleNavigation('/login')}>
                        Sign In
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32 bg-slate-900 text-white shadow-inner-lg">
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Discover Your Next Great <span className="text-amber-400">Read</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                        Explore educational books with integrated audio support. Perfect for students, teachers, and lifelong learners seeking engaging content.
                    </p>

                    {/* Deep Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12 relative">
                        <form onSubmit={handleSearch} className="relative">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for books, formulas, or concepts (e.g., 'E=mc^2' or 'mitosis')..."
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-md transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            {isSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />}
                        </form>

                        {/* Search Results Dropdown */}
                        {searchResults && (
                            <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl overflow-hidden z-[60] text-left border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Search Results</h3>
                                    <button onClick={() => setSearchResults(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {/* Books */}
                                    {searchResults.results.books.length > 0 && (
                                        <div className="p-4">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Books</p>
                                            <div className="space-y-3">
                                                {searchResults.results.books.map((book: Book) => (
                                                    <div key={book.id} onClick={() => handleNavigation(`/book/${book.id}`)} className="flex items-center gap-3 cursor-pointer group">
                                                        <div className="w-10 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                                            <BookOpen size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{book.title}</p>
                                                            <p className="text-xs text-slate-500">{book.author}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Concepts/Symbols */}
                                    {searchResults.results.concepts.length > 0 && (
                                        <div className="p-4 border-t border-slate-100">
                                            <p className="text-[10px] font-bold text-purple-600 uppercase mb-2">Concepts & Symbols</p>
                                            <div className="space-y-3">
                                                {searchResults.results.concepts.map((concept: ConceptDefinition) => (
                                                    <div key={concept.id} onClick={() => handleNavigation(`/book/${concept.Formula.Book.id}`)} className="cursor-pointer group">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{concept.symbol}</span>
                                                            <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600 transition-colors">{concept.spoken}</span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 line-clamp-1">{concept.definition}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {searchResults.results.books.length === 0 && searchResults.results.concepts.length === 0 && (
                                        <div className="p-12 text-center text-slate-400">
                                            <Search className="mx-auto mb-3 opacity-20 w-8 h-8" />
                                            <p className="text-sm">No exact matches found. Try a different term.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button variant="primary" size="lg" onClick={() => handleNavigation('/studio')}>
                            Start Creating Audiobooks
                        </Button>
                        <Button size="lg" variant="primary" className="px-8" onClick={() => handleNavigation('/library')}>
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
                            Read, Listen, and <span className="text-amber-600">Master</span> the Material.
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Explore a growing library of quality educational content with integrated audio narration and personalized reading analytics to track your progress and retention.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="secondary" size="md" onClick={() => handleNavigation('/library')} className="w-full">
                                Start Learning
                            </Button>
                            <Button variant="outline" onClick={() => handleNavigation('/analytics')}>
                                Check Your Progress
                            </Button>
                        </div>
                    </div>

                    {/* Action Card */}
                    <Card className="p-8 md:p-10 shadow-2xl rounded-3xl">
                        <div className="mb-4">
                            <span className="text-amber-600 text-3xl mb-2 block">📚</span>
                            <h3 className="text-2xl font-bold text-slate-800">Jump Back In</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Continue reading your last book or quickly find new resources to aid your studies. Your progress is saved automatically.
                        </p>
                        <Button variant="secondary" className="w-full" onClick={() => handleNavigation('/library')}>
                            Go to Your Library
                        </Button>
                    </Card>
                </div>

                {/* Features Grid */}
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Why Choose QuantumMint?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need for an enhanced learning experience, all in one platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6">
                            <div className="text-4xl mb-4">🎧</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">AI-Powered Audiobooks</h3>
                            <p className="text-gray-600">
                                Transform any textbook into an engaging audiobook with our advanced AI narration technology.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Learning Analytics</h3>
                            <p className="text-gray-600">
                                Track your reading progress, comprehension, and learning patterns to optimize your study strategy.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Flexible Access</h3>
                            <p className="text-gray-600">
                                Pay per use or own books permanently. Support for USD/SLL with mobile money integration.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <div className="text-4xl mb-4">🎁</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Gift System</h3>
                            <p className="text-gray-600">
                                Send educational materials as gifts to students via email or SMS.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Referral Rewards</h3>
                            <p className="text-gray-600">
                                Earn 2 hours of reading/listening time by referring friends who sign up and purchase books, helping expand access to education.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Mobile First</h3>
                            <p className="text-gray-600">
                                Optimized for smartphones and low-bandwidth environments across Sierra Leone.
                            </p>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24 text-center">
                    <Card className="p-12 bg-gradient-to-br from-amber-50 to-orange-50">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
                            Ready to Transform Your Learning?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of students and educators already using QuantumMint to enhance their educational journey.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button variant="warm" size="lg" onClick={() => handleNavigation('/register')}>
                                Get Started Free
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => handleNavigation('/about')}>
                                Learn More
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-800 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-amber-400">QuantumMint</h3>
                            <p className="text-slate-400 text-sm">
                                Revolutionizing education in Sierra Leone through accessible digital content.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm">
                                <li><button onClick={() => handleNavigation('/library')} className="text-slate-400 hover:text-amber-400">Library</button></li>
                                <li><button onClick={() => handleNavigation('/studio')} className="text-slate-400 hover:text-amber-400">Creator Studio</button></li>
                                <li><button onClick={() => handleNavigation('/analytics')} className="text-slate-400 hover:text-amber-400">Analytics</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><button onClick={() => handleNavigation('/about')} className="text-slate-400 hover:text-amber-400">About Us</button></li>
                                <li><button onClick={() => handleNavigation('/faq')} className="text-slate-400 hover:text-amber-400">FAQ</button></li>
                                <li><button onClick={() => handleNavigation('/support')} className="text-slate-400 hover:text-amber-400">Support</button></li>
                                <li><button onClick={() => handleNavigation('/contact')} className="text-slate-400 hover:text-amber-400">Contact</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><button onClick={() => handleNavigation('/privacy')} className="text-slate-400 hover:text-amber-400">Privacy Policy</button></li>
                                <li><button onClick={() => handleNavigation('/terms')} className="text-slate-400 hover:text-amber-400">Terms of Service</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-700 pt-8 text-center">
                        <p className="text-slate-400 text-sm">
                            &copy; {new Date().getFullYear()} QuantumMint Bookstore. All rights reserved.
                        </p>
                        <p className="text-slate-500 text-xs mt-2">
                            Freetown, Sierra Leone | help@quantummint.net
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

