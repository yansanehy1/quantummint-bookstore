import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Wallet,
} from "lucide-react";
import { useLocation } from "wouter";

interface SellerRequestItem {
  id: string;
  name: string;
  email: string;
  expertise: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  motivation: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "sellers">(
    "overview"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const [sellerRequests, setSellerRequests] = useState<SellerRequestItem[]>([
    {
      id: "1",
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      expertise: "Mathematics & Physics",
      experience: "10 years teaching experience",
      status: "pending",
      submittedDate: "2024-01-15",
      motivation:
        "I want to share my teaching methods with students across Sierra Leone",
    },
    {
      id: "2",
      name: "Fatima Conteh",
      email: "fatima@example.com",
      expertise: "English Literature",
      experience: "8 years in education",
      status: "pending",
      submittedDate: "2024-01-14",
      motivation:
        "Passionate about making quality literature education accessible",
    },
    {
      id: "3",
      name: "Ibrahim Koroma",
      email: "ibrahim@example.com",
      expertise: "Computer Science",
      experience: "5 years professional experience",
      status: "approved",
      submittedDate: "2024-01-10",
      motivation: "Want to teach programming to the next generation",
    },
    {
      id: "4",
      name: "Mariama Jallow",
      email: "mariama@example.com",
      expertise: "Biology",
      experience: "12 years teaching",
      status: "approved",
      submittedDate: "2024-01-08",
      motivation: "Creating interactive biology learning materials",
    },
  ]);

  const handleApprove = (id: string) => {
    setSellerRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleReject = (id: string) => {
    setSellerRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "rejected" } : req
      )
    );
  };

  const filteredRequests = sellerRequests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.expertise.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || req.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalRequests: sellerRequests.length,
    pendingRequests: sellerRequests.filter((r) => r.status === "pending").length,
    approvedSellers: sellerRequests.filter((r) => r.status === "approved").length,
    rejectedRequests: sellerRequests.filter((r) => r.status === "rejected").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books Admin</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button
              onClick={() => setLocation("/")}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => setLocation("/dashboard")}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage seller applications and platform content</p>
        </section>

        {/* Stats Overview */}
        {activeTab === "overview" && (
          <>
            <div className="mb-8 flex gap-4">
              <Button onClick={() => setLocation("/admin-book-management")} className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="w-5 h-5 mr-2" />
                Manage Books
              </Button>
              <Button onClick={() => setLocation("/admin-wallet-management")} className="bg-purple-600 hover:bg-purple-700">
                <Wallet className="w-5 h-5 mr-2" />
                Wallet Management
              </Button>
            </div>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Approved Sellers</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approvedSellers}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejectedRequests}</p>
                </div>
                <XCircle className="w-12 h-12 text-red-600 opacity-20" />
              </div>
            </Card>
            </div>
          </>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "overview"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "requests"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Seller Requests
          </button>
          <button
            onClick={() => setActiveTab("sellers")}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "sellers"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Approved Sellers
          </button>
        </div>

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  aria-label="Search requests"
                  placeholder="Search by name, email, or expertise..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <select
                aria-label="Filter status"
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterStatus(
                    e.target.value as
                      | "all"
                      | "pending"
                      | "approved"
                      | "rejected"
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">No requests found</p>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{request.name}</h3>
                          <span
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{request.email}</p>
                        <p className="text-sm text-gray-600">Submitted: {request.submittedDate}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Expertise</p>
                        <p className="text-sm text-gray-600">{request.expertise}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Experience</p>
                        <p className="text-sm text-gray-600">{request.experience}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Motivation</p>
                      <p className="text-sm text-gray-600">{request.motivation}</p>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Approved Sellers Tab */}
        {activeTab === "sellers" && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {sellerRequests
                .filter((r) => r.status === "approved")
                .map((seller) => (
                  <Card key={seller.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{seller.name}</h3>
                        <p className="text-sm text-gray-600">{seller.email}</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>

                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">Expertise</p>
                        <p className="text-sm text-gray-600">{seller.expertise}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase">Experience</p>
                        <p className="text-sm text-gray-600">{seller.experience}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setLocation(`/seller-profile/${seller.id}`)}
                    >
                      View Profile
                    </Button>
                  </Card>
                ))}
            </div>

            {sellerRequests.filter((r) => r.status === "approved").length ===
              0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No approved sellers yet</p>
              </Card>
              )}
          </>
        )}
      </main>
    </div>
  );
}
