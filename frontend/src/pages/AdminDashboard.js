"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = require("react");
const wouter_1 = require("wouter");
const AuthContext_1 = require("@/_core/contexts/AuthContext");
// NOTE: I am keeping the lucide-react icons available,
// but the component imports from a dummy path "@/components/ui/button" and "@/components/ui/card".
// Since I must operate in a single file, I'll define simple local components for Button and Card
// using standard Tailwind CSS to ensure the app runs and looks great.
const lucide_react_1 = require("lucide-react");
// --- START: Local UI Component Definitions (Simulating shadcn/ui) ---
const Button = ({ children, className = "", variant = "default", onClick }) => {
    let baseClasses = "font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md";
    let variantClasses = "";
    switch (variant) {
        case "outline":
            variantClasses = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
            break;
        case "destructive":
            variantClasses = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
            break;
        case "subtle":
            variantClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-none";
            break;
        default:
            // Primary/Default
            variantClasses = "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500";
            break;
    }
    return (<button className={`${baseClasses} ${variantClasses} ${className}`} onClick={onClick}>
      {children}
    </button>);
};
const Card = ({ children, className = "" }) => (<div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>);
function App() {
    const { user } = (0, AuthContext_1.useAuthContext)();
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [activeTab, setActiveTab] = (0, react_1.useState)("overview");
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [filterStatus, setFilterStatus] = (0, react_1.useState)("all");
    const [sellerRequests, setSellerRequests] = (0, react_1.useState)([
        {
            id: "1",
            name: "Ahmed Hassan",
            email: "ahmed@example.com",
            expertise: "Mathematics & Physics",
            experience: "10 years teaching experience",
            status: "pending",
            submittedDate: "2024-01-15",
            motivation: "I want to share my teaching methods with students across Sierra Leone and believe my educational materials are top-tier.",
        },
        {
            id: "2",
            name: "Fatima Conteh",
            email: "fatima@example.com",
            expertise: "English Literature",
            experience: "8 years in education",
            status: "pending",
            submittedDate: "2024-01-14",
            motivation: "Passionate about making quality literature education accessible to rural students via digital resources.",
        },
        {
            id: "3",
            name: "Ibrahim Koroma",
            email: "ibrahim@example.com",
            expertise: "Computer Science",
            experience: "5 years professional experience",
            status: "approved",
            submittedDate: "2024-01-10",
            motivation: "Want to teach programming to the next generation of West African innovators.",
        },
        {
            id: "4",
            name: "Mariama Jallow",
            email: "mariama@example.com",
            expertise: "Biology",
            experience: "12 years teaching",
            status: "approved",
            submittedDate: "2024-01-08",
            motivation: "Creating interactive biology learning materials, especially focused on local ecology.",
        },
        {
            id: "5",
            name: "Musa Bangura",
            email: "musa@example.com",
            expertise: "History & Civics",
            experience: "2 years tutoring",
            status: "rejected",
            submittedDate: "2024-01-01",
            motivation: "A fresh graduate looking to contribute to quality education.",
        },
    ]);
    const handleApprove = (id) => {
        setSellerRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)));
    };
    const handleReject = (id) => {
        setSellerRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)));
    };
    const filteredRequests = sellerRequests.filter((req) => {
        const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.expertise.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || req.status === filterStatus;
        return matchesSearch && matchesFilter;
    });
    const stats = {
        totalRequests: sellerRequests.length,
        pendingRequests: sellerRequests.filter((r) => r.status === "pending").length,
        approvedSellers: sellerRequests.filter((r) => r.status === "approved").length,
        rejectedRequests: sellerRequests.filter((r) => r.status === "rejected").length,
    };
    // Improved status color scheme
    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-50 text-green-700 ring-1 ring-green-200";
            case "rejected":
                return "bg-red-50 text-red-700 ring-1 ring-red-200";
            case "pending":
                return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
            default:
                return "bg-gray-100 text-gray-800 ring-1 ring-gray-300";
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <lucide_react_1.CheckCircle className="w-4 h-4 text-green-500"/>;
            case "rejected":
                return <lucide_react_1.XCircle className="w-4 h-4 text-red-500"/>;
            case "pending":
                return <lucide_react_1.Clock className="w-4 h-4 text-amber-500"/>;
            default:
                return null;
        }
    };
    // Statistics Card Component
    const StatCard = ({ title, value, icon, iconColor, valueColor }) => (<Card className="p-6 flex items-center justify-between transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl shadow-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-full ${iconColor} bg-opacity-10`}>
        {icon}
      </div>
    </Card>);
    return (<div className="min-h-screen bg-slate-50 font-sans">
      <style>{`
        /* Custom scrollbar for a cleaner look */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }
      `}</style>
      
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-amber-500/30">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <lucide_react_1.BookOpen className="w-8 h-8 text-amber-600 animate-pulse"/>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sierra Books Admin</h1>
          </div>
          <nav className="flex gap-6 items-center">
            <button onClick={() => setLocation("/")} className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Home
            </button>
            <button onClick={() => setLocation("/dashboard")} className="text-amber-600 font-bold border-b-2 border-amber-600 transition-colors">
              Dashboard
            </button>
            {/* Placeholder for user avatar/menu */}
            <lucide_react_1.Users className="w-6 h-6 text-gray-500 cursor-pointer hover:text-amber-600 transition-colors"/>
          </nav>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <section className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-xl text-gray-600">Review, manage, and monitor marketplace activity.</p>
        </section>

        {/* Tabs */}
        <div className="flex gap-6 mb-10 border-b border-gray-200">
          {[
            { id: "overview", label: "Platform Overview" },
            { id: "requests", label: `Seller Requests (${stats.pendingRequests})` },
            { id: "sellers", label: "Approved Sellers" },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 font-bold text-lg transition-all duration-300 ${activeTab === tab.id
                ? "text-amber-600 border-b-4 border-amber-600 bg-amber-50/50 rounded-t-lg"
                : "text-gray-500 hover:text-gray-800 hover:border-b-4 hover:border-gray-200"}`}>
              {tab.label}
            </button>))}
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (<>
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setLocation("/admin-book-management")} className="bg-blue-600 hover:bg-blue-700">
                <lucide_react_1.BookOpen className="w-5 h-5 mr-2"/>
                Manage Books & Content
              </Button>
              <Button onClick={() => setLocation("/admin-wallet-management")} className="bg-purple-600 hover:bg-purple-700">
                <lucide_react_1.Wallet className="w-5 h-5 mr-2"/>
                Financial Management
              </Button>
              {user?.role === 'admin' && (<Button variant="outline" className="text-sm px-3 py-2 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" onClick={() => window.open("https://quantum.quantummint.net", "_blank", "noopener,noreferrer")} title="Access restricted to administrators only">
                  Open Quantum Admin
                </Button>)}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Total Applications" value={stats.totalRequests} valueColor="text-gray-900" icon={<lucide_react_1.Users className="w-8 h-8 text-blue-600"/>} iconColor="bg-blue-600"/>
              <StatCard title="Pending Review" value={stats.pendingRequests} valueColor="text-amber-600" icon={<lucide_react_1.Clock className="w-8 h-8 text-amber-600"/>} iconColor="bg-amber-600"/>
              <StatCard title="Approved Sellers" value={stats.approvedSellers} valueColor="text-green-600" icon={<lucide_react_1.CheckCircle className="w-8 h-8 text-green-600"/>} iconColor="bg-green-600"/>
              <StatCard title="Rejected Applications" value={stats.rejectedRequests} valueColor="text-red-600" icon={<lucide_react_1.XCircle className="w-8 h-8 text-red-600"/>} iconColor="bg-red-600"/>
            </div>
          </>)}

        {/* Requests Tab Content */}
        {(activeTab === "requests" || activeTab === "sellers") && (<div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-inner border border-gray-100">
              <div className="flex-1 relative">
                <lucide_react_1.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input type="text" placeholder="Search by name, email, or expertise..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"/>
              </div>
              <div className="sm:w-1/3">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl appearance-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white cursor-pointer" aria-label="Filter status">
                  <option value="all">Filter: All Status</option>
                  <option value="pending">Filter: Pending</option>
                  <option value="approved">Filter: Approved</option>
                  <option value="rejected">Filter: Rejected</option>
                </select>
              </div>
            </div>

            {/* Requests List/Seller List */}
            <div className="space-y-5">
              {filteredRequests.filter(req => activeTab === "sellers" ? req.status === "approved" : true).length === 0 ? (<Card className="p-12 text-center border-dashed border-2 border-gray-300">
                  <lucide_react_1.AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3"/>
                  <p className="text-xl font-semibold text-gray-600">
                    {activeTab === "sellers" ? "No approved sellers match your search." : "No requests found matching your criteria."}
                  </p>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filter settings.</p>
                </Card>) : (filteredRequests.filter(req => activeTab === "sellers" ? req.status === "approved" : true).map((request) => (<Card key={request.id} className="p-6 transition-all duration-300 transform hover:shadow-2xl hover:border-amber-200">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-2xl font-extrabold text-gray-900 truncate">{request.name}</h3>
                          <span className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-md font-medium text-gray-600">{request.email}</p>
                        <p className="text-sm text-gray-500 mt-1">Submitted on: <span className="font-medium">{request.submittedDate}</span></p>
                      </div>
                      
                      {request.status === "pending" && (<div className="flex gap-3 w-full md:w-auto md:min-w-[200px] flex-shrink-0">
                          <Button onClick={() => handleApprove(request.id)} className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200/50">
                            <lucide_react_1.CheckCircle className="w-4 h-4 mr-2"/>
                            Approve
                          </Button>
                          <Button onClick={() => handleReject(request.id)} variant="destructive" className="w-full bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 shadow-lg shadow-red-200/50">
                            <lucide_react_1.XCircle className="w-4 h-4 mr-2"/>
                            Reject
                          </Button>
                        </div>)}

                      {request.status === "approved" && activeTab === "sellers" && (<Button onClick={() => setLocation(`/seller-profile/${request.id}`)} variant="subtle" className="w-full md:w-auto bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">
                            View Profile
                          </Button>)}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-amber-600 uppercase mb-1 tracking-wider">Expertise</p>
                        <p className="text-lg font-medium text-gray-800">{request.expertise}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-600 uppercase mb-1 tracking-wider">Experience</p>
                        <p className="text-lg font-medium text-gray-800">{request.experience}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Motivation/Pitch</p>
                      <p className="text-sm italic text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        {request.motivation}
                      </p>
                    </div>

                  </Card>)))}
            </div>
          </div>)}
      </main>
    </div>);
}
