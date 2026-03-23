import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Button = ({
    children,
    onClick,
    className = '',
    variant = 'default',
    size = 'default'
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'default' | 'warm' | 'outline';
    size?: 'default' | 'lg';
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500';

    let variantClasses;
    switch (variant) {
        case 'warm':
            variantClasses = 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/30';
            break;
        case 'outline':
            variantClasses = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm';
            break;
        default:
            variantClasses = 'bg-slate-700 text-white hover:bg-slate-800 shadow-md shadow-slate-500/20';
    }

    const sizeClasses = size === 'lg' ? 'h-12 px-8 text-lg' : 'h-10 px-4 text-base';

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
            {children}
        </button>
    );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100 ${className}`}>
        {children}
    </div>
);

const Home: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'QuantumMint - Educational Audiobooks Platform';
    }, []);

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
                            <span className="text-slate-700">- Sierra Books</span>
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
                    <Button size="default" variant="default" onClick={() => handleNavigation('/login')}>
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

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button variant="warm" size="lg" onClick={() => handleNavigation('/studio')}>
                            Start Creating Audiobooks
                        </Button>
                        <Button size="lg" variant="warm" className="px-8 py-4 text-lg font-bold" onClick={() => handleNavigation('/library')}>
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
                            <Button variant="default" size="default" onClick={() => handleNavigation('/library')} className="w-full">
                                Start Learning
                            </Button>
                            <Button variant="outline" onClick={() => handleNavigation('/analytics')}>
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
                        <Button variant="default" className="w-full" onClick={() => handleNavigation('/library')}>
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

