import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "@/_core/contexts/AuthContext";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import BookDetails from "./pages/BookDetails";
import Referrals from "./pages/Referrals";
import Gifts from "./pages/Gifts";
import CreateBook from "./pages/CreateBook";
import SellerDashboard from "./pages/SellerDashboard";
import AdvancedSellerRegistration from "./pages/AdvancedSellerRegistration";
import AudiobookCreator from "./pages/AudiobookCreator";
import SellerRegistration from "./pages/SellerRegistration";
import SellerOnboarding from "./pages/SellerOnboarding";
import Register from "./pages/Register";
import SellerRequest from "./pages/SellerRequest";
import AdminDashboard from "./pages/AdminDashboard";
import BookEditor from "./pages/BookEditor";
import AdminBookManagement from "./pages/AdminBookManagement";
import ReadingAnalytics from "./pages/ReadingAnalytics";
import AdminWalletManagement from "./pages/AdminWalletManagement";
import Checkout from "./pages/Checkout";
import AudiobookStudioPage from './pages/AudiobookStudio';
import AIAssistantsPage from './pages/AIAssistants';

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/library"} component={Library} />
      <Route path={"/book/:id"} component={BookDetails} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/wallet"} component={Wallet} />
      <Route path={"/referrals"} component={Referrals} />
      <Route path={"/gifts"} component={Gifts} />
      <Route path={"/create-book"} component={CreateBook} />
      <Route path={"/seller-dashboard"} component={SellerDashboard} />
      <Route path={"/audiobook-creator"} component={AudiobookCreator} />
      <Route path={"/seller-registration"} component={SellerRegistration} />
      <Route path={"/advanced-seller-registration"} component={AdvancedSellerRegistration} />
      <Route path={"/seller-onboarding"} component={SellerOnboarding} />
      <Route path={"/register"} component={Register} />
      <Route path={"/seller-request"} component={SellerRequest} />
      <Route path={"/admin-dashboard"} component={AdminDashboard} />
      <Route path={"/book-editor/:id"} component={BookEditor} />
      <Route path={"/admin-book-management"} component={AdminBookManagement} />
      <Route path={"/reading-analytics"} component={ReadingAnalytics} />
      <Route path={"/admin-wallet-management"} component={AdminWalletManagement} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/audiobook-studio"} component={AudiobookStudioPage} />
      <Route path={"/ai-assistants"} component={AIAssistantsPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
