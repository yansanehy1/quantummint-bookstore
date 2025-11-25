"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sonner_1 = require("@/components/ui/sonner");
const tooltip_1 = require("@/components/ui/tooltip");
const NotFound_1 = __importDefault(require("@/pages/NotFound"));
const wouter_1 = require("wouter");
const ErrorBoundary_1 = __importDefault(require("./components/ErrorBoundary"));
const ThemeContext_1 = require("./contexts/ThemeContext");
const AuthContext_1 = require("@/_core/contexts/AuthContext");
const Home_1 = __importDefault(require("./pages/Home"));
const Library_1 = __importDefault(require("./pages/Library"));
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
const Wallet_1 = __importDefault(require("./pages/Wallet"));
const BookDetails_1 = __importDefault(require("./pages/BookDetails"));
const Referrals_1 = __importDefault(require("./pages/Referrals"));
const Gifts_1 = __importDefault(require("./pages/Gifts"));
const CreateBook_1 = __importDefault(require("./pages/CreateBook"));
const SellerDashboard_1 = __importDefault(require("./pages/SellerDashboard"));
const AdvancedSellerRegistration_1 = __importDefault(require("./pages/AdvancedSellerRegistration"));
const AudiobookCreator_1 = __importDefault(require("./pages/AudiobookCreator"));
const SellerRegistration_1 = __importDefault(require("./pages/SellerRegistration"));
const SellerOnboarding_1 = __importDefault(require("./pages/SellerOnboarding"));
const Register_1 = __importDefault(require("./pages/Register"));
const SellerRequest_1 = __importDefault(require("./pages/SellerRequest"));
const AdminDashboard_1 = __importDefault(require("./pages/AdminDashboard"));
const BookEditor_1 = __importDefault(require("./pages/BookEditor"));
const AdminBookManagement_1 = __importDefault(require("./pages/AdminBookManagement"));
const ReadingAnalytics_1 = __importDefault(require("./pages/ReadingAnalytics"));
const AdminWalletManagement_1 = __importDefault(require("./pages/AdminWalletManagement"));
const Checkout_1 = __importDefault(require("./pages/Checkout"));
const AudiobookStudio_1 = __importDefault(require("./pages/AudiobookStudio"));
const AIAssistants_1 = __importDefault(require("./pages/AIAssistants"));
function Router() {
    return (<wouter_1.Switch>
      <wouter_1.Route path={"/"} component={Home_1.default}/>
      <wouter_1.Route path={"/library"} component={Library_1.default}/>
      <wouter_1.Route path={"/book/:id"} component={BookDetails_1.default}/>
      <wouter_1.Route path={"/dashboard"} component={Dashboard_1.default}/>
      <wouter_1.Route path={"/wallet"} component={Wallet_1.default}/>
      <wouter_1.Route path={"/referrals"} component={Referrals_1.default}/>
      <wouter_1.Route path={"/gifts"} component={Gifts_1.default}/>
      <wouter_1.Route path={"/create-book"} component={CreateBook_1.default}/>
      <wouter_1.Route path={"/seller-dashboard"} component={SellerDashboard_1.default}/>
      <wouter_1.Route path={"/audiobook-creator"} component={AudiobookCreator_1.default}/>
      <wouter_1.Route path={"/seller-registration"} component={SellerRegistration_1.default}/>
      <wouter_1.Route path={"/advanced-seller-registration"} component={AdvancedSellerRegistration_1.default}/>
      <wouter_1.Route path={"/seller-onboarding"} component={SellerOnboarding_1.default}/>
      <wouter_1.Route path={"/register"} component={Register_1.default}/>
      <wouter_1.Route path={"/seller-request"} component={SellerRequest_1.default}/>
      <wouter_1.Route path={"/admin-dashboard"} component={AdminDashboard_1.default}/>
      <wouter_1.Route path={"/book-editor/:id"} component={BookEditor_1.default}/>
      <wouter_1.Route path={"/admin-book-management"} component={AdminBookManagement_1.default}/>
      <wouter_1.Route path={"/reading-analytics"} component={ReadingAnalytics_1.default}/>
      <wouter_1.Route path={"/admin-wallet-management"} component={AdminWalletManagement_1.default}/>
      <wouter_1.Route path={"/checkout"} component={Checkout_1.default}/>
      <wouter_1.Route path={"/audiobook-studio"} component={AudiobookStudio_1.default}/>
      <wouter_1.Route path={"/ai-assistants"} component={AIAssistants_1.default}/>
      <wouter_1.Route path={"/404"} component={NotFound_1.default}/>
      <wouter_1.Route component={NotFound_1.default}/>
    </wouter_1.Switch>);
}
function App() {
    return (<ErrorBoundary_1.default>
      <ThemeContext_1.ThemeProvider defaultTheme="light">
        <tooltip_1.TooltipProvider>
          <AuthContext_1.AuthProvider>
            <sonner_1.Toaster />
            <Router />
          </AuthContext_1.AuthProvider>
        </tooltip_1.TooltipProvider>
      </ThemeContext_1.ThemeProvider>
    </ErrorBoundary_1.default>);
}
exports.default = App;
