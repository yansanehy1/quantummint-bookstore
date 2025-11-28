import React, { useState, useEffect } from 'react';
import { ViewState, Book } from './types';
import Marketplace from './pages/Marketplace';
import Studio from './pages/Studio';
import Reader from './pages/Reader';
import Login from './pages/Login';
import MapsAgent from './pages/MapsAgent';
import VisionAgent from './pages/VisionAgent';
import Checkout from './pages/Checkout';
import Wallet from './pages/Wallet';
import SellerDashboard from './pages/SellerDashboard';
import SellerOnboarding from './pages/SellerOnboarding';
import SellerRegistration from './pages/SellerRegistration';
import SellerRequest from './pages/SellerRequest';
import Register from './pages/Register';
import Referrals from './pages/Referrals';
import ReadingAnalytics from './pages/ReadingAnalytics';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookManagement from './pages/AdminBookManagement';
import AdminWalletManagement from './pages/AdminWalletManagement';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import BookReader from './pages/BookReader';
import BookEditor from './pages/BookEditor';
import Home from './pages/Home';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { BookOpen, ShoppingBag, Mic2, LayoutGrid, LogOut, Map, ScanEye, UserCircle, Wallet as WalletIcon, LayoutDashboard, UserPlus, Users, BarChart2, Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { view, setView } = useNavigation();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [previousView, setPreviousView] = useState<ViewState>('MARKETPLACE');

  const handleReadBook = (book: Book) => {
    setPreviousView(view); // Remember where we came from
    setSelectedBook(book);
    setView('READER');
  };

  const handleStudioPreview = (book: Book) => {
    setPreviousView('STUDIO'); // Explicitly set return path
    setSelectedBook(book);
    setView('READER');
  };

  const closeReader = () => {
    setView(previousView); // Go back to previous view (Studio or Marketplace)
    setSelectedBook(null);
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600"></div></div>;
  }

  if (!isAuthenticated) {
    if (view === 'REGISTER') return <Register />;
    if (view === 'SELLER_REQUEST') return <SellerRequest />;
    if (view === 'HOME') return <Home />;
    return <Login />;
  }

  if (view === 'READER' && selectedBook) {
    return <Reader book={selectedBook} onClose={closeReader} />;
  }

  if (view === 'CHECKOUT') {
    return <Checkout />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex z-40">
        <div>
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
            <img src="/logo.png" alt="QuantumMint Logo" className="w-10 h-10 rounded-lg object-contain" />
            <span className="ml-3 font-bold text-xl text-slate-800 hidden lg:block">QuantumMint</span>
          </div>

          <nav className="p-4 space-y-2">
            <NavItem
              icon={<LayoutGrid />}
              label="Home"
              isActive={view === 'HOME'}
              onClick={() => setView('HOME')}
            />
            <NavItem
              icon={<ShoppingBag />}
              label="Marketplace"
              isActive={view === 'MARKETPLACE'}
              onClick={() => setView('MARKETPLACE')}
            />
            <NavItem
              icon={<LayoutGrid />}
              label="My Library"
              isActive={view === 'LIBRARY'}
              onClick={() => setView('LIBRARY')}
            />
            <NavItem
              icon={<BarChart2 />}
              label="Reading Analytics"
              isActive={view === 'READING_ANALYTICS'}
              onClick={() => setView('READING_ANALYTICS')}
            />
            <NavItem
              icon={<WalletIcon />}
              label="Wallet"
              isActive={view === 'WALLET'}
              onClick={() => setView('WALLET')}
            />
            <NavItem
              icon={<Users />}
              label="Referrals"
              isActive={view === 'REFERRALS'}
              onClick={() => setView('REFERRALS')}
            />

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:block">Tools</p>
            </div>

            <NavItem
              icon={<Map />}
              label="Maps Agent"
              isActive={view === 'MAPS'}
              onClick={() => setView('MAPS')}
            />
            <NavItem
              icon={<ScanEye />}
              label="Vision Agent"
              isActive={view === 'VISION'}
              onClick={() => setView('VISION')}
            />

            {user?.role === 'educator' && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:block">Creator</p>
                </div>
                <NavItem
                  icon={<Mic2 />}
                  label="Audiobook Studio"
                  isActive={view === 'STUDIO'}
                  onClick={() => setView('STUDIO')}
                />
                <NavItem
                  icon={<LayoutDashboard />}
                  label="Seller Dashboard"
                  isActive={view === 'SELLER_DASHBOARD'}
                  onClick={() => setView('SELLER_DASHBOARD')}
                />
                <NavItem
                  icon={<UserPlus />}
                  label="Seller Onboarding"
                  isActive={view === 'SELLER_ONBOARDING'}
                  onClick={() => setView('SELLER_ONBOARDING')}
                />
                <NavItem
                  icon={<UserCircle />}
                  label="Seller Registration"
                  isActive={view === 'SELLER_REGISTRATION'}
                  onClick={() => setView('SELLER_REGISTRATION')}
                />
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:block">Admin</p>
                </div>
                <NavItem
                  icon={<Shield />}
                  label="Admin Dashboard"
                  isActive={view === 'ADMIN_DASHBOARD'}
                  onClick={() => setView('ADMIN_DASHBOARD')}
                />
              </>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt="Av" /> : <UserCircle className="text-slate-500" />}
            </div>
            <div className="ml-3 hidden lg:block">
              <p className="text-sm font-medium text-slate-900 truncate w-32">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center p-3 text-slate-500 hover:text-red-600 transition-colors w-full rounded-lg hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="ml-3 font-medium hidden lg:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <span className="font-bold text-lg text-slate-800">QuantumMint</span>
        <div className="flex gap-4">
          <button onClick={() => setView('MARKETPLACE')} className={view === 'MARKETPLACE' ? 'text-quantum-600' : 'text-slate-500'}>
            <ShoppingBag />
          </button>
          <button onClick={() => setView('MAPS')} className={view === 'MAPS' ? 'text-quantum-600' : 'text-slate-500'}>
            <Map />
          </button>
          <button onClick={() => setView('WALLET')} className={view === 'WALLET' ? 'text-quantum-600' : 'text-slate-500'}>
            <WalletIcon />
          </button>
          <button onClick={logout} className="text-slate-500">
            <LogOut />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0 scroll-smooth">
        {view === 'MARKETPLACE' && <Marketplace onSelectBook={handleReadBook} />}
        {view === 'WALLET' && <Wallet />}
        {view === 'LIBRARY' && (
          <div className="p-10 text-center text-slate-500 flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-medium text-slate-800">Your library is empty</h2>
            <p className="text-slate-500 mt-2">Purchased books will appear here.</p>
            <button onClick={() => setView('MARKETPLACE')} className="mt-4 text-quantum-600 hover:underline">Browse Store</button>
          </div>
        )}
        {view === 'MAPS' && <MapsAgent />}
        {view === 'VISION' && <VisionAgent />}
        {view === 'STUDIO' && user?.role === 'educator' && <Studio onPreview={handleStudioPreview} />}
        {view === 'SELLER_DASHBOARD' && <SellerDashboard />}
        {view === 'SELLER_ONBOARDING' && <SellerOnboarding />}
        {view === 'SELLER_REGISTRATION' && <SellerRegistration />}
        {view === 'SELLER_REQUEST' && <SellerRequest />}
        {view === 'REFERRALS' && <Referrals />}
        {view === 'READING_ANALYTICS' && <ReadingAnalytics />}
        {view === 'NOT_FOUND' && <NotFound />}
        {view === 'ADMIN_DASHBOARD' && <AdminDashboard />}
        {view === 'ADMIN_BOOK_MANAGEMENT' && <AdminBookManagement />}
        {view === 'ADMIN_WALLET_MANAGEMENT' && <AdminWalletManagement />}
        {view === 'PRIVACY' && <PrivacyPolicy />}
        {view === 'TERMS' && <TermsOfService />}
        {view === 'ABOUT' && <AboutUs />}
        {view === 'CONTACT' && <Contact />}
        {view === 'FAQ' && <FAQ />}
        {view === 'SUPPORT' && <Support />}
        {view === 'HOME' && <Home />}
        {view === 'BOOK_READER' && <BookReader />}
        {view === 'BOOK_EDITOR' && <BookEditor />}
        {view === 'STUDIO' && user?.role !== 'educator' && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Educator Access Only</h2>
            <p className="text-slate-600 max-w-md">Please log in as an educator to access the Audiobook Studio Pro tools.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center w-full p-3 rounded-lg transition-all duration-200 group
      ${isActive ? 'bg-quantum-50 text-quantum-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
    `}
  >
    <span className={`transition-colors ${isActive ? 'text-quantum-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
    </span>
    <span className="ml-3 font-medium hidden lg:block">{label}</span>
  </button>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;