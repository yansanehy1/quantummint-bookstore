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
      </div>
    </div>
  );
};

export default Login;