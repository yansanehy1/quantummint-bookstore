import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, Camera, Shield } from 'lucide-react';
import { getCurrentUser } from '@/services/store';

export const Profile: React.FC = () => {
    const user = getCurrentUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || 'user@example.com',
        phone: '+232 XX XXX XXXX',
        location: 'Freetown, Sierra Leone',
        bio: 'Passionate learner and educator on the QuantumMint Bookstore platform.',
        website: 'https://example.com'
    });

    const handleSave = () => {
        setIsEditing(false);
        // In real app, this would save to backend
        console.log('Saving profile:', formData);
    };

    const stats = [
        { label: 'Books Read', value: '24', color: 'emerald' },
        { label: 'Total Hours', value: '156', color: 'blue' },
        { label: 'Courses Completed', value: '8', color: 'purple' },
        { label: 'Certificates', value: '5', color: 'amber' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    {/* Cover Photo */}
                    <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
                        <button className="absolute bottom-4 right-4 p-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-colors">
                            <Camera size={18} />
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                                    <img
                                        src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User')}
                                        alt={user?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors">
                                    <Camera size={16} />
                                </button>
                            </div>

                            {/* User Details */}
                            <div className="flex-1 mt-16 sm:mt-12">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 mb-1">{user?.name}</h1>
                                        <p className="text-slate-600 capitalize">{user?.role?.toLowerCase()} Account</p>
                                    </div>
                                    <button
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                        className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        {isEditing ? (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={18} />
                                                <span>Edit Profile</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-4">
                                    {stats.map(stat => (
                                        <div key={stat.label} className="text-center">
                                            <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-slate-600">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <User size={18} className="text-slate-400" />
                                                <span>{formData.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <Mail size={18} className="text-slate-400" />
                                                <span>{formData.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <Phone size={18} className="text-slate-400" />
                                                <span>{formData.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-900">
                                                <MapPin size={18} className="text-slate-400" />
                                                <span>{formData.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                    {isEditing ? (
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{formData.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Shield size={20} className="text-emerald-600" />
                                Account Security
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-slate-900">Password</h3>
                                        <p className="text-sm text-slate-600">Last changed 2 months ago</p>
                                    </div>
                                    <button className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium">
                                        Change
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
                                        <p className="text-sm text-slate-600">Add an extra layer of security</p>
                                    </div>
                                    <button className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Activity */}
                    <div className="space-y-6">
                        {/* Wallet Balance */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
                            <p className="text-emerald-100 mb-2">Wallet Balance</p>
                            <h3 className="text-3xl font-bold mb-4">${user?.walletBalance?.usd?.toFixed(2) || '0.00'}</h3>
                            <button className="w-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white rounded-lg py-2 font-medium transition-colors">
                                Add Funds
                            </button>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {[
                                    { action: 'Purchased', item: 'Math Textbook', time: '2 hours ago' },
                                    { action: 'Completed', item: 'Physics Course', time: '1 day ago' },
                                    { action: 'Started', item: 'Chemistry Lab', time: '3 days ago' }
                                ].map((activity, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-900">
                                                <span className="font-medium">{activity.action}</span> {activity.item}
                                            </p>
                                            <p className="text-xs text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Calendar size={20} />
                                <div>
                                    <p className="text-sm">Member since</p>
                                    <p className="font-semibold text-slate-900">January 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
