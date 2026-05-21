import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Clock, 
  TrendingUp, 
  CreditCard, 
  AlertCircle,
  Settings,
  RefreshCw,
  DollarSign,
  Coins
} from 'lucide-react';
import { toast } from 'sonner';
import { usePayGO } from '../hooks/usePayGO';

interface PayGOWalletProps {
  className?: string;
}

export const PayGOWallet: React.FC<PayGOWalletProps> = ({ className = '' }) => {
  const {
    wallet,
    loading,
    error,
    refreshWallet,
    depositFunds,
    getTransactions
  } = usePayGO(localStorage.getItem('token') || '');

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositCurrency, setDepositCurrency] = useState<'SLL' | 'USD'>('SLL');
  const [depositMethod, setDepositMethod] = useState('orange_money');
  const [depositReference, setDepositReference] = useState('');
  const [processingDeposit, setProcessingDeposit] = useState(false);

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setProcessingDeposit(true);
      await depositFunds(
        parseFloat(depositAmount),
        depositCurrency,
        depositMethod,
        depositReference || undefined
      );

      // Reset form
      setDepositAmount('');
      setDepositReference('');
      setShowDepositModal(false);
      
      // Refresh transactions
      getTransactions();
      
      toast.success('Deposit successful!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deposit failed');
    } finally {
      setProcessingDeposit(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'SLL') {
      return `Le ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error || 'Wallet not available'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">PayGO Wallet</h3>
        </div>
        <button
          onClick={refreshWallet}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh wallet"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Balance Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">SLL Balance</span>
            <Coins className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(wallet.leones_balance, 'SLL')}
          </div>
          {wallet.default_currency === 'SLL' && (
            <span className="text-xs text-blue-700 mt-1 block">Default Currency</span>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">USD Balance</span>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">
            {formatCurrency(wallet.usd_balance, 'USD')}
          </div>
          {wallet.default_currency === 'USD' && (
            <span className="text-xs text-green-700 mt-1 block">Default Currency</span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setShowDepositModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total Deposited</span>
          </div>
          <div className="font-semibold text-gray-900">
            {formatCurrency(
              wallet.default_currency === 'SLL' ? wallet.total_deposited_leones : wallet.total_deposited_usd,
              wallet.default_currency
            )}
          </div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Total Spent</span>
          </div>
          <div className="font-semibold text-gray-900">
            {formatCurrency(
              wallet.default_currency === 'SLL' ? wallet.total_spent_leones : wallet.total_spent_usd,
              wallet.default_currency
            )}
          </div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Auto Top-up</span>
          </div>
          <div className="font-semibold text-gray-900">
            {wallet.auto_topup_enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      {wallet.is_suspended && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Wallet Suspended</span>
          </div>
          {wallet.suspension_reason && (
            <p className="text-sm text-red-700 mt-1">{wallet.suspension_reason}</p>
          )}
        </div>
      )}

      {/* Last Used */}
      {wallet.last_used_at && (
        <div className="text-sm text-gray-600">
          Last used: {new Date(wallet.last_used_at).toLocaleString()}
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Funds to Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={depositCurrency}
                  onChange={(e) => setDepositCurrency(e.target.value as 'SLL' | 'USD')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SLL">Sierra Leone Leones (SLL)</option>
                  <option value="USD">US Dollars (USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="orange_money">Orange Money</option>
                  <option value="afrimoney">Afrimoney</option>
                  <option value="qmoney">Q Money</option>
                  <option value="stripe">Credit/Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference (Optional)
                </label>
                <input
                  type="text"
                  value={depositReference}
                  onChange={(e) => setDepositReference(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Transaction reference"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleDeposit}
                disabled={processingDeposit || !depositAmount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processingDeposit ? 'Processing...' : 'Add Funds'}
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
