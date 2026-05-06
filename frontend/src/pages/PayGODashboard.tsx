import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Clock,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  DollarSign,
  Coins,
  Activity,
  Users,
  BookOpen,
  Video,
  Headphones
} from 'lucide-react';
import { PayGOWallet } from '../components/PayGOWallet';
import { usePayGO } from '../hooks/usePayGO';

export const PayGODashboard: React.FC = () => {
  const {
    wallet,
    transactions,
    activeSessions,
    loading,
    error,
    getTransactions,
    getActiveSessions
  } = usePayGO(localStorage.getItem('token') || '');

  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getTransactions(currentPage, 20, filterType === 'all' ? undefined : filterType);
  }, [currentPage, filterType, getTransactions]);

  const formatCurrency = (amount: number, currency: string = 'SLL') => {
    if (currency === 'SLL') {
      return `Le ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'charge':
        return <Coins className="w-4 h-4 text-red-600" />;
      case 'refund':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'bonus':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getServiceIcon = (serviceType?: string) => {
    switch (serviceType) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audiobook':
        return <Headphones className="w-4 h-4" />;
      case 'ebook':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const calculateStats = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weekTransactions = transactions.filter(t => 
      new Date(t.created_at) >= weekAgo
    );
    const monthTransactions = transactions.filter(t => 
      new Date(t.created_at) >= monthAgo
    );

    const weekSpending = weekTransactions
      .filter(t => t.transaction_type === 'charge')
      .reduce((sum, t) => sum + Math.abs(t.leones_amount), 0);

    const monthSpending = monthTransactions
      .filter(t => t.transaction_type === 'charge')
      .reduce((sum, t) => sum + Math.abs(t.leones_amount), 0);

    const weekDeposits = weekTransactions
      .filter(t => t.transaction_type === 'deposit')
      .reduce((sum, t) => sum + t.leones_amount, 0);

    return {
      weekSpending,
      monthSpending,
      weekDeposits,
      activeSessionCount: activeSessions.length
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PayGO Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Wallet className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">PayGO Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {activeSessions.length} Active Session{activeSessions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Section */}
        <div className="mb-8">
          <PayGOWallet />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Week Spending</span>
              <TrendingUp className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.weekSpending)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Month Spending</span>
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.monthSpending)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Week Deposits</span>
              <CreditCard className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.weekDeposits)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Sessions</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.activeSessionCount}
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(session.product_type)}
                    <div>
                      <div className="font-medium text-gray-900">{session.product_id}</div>
                      <div className="text-sm text-gray-600">
                        Started: {new Date(session.started_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(session.accumulated_leones)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.floor(session.total_duration_seconds / 60)} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="charge">Charges</option>
                <option value="refund">Refunds</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getTransactionIcon(transaction.transaction_type)}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {transaction.transaction_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getServiceIcon(transaction.service_type)}
                          <span className="text-sm text-gray-600 capitalize">
                            {transaction.service_type || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {transaction.product_title || transaction.payment_method || 'Wallet Transaction'}
                        </div>
                        {transaction.duration_minutes && (
                          <div className="text-xs text-gray-600">
                            {transaction.duration_minutes} minutes
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.leones_amount))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
