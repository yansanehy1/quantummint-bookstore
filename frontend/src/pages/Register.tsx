import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'learner' as 'learner' | 'seller'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Register - Quantummint Bookstore';
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            toast.success('Registration successful! Welcome to QuantumMint.');
            navigate('/dashboard');
        } catch (err: any) {
            const message = err.message || 'Registration failed. Please try again.';
            setError(message);
            toast.error(message);
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo.png" alt="QuantumMint Logo" className="w-20 h-20 object-contain" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Or{' '}
                    <button onClick={() => navigate('/login')} className="font-medium text-quantum-600 hover:text-quantum-500">
                        sign in to your existing account
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="focus:ring-quantum-500 focus:border-quantum-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="focus:ring-quantum-500 focus:border-quantum-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="focus:ring-quantum-500 focus:border-quantum-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="focus:ring-quantum-500 focus:border-quantum-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                I want to...
                            </label>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <div
                                    onClick={() => setFormData({ ...formData, role: 'learner' })}
                                    className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center text-center transition-all ${formData.role === 'learner'
                                        ? 'border-quantum-500 bg-quantum-50 ring-1 ring-quantum-500'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <BookOpen className={`h-6 w-6 mb-2 ${formData.role === 'learner' ? 'text-quantum-600' : 'text-slate-400'}`} />
                                    <span className={`text-sm font-medium ${formData.role === 'learner' ? 'text-quantum-900' : 'text-slate-900'}`}>
                                        Read & Learn
                                    </span>
                                </div>
                                <div
                                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                                    className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center text-center transition-all ${formData.role === 'seller'
                                        ? 'border-quantum-500 bg-quantum-50 ring-1 ring-quantum-500'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <User className={`h-6 w-6 mb-2 ${formData.role === 'seller' ? 'text-quantum-600' : 'text-slate-400'}`} />
                                    <span className={`text-sm font-medium ${formData.role === 'seller' ? 'text-quantum-900' : 'text-slate-900'}`}>
                                        Teach & Earn
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full justify-center"
                                isLoading={isLoading}
                            >
                                Create Account
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">
                                    By registering, you agree to our Terms & Privacy Policy
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
