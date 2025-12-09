
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getCurrentUser, updateWalletBalance, subscribe } from '@/web-frontend/src/services/store';
import { CreditCard, ArrowUpRight, ArrowDownLeft, DollarSign, X, ShieldCheck } from 'lucide-react';

type TransactionType = 'deposit' | 'withdraw';
type Currency = 'USD' | 'SLL';

interface PaymentProvider {
   id: string;
   name: string;
   icon: React.ReactNode;
   supportedCurrencies: Currency[];
   color: string;
}

const PROVIDERS: PaymentProvider[] = [
   {
      id: 'stripe',
      name: 'Stripe',
      icon: <CreditCard size={20} />,
      supportedCurrencies: ['USD'],
      color: 'bg-indigo-600'
   },
   {
      id: 'orange',
      name: 'Orange Money',
      icon: <span className="font-bold text-lg">OM</span>,
      supportedCurrencies: ['SLL'],
      color: 'bg-orange-500'
   },
   {
      id: 'afri',
      name: 'Afrimoney',
      icon: <span className="font-bold text-lg">AM</span>,
      supportedCurrencies: ['SLL'],
      color: 'bg-red-600'
   },
   {
      id: 'qmoney',
      name: 'QMoney',
      icon: <span className="font-bold text-lg">QM</span>,
      supportedCurrencies: ['SLL'],
      color: 'bg-blue-500'
   }
];

