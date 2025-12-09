import React, { useState } from "react";
import { Users, Search, Plus, Minus, Gift, TrendingUp, History, Send } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  usdBalance: number;
  sllBalance: number;
  role: "admin" | "seller" | "user";
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: "credit" | "debit";
  currency: "USD" | "SLL";
  amount: number;
  reason: string;
  date: Date;
  adminName: string;
}

const CustomCard = ({ children, className = "" }: any) => (
  <div className={`rounded-xl shadow-lg bg-white overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CustomButton = ({ children, onClick, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const mockUsers: User[] = [
  { id: "1", name: "Ibrahim Yansaneh", email: "ibrahim@example.com", usdBalance: 50.0, sllBalance: 82000, role: "admin" },
  { id: "2", name: "John Doe", email: "john@example.com", usdBalance: 25.5, sllBalance: 41000, role: "seller" },
  { id: "3", name: "Jane Smith", email: "jane@example.com", usdBalance: 10.0, sllBalance: 16400, role: "user" },
  { id: "4", name: "Ahmed Hassan", email: "ahmed@example.com", usdBalance: 75.25, sllBalance: 123400, role: "seller" },
  { id: "5", name: "Fatima Mohamed", email: "fatima@example.com", usdBalance: 5.0, sllBalance: 8200, role: "user" },
];

const mockTransactions: Transaction[] = [
  { id: "1", userId: "2", userName: "John Doe", type: "credit", currency: "USD", amount: 50.0, reason: "Seller bonus for high sales", date: new Date(2025, 10, 1), adminName: "Ibrahim Yansaneh" },
  { id: "2", userId: "3", userName: "Jane Smith", type: "debit", currency: "SLL", amount: 5000, reason: "Refund for cancelled order", date: new Date(2025, 10, 2), adminName: "Ibrahim Yansaneh" },
  { id: "3", userId: "4", userName: "Ahmed Hassan", type: "credit", currency: "USD", amount: 100.0, reason: "Monthly seller incentive", date: new Date(2025, 10, 3), adminName: "Ibrahim Yansaneh" },
];

export const AdminConsole = () => {
  const [activeTab, setActiveTab] = useState<"credit-debit" | "gift" | "history">("credit-debit");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [transactionForm, setTransactionForm] = useState({ type: "credit" as "credit" | "debit", currency: "USD" as "USD" | "SLL", amount: "", reason: "" });
  const [giftForm, setGiftForm] = useState({ bookId: "", bookTitle: "", recipientType: "individual" as "individual" | "all", selectedUserId: "", message: "" });
  
  const availableBooks = [
    { id: "b1", title: "Language Arts - JSS 1" },
    { id: "b2", title: "Mathematics - JSS 2" },
    { id: "b3", title: "English Literature - SSS 1" },
    { id: "b4", title: "Biology - SSS 2" },
    { id: "b5", title: "Advanced Physics" },
  ];

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const showMessage = (msg: string) => alert(msg);

  const handleCreditDebit = () => {
    if (!selectedUser || !transactionForm.amount || !transactionForm.reason) {
      showMessage("Error: Please select a user and fill in the amount and reason.");
      return;
    }
    const amount = parseFloat(transactionForm.amount);
    if (isNaN(amount) || amount <= 0) {
        showMessage("Error: Please enter a valid, positive amount.");
        return;
    }

    let insufficientFunds = false;
    let newUsdBalance = selectedUser.usdBalance;
    let newSllBalance = selectedUser.sllBalance;
    
    if (transactionForm.currency === "USD") {
        newUsdBalance = transactionForm.type === "credit" ? selectedUser.usdBalance + amount : selectedUser.usdBalance - amount;
        if (newUsdBalance < 0) {
            insufficientFunds = true;
            showMessage(`Error: Insufficient USD funds for ${selectedUser.name}.`);
        }
    } else {
        newSllBalance = transactionForm.type === "credit" ? selectedUser.sllBalance + amount : selectedUser.sllBalance - amount;
        if (newSllBalance < 0) {
            insufficientFunds = true;
            showMessage(`Error: Insufficient SLL funds for ${selectedUser.name}.`);
        }
    }
    
    if (insufficientFunds) return;

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return { 
            ...user, 
            usdBalance: newUsdBalance,
            sllBalance: newSllBalance
        };
      }
      return user;
    });

    const newTransaction: Transaction = { id: String(transactions.length + 1), userId: selectedUser.id, userName: selectedUser.name, type: transactionForm.type, currency: transactionForm.currency, amount, reason: transactionForm.reason, date: new Date(), adminName: "Ibrahim Yansaneh" };

    setUsers(updatedUsers);
    setTransactions([newTransaction, ...transactions]);
    setSelectedUser(null);
    setTransactionForm({ type: "credit", currency: "USD", amount: "", reason: "" });
    showMessage("Success: Transaction completed successfully!");
  };

  const handleGift = () => {
    if (giftForm.recipientType === "individual" && !giftForm.selectedUserId) {
      showMessage("Error: Please select a recipient user for the individual gift.");
      return;
    }
    if (!giftForm.bookTitle) {
      showMessage("Error: Please select a book to gift.");
      return;
    }
    
    const book = availableBooks.find(b => b.title === giftForm.bookTitle);
    const recipients = giftForm.recipientType === "individual" 
        ? [users.find(u => u.id === giftForm.selectedUserId)?.name || "Unknown User"] 
        : [`All ${users.length} Users`];

    showMessage(`Success: Gift "${giftForm.bookTitle}" sent to ${recipients.join(', ')}! (Book ID: ${book?.id || 'N/A'})`);
    setGiftForm({ bookId: "", bookTitle: "", recipientType: "individual", selectedUserId: "", message: "" });
  };

  const totalUsdDistributed = transactions.filter((t) => t.type === "credit" && t.currency === "USD").reduce((sum, t) => sum + t.amount, 0);
  const totalSllDistributed = transactions.filter((t) => t.type === "credit" && t.currency === "SLL").reduce((sum, t) => sum + t.amount, 0);

  const renderDashboardCard = (title: string, value: string, Icon: React.ElementType, gradientClass: string) => (
    <div className={`p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${gradientClass} text-white border-0`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-4xl font-extrabold mt-2 tracking-tight">{value}</p>
        </div>
        <div className="p-3 bg-white/10 rounded-full">
          <Icon className="w-8 h-8 opacity-80" />
        </div>
      </div>
    </div>
  );

  const renderTabButton = (tabName: "credit-debit" | "gift" | "history", label: string, Icon: React.FC<any>) => (
    <button 
      onClick={() => setActiveTab(tabName)} 
      className={`flex items-center px-4 md:px-6 py-3 font-medium transition-all duration-300 border-b-4 
        ${activeTab === tabName 
          ? "border-indigo-600 text-indigo-700 bg-indigo-50 shadow-inner rounded-t-lg" 
          : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-gray-300"
        }
      `}
    >
      <Icon className="w-5 h-5 inline mr-2" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-inter">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="pb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-lg text-gray-500 mt-1">Manage user finances, rewards, and transaction history.</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {renderDashboardCard("Total Users", users.length.toString(), Users, "bg-gradient-to-tr from-blue-500 to-indigo-600")}
          {renderDashboardCard("USD Credited", `$${totalUsdDistributed.toFixed(2)}`, TrendingUp, "bg-gradient-to-tr from-green-500 to-teal-600")}
          {renderDashboardCard("SLL Credited", `Le ${totalSllDistributed.toLocaleString()}`, TrendingUp, "bg-gradient-to-tr from-purple-500 to-pink-600")}
          {renderDashboardCard("Total Transactions", transactions.length.toString(), History, "bg-gradient-to-tr from-yellow-500 to-orange-600")}
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200">
          {renderTabButton("credit-debit", "Wallet Transfers", Users)}
          {renderTabButton("gift", "Reward Books", Gift)}
          {renderTabButton("history", "Transaction Log", History)}
        </div>

        {activeTab === "credit-debit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CustomCard className="lg:col-span-2 shadow-2xl border border-gray-100">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Recipient</h3>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                  />
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div 
                        key={user.id} 
                        onClick={() => setSelectedUser(user)} 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition duration-300 flex justify-between items-center 
                          ${selectedUser?.id === user.id 
                            ? "border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-500" 
                            : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex-1">
                          <p className="font-bold text-lg text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-right ml-4 space-y-1">
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full mr-2 ${user.usdBalance >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            ${user.usdBalance.toFixed(2)} USD
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${user.sllBalance >= 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                            Le {user.sllBalance.toLocaleString()} SLL
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">No users found matching your search.</div>
                  )}
                </div>
              </div>
            </CustomCard>

            <CustomCard className="shadow-2xl border border-gray-100">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{selectedUser ? `Transact for ${selectedUser.name.split(' ')[0]}` : "Select User to Begin"}</h3>

                {!selectedUser && (
                    <div className="text-center py-12 text-gray-500 italic">
                        <Users className="w-10 h-10 mx-auto mb-3" />
                        Please select a user from the list on the left to process a wallet transaction.
                    </div>
                )}

                {selectedUser && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction Type</label>
                      <div className="flex gap-4 p-1 bg-gray-100 rounded-xl shadow-inner">
                        <CustomButton 
                          onClick={() => setTransactionForm({ ...transactionForm, type: "credit" })} 
                          className={`flex-1 ${transactionForm.type === "credit" ? "bg-green-600 text-white shadow-lg ring-green-500" : "bg-transparent text-gray-700 hover:bg-white"}`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Credit
                        </CustomButton>
                        <CustomButton 
                          onClick={() => setTransactionForm({ ...transactionForm, type: "debit" })} 
                          className={`flex-1 ${transactionForm.type === "debit" ? "bg-red-600 text-white shadow-lg ring-red-500" : "bg-transparent text-gray-700 hover:bg-white"}`}
                        >
                          <Minus className="w-4 h-4 mr-2" />
                          Debit
                        </CustomButton>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                      <select 
                        value={transactionForm.currency} 
                        onChange={(e) => setTransactionForm({ ...transactionForm, currency: e.target.value as "USD" | "SLL" })} 
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      >
                        <option value="USD">USD ($) - Current: ${selectedUser.usdBalance.toFixed(2)}</option>
                        <option value="SLL">SLL (Le) - Current: Le {selectedUser.sllBalance.toLocaleString()}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={transactionForm.amount} 
                        onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })} 
                        placeholder="0.00" 
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
                      <textarea 
                        value={transactionForm.reason} 
                        onChange={(e) => setTransactionForm({ ...transactionForm, reason: e.target.value })} 
                        placeholder="Enter reason for transaction..." 
                        rows={3} 
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                      />
                    </div>

                    <CustomButton 
                        onClick={handleCreditDebit} 
                        className={`w-full text-white font-bold text-lg py-3 shadow-xl 
                            ${transactionForm.type === "credit" 
                                ? "bg-green-600 hover:bg-green-700 ring-green-300" 
                                : "bg-red-600 hover:bg-red-700 ring-red-300"
                            }`
                        }
                    >
                        {transactionForm.type === "credit" ? "Credit" : "Debit"} Wallet
                    </CustomButton>
                  </div>
                )}
              </div>
            </CustomCard>
          </div>
        )}

        {activeTab === "gift" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomCard className="shadow-2xl border border-gray-100">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Book Reward</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Send To</label>
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-xl shadow-inner">
                      <CustomButton 
                          onClick={() => setGiftForm({ ...giftForm, recipientType: "individual", selectedUserId: "" })} 
                          className={`flex-1 py-3 ${giftForm.recipientType === "individual" ? "bg-indigo-600 text-white shadow-lg ring-indigo-500" : "bg-transparent text-gray-700 hover:bg-white"}`}
                      >
                          Individual User
                      </CustomButton>
                      <CustomButton 
                          onClick={() => setGiftForm({ ...giftForm, recipientType: "all", selectedUserId: "" })} 
                          className={`flex-1 py-3 ${giftForm.recipientType === "all" ? "bg-indigo-600 text-white shadow-lg ring-indigo-500" : "bg-transparent text-gray-700 hover:bg-white"}`}
                      >
                          All Users ({users.length})
                      </CustomButton>
                    </div>
                  </div>

                  {giftForm.recipientType === "individual" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select User</label>
                      <select 
                        value={giftForm.selectedUserId} 
                        onChange={(e) => setGiftForm({ ...giftForm, selectedUserId: e.target.value })} 
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      >
                        <option value="">Choose a user...</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Book</label>
                    <input 
                      type="text" 
                      placeholder="Filter book titles..." 
                      value={giftForm.bookTitle} 
                      onChange={(e) => setGiftForm({ ...giftForm, bookTitle: e.target.value })} 
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition mb-3" 
                    />
                    <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-xl bg-gray-50">
                      {availableBooks
                          .filter(book => book.title.toLowerCase().includes(giftForm.bookTitle.toLowerCase()))
                          .map((book) => (
                          <button 
                              key={book.id} 
                              onClick={() => setGiftForm({ ...giftForm, bookTitle: book.title, bookId: book.id })} 
                              className={`w-full text-left p-3 rounded-lg transition duration-200 text-sm border-2 
                                ${giftForm.bookTitle === book.title 
                                  ? "bg-purple-100 border-purple-500 text-purple-900 font-semibold" 
                                  : "bg-white border-gray-200 hover:bg-gray-100"
                                }`}
                          >
                              {book.title}
                          </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gift Message (Optional)</label>
                    <textarea 
                      value={giftForm.message} 
                      onChange={(e) => setGiftForm({ ...giftForm, message: e.target.value })} 
                      placeholder="Add a personal message..." 
                      rows={3} 
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                    />
                  </div>

                  <CustomButton 
                      onClick={handleGift} 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-3 shadow-xl ring-purple-300"
                  >
                    <Send className="w-5 h-5 mr-3" />
                    Send Gift
                  </CustomButton>
                </div>
              </div>
            </CustomCard>

            <CustomCard className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Gift Details</h3>
              <div className="space-y-4">
                {[
                  { title: "Recipient Type", value: giftForm.recipientType === "individual" ? "Individual User" : `All Users (${users.length} recipients)` },
                  { title: "Book Title", value: giftForm.bookTitle || "Not selected", highlight: !!giftForm.bookTitle },
                  { title: "Recipient Name", value: giftForm.recipientType === "individual" ? (users.find((u) => u.id === giftForm.selectedUserId)?.name || "Not selected") : "N/A (All Users)", show: giftForm.recipientType === "individual" },
                  { title: "Message", value: giftForm.message || "No personal message.", textClass: "italic text-gray-700" },
                ].filter(item => item.show !== false).map((item) => (
                  <div key={item.title} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">{item.title}</p>
                    <p className={`text-lg font-semibold text-gray-900 ${item.textClass || ""}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CustomCard>
          </div>
        )}

        {activeTab === "history" && (
          <CustomCard className="shadow-2xl border border-gray-100">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Full Transaction Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-700 uppercase tracking-wider">
                      <th className="text-left py-3 px-4 font-bold rounded-tl-xl">Date</th>
                      <th className="text-left py-3 px-4 font-bold">User</th>
                      <th className="text-left py-3 px-4 font-bold">Type</th>
                      <th className="text-right py-3 px-4 font-bold">Amount</th>
                      <th className="text-left py-3 px-4 font-bold">Reason</th>
                      <th className="text-left py-3 px-4 font-bold rounded-tr-xl">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.id} className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition duration-150`}>
                        <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{transaction.date.toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-gray-900 font-semibold">{transaction.userName}</td>
                        <td className="py-4 px-4">
                          <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wide ${transaction.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {transaction.type === "credit" ? "CREDIT" : "DEBIT"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-extrabold whitespace-nowrap">
                          <span className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                            {transaction.type === "credit" ? "+" : "-"}
                            {transaction.currency === "USD" ? `$${transaction.amount.toFixed(2)}` : `Le ${transaction.amount.toLocaleString()}`}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{transaction.reason}</td>
                        <td className="py-4 px-4 text-gray-600 whitespace-nowrap">{transaction.adminName}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500 italic">No transactions recorded yet.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CustomCard>
        )}
      </div>
    </div>
  );
};



