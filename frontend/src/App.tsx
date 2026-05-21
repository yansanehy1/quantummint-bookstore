import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import Sidebar from './components/layout/Sidebar';
import type { User } from './types/types';

// Loading Component
const PageLoader = () => (
  <div className="h-full w-full flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-600"></div>
  </div>
);

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Library = lazy(() => import('./pages/Library'));
const Studio = lazy(() => import('./pages/Studio'));
const Reader = lazy(() => import('./pages/Reader'));
const Login = lazy(() => import('./pages/Login'));
const MapsAgent = lazy(() => import('./pages/MapsAgent'));
const VisionAgent = lazy(() => import('./pages/VisionAgent'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const SellerPortal = lazy(() => import('./pages/SellerPortal'));
const SellerOnboarding = lazy(() => import('./pages/SellerOnboarding'));
const SellerRegistration = lazy(() => import('./pages/SellerRegistration'));
const SellerRequest = lazy(() => import('./pages/SellerRequest'));
const Register = lazy(() => import('./pages/Register'));
const Referrals = lazy(() => import('./pages/Referrals'));
const ReadingAnalytics = lazy(() => import('./pages/ReadingAnalytics'));
const LearnerDashboard = lazy(() => import('./pages/LearnerDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminBookManagement = lazy(() => import('./pages/AdminBookManagement'));
const AdminSellerManagement = lazy(() => import('./pages/AdminSellerManagement'));
const AdminWalletManagement = lazy(() => import('./pages/AdminWalletManagement'));
const AdminPayoutManagement = lazy(() => import('./pages/AdminPayoutManagement'));
const AdminRefundManagement = lazy(() => import('./pages/AdminRefundManagement'));
const AdminPromotions = lazy(() => import('./pages/AdminPromotions'));
const SRSReview = lazy(() => import('./pages/SRSReview'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Support = lazy(() => import('./pages/Support'));
const Settings = lazy(() => import('./pages/Settings'));
const BookEditor = lazy(() => import('./pages/BookEditor'));
const BatchSubscription = lazy(() => import('./pages/BatchSubscription'));
const AdminGroups = lazy(() => import('./pages/AdminGroups'));

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Library />} />
            <Route path="/library" element={<Library />} />
            <Route path="/dashboard" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />

            <Route path="/analytics" element={<ProtectedRoute><ReadingAnalytics /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
            <Route path="/subscriptions/batch" element={<ProtectedRoute><BatchSubscription /></ProtectedRoute>} />
            <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><SRSReview /></ProtectedRoute>} />

            <Route path="/maps" element={<ProtectedRoute><MapsAgent /></ProtectedRoute>} />
            <Route path="/vision" element={<ProtectedRoute><VisionAgent /></ProtectedRoute>} />

            {/* Seller Routes */}
            <Route path="/studio" element={<ProtectedRoute roles={['seller']}><Studio onPreview={() => { }} /></ProtectedRoute>} />
            <Route path="/seller/dashboard" element={<ProtectedRoute roles={['seller']}><SellerPortal /></ProtectedRoute>} />
            <Route path="/seller/onboarding" element={<ProtectedRoute roles={['seller']}><SellerOnboarding /></ProtectedRoute>} />
            <Route path="/seller/registration" element={<ProtectedRoute roles={['seller']}><SellerRegistration /></ProtectedRoute>} />
            <Route path="/seller/request" element={<ProtectedRoute><SellerRequest /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/books" element={<ProtectedRoute roles={['admin']}><AdminBookManagement /></ProtectedRoute>} />
            <Route path="/admin/sellers" element={<ProtectedRoute roles={['admin']}><AdminSellerManagement /></ProtectedRoute>} />
            <Route path="/admin/wallet" element={<ProtectedRoute roles={['admin']}><AdminWalletManagement /></ProtectedRoute>} />
            <Route path="/admin/payouts" element={<ProtectedRoute roles={['admin']}><AdminPayoutManagement /></ProtectedRoute>} />
            <Route path="/admin/refunds" element={<ProtectedRoute roles={['admin']}><AdminRefundManagement /></ProtectedRoute>} />
            <Route path="/admin/groups" element={<ProtectedRoute roles={['admin']}><AdminGroups /></ProtectedRoute>} />
            <Route path="/admin/promotions" element={<ProtectedRoute roles={['admin']}><AdminPromotions /></ProtectedRoute>} />

            {/* Public Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />

            {/* Reader/Editor */}
            <Route path="/read/:bookId" element={<ProtectedRoute><Reader /></ProtectedRoute>} />
            <Route path="/edit/:bookId" element={<ProtectedRoute roles={['seller']}><BookEditor /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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

