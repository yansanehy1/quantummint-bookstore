import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SellerRequest() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        reason: '',
        experience: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send an API request
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h2>
                    <p className="text-slate-600 mb-8">
                        Thank you for your interest in becoming a seller. Our team will review your application and get back to you within 24-48 hours.
                    </p>
                    <Button onClick={() => navigate('/')} className="w-full">
                        Return to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-quantum-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-lg">Q</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900">QuantumMint</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Become a Seller</h1>
                    <p className="text-lg text-slate-600">
                        Join our community of educators and authors. Share your knowledge and earn from your content.
                    </p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Why do you want to join?
                            </label>
                            <textarea
                                required
                                rows={4}
                                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                placeholder="Tell us about the content you plan to publish..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Relevant Experience (Optional)
                            </label>
                            <textarea
                                rows={3}
                                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                placeholder="Any previous publishing or teaching experience..."
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full justify-center">
                                Submit Application
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}
