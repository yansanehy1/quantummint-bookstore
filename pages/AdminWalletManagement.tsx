import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    History,
    Plus,
    Minus,
    Search,
    Send,
    Gift,
    DollarSign
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface User {
    id: string;
    name: string;
    email: string;
    usdBalance: number;
    sllBalance: number;
    role: string;
}

interface Transaction {
    id: string;
    userId: string;
    userName: string;
    type: 'credit' | 'debit';
    currency: 'USD' | 'SLL';
    amount: number;
    reason: string;
    date: Date;
    adminName: string;
}

const mockUsers: User[] = [
    { id: '1', name: 'Ibrahim Yansaneh', email: 'ibrahim@example.com', usdBalance: 50.0, sllBalance: 82000, role: 'admin' },
    { id: '2', name: 'John Doe', email: 'john@example.com', usdBalance: 25.5, sllBalance: 41000, role: 'seller' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', usdBalance: 10.0, sllBalance: 16400, role: 'user' },
];

const mockTransactions: Transaction[] = [
    { id: '1', userId: '2', userName: 'John Doe', type: 'credit', currency: 'USD', amount: 50.0, reason: 'Seller bonus', date: new Date(2025, 10, 1), adminName: 'Ibrahim' },
];

export default function AdminWalletManagement() {

    useEffect(() => {
        document.title = 'Wallet Management - Quantummint Bookstore';
    }, []);
    const [activeTab, setActiveTab] = useState<'credit-debit' | 'gift' | 'history'>('credit-debit');
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [transactionForm, setTransactionForm] = useState({ type: 'credit' as 'credit' | 'debit', currency: 'USD' as 'USD' | 'SLL', amount: '', reason: '' });
    const [giftForm, setGiftForm] = useState({ bookTitle: '', recipientType: 'individual' as 'individual' | 'all', selectedUserId: '', message: '' });

    const availableBooks = [
        { id: 'b1', title: 'Language Arts - JSS 1' },
        { id: 'b2', title: 'Mathematics - JSS 2' },
        { id: 'b3', title: 'English Literature - SSS 1' },
    ];

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreditDebit = () => {
        if (!selectedUser || !transactionForm.amount || !transactionForm.reason) {
            alert('Please select a user and fill in the amount and reason.');
            return;
        }

        const amount = parseFloat(transactionForm.amount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        let newUsdBalance = selectedUser.usdBalance;
        let newSllBalance = selectedUser.sllBalance;

        if (transactionForm.currency === 'USD') {
            newUsdBalance = transactionForm.type === 'credit' ? selectedUser.usdBalance + amount : selectedUser.usdBalance - amount;
            if (newUsdBalance < 0) {
                alert('Insufficient USD funds.');
                return;
            }
        } else {
            newSllBalance = transactionForm.type === 'credit' ? selectedUser.sllBalance + amount : selectedUser.sllBalance - amount;
            if (newSllBalance < 0) {
                alert('Insufficient SLL funds.');
                return;
            }
        }

        const updatedUsers = users.map(user =>
            user.id === selectedUser.id ? { ...user, usdBalance: newUsdBalance, sllBalance: newSllBalance } : user
        );

        const newTransaction: Transaction = {
            id: String(transactions.length + 1),
            userId: selectedUser.id,
            userName: selectedUser.name,
            type: transactionForm.type,
            currency: transactionForm.currency,
            amount,
            reason: transactionForm.reason,
            date: new Date(),
            adminName: 'Admin'
        };

        setUsers(updatedUsers);
        setTransactions([newTransaction, ...transactions]);
        setSelectedUser(null);
        setTransactionForm({ type: 'credit', currency: 'USD', amount: '', reason: '' });
        alert('Transaction completed successfully!');
    };

    const handleGift = () => {
        if (giftForm.recipientType === 'individual' && !giftForm.selectedUserId) {
            alert('Please select a recipient user.');
            return;
        }
        if (!giftForm.bookTitle) {
            alert('Please select a book to gift.');
            return;
        }
        alert(`Gift "${giftForm.bookTitle}" sent successfully!`);
        setGiftForm({ bookTitle: '', recipientType: 'individual', selectedUserId: '', message: '' });
    };

    const totalUsdDistributed = transactions.filter(t => t.type === 'credit' && t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0);
    const totalSllDistributed = transactions.filter(t => t.type === 'credit' && t.currency === 'SLL').reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="pb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900">Admin Wallet Management</h1>
                    <p className="text-lg text-gray-500 mt-1">Manage user finances and rewards.</p>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-80">Total Users</p>
                                <p className="text-4xl font-extrabold mt-2">{users.length}</p>
                            </div>
                            <Users className="w-8 h-8 opacity-80" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-tr from-green-500 to-teal-600 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-80">USD Credited</p>
                                <p className="text-4xl font-extrabold mt-2">${totalUsdDistributed.toFixed(2)}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 opacity-80" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-tr from-purple-500 to-pink-600 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-80">SLL Credited</p>
                                <p className="text-4xl font-extrabold mt-2">Le {totalSllDistributed.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 opacity-80" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-tr from-yellow-500 to-orange-600 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-80">Transactions</p>
                                <p className="text-4xl font-extrabold mt-2">{transactions.length}</p>
                            </div>
                            <History className="w-8 h-8 opacity-80" />
                        </div>
                    </Card>
                </div>

                <div className="flex overflow-x-auto border-b border-gray-200">
                    {[
                        { id: 'credit-debit' as const, label: 'Wallet Transfers', icon: Users },
                        { id: 'gift' as const, label: 'Reward Books', icon: Gift },
                        { id: 'history' as const, label: 'Transaction Log', icon: History },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-6 py-3 font-medium transition ${activeTab === tab.id
                                ? 'border-b-4 border-indigo-600 text-indigo-700 bg-indigo-50'
                                : 'border-transparent text-gray-500 hover:text-indigo-600'
                                }`}
                        >
                            <tab.icon className="w-5 h-5 mr-2" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'credit-debit' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 p-6">
                            <h3 className="text-2xl font-bold mb-6">Select Recipient</h3>
                            <div className="mb-4 relative">
                                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition ${selectedUser?.id === user.id
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-lg">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className="inline-block px-3 py-1 text-sm font-bold rounded-full bg-green-100 text-green-700">
                                                    ${user.usdBalance.toFixed(2)}
                                                </span>
                                                <span className="inline-block px-3 py-1 text-sm font-bold rounded-full bg-blue-100 text-blue-700 ml-2">
                                                    Le {user.sllBalance.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-2xl font-bold mb-6">
                                {selectedUser ? `Transact for ${selectedUser.name.split(' ')[0]}` : 'Select User'}
                            </h3>

                            {selectedUser ? (
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={() => setTransactionForm({ ...transactionForm, type: 'credit' })}
                                            className={`flex-1 ${transactionForm.type === 'credit' ? 'bg-green-600' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Credit
                                        </Button>
                                        <Button
                                            onClick={() => setTransactionForm({ ...transactionForm, type: 'debit' })}
                                            className={`flex-1 ${transactionForm.type === 'debit' ? 'bg-red-600' : 'bg-gray-200 text-gray-700'}`}
                                        >
                                            <Minus className="w-4 h-4 mr-2" />
                                            Debit
                                        </Button>
                                    </div>

                                    <select
                                        value={transactionForm.currency}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, currency: e.target.value as 'USD' | 'SLL' })}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl"
                                    >
                                        <option value="USD">USD - ${selectedUser.usdBalance.toFixed(2)}</option>
                                        <option value="SLL">SLL - Le {selectedUser.sllBalance.toLocaleString()}</option>
                                    </select>

                                    <input
                                        type="number"
                                        step="0.01"
                                        value={transactionForm.amount}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                        placeholder="Amount"
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl"
                                    />

                                    <textarea
                                        value={transactionForm.reason}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, reason: e.target.value })}
                                        placeholder="Reason for transaction..."
                                        rows={3}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl"
                                    />

                                    <Button
                                        onClick={handleCreditDebit}
                                        className={`w-full ${transactionForm.type === 'credit' ? 'bg-green-600' : 'bg-red-600'}`}
                                    >
                                        {transactionForm.type === 'credit' ? 'Credit' : 'Debit'} Wallet
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="w-10 h-10 mx-auto mb-3" />
                                    Select a user to begin
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'gift' && (
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-2xl font-bold mb-6">Send Book Reward</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => setGiftForm({ ...giftForm, recipientType: 'individual' })}
                                        className={`flex-1 ${giftForm.recipientType === 'individual' ? 'bg-indigo-600' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        Individual
                                    </Button>
                                    <Button
                                        onClick={() => setGiftForm({ ...giftForm, recipientType: 'all' })}
                                        className={`flex-1 ${giftForm.recipientType === 'all' ? 'bg-indigo-600' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        All Users ({users.length})
                                    </Button>
                                </div>

                                {giftForm.recipientType === 'individual' && (
                                    <select
                                        value={giftForm.selectedUserId}
                                        onChange={(e) => setGiftForm({ ...giftForm, selectedUserId: e.target.value })}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-xl"
                                    >
                                        <option value="">Choose a user...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                        ))}
                                    </select>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Select Book</label>
                                    <div className="space-y-2">
                                        {availableBooks.map(book => (
                                            <button
                                                key={book.id}
                                                onClick={() => setGiftForm({ ...giftForm, bookTitle: book.title })}
                                                className={`w-full text-left p-3 rounded-lg border-2 transition ${giftForm.bookTitle === book.title
                                                    ? 'bg-purple-100 border-purple-500'
                                                    : 'bg-white border-gray-200 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {book.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    value={giftForm.message}
                                    onChange={(e) => setGiftForm({ ...giftForm, message: e.target.value })}
                                    placeholder="Gift message (optional)..."
                                    rows={3}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl"
                                />

                                <Button onClick={handleGift} className="w-full bg-purple-600">
                                    <Send className="w-5 h-5 mr-3" />
                                    Send Gift
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                            <h3 className="text-2xl font-bold mb-6">Review Gift Details</h3>
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl">
                                    <p className="text-sm text-gray-500">Recipient Type</p>
                                    <p className="text-lg font-semibold">{giftForm.recipientType === 'individual' ? 'Individual User' : `All Users (${users.length})`}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl">
                                    <p className="text-sm text-gray-500">Book Title</p>
                                    <p className="text-lg font-semibold">{giftForm.bookTitle || 'Not selected'}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'history' && (
                    <Card className="p-6">
                        <h3 className="text-2xl font-bold mb-6">Transaction History</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b-2">
                                    <tr>
                                        <th className="text-left py-3 px-4">Date</th>
                                        <th className="text-left py-3 px-4">User</th>
                                        <th className="text-left py-3 px-4">Type</th>
                                        <th className="text-right py-3 px-4">Amount</th>
                                        <th className="text-left py-3 px-4">Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-4">{tx.date.toLocaleDateString()}</td>
                                            <td className="py-4 px-4 font-semibold">{tx.userName}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${tx.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {tx.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right font-extrabold">
                                                {tx.type === 'credit' ? '+' : '-'}
                                                {tx.currency === 'USD' ? `$${tx.amount.toFixed(2)}` : `Le ${tx.amount.toLocaleString()}`}
                                            </td>
                                            <td className="py-4 px-4">{tx.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
