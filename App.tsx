import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import Sidebar from './components/layout/Sidebar';
import { User } from './types';

// Pages
// Pages
import Library from './pages/Library';
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
import Settings from './pages/Settings';

import BookEditor from './pages/BookEditor';
import Home from './pages/Home';

import { ShoppingBag, Map, Wallet as WalletIcon, LogOut, BookOpen } from 'lucide-react';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: User['role'][] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-dvh bg-slate-50 font-sans text-slate-900">
      <Sidebar />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <span className="font-bold text-lg text-slate-800">QuantumMint</span>
        <div className="flex gap-4">
          <a href="/library" aria-label="Library" className="text-slate-500"><BookOpen /></a>
          <a href="/maps" aria-label="Maps" className="text-slate-500"><Map /></a>
          <a href="/wallet" aria-label="Wallet" className="text-slate-500"><WalletIcon /></a>
          <button onClick={logout} aria-label="Logout" className="text-slate-500"><LogOut /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0 scroll-smooth">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Library />} />
          <Route path="/library" element={<Library />} />

          <Route path="/analytics" element={<ProtectedRoute><ReadingAnalytics /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          <Route path="/maps" element={<ProtectedRoute><MapsAgent /></ProtectedRoute>} />
          <Route path="/vision" element={<ProtectedRoute><VisionAgent /></ProtectedRoute>} />

          {/* Educator Routes */}
          <Route path="/studio" element={<ProtectedRoute roles={['educator']}><Studio onPreview={() => { }} /></ProtectedRoute>} />
          <Route path="/seller/dashboard" element={<ProtectedRoute roles={['educator']}><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/onboarding" element={<ProtectedRoute roles={['educator']}><SellerOnboarding /></ProtectedRoute>} />
          <Route path="/seller/registration" element={<ProtectedRoute roles={['educator']}><SellerRegistration /></ProtectedRoute>} />
          <Route path="/seller/request" element={<ProtectedRoute><SellerRequest /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/books" element={<ProtectedRoute roles={['admin']}><AdminBookManagement /></ProtectedRoute>} />
          <Route path="/admin/wallet" element={<ProtectedRoute roles={['admin']}><AdminWalletManagement /></ProtectedRoute>} />

          {/* Public Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />

          {/* Reader/Editor */}
          <Route path="/read/:bookId" element={<ProtectedRoute><Reader /></ProtectedRoute>} />
          <Route path="/edit/:bookId" element={<ProtectedRoute roles={['educator']}><BookEditor /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>

    </Router>
  );
};

export default App;

