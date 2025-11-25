"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Wallet;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
function Wallet() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [activeTab, setActiveTab] = (0, react_1.useState)("balance");
    const [depositAmount, setDepositAmount] = (0, react_1.useState)("");
    const [selectedProvider, setSelectedProvider] = (0, react_1.useState)("orange");
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
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <lucide_react_1.BookOpen className="w-8 h-8 text-amber-600"/>
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => setLocation("/")} className="text-gray-700 hover:text-amber-600 font-medium">Home</button>
            <button onClick={() => setLocation("/library")} className="text-gray-700 hover:text-amber-600 font-medium">Library</button>
            <button onClick={() => setLocation("/dashboard")} className="text-gray-700 hover:text-amber-600 font-medium">Dashboard</button>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Wallet Balance Cards */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <card_1.Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-green-100 text-sm mb-2">USD Balance</p>
                <p className="text-5xl font-bold">$0.00</p>
              </div>
              <lucide_react_1.Wallet className="w-12 h-12 opacity-30"/>
            </div>
            <div className="flex gap-3">
              <button_1.Button onClick={() => setActiveTab("deposit")} className="bg-white text-green-600 hover:bg-green-50 flex-1">
                <lucide_react_1.ArrowDown className="w-4 h-4 mr-2"/>
                Deposit
              </button_1.Button>
              <button_1.Button onClick={() => setActiveTab("cashout")} variant="outline" className="border-white text-white hover:bg-white/10 flex-1">
                <lucide_react_1.ArrowUp className="w-4 h-4 mr-2"/>
                Cashout
              </button_1.Button>
            </div>
          </card_1.Card>

          <card_1.Card className="p-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-blue-100 text-sm mb-2">SLL Balance</p>
                <p className="text-5xl font-bold">Le 0.00</p>
              </div>
              <lucide_react_1.Wallet className="w-12 h-12 opacity-30"/>
            </div>
            <div className="flex gap-3">
              <button_1.Button onClick={() => setActiveTab("deposit")} className="bg-white text-blue-600 hover:bg-blue-50 flex-1">
                <lucide_react_1.ArrowDown className="w-4 h-4 mr-2"/>
                Deposit
              </button_1.Button>
              <button_1.Button onClick={() => setActiveTab("cashout")} variant="outline" className="border-white text-white hover:bg-white/10 flex-1">
                <lucide_react_1.ArrowUp className="w-4 h-4 mr-2"/>
                Cashout
              </button_1.Button>
            </div>
          </card_1.Card>
        </section>

        {/* Deposit Section */}
        {activeTab === "deposit" && (<section className="mb-12">
            <card_1.Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Deposit Funds</h3>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Method</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {providers.map((provider) => (<button key={provider.id} onClick={() => setSelectedProvider(provider.id)} className={`p-4 rounded-lg border-2 transition text-left ${selectedProvider === provider.id ? "border-amber-600 bg-amber-50" : "border-gray-200 hover:border-amber-600"}`}>
                      <span className="text-2xl mr-2">{provider.icon}</span>
                      <span className="font-semibold">{provider.name}</span>
                    </button>))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amount</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input_1.Input type="number" placeholder="Enter amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="py-2 h-12"/>
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

              <button_1.Button onClick={() => {
                if (!depositAmount || parseFloat(depositAmount) <= 0) {
                    alert("Please enter a valid amount");
                    return;
                }
                alert(`Redirecting to ${providers.find((p) => p.id === selectedProvider)?.name} for payment of $${depositAmount}...`);
            }} className="bg-green-600 hover:bg-green-700 w-full py-3 text-lg">
                <lucide_react_1.ArrowDown className="w-5 h-5 mr-2"/>
                Proceed to Payment
              </button_1.Button>
            </card_1.Card>
          </section>)}

        {/* Cashout Section */}
        {activeTab === "cashout" && (<section className="mb-12">
            <card_1.Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Request Cashout</h3>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Withdrawal Method</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {providers.slice(0, 3).map((provider) => (<button key={provider.id} onClick={() => setSelectedProvider(provider.id)} className={`p-4 rounded-lg border-2 transition text-left ${selectedProvider === provider.id ? "border-amber-600 bg-amber-50" : "border-gray-200 hover:border-amber-600"}`}>
                      <span className="text-2xl mr-2">{provider.icon}</span>
                      <span className="font-semibold">{provider.name}</span>
                    </button>))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Withdrawal Amount</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input_1.Input type="number" placeholder="Enter amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="py-2 h-12"/>
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

              <button_1.Button className="bg-blue-600 hover:bg-blue-700 w-full py-3 text-lg">
                <lucide_react_1.ArrowUp className="w-5 h-5 mr-2"/>
                Request Cashout
              </button_1.Button>
            </card_1.Card>
          </section>)}

        {/* Transaction History */}
        <section>
          <card_1.Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <lucide_react_1.History className="w-6 h-6"/>
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
                  {mockTransactions.length > 0 ? (mockTransactions.map((tx) => (<tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{tx.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.type === "deposit"
                ? "bg-green-100 text-green-800"
                : tx.type === "purchase"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"}`}>
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
                      </tr>))) : (<tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                        No transactions yet
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </card_1.Card>
        </section>
      </main>
    </div>);
}
