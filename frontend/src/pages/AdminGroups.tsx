import React, { useState, useEffect } from 'react';
import { Users, Plus, ShieldCheck, CreditCard, UserPlus, Search, Loader2, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminAPI } from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'sonner';
import type { UserGroup } from '../types/types';

export default function AdminGroups() {
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isActivatingSub, setIsActivatingSub] = useState(false);
    const [isAdjustingBalance, setIsAdjustingBalance] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showActivateSubModal, setShowActivateSubModal] = useState(false);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<string>('30days');
    const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        type: 'CUG' as const,
        sponsorEmail: '',
        maxMembers: 2000,
        prepaidBalance: 0,
        currency: 'SLL' as 'SLL' | 'USD',
        allowedBookIds: [] as string[]
    });

    useEffect(() => {
        loadGroups();
        loadBooks();
        loadPlans();
    }, []);

    const loadGroups = async () => {
        try {
            const data = await adminAPI.listGroups();
            setGroups(data);
        } catch (err) {
            toast.error('Failed to load groups');
        } finally {
            setIsLoading(false);
        }
    };

    const loadBooks = async () => {
        try {
            const data = await adminAPI.getAllBooks();
            setBooks(data);
        } catch (err) {
            console.error('Failed to load books', err);
        }
    };

    const loadPlans = async () => {
        try {
            const { plans } = await adminAPI.getSubscriptionPlans();
            setPlans(plans);
        } catch (err) {
            console.error('Failed to load plans', err);
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await adminAPI.createGroup(newGroup);
            toast.success('Group created successfully');
            setShowCreateModal(false);
            loadGroups();
        } catch (err: any) {
            toast.error(err.message || 'Failed to create group');
        } finally {
            setIsCreating(false);
        }
    };

    const handleActivateGroup = async (groupId: string) => {
        try {
            await adminAPI.activateGroup(groupId);
            toast.success('Group activated');
            loadGroups();
        } catch (err: any) {
            toast.error(err.message || 'Failed to activate group');
        }
    };

    const handleOpenActivateSubModal = (group: UserGroup) => {
        setSelectedGroup(group);
        setShowActivateSubModal(true);
    };

    const handleOpenBalanceModal = (group: UserGroup) => {
        setSelectedGroup(group);
        setAdjustmentAmount(0);
        setShowBalanceModal(true);
    };

    const handleAdjustBalance = async () => {
        if (!selectedGroup || adjustmentAmount === 0) return;
        setIsAdjustingBalance(true);
        try {
            await adminAPI.adjustGroupBalance(selectedGroup.id, {
                amount: adjustmentAmount,
                description: `Admin manual top-up: ${adjustmentAmount} ${selectedGroup.currency}`
            });
            toast.success('Group balance updated');
            setShowBalanceModal(false);
            loadGroups();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update balance');
        } finally {
            setIsAdjustingBalance(false);
        }
    };

    const handleActivateGroupSub = async () => {
        if (!selectedGroup) return;
        setIsActivatingSub(true);
        try {
            await adminAPI.activateGroupSubscriptions(selectedGroup.id, selectedPlanId);
            toast.success('Subscriptions activated for all group members');
            setShowActivateSubModal(false);
            loadGroups();
        } catch (err: any) {
            toast.error(err.message || 'Failed to activate subscriptions');
        } finally {
            setIsActivatingSub(false);
        }
    };

    const getCumulativeCost = () => {
        if (!selectedGroup || !selectedPlanId) return 0;
        const plan = plans.find(p => p.id === selectedPlanId);
        if (!plan) return 0;
        const price = selectedGroup.currency === 'USD' ? plan.priceUSD : plan.priceSLL;
        return price * (selectedGroup.GroupMembers?.length || 0);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Closed User Groups (CUG)</h1>
                    <p className="text-slate-500">Manage organizational and sponsored user groups.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    New Group
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-quantum-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <Card key={group.id} className="overflow-hidden">
                            <div className={`h-2 ${group.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{group.name}</h3>
                                        <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 rounded mt-1">
                                            {group.type}
                                        </span>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                                        group.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {group.status.toUpperCase()}
                                    </div>
                                </div>
                                
                                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                    {group.description || 'No description provided.'}
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Sponsor:</span>
                                        <span className="font-medium">{group.GroupSponsor?.name || 'System'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Members:</span>
                                        <span className="font-medium">{group.GroupMembers?.length || 0} / {group.maxMembers}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Balance:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-quantum-700">
                                                {group.currency === 'SLL' ? `${parseFloat(group.prepaidBalance).toLocaleString()} SLL` : `$${group.prepaidBalance}`}
                                            </span>
                                            <button 
                                                onClick={() => handleOpenBalanceModal(group)}
                                                className="p-1 hover:bg-quantum-50 rounded text-quantum-600 transition-colors"
                                                title="Top-up Balance"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {group.status === 'pending' && (
                                        <Button 
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleActivateGroup(group.id)}
                                        >
                                            Activate Group
                                        </Button>
                                    )}
                                    {group.status === 'active' && (
                                        <Button 
                                            className="flex-1 bg-quantum-600 hover:bg-quantum-700 text-white"
                                            onClick={() => handleOpenActivateSubModal(group)}
                                        >
                                            Push Subscription
                                        </Button>
                                    )}
                                    <Button variant="outline" className="flex-1">
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-6">Create New User Group</h2>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 ring-quantum-500"
                                    value={newGroup.name}
                                    onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 ring-quantum-500 h-20"
                                    value={newGroup.description}
                                    onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sponsor Email (Optional)</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 ring-quantum-500"
                                    value={newGroup.sponsorEmail}
                                    onChange={e => setNewGroup({ ...newGroup, sponsorEmail: e.target.value })}
                                    placeholder="sponsor@example.com"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select 
                                        className="w-full p-2 border rounded-lg outline-none"
                                        value={newGroup.type}
                                        onChange={e => setNewGroup({ ...newGroup, type: e.target.value as any })}
                                    >
                                        <option value="CUG">CUG</option>
                                        <option value="ORGANIZATION">Organization</option>
                                        <option value="GOVERNMENT">Government</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Members</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg outline-none"
                                        value={newGroup.maxMembers}
                                        onChange={e => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Prepaid Balance</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg outline-none"
                                        value={newGroup.prepaidBalance}
                                        onChange={e => setNewGroup({ ...newGroup, prepaidBalance: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                                    <select 
                                        className="w-full p-2 border rounded-lg outline-none"
                                        value={newGroup.currency}
                                        onChange={e => setNewGroup({ ...newGroup, currency: e.target.value as any })}
                                    >
                                        <option value="SLL">SLL</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Books (Optional)</label>
                                <p className="text-[10px] text-slate-500 mb-2">If none selected, group has platform-wide access.</p>
                                <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                                    {books.map(book => (
                                        <label key={book.id} className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newGroup.allowedBookIds.includes(book.id)}
                                                onChange={e => {
                                                    const ids = e.target.checked
                                                        ? [...newGroup.allowedBookIds, book.id]
                                                        : newGroup.allowedBookIds.filter(id => id !== book.id);
                                                    setNewGroup({ ...newGroup, allowedBookIds: ids });
                                                }}
                                                className="rounded border-slate-300 text-quantum-600 focus:ring-quantum-500"
                                            />
                                            <span className="text-xs text-slate-700 truncate">{book.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="flex-1"
                                    disabled={isCreating}
                                >
                                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Group'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {showActivateSubModal && selectedGroup && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-2">Activate Group Subscription</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            This will activate a prepaid subscription for all <strong>{selectedGroup.GroupMembers?.length || 0}</strong> members of <strong>{selectedGroup.name}</strong>.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Plan</label>
                                <select 
                                    className="w-full p-2 border rounded-lg outline-none"
                                    value={selectedPlanId}
                                    onChange={e => setSelectedPlanId(e.target.value)}
                                >
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.id.toUpperCase()} ({plan.durationHours} hrs)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Plan Duration:</span>
                                    <span className="font-medium text-slate-900">
                                        {plans.find(p => p.id === selectedPlanId)?.durationHours || 0} Hours
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Charge per learner:</span>
                                    <span className="font-medium text-quantum-700">
                                        {selectedGroup.currency === 'SLL' 
                                            ? `${(plans.find(p => p.id === selectedPlanId)?.priceSLL || 0).toLocaleString()} SLL`
                                            : `$${plans.find(p => p.id === selectedPlanId)?.priceUSD || 0}`
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Learner Count:</span>
                                    <span className="font-medium text-slate-900">{selectedGroup.GroupMembers?.length || 0}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-2 flex justify-between">
                                    <span className="font-bold text-slate-900 text-base">Total Cumulative Cost:</span>
                                    <span className="font-bold text-quantum-700 text-xl">
                                        {selectedGroup.currency === 'SLL' 
                                            ? `${getCumulativeCost().toLocaleString()} SLL`
                                            : `$${getCumulativeCost()}`
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs mt-2 p-2 bg-white rounded border border-slate-100">
                                    <span className="text-slate-500">Group Available Funds:</span>
                                    <span className={`font-bold ${parseFloat(selectedGroup.prepaidBalance) < getCumulativeCost() ? 'text-red-600' : 'text-green-600'}`}>
                                        {selectedGroup.currency === 'SLL' 
                                            ? `${parseFloat(selectedGroup.prepaidBalance).toLocaleString()} SLL`
                                            : `$${selectedGroup.prepaidBalance}`
                                        }
                                    </span>
                                </div>
                            </div>

                            {parseFloat(selectedGroup.prepaidBalance) < getCumulativeCost() && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-xs text-red-800">
                                        Insufficient prepaid balance. Please adjust the group balance before activating.
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 mt-8">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => setShowActivateSubModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="button" 
                                    className="flex-1 bg-quantum-600 hover:bg-quantum-700 text-white"
                                    disabled={isActivatingSub || parseFloat(selectedGroup.prepaidBalance) < getCumulativeCost()}
                                    onClick={handleActivateGroupSub}
                                >
                                    {isActivatingSub ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate Now'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {showBalanceModal && selectedGroup && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-sm p-6">
                        <h2 className="text-xl font-bold mb-2">Adjust Group Balance</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Group: <strong>{selectedGroup.name}</strong>
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Amount ({selectedGroup.currency})
                                </label>
                                <input 
                                    type="number"
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 ring-quantum-500"
                                    value={adjustmentAmount}
                                    onChange={e => setAdjustmentAmount(parseFloat(e.target.value))}
                                    placeholder="e.g. 50000 or -20000"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Positive to credit, negative to debit.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-xs text-slate-500">Current Balance:</span>
                                <span className="font-bold text-slate-900">
                                    {selectedGroup.currency === 'SLL' 
                                        ? `${parseFloat(selectedGroup.prepaidBalance).toLocaleString()} SLL`
                                        : `$${selectedGroup.prepaidBalance}`
                                    }
                                </span>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => setShowBalanceModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="button" 
                                    className="flex-1"
                                    disabled={isAdjustingBalance || adjustmentAmount === 0}
                                    onClick={handleAdjustBalance}
                                >
                                    {isAdjustingBalance ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
