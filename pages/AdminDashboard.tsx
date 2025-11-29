import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    BookOpen,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Search,
    Wallet as WalletIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface SellerRequest {
    id: string;
    name: string;
    email: string;
    expertise: string;
    experience: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedDate: string;
    motivation: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Admin Dashboard - Quantummint Bookstore';
    }, []);
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'sellers'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([
        {
            id: '1',
            name: 'Ahmed Hassan',
            email: 'ahmed@example.com',
            expertise: 'Mathematics & Physics',
            experience: '10 years teaching experience',
            status: 'pending',
            submittedDate: '2024-01-15',
            motivation: 'I want to share my teaching methods with students across Sierra Leone and believe my educational materials are top-tier.',
        },
        {
            id: '2',
            name: 'Fatima Conteh',
            email: 'fatima@example.com',
            expertise: 'English Literature',
            experience: '8 years in education',
            status: 'pending',
            submittedDate: '2024-01-14',
            motivation: 'Passionate about making quality literature education accessible to rural students via digital resources.',
        },
        {
            id: '3',
            name: 'Ibrahim Koroma',
            email: 'ibrahim@example.com',
            expertise: 'Computer Science',
            experience: '5 years professional experience',
            status: 'approved',
            submittedDate: '2024-01-10',
            motivation: 'Want to teach programming to the next generation of West African innovators.',
        },
    ]);

    const handleApprove = (id: string) => {
        setSellerRequests(prev =>
            prev.map(req => req.id === id ? { ...req, status: 'approved' as const } : req)
        );
    };

    const handleReject = (id: string) => {
        setSellerRequests(prev =>
            prev.map(req => req.id === id ? { ...req, status: 'rejected' as const } : req)
        );
    };

    const filteredRequests = sellerRequests.filter(req => {
        const matchesSearch =
            req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.expertise.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        totalRequests: sellerRequests.length,
        pendingRequests: sellerRequests.filter(r => r.status === 'pending').length,
        approvedSellers: sellerRequests.filter(r => r.status === 'approved').length,
        rejectedRequests: sellerRequests.filter(r => r.status === 'rejected').length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-50 text-green-700 ring-1 ring-green-200';
            case 'rejected': return 'bg-red-50 text-red-700 ring-1 ring-red-200';
            case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
            default: return 'bg-gray-100 text-gray-800 ring-1 ring-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-amber-500/30">
                <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-amber-600" />
                        <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <nav className="flex gap-6 items-center">
                        <button onClick={() => navigate('/')} className="text-gray-700 hover:text-amber-600 font-medium">
                            Home
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container max-w-7xl mx-auto px-4 py-12">
                <section className="mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-2">Admin Panel</h1>
                    <p className="text-xl text-gray-600">Review, manage, and monitor marketplace activity.</p>
                </section>

                {/* Tabs */}
                <div className="flex gap-6 mb-10 border-b border-gray-200">
                    {[
                        { id: 'overview' as const, label: 'Platform Overview' },
                        { id: 'requests' as const, label: `Seller Requests (${stats.pendingRequests})` },
                        { id: 'sellers' as const, label: 'Approved Sellers' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-bold text-lg transition-all duration-300 ${activeTab === tab.id
                                ? 'text-amber-600 border-b-4 border-amber-600 bg-amber-50/50 rounded-t-lg'
                                : 'text-gray-500 hover:text-gray-800 hover:border-b-4 hover:border-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        <div className="mb-8 flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => navigate('/admin/books')} className="bg-blue-600 hover:bg-blue-700">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Manage Books & Content
                            </Button>
                            <Button onClick={() => navigate('/admin/wallet')} className="bg-purple-600 hover:bg-purple-700">
                                <WalletIcon className="w-5 h-5 mr-2" />
                                Financial Management
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Total Applications', value: stats.totalRequests, icon: Users, color: 'blue' },
                                { title: 'Pending Review', value: stats.pendingRequests, icon: Clock, color: 'amber' },
                                { title: 'Approved Sellers', value: stats.approvedSellers, icon: CheckCircle, color: 'green' },
                                { title: 'Rejected Applications', value: stats.rejectedRequests, icon: XCircle, color: 'red' },
                            ].map((stat, index) => (
                                <Card key={index} className="p-6 flex items-center justify-between hover:shadow-xl transition">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                        <p className={`text-4xl font-extrabold text-${stat.color}-600`}>{stat.value}</p>
                                    </div>
                                    <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {/* Requests Tab */}
                {(activeTab === 'requests' || activeTab === 'sellers') && (
                    <div>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-inner border">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or expertise..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="sm:w-1/3 px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                                aria-label="Filter status"
                            >
                                <option value="all">Filter: All Status</option>
                                <option value="pending">Filter: Pending</option>
                                <option value="approved">Filter: Approved</option>
                                <option value="rejected">Filter: Rejected</option>
                            </select>
                        </div>

                        <div className="space-y-5">
                            {filteredRequests
                                .filter(req => activeTab === 'sellers' ? req.status === 'approved' : true)
                                .length === 0 ? (
                                <Card className="p-12 text-center border-dashed border-2">
                                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                    <p className="text-xl font-semibold text-gray-600">No requests found</p>
                                </Card>
                            ) : (
                                filteredRequests
                                    .filter(req => activeTab === 'sellers' ? req.status === 'approved' : true)
                                    .map(request => (
                                        <Card key={request.id} className="p-6 hover:shadow-2xl transition">
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h3 className="text-2xl font-extrabold text-gray-900">{request.name}</h3>
                                                        <span className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(request.status)}`}>
                                                            {getStatusIcon(request.status)}
                                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="text-md font-medium text-gray-600">{request.email}</p>
                                                    <p className="text-sm text-gray-500 mt-1">Submitted: {request.submittedDate}</p>
                                                </div>

                                                {request.status === 'pending' && (
                                                    <div className="flex gap-3">
                                                        <Button onClick={() => handleApprove(request.id)} className="bg-green-600 hover:bg-green-700">
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Approve
                                                        </Button>
                                                        <Button onClick={() => handleReject(request.id)} className="bg-red-600 hover:bg-red-700">
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                                                <div>
                                                    <p className="text-xs font-bold text-amber-600 uppercase mb-1">Expertise</p>
                                                    <p className="text-lg font-medium text-gray-800">{request.expertise}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-amber-600 uppercase mb-1">Experience</p>
                                                    <p className="text-lg font-medium text-gray-800">{request.experience}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t">
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Motivation</p>
                                                <p className="text-sm italic text-gray-700 p-3 bg-gray-50 rounded-lg">
                                                    {request.motivation}
                                                </p>
                                            </div>
                                        </Card>
                                    ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
