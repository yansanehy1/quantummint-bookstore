
import React, { useState, useEffect } from 'react';
import { Router, Route, Switch, useLocation } from 'wouter';
import { Layout } from './components/layout/Layout';
import { Library } from './pages/Library';
import { Player } from './pages/Player';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Wallet } from './pages/Wallet';
import { SmartTools } from './pages/SmartTools';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { SystemSettings } from './pages/SystemSettings';
import { ManageUsers } from './pages/ManageUsers';
import { AiTutor } from './components/chat/AiTutor';
import { getCurrentUser, logout } from './web-frontend/src/services/store';
import { AdminConsole } from './pages/AdminConsole';
import { SellerRegistration } from './pages/SellerRegistration';
import { BookEditor } from './pages/BookEditor';
import { Checkout } from './pages/Checkout';
import { Gifts } from './pages/Gifts';
import { ReadingAnalytics } from './pages/ReadingAnalytics';
import { Referrals } from './pages/Referrals';
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerOnboarding } from './pages/SellerOnboarding';
import { NotFound } from './pages/NotFound';
import { Discover } from './pages/Discover';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { AllBooks, Audiobooks, VideoBooks as VideoBooksOld, NewReleases, Bestsellers } from './pages/BookCatalog';
import { VideoBooks } from './pages/VideoBooks';

const App: React.FC = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [location, setLocation] = useLocation();

  // Watch for auth changes
  useEffect(() => {
    const interval = setInterval(() => {
      const u = getCurrentUser();
      if (u?.id !== user?.id) {
        setUser(u);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setLocation('/');
  };

  // If not logged in and not on public pages, show Login or Home
  const publicRoutes = ['/', '/login', '/seller-registration'];
  if (!user && !publicRoutes.includes(location)) {
    if (location === '/login') return <Login />;
    return <Home />;
  }

  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/seller-registration" component={SellerRegistration} />

        {/* Protected Routes wrapped in Layout */}
        <Route path="/:rest*">
          <Layout onLogout={handleLogout}>
            <Switch>
              <Route path="/learner-dashboard">
                <LearnerDashboard onNavigate={(page, id) => setLocation(id ? `/${page}/${id}` : `/${page}`)} />
              </Route>
              <Route path="/admin-dashboard" component={AdminDashboard} />
              <Route path="/seller-dashboard" component={SellerDashboard} />
              <Route path="/library">
                <Library onSelectBook={(id) => setLocation(`/player/${id}`)} />
              </Route>
              <Route path="/player/:id">
                {params => <Player bookId={params.id} onBack={() => setLocation('/library')} />}
              </Route>
              <Route path="/wallet" component={Wallet} />
              <Route path="/tools" component={SmartTools} />
              <Route path="/settings" component={SystemSettings} />
              <Route path="/manage-users" component={ManageUsers} />
              <Route path="/admin-console" component={AdminConsole} />
              <Route path="/book-editor" component={BookEditor} />
              <Route path="/book-editor/:id">
                <BookEditor />
              </Route>
              <Route path="/checkout" component={Checkout} />
              <Route path="/gifts" component={Gifts} />
              <Route path="/reading-analytics" component={ReadingAnalytics} />
              <Route path="/referrals" component={Referrals} />
              <Route path="/seller-onboarding" component={SellerOnboarding} />

              {/* New Pages */}
              <Route path="/discover" component={Discover} />
              <Route path="/profile" component={Profile} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/books" component={AllBooks} />
              <Route path="/audiobooks" component={Audiobooks} />
              <Route path="/video-books" component={VideoBooks} />
              <Route path="/new-releases" component={NewReleases} />
              <Route path="/bestsellers" component={Bestsellers} />

              <Route component={NotFound} />
            </Switch>
            {user && user.role !== 'ADMIN' && <AiTutor />}
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;



