"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SellerDashboard;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
function SellerDashboard() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [activeTab, setActiveTab] = (0, react_1.useState)("books");
    const mockBooks = [
        {
            id: 1,
            title: "Introduction to Physics",
            category: "Science",
            price: "$4.99",
            sales: 45,
            earnings: "$180.45",
            rating: 4.5,
            status: "published",
            createdDate: "2024-01-10",
        },
        {
            id: 2,
            title: "Advanced Mathematics",
            category: "Mathematics",
            price: "$5.99",
            sales: 28,
            earnings: "$125.30",
            rating: 4.8,
            status: "published",
            createdDate: "2024-01-15",
        },
        {
            id: 3,
            title: "Web Development Basics",
            category: "Technology",
            price: "$6.99",
            sales: 0,
            earnings: "$0.00",
            rating: 0,
            status: "draft",
            createdDate: "2024-01-18",
        },
    ];
    const mockEarnings = [
        { date: "2024-01-20", amount: "$45.50", source: "Book Sales" },
        { date: "2024-01-19", amount: "$32.25", source: "Book Sales" },
        { date: "2024-01-18", amount: "$28.70", source: "Book Sales" },
        { date: "2024-01-17", amount: "$0.00", source: "No sales" },
    ];
    const totalEarnings = "$305.75";
    const totalSales = 73;
    const averageRating = 4.65;
    const totalBooks = 3;
    const handleDeleteBook = (id) => {
        if (confirm("Are you sure you want to delete this book?")) {
            alert("Book deleted successfully");
        }
    };
    const handleEditBook = (id) => {
        setLocation(`/edit-book/${id}`);
    };
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <lucide_react_1.BookOpen className="w-8 h-8 text-amber-600"/>
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => setLocation("/")} className="text-gray-700 hover:text-amber-600 font-medium">Home</button>
            <button onClick={() => setLocation("/dashboard")} className="text-gray-700 hover:text-amber-600 font-medium">Dashboard</button>
            <button onClick={() => setLocation("/wallet")} className="text-gray-700 hover:text-amber-600 font-medium">Wallet</button>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <section className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
              <p className="text-xl text-gray-600">Manage your books, track sales, and monitor earnings.</p>
            </div>
            <button_1.Button onClick={() => setLocation("/create-book")} className="bg-green-600 hover:bg-green-700">
              <lucide_react_1.Plus className="w-5 h-5 mr-2"/>
              Create New Book
            </button_1.Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid md:grid-cols-4 gap-6 mb-12">
          <card_1.Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">{totalEarnings}</p>
              </div>
              <lucide_react_1.DollarSign className="w-12 h-12 text-green-600 opacity-20"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">{totalSales}</p>
              </div>
              <lucide_react_1.TrendingUp className="w-12 h-12 text-blue-600 opacity-20"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Published Books</p>
                <p className="text-3xl font-bold text-gray-900">{totalBooks}</p>
              </div>
              <lucide_react_1.BookOpen className="w-12 h-12 text-amber-600 opacity-20"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Avg. Rating</p>
                <p className="text-3xl font-bold text-gray-900">{averageRating}★</p>
              </div>
              <lucide_react_1.Users className="w-12 h-12 text-purple-600 opacity-20"/>
            </div>
          </card_1.Card>
        </section>

        {/* Tabs */}
        <section className="mb-8">
          <div className="flex gap-4 border-b border-gray-200">
            <button onClick={() => setActiveTab("books")} className={`px-6 py-3 font-semibold transition ${activeTab === "books"
            ? "text-amber-600 border-b-2 border-amber-600"
            : "text-gray-600 hover:text-gray-900"}`}>
              <lucide_react_1.BookOpen className="w-4 h-4 inline mr-2"/>
              My Books ({mockBooks.length})
            </button>
            <button onClick={() => setActiveTab("earnings")} className={`px-6 py-3 font-semibold transition ${activeTab === "earnings"
            ? "text-amber-600 border-b-2 border-amber-600"
            : "text-gray-600 hover:text-gray-900"}`}>
              <lucide_react_1.DollarSign className="w-4 h-4 inline mr-2"/>
              Earnings
            </button>
            <button onClick={() => setActiveTab("analytics")} className={`px-6 py-3 font-semibold transition ${activeTab === "analytics"
            ? "text-amber-600 border-b-2 border-amber-600"
            : "text-gray-600 hover:text-gray-900"}`}>
              <lucide_react_1.TrendingUp className="w-4 h-4 inline mr-2"/>
              Analytics
            </button>
          </div>
        </section>

        {/* Books Tab */}
        {activeTab === "books" && (<section className="mb-12">
            <card_1.Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Your Books</h2>
              <div className="space-y-4">
                {mockBooks.length > 0 ? (mockBooks.map((book) => (<card_1.Card key={book.id} className="p-6 border-l-4 border-amber-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${book.status === "published"
                    ? "bg-green-100 text-green-800"
                    : book.status === "draft"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"}`}>
                              {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{book.category}</p>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Price</p>
                              <p className="font-semibold text-gray-900">{book.price}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Sales</p>
                              <p className="font-semibold text-gray-900">{book.sales}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Earnings</p>
                              <p className="font-semibold text-green-600">{book.earnings}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Rating</p>
                              <p className="font-semibold text-gray-900">
                                {book.rating > 0 ? `${book.rating}★` : "No ratings"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button_1.Button onClick={() => setLocation(`/book/${book.id}`)} variant="outline" size="sm">
                            <lucide_react_1.Eye className="w-4 h-4"/>
                          </button_1.Button>
                          <button_1.Button onClick={() => setLocation("/book-editor/" + book.id)} variant="outline" size="sm">
                            <lucide_react_1.Edit2 className="w-4 h-4"/>
                          </button_1.Button>
                          <button_1.Button onClick={() => handleDeleteBook(book.id)} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <lucide_react_1.Trash2 className="w-4 h-4"/>
                          </button_1.Button>
                        </div>
                      </div>
                    </card_1.Card>))) : (<div className="text-center py-12">
                    <lucide_react_1.BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <p className="text-gray-600 text-lg mb-4">You haven't published any books yet.</p>
                    <button_1.Button onClick={() => setLocation("/create-book")} className="bg-green-600 hover:bg-green-700">
                      <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                      Create Your First Book
                    </button_1.Button>
                  </div>)}
              </div>
            </card_1.Card>
          </section>)}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (<section className="mb-12">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <card_1.Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-green-600 mb-4">{totalEarnings}</p>
                <button_1.Button className="w-full bg-green-600 hover:bg-green-700">
                  <lucide_react_1.Download className="w-4 h-4 mr-2"/>
                  Request Cashout
                </button_1.Button>
              </card_1.Card>
              <card_1.Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                <p className="text-gray-600 text-sm mb-2">This Month</p>
                <p className="text-4xl font-bold text-blue-600">$125.45</p>
                <p className="text-sm text-gray-600 mt-4">+15% from last month</p>
              </card_1.Card>
              <card_1.Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <p className="text-gray-600 text-sm mb-2">Pending Payout</p>
                <p className="text-4xl font-bold text-purple-600">$45.30</p>
                <p className="text-sm text-gray-600 mt-4">Available next week</p>
              </card_1.Card>
            </div>

            <card_1.Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Recent Earnings</h3>
              <div className="space-y-3">
                {mockEarnings.map((earning, idx) => (<div key={idx} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-900">{earning.source}</p>
                      <p className="text-sm text-gray-600">{earning.date}</p>
                    </div>
                    <p className={`text-lg font-bold ${earning.amount.includes("-") ? "text-red-600" : "text-green-600"}`}>
                      {earning.amount}
                    </p>
                  </div>))}
              </div>
            </card_1.Card>
          </section>)}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (<section className="mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              <card_1.Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Sales Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-gray-900">Introduction to Physics</p>
                      <p className="text-gray-600">45 sales</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-gray-900">Advanced Mathematics</p>
                      <p className="text-gray-600">28 sales</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "38%" }}></div>
                    </div>
                  </div>
                </div>
              </card_1.Card>

              <card_1.Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Reader Demographics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">High School Students</span>
                    <span className="font-bold text-gray-900">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">University Students</span>
                    <span className="font-bold text-gray-900">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Teachers</span>
                    <span className="font-bold text-gray-900">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Others</span>
                    <span className="font-bold text-gray-900">5%</span>
                  </div>
                </div>
              </card_1.Card>
            </div>
          </section>)}
      </main>
    </div>);
}
