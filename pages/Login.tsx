
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
      </div>
    </div>
  );
};

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




