import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    User, Mail, Lock, Save, Bell, Shield, UserCircle, Camera,
    Smartphone, LogOut, Key, CheckCircle2, AlertCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Settings() {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        notifications: true
    });

    // Security Form State
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactor: false
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                bio: 'Passionate learner and book enthusiast.', // Mock data
                notifications: true
            });
        }
        document.title = 'Settings - Quantummint Bookstore';
    }, [user]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');

        try {
            await updateProfile({
                name: profileData.name,
                email: profileData.email
            });
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSecuritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');

        // Mock password update
        setTimeout(() => {
            setSuccessMessage('Security settings updated successfully!');
            setIsLoading(false);
            setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-600 mt-2">Manage your profile, preferences, and account security.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <Card className="overflow-hidden">
                            <nav className="flex flex-col">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'profile'
                                        ? 'bg-quantum-50 text-quantum-700 border-l-4 border-quantum-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                                        }`}
                                >
                                    <UserCircle className="w-5 h-5" />
                                    Edit Profile & Preferences
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'security'
                                        ? 'bg-quantum-50 text-quantum-700 border-l-4 border-quantum-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                                        }`}
                                >
                                    <Shield className="w-5 h-5" />
                                    Security & Devices
                                </button>
                            </nav>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <Card className="p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-slate-900">Edit Profile & Preferences</h2>
                                    <p className="text-sm text-slate-500">Update your personal information and how we contact you.</p>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <img
                                                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-slate-100"
                                            />
                                            <button
                                                type="button"
                                                className="absolute bottom-0 right-0 p-2 bg-quantum-600 text-white rounded-full hover:bg-quantum-700 shadow-md transition"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-slate-900">{user.name}</h3>
                                            <p className="text-slate-500 text-sm">{user.role === 'seller' ? 'Seller Account' : 'User Account'}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                            <textarea
                                                rows={3}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                                placeholder="Tell us a little about yourself..."
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <h3 className="text-sm font-medium text-slate-900 mb-4">Preferences</h3>
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <Bell className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900">Email Notifications</h4>
                                                    <p className="text-sm text-slate-500">Receive updates about your account and purchases</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.notifications}
                                                    onChange={(e) => setProfileData({ ...profileData, notifications: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                        {successMessage && (
                                            <span className="text-green-600 text-sm font-medium flex items-center animate-fade-in">
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                {successMessage}
                                            </span>
                                        )}
                                        <div className="flex gap-3 ml-auto">
                                            <Button type="submit" isLoading={isLoading}>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card className="p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-slate-900">Security & Devices</h2>
                                    <p className="text-sm text-slate-500">Manage your password and security settings.</p>
                                </div>

                                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-slate-900">Change Password</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={securityData.currentPassword}
                                                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Key className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={securityData.newPassword}
                                                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Key className="h-5 w-5 text-slate-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={securityData.confirmPassword}
                                                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-quantum-500 focus:border-quantum-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <h3 className="text-sm font-medium text-slate-900 mb-4">Two-Factor Authentication</h3>
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-purple-50 rounded-lg">
                                                    <Smartphone className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900">Authenticator App</h4>
                                                    <p className="text-sm text-slate-500">Use an app like Google Authenticator to protect your account</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={securityData.twoFactor}
                                                    onChange={(e) => setSecurityData({ ...securityData, twoFactor: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                        {successMessage && (
                                            <span className="text-green-600 text-sm font-medium flex items-center animate-fade-in">
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                {successMessage}
                                            </span>
                                        )}
                                        <div className="flex gap-3 ml-auto">
                                            <Button type="submit" isLoading={isLoading}>
                                                <Save className="w-4 h-4 mr-2" />
                                                Update Security
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <h3 className="text-sm font-medium text-red-600 mb-4">Danger Zone</h3>
                                        <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-100">
                                            <div>
                                                <h4 className="font-medium text-red-900">Delete Account</h4>
                                                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                                            </div>
                                            <Button variant="outline" className="text-red-600 hover:bg-red-100 border-red-200">
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
