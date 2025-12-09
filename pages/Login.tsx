<<<<<<< HEAD

import React from 'react';
import { useLocation } from 'wouter';
import { login } from '@/web-frontend/src/services/store';
import { UserRole } from '../types';
import { BookOpen, User, ShieldCheck, GraduationCap, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

interface LoginProps {
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = () => {
  const [, setLocation] = useLocation();

  const handleLogin = (role: UserRole) => {
    login(role);
    // Redirect based on role handled in App.tsx or here
    if (role === UserRole.ADMIN) setLocation('/admin-dashboard');
    else if (role === UserRole.EDUCATOR) setLocation('/seller-dashboard');
    else setLocation('/learner-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button onClick={() => setLocation('/')} className="mb-4 flex items-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </button>
        <Card className="w-full bg-white shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                <BookOpen className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to QuantumMint</h1>
              <p className="text-slate-500">Select your role to continue</p>
            </div>

            <div className="space-y-4">
              <LoginOption
                icon={<GraduationCap size={24} />}
                title="Learner"
                desc="Access books & immersive content"
                onClick={() => handleLogin(UserRole.LEARNER)}
                color="bg-emerald-50 text-emerald-600 hover:border-emerald-500"
              />

              <LoginOption
                icon={<User size={24} />}
                title="Educator"
                desc="Create content & earn revenue"
                onClick={() => handleLogin(UserRole.EDUCATOR)}
                color="bg-blue-50 text-blue-600 hover:border-blue-500"
              />

              <LoginOption
                icon={<ShieldCheck size={24} />}
                title="Administrator"
                desc="System management"
                onClick={() => handleLogin(UserRole.ADMIN)}
                color="bg-purple-50 text-purple-600 hover:border-purple-500"
              />
            </div>
          </CardContent>
        </Card>
=======
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { User, BookOpen } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Login - Quantummint Bookstore';
  }, []);
  const [role, setRole] = useState<'learner' | 'educator'>('learner');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await login(email, role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/logo.png" alt="QuantumMint Logo" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sign in to QuantumMint
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or <a href="#" className="font-medium text-quantum-600 hover:text-quantum-500">start your 14-day free trial</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-quantum-500 focus:border-quantum-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">I am a...</label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div
                  onClick={() => setRole('learner')}
                  className={`cursor-pointer p-3 border rounded-md text-center flex flex-col items-center gap-2 transition-all ${role === 'learner' ? 'border-quantum-500 bg-quantum-50 ring-1 ring-quantum-500' : 'border-slate-300 hover:bg-slate-50'}`}
                >
                  <BookOpen className={role === 'learner' ? 'text-quantum-600' : 'text-slate-400'} />
                  <span className={`text-sm font-medium ${role === 'learner' ? 'text-quantum-900' : 'text-slate-500'}`}>Learner</span>
                </div>
                <div
                  onClick={() => setRole('educator')}
                  className={`cursor-pointer p-3 border rounded-md text-center flex flex-col items-center gap-2 transition-all ${role === 'educator' ? 'border-quantum-500 bg-quantum-50 ring-1 ring-quantum-500' : 'border-slate-300 hover:bg-slate-50'}`}
                >
                  <User className={role === 'educator' ? 'text-quantum-600' : 'text-slate-400'} />
                  <span className={`text-sm font-medium ${role === 'educator' ? 'text-quantum-900' : 'text-slate-500'}`}>Educator</span>
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4"
                isLoading={isLoading}
              >
                Sign in
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
                  Authentication powered by NextAuth.js
                </span>
              </div>
            </div>
          </div>
        </div>
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
      </div>
    </div>
  );
};

<<<<<<< HEAD
const LoginOption = ({ icon, title, desc, onClick, color }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl border border-transparent transition-all duration-200 group text-left ${color}`}
  >
    <div className="w-12 h-12 rounded-lg bg-white/60 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <div className="font-bold text-slate-900 group-hover:text-current">{title}</div>
      <div className="text-xs text-slate-500 group-hover:text-slate-600">{desc}</div>
    </div>
  </button>
);




=======
export default Login;
>>>>>>> eee79d7da06a64aee98daa05ffcfbc5ba43db233