export const Wallet: React.FC = () => {
   const [user, setUser] = useState(getCurrentUser());
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [activeType, setActiveType] = useState<TransactionType>('deposit');
   const [activeCurrency, setActiveCurrency] = useState<Currency>('USD');
   const [amount, setAmount] = useState('');
   const [selectedProviderId, setSelectedProviderId] = useState<string>('');
   const [isProcessing, setIsProcessing] = useState(false);

   useEffect(() => {
      const unsubscribe = subscribe(() => setUser(getCurrentUser()));
      return unsubscribe;
   }, []);

   const openModal = (type: TransactionType, currency: Currency) => {
      setActiveType(type);
      setActiveCurrency(currency);

      // Default provider selection
      const available = PROVIDERS.filter(p => p.supportedCurrencies.includes(currency));
      if (available.length > 0) setSelectedProviderId(available[0].id);

      setAmount('');
      setIsModalOpen(true);
   };

   const handleTransaction = () => {
      if (!amount || parseFloat(amount) <= 0) return;

      setIsProcessing(true);
      // Simulate API call delay
      setTimeout(() => {
         const val = parseFloat(amount);
         // For withdrawal, we deduct (negative value). For deposit, we add (positive).
         const change = activeType === 'deposit' ? val : -val;

         updateWalletBalance(change, activeCurrency);

         setIsProcessing(false);
         setIsModalOpen(false);
         alert(`${activeType === 'deposit' ? 'Deposit' : 'Withdrawal'} of ${activeCurrency} ${amount} successful!`);
      }, 1500);
   };

   if (!user) return <div className="p-8">Please log in to view wallet.</div>;

   const availableProviders = PROVIDERS.filter(p => p.supportedCurrencies.includes(activeCurrency));
   const selectedProvider = PROVIDERS.find(p => p.id === selectedProviderId);

   // Fee Calculation Logic
   // Registration/Deposit is Free.
   // Cash Out (Withdrawal) fee is 25%.
   const amountVal = parseFloat(amount || '0');
   let feeVal = 0;
   let feeDisplay = 'Free';

   if (activeType === 'withdraw') {
      feeVal = amountVal * 0.25; // 25% fee on cash out
      feeDisplay = `${activeCurrency === 'USD' ? '$' : 'Le'} ${feeVal.toFixed(2)} (25%)`;
   }

   // Calculate Net Total
   // Deposit: You pay Amount (Fee is 0). Wallet +Amount.
   // Withdraw: You request Amount from Wallet. You receive Amount - Fee. Wallet -Amount.
   const netTotal = activeType === 'deposit' ? amountVal : (amountVal - feeVal);

   return (
      <div className="p-8 max-w-4xl mx-auto">
         <h1 className="text-3xl font-bold text-slate-900 mb-8">Wallet & Payments</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* USD Wallet */}
            <Card className="bg-slate-900 text-white border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               <CardContent className="p-8 relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <span className="text-slate-400 text-sm font-medium tracking-wider">USD BALANCE</span>
                        <h2 className="text-4xl font-bold mt-2">${user.walletBalance.usd.toFixed(2)}</h2>
                     </div>
                     <div className="p-3 bg-slate-800 rounded-xl"><DollarSign className="text-emerald-400" /></div>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-700 border-none" onClick={() => openModal('deposit', 'USD')}>
                        Top Up
                     </Button>
                     <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 w-full" onClick={() => openModal('withdraw', 'USD')}>
                        Cash Out
                     </Button>
                  </div>
               </CardContent>
            </Card>

            {/* SLL Wallet */}
            <Card className="bg-gradient-to-br from-orange-600 to-red-700 text-white border-none relative overflow-hidden">
               <div className="absolute bottom-0 left-0 p-32 bg-yellow-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
               <CardContent className="p-8 relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <span className="text-orange-100 text-sm font-medium tracking-wider">SLL BALANCE</span>
                        <h2 className="text-4xl font-bold mt-2">Le {user.walletBalance.sll.toLocaleString()}</h2>
                     </div>
                     <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"><CreditCard className="text-white" /></div>
                  </div>
                  <div className="flex gap-3">
                     <Button className="w-full bg-white text-orange-700 hover:bg-orange-50 border-none font-bold" onClick={() => openModal('deposit', 'SLL')}>
                        Deposit
                     </Button>
                     <Button className="w-full bg-orange-800/50 text-white hover:bg-orange-900/50 border-none backdrop-blur-sm" onClick={() => openModal('withdraw', 'SLL')}>
                        Withdraw
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         <Card>
            <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
            <CardContent>
               <div className="divide-y divide-slate-100">
                  <TransactionItem
                     type="deposit"
                     title="Top up via Stripe"
                     date="Today, 10:23 AM"
                     amount="+$50.00"
                     status="Completed"
                  />
                  <TransactionItem
                     type="purchase"
                     title="Purchased 'Physics Mastery'"
                     date="Yesterday, 4:15 PM"
                     amount="-$15.99"
                     status="Completed"
                  />
                  <TransactionItem
                     type="deposit"
                     title="Orange Money Deposit"
                     date="Oct 24, 2023"
                     amount="+Le 500,000"
                     status="Completed"
                  />
               </div>
            </CardContent>
         </Card>

         {/* Payment Modal */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                     <h3 className="text-lg font-bold text-slate-900 capitalize">{activeType} {activeCurrency}</h3>
                     <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
                     {/* Provider Selection */}
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Method</label>
                        <div className="grid grid-cols-2 gap-3">
                           {availableProviders.map(provider => (
                              <button
                                 key={provider.id}
                                 onClick={() => setSelectedProviderId(provider.id)}
                                 className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedProviderId === provider.id
                                    ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                              >
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${provider.color}`}>
                                    {provider.icon}
                                 </div>
                                 <span className="font-medium text-slate-700 text-sm">{provider.name}</span>
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Amount Input */}
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activeType === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'}</label>
                        <div className="relative">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                              {activeCurrency === 'USD' ? '$' : 'Le'}
                           </div>
                           <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-bold text-slate-900"
                              placeholder="0.00"
                              autoFocus
                           />
                        </div>
                     </div>

                     {/* Summary & Fees */}
                     <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Amount</span>
                           <span className="font-medium text-slate-700">
                              {activeCurrency === 'USD' ? '$' : 'Le'} {amountVal.toFixed(2)}
                           </span>
                        </div>
                        {selectedProvider && (
                           <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Provider</span>
                              <span className="font-medium text-slate-700 flex items-center gap-1">
                                 <ShieldCheck size={14} className="text-emerald-500" />
                                 {selectedProvider.name}
                              </span>
                           </div>
                        )}

                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Platform Fee {activeType === 'withdraw' ? '(25%)' : ''}</span>
                           <span className={`font-medium ${activeType === 'withdraw' ? 'text-red-500' : 'text-slate-700'}`}>
                              {activeType === 'withdraw' ? '-' : ''}{feeDisplay}
                           </span>
                        </div>

                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                           <span className="font-bold text-slate-700">
                              {activeType === 'deposit' ? 'Total You Pay' : 'Net Received'}
                           </span>
                           <span className="font-bold text-lg text-emerald-600">
                              {activeCurrency === 'USD' ? '$' : 'Le'} {netTotal.toFixed(2)}
                           </span>
                        </div>
                     </div>

                     {activeType === 'withdraw' && (
                        <p className="text-xs text-slate-400 text-center leading-relaxed">
                           A 25% platform fee applies to all cash-out transactions.
                        </p>
                     )}
                     {activeType === 'deposit' && (
                        <p className="text-xs text-slate-400 text-center leading-relaxed">
                           Deposits are free.
                        </p>
                     )}

                     <Button
                        size="lg"
                        className="w-full"
                        onClick={handleTransaction}
                        disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                        isLoading={isProcessing}
                     >
                        Confirm {activeType === 'deposit' ? 'Deposit' : 'Withdrawal'}
                     </Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

const TransactionItem: React.FC<{ type: 'deposit' | 'purchase', title: string, date: string, amount: string, status?: string }> = ({ type, title, date, amount, status }) => (
   <div className="flex items-center justify-between py-4 group hover:bg-slate-50 transition-colors px-2 rounded-lg -mx-2">
      <div className="flex items-center gap-4">
         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
            {type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
         </div>
         <div>
            <div className="font-medium text-slate-900">{title}</div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
               <span>{date}</span>
               {status && <span className="w-1 h-1 bg-slate-300 rounded-full" />}
               {status && <span className="text-emerald-600 font-medium">{status}</span>}
            </div>
         </div>
      </div>
      <div className={`font-bold ${type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'}`}>
         {amount}
      </div>
   </div>
);




