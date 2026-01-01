import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  BookOpen,
  Wallet as WalletIcon,
  ArrowDown,
  ArrowUp,
  History
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

// Simple Input Component
const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
    {...props}
  />
);

export default function Wallet() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("balance");
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("orange");

  const providers = [
    { id: "orange", name: "Orange Money", icon: "🟠" },
    { id: "afrimoney", name: "Afrimoney", icon: "🏦" },
    { id: "qmoney", name: "Qmoney", icon: "💳" },
    { id: "stripe", name: "Stripe (International)", icon: "💳" },
  ];

  const mockTransactions = [
    { id: 1, type: "deposit", amount: "$50.00", provider: "Orange Money", status: "completed", date: "2024-01-15" },
    { id: 2, type: "purchase", amount: "-$4.99", description: "Introduction to Physics", status: "completed", date: "2024-01-14" },
    { id: 3, type: "bonus", amount: "+$5.00", description: "Referral Bonus", status: "completed", date: "2024-01-10" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/marketplace')}>
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => navigate('/marketplace')} className="text-gray-700 hover:text-amber-600 font-medium">Home</button>
            <button onClick={() => navigate('/library')} className="text-gray-700 hover:text-amber-600 font-medium">Library</button>
            <button onClick={() => navigate('/seller/dashboard')} className="text-gray-700 hover:text-amber-600 font-medium">Dashboard</button>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Wallet Balance Cards */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-green-100 text-sm mb-2">USD Balance</p>
                <p className="text-5xl font-bold">${user?.balance.toFixed(2) || "0.00"}</p>
              </div>
              <WalletIcon className="w-12 h-12 opacity-30" />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setActiveTab("deposit")} className="bg-white text-green-600 hover:bg-green-50 flex-1">
                <ArrowDown className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button onClick={() => setActiveTab("cashout")} variant="outline" className="border-white text-white hover:bg-white/10 flex-1">
                <ArrowUp className="w-4 h-4 mr-2" />
                Cashout
              </Button>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-blue-100 text-sm mb-2">SLL Balance</p>
                <p className="text-5xl font-bold">Le 0.00</p>
              </div>
              <WalletIcon className="w-12 h-12 opacity-30" />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setActiveTab("deposit")} className="bg-white text-blue-600 hover:bg-blue-50 flex-1">
                <ArrowDown className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button onClick={() => setActiveTab("cashout")} variant="outline" className="border-white text-white hover:bg-white/10 flex-1">
                <ArrowUp className="w-4 h-4 mr-2" />
                Cashout
              </Button>
            </div>
          </Card>
        </section>

        {/* Deposit Section */}
        {activeTab === "deposit" && (
          <section className="mb-12">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Deposit Funds</h3>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Method</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={`p-4 rounded-lg border-2 transition text-left ${selectedProvider === provider.id ? "border-amber-600 bg-amber-50" : "border-gray-200 hover:border-amber-600"
                        }`}
                    >
                      <span className="text-2xl mr-2">{provider.icon}</span>
                      <span className="font-semibold">{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amount</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="py-2 h-12"
                    />
                  </div>
                  <select aria-label="Currency" className="px-4 py-2 border border-gray-300 rounded-lg font-semibold">
                    <option>USD</option>
                    <option>SLL</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> You will be redirected to {providers.find((p) => p.id === selectedProvider)?.name} to complete the payment securely.
                </p>
              </div>

              <Button
                onClick={() => {
                  if (!depositAmount || parseFloat(depositAmount) <= 0) {
                    alert("Please enter a valid amount");
                    return;
                  }
                  alert(`Redirecting to ${providers.find((p) => p.id === selectedProvider)?.name} for payment of $${depositAmount}...`);
                }}
                className="bg-green-600 hover:bg-green-700 w-full py-3 text-lg"
              >
                <ArrowDown className="w-5 h-5 mr-2" />
                Proceed to Payment
              </Button>
            </Card>
          </section>
        )}

        {/* Cashout Section */}
        {activeTab === "cashout" && (
          <section className="mb-12">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Request Cashout</h3>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Withdrawal Method</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {providers.slice(0, 3).map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={`p-4 rounded-lg border-2 transition text-left ${selectedProvider === provider.id ? "border-amber-600 bg-amber-50" : "border-gray-200 hover:border-amber-600"
                        }`}
                    >
                      <span className="text-2xl mr-2">{provider.icon}</span>
                      <span className="font-semibold">{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Withdrawal Amount</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="py-2 h-12"
                    />
                  </div>
                  <select aria-label="Currency" className="px-4 py-2 border border-gray-300 rounded-lg font-semibold">
                    <option>USD</option>
                    <option>SLL</option>
                  </select>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-yellow-900">
                  <strong>Processing Time:</strong> Cashout requests typically take 1-3 business days to complete.
                </p>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 w-full py-3 text-lg">
                <ArrowUp className="w-5 h-5 mr-2" />
                Request Cashout
              </Button>
            </Card>
          </section>
        )}

        {/* Transaction History */}
        <section>
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <History className="w-6 h-6" />
              Transaction History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockTransactions.length > 0 ? (
                    mockTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{tx.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.type === "deposit"
                              ? "bg-green-100 text-green-800"
                              : tx.type === "purchase"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                              }`}
                          >
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{tx.description || tx.provider}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{tx.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                        No transactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

