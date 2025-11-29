import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
    BookOpen,
    Plus,
    DollarSign,
    TrendingUp,
    Users,
    Eye,
    Edit2,
    Trash2,
    Download
} from "lucide-react";

export default function SellerDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [location, setLocation] = useState("/");
    const [activeTab, setActiveTab] = useState("books");

    useEffect(() => {
        document.title = 'Seller Dashboard - Quantummint Bookstore';
    }, []);

    const mockBooks = [
        { id: 1, title: "Introduction to Physics", category: "Science", price: "$4.99", sales: 45, earnings: "$180.45", rating: 4.5, status: "published", createdDate: "2024-01-10" },
        { id: 2, title: "Advanced Mathematics", category: "Mathematics", price: "$5.99", sales: 28, earnings: "$125.30", rating: 4.8, status: "published", createdDate: "2024-01-15" },
        { id: 3, title: "Web Development Basics", category: "Technology", price: "$6.99", sales: 15, earnings: "$85.00", rating: 4.2, status: "published", createdDate: "2024-01-18" },
        { id: 4, title: "Quantum Mechanics", category: "Science", price: "$9.99", sales: 12, earnings: "$110.00", rating: 4.9, status: "published", createdDate: "2024-01-20" },
        { id: 5, title: "Organic Chemistry", category: "Science", price: "$7.99", sales: 30, earnings: "$210.50", rating: 4.6, status: "published", createdDate: "2024-01-22" },
        { id: 6, title: "World History", category: "History", price: "$5.50", sales: 20, earnings: "$95.00", rating: 4.4, status: "published", createdDate: "2024-01-25" },
        { id: 7, title: "Macroeconomics", category: "Economics", price: "$8.99", sales: 18, earnings: "$145.00", rating: 4.7, status: "published", createdDate: "2024-01-28" },
        { id: 8, title: "Psychology 101", category: "Psychology", price: "$4.50", sales: 50, earnings: "$200.00", rating: 4.5, status: "published", createdDate: "2024-02-01" },
        { id: 9, title: "Art History", category: "Art", price: "$6.50", sales: 10, earnings: "$55.00", rating: 4.3, status: "published", createdDate: "2024-02-05" },
        { id: 10, title: "Computer Science", category: "Technology", price: "$10.99", sales: 25, earnings: "$250.00", rating: 4.8, status: "published", createdDate: "2024-02-10" },
        { id: 11, title: "Data Structures", category: "Technology", price: "$8.50", sales: 0, earnings: "$0.00", rating: 0, status: "draft", createdDate: "2024-02-15" },
        { id: 12, title: "Algorithms", category: "Technology", price: "$9.50", sales: 0, earnings: "$0.00", rating: 0, status: "draft", createdDate: "2024-02-18" },
    ];

    const mockEarnings = [
        { date: "2024-01-20", amount: "$45.50", source: "Book Sales" },
        { date: "2024-01-19", amount: "$32.25", source: "Book Sales" },
        { date: "2024-01-18", amount: "$28.70", source: "Book Sales" },
        { date: "2024-01-17", amount: "$0.00", source: "No sales" },
    ];

    const totalEarnings = "$125.50";
    const totalSales = 253;
    const averageRating = 4.65;
    const totalBooks = 12;

    const handleDeleteBook = (id: number) => {
        if (confirm("Are you sure you want to delete this book?")) {
            alert("Book deleted successfully");
        }
    };

    const renderContent = () => {
        if (location === "/create-book") {
            return (
                <div className="container max-w-6xl mx-auto px-4 py-12">
                    <Button onClick={() => setLocation("/")} variant="outline" className="mb-6">
                        ← Back to Dashboard
                    </Button>
                    <Card className="p-8">
                        <h1 className="text-2xl font-bold mb-4">Create New Book</h1>
                        <p className="text-gray-600">Book creation form placeholder...</p>
                    </Card>
                </div>
            );
        }

        if (location.startsWith("/edit-book/")) {
            return (
                <div className="container max-w-6xl mx-auto px-4 py-12">
                    <Button onClick={() => setLocation("/")} variant="outline" className="mb-6">
                        ← Back to Dashboard
                    </Button>
                    <Card className="p-8">
                        <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
                        <p className="text-gray-600">Book editor placeholder for ID: {location.split("/")[2]}</p>
                    </Card>
                </div>
            );
        }

        if (location === "/wallet") {
            return (
                <div className="container max-w-6xl mx-auto px-4 py-12">
                    <Button onClick={() => setLocation("/")} variant="outline" className="mb-6">
                        ← Back to Dashboard
                    </Button>
                    <Card className="p-8">
                        <h1 className="text-2xl font-bold mb-4">Seller Wallet</h1>
                        <p className="text-gray-600">Wallet details placeholder...</p>
                    </Card>
                </div>
            )
        }

        // Default Dashboard View
        return (
            <main className="container max-w-6xl mx-auto px-4 py-12">
                {/* Header Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
                            <p className="text-xl text-gray-600">Welcome back, {user?.name || 'Alex Johnson'}. Manage your books and earnings.</p>
                        </div>
                        <Button onClick={() => navigate('/studio')} className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Book
                        </Button>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="grid md:grid-cols-4 gap-6 mb-12">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
                                <p className="text-3xl font-bold text-gray-900">{totalEarnings}</p>
                            </div>
                            <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Sales</p>
                                <p className="text-3xl font-bold text-gray-900">{totalSales}</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Published Books</p>
                                <p className="text-3xl font-bold text-gray-900">{totalBooks}</p>
                            </div>
                            <BookOpen className="w-12 h-12 text-amber-600 opacity-20" />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Avg. Rating</p>
                                <p className="text-3xl font-bold text-gray-900">{averageRating}★</p>
                            </div>
                            <Users className="w-12 h-12 text-purple-600 opacity-20" />
                        </div>
                    </Card>
                </section>

                {/* Tabs */}
                <section className="mb-8">
                    <div className="flex gap-4 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("books")}
                            className={`px-6 py-3 font-semibold transition ${activeTab === "books"
                                ? "text-amber-600 border-b-2 border-amber-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            My Books ({mockBooks.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("earnings")}
                            className={`px-6 py-3 font-semibold transition ${activeTab === "earnings"
                                ? "text-amber-600 border-b-2 border-amber-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            Earnings
                        </button>
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`px-6 py-3 font-semibold transition ${activeTab === "analytics"
                                ? "text-amber-600 border-b-2 border-amber-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <TrendingUp className="w-4 h-4 inline mr-2" />
                            Analytics
                        </button>
                    </div>
                </section>

                {/* Books Tab */}
                {activeTab === "books" && (
                    <section className="mb-12">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold mb-6">Your Books</h2>
                            <div className="space-y-4">
                                {mockBooks.length > 0 ? (
                                    mockBooks.map((book) => (
                                        <Card key={book.id} className="p-6 border-l-4 border-amber-600">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${book.status === "published"
                                                                ? "bg-green-100 text-green-800"
                                                                : book.status === "draft"
                                                                    ? "bg-gray-100 text-gray-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                        >
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
                                                    <Button onClick={() => setLocation(`/book/${book.id}`)} variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button onClick={() => setLocation("/edit-book/" + book.id)} variant="outline" size="sm">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg mb-4">You haven't published any books yet.</p>
                                        <Button onClick={() => setLocation("/create-book")} className="bg-green-600 hover:bg-green-700">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Book
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </section>
                )}

                {/* Earnings Tab */}
                {activeTab === "earnings" && (
                    <section className="mb-12">
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                                <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
                                <p className="text-4xl font-bold text-green-600 mb-4">{totalEarnings}</p>
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Request Cashout
                                </Button>
                            </Card>
                            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                                <p className="text-gray-600 text-sm mb-2">This Month</p>
                                <p className="text-4xl font-bold text-blue-600">$125.45</p>
                                <p className="text-sm text-gray-600 mt-4">+15% from last month</p>
                            </Card>
                            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                                <p className="text-gray-600 text-sm mb-2">Pending Payout</p>
                                <p className="text-4xl font-bold text-purple-600">$45.30</p>
                                <p className="text-sm text-gray-600 mt-4">Available next week</p>
                            </Card>
                        </div>

                        <Card className="p-8">
                            <h3 className="text-2xl font-bold mb-6">Recent Earnings</h3>
                            <div className="space-y-3">
                                {mockEarnings.map((earning, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">{earning.source}</p>
                                            <p className="text-sm text-gray-600">{earning.date}</p>
                                        </div>
                                        <p
                                            className={`text-lg font-bold ${earning.amount.includes("-") ? "text-red-600" : "text-green-600"
                                                }`}
                                        >
                                            {earning.amount}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </section>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <section className="mb-12">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="p-8">
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
                            </Card>

                            <Card className="p-8">
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
                            </Card>
                        </div>
                    </section>
                )}
            </main>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
                        <BookOpen className="w-8 h-8 text-amber-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
                    </div>
                    <nav className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate('/')}
                            className={`font-medium ${location === "/" ? "text-amber-600" : "text-gray-700 hover:text-amber-600"}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => setLocation("/dashboard")}
                            className={`font-medium ${location === "/dashboard" ? "text-amber-600" : "text-gray-700 hover:text-amber-600"}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setLocation("/wallet")}
                            className={`font-medium ${location === "/wallet" ? "text-amber-600" : "text-gray-700 hover:text-amber-600"}`}
                        >
                            Wallet
                        </button>
                    </nav>
                </div>
            </header>

            {renderContent()}
        </div>
    );
}
