import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Wallet as WalletIcon, ArrowDown, ArrowUp, History,
  RefreshCw, CheckCircle, AlertCircle, Phone, RotateCcw
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import PaymentMethodCard from "../components/payment/PaymentMethodCard";
import FeeBreakdown from "../components/payment/FeeBreakdown";
import StripeConnect from "../components/payment/StripeConnect";
import TransactionHistory from "../components/payment/TransactionHistory";
import {
  getWalletBalance, getTransactionHistory, depositMobileMoney, depositStripe,
  withdrawMobileMoney, withdrawStripe, type SavedMethod, type Transaction,
} from "../services/paymentService";
import { refundsAPI, type RefundRequest, type EligiblePurchase } from "../utils/api";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { PAYMENT_CONFIGS, type PaymentMethod } from "../types/payments";

type Tab = "balance" | "deposit" | "withdraw" | "history" | "refunds";

const MOBILE_METHODS: PaymentMethod[] = ["orange_money", "afrimoney", "qmoney"];
const ALL_METHODS: PaymentMethod[] = [...MOBILE_METHODS, "stripe"];

// ─── Notification banner ────────────────────────────────────────────────────

function Banner({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border mb-6 ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
      }`}>
      {type === "success" ? <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
      <p className="flex-1 text-sm">{message}</p>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 text-xl leading-none">&times;</button>
    </div>
  );
}

// ─── Balance cards ──────────────────────────────────────────────────────────

function BalanceCard({ label, value, sub, gradient, onDeposit, onWithdraw }: {
  label: string; value: string; sub?: string; gradient: string;
  onDeposit: () => void; onWithdraw: () => void;
}) {
  return (
    <div className={`rounded-2xl p-6 text-white ${gradient} shadow-lg`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-white/70 text-sm mb-1">{label}</p>
          <p className="text-4xl font-bold tracking-tight">{value}</p>
          {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
        </div>
        <WalletIcon className="w-10 h-10 opacity-20" />
      </div>
      <div className="flex gap-3">
        <button onClick={onDeposit}
          className="flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors">
          <ArrowDown className="w-4 h-4" /> Deposit
        </button>
        <button onClick={onWithdraw}
          className="flex-1 flex items-center justify-center gap-2 border border-white/40 hover:bg-white/10 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors">
          <ArrowUp className="w-4 h-4" /> Withdraw
        </button>
      </div>
    </div>
  );
}

// ─── Main Wallet page ────────────────────────────────────────────────────────

export default function Wallet() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // ─ Wallet state
  const [balanceSLL, setBalanceSLL] = useState(0);
  const [balanceUSD, setBalanceUSD] = useState(0);
  const [savedMethods, setSavedMethods] = useState<SavedMethod[]>([]);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // ─ Tab
  const [activeTab, setActiveTab] = useState<Tab>("balance");

  // ─ Deposit state
  const [depositMethod, setDepositMethod] = useState<PaymentMethod>("orange_money");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositPhone, setDepositPhone] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);

  // ─ Withdrawal state
  const [withdrawMethod, setWithdrawMethod] = useState<PaymentMethod>("orange_money");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // ─ History state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [historyFilters, setHistoryFilters] = useState<{ type?: string; method?: string; status?: string }>({});
  const [historyLoading, setHistoryLoading] = useState(false);

  const { rate: exchangeRate } = useExchangeRate();

  // ─ Refunds state
  const [eligiblePurchases, setEligiblePurchases] = useState<EligiblePurchase[]>([]);
  const [myRefunds, setMyRefunds] = useState<RefundRequest[]>([]);
  const [refundPurchaseId, setRefundPurchaseId] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundsLoading, setRefundsLoading] = useState(false);
  const [refundSubmitting, setRefundSubmitting] = useState(false);

  // ─ Notification
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ─ Load balance
  const loadBalance = useCallback(async () => {
    setBalanceLoading(true);
    try {
      const data = await getWalletBalance();
      setBalanceSLL(data.balanceSLL);
      setBalanceUSD(data.balanceUSD);
      setSavedMethods(data.savedMethods);
    } catch {
      // Balance unavailable — show zeros
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const loadRefunds = useCallback(async () => {
    setRefundsLoading(true);
    try {
      const [eligible, refunds] = await Promise.all([
        refundsAPI.getEligiblePurchases(),
        refundsAPI.getMyRefunds(),
      ]);
      setEligiblePurchases(eligible);
      setMyRefunds(refunds);
    } catch {
      setEligiblePurchases([]);
      setMyRefunds([]);
    } finally {
      setRefundsLoading(false);
    }
  }, []);

  // ─ Load transactions
  const loadHistory = useCallback(async (page = 1, filters = historyFilters) => {
    setHistoryLoading(true);
    try {
      const data = await getTransactionHistory({ page, limit: 20, ...filters });
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch {
      // History unavailable
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFilters]);

  useEffect(() => { loadBalance(); }, [loadBalance]);
  useEffect(() => {
    if (activeTab === "history") loadHistory();
    if (activeTab === "refunds") loadRefunds();
  }, [activeTab, loadHistory, loadRefunds]);

  const handleRefundSubmit = async () => {
    if (!refundPurchaseId) return setBanner({ type: "error", message: "Select a purchase to refund." });
    if (refundReason.trim().length < 10) return setBanner({ type: "error", message: "Reason must be at least 10 characters." });
    setRefundSubmitting(true);
    try {
      const result = await refundsAPI.submit({ purchaseId: refundPurchaseId, reason: refundReason.trim() });
      setBanner({ type: "success", message: result.message });
      setRefundPurchaseId("");
      setRefundReason("");
      loadRefunds();
    } catch (e: unknown) {
      setBanner({ type: "error", message: e instanceof Error ? e.message : "Failed to submit refund request." });
    } finally {
      setRefundSubmitting(false);
    }
  };

  // Handle Stripe connect callback redirect
  useEffect(() => {
    if (searchParams.get("stripe") === "connected") {
      setBanner({ type: "success", message: "Stripe account connected successfully! You can now receive USD payouts." });
      setSearchParams({});
      loadBalance();
    }
  }, [searchParams, setSearchParams, loadBalance]);

  // ─ Deposit submit
  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    const cfg = PAYMENT_CONFIGS[depositMethod];
    if (!amount || amount <= 0) return setBanner({ type: "error", message: "Please enter a valid amount." });
    if (amount < cfg.minDeposit) return setBanner({ type: "error", message: `Minimum deposit is ${cfg.currency === 'SLL' ? 'Le' : '$'} ${cfg.minDeposit.toLocaleString()}` });
    if (amount > cfg.maxDeposit) return setBanner({ type: "error", message: `Maximum deposit is ${cfg.currency === 'SLL' ? 'Le' : '$'} ${cfg.maxDeposit.toLocaleString()}` });
    if (depositMethod !== "stripe" && !depositPhone) return setBanner({ type: "error", message: "Please enter your phone number." });

    setDepositLoading(true);
    try {
      let result;
      if (depositMethod === "stripe") {
        result = await depositStripe({ amountUSD: amount });
      } else {
        result = await depositMobileMoney({ method: depositMethod, phoneNumber: depositPhone, amountSLL: amount });
      }
      setBanner({ type: "success", message: result.message });
      setDepositAmount(""); setDepositPhone("");
      loadBalance();
    } catch (e: unknown) {
      setBanner({ type: "error", message: e instanceof Error ? e.message : "Deposit failed. Please try again." });
    } finally {
      setDepositLoading(false);
    }
  };

  // ─ Withdraw submit
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const cfg = PAYMENT_CONFIGS[withdrawMethod];
    if (!amount || amount <= 0) return setBanner({ type: "error", message: "Please enter a valid amount." });
    if (amount < cfg.minWithdrawal) return setBanner({ type: "error", message: `Minimum withdrawal is ${cfg.currency === 'SLL' ? 'Le' : '$'} ${cfg.minWithdrawal.toLocaleString()}` });
    if (withdrawMethod !== "stripe" && !withdrawPhone) return setBanner({ type: "error", message: "Please enter your phone number." });

    setWithdrawLoading(true);
    try {
      let result;
      if (withdrawMethod === "stripe") {
        result = await withdrawStripe({ amountUSD: amount });
      } else {
        result = await withdrawMobileMoney({ method: withdrawMethod, phoneNumber: withdrawPhone, amountSLL: amount });
      }
      setBanner({ type: "success", message: result.message });
      setWithdrawAmount(""); setWithdrawPhone("");
      loadBalance();
    } catch (e: unknown) {
      setBanner({ type: "error", message: e instanceof Error ? e.message : "Withdrawal failed. Please try again." });
    } finally {
      setWithdrawLoading(false);
    }
  };

  const stripeMethod = savedMethods.find(m => m.type === "stripe");
  const depositCfg = PAYMENT_CONFIGS[depositMethod];
  const withdrawCfg = PAYMENT_CONFIGS[withdrawMethod];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer gap-3" onClick={() => navigate("/library")}>
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">QuantumMint</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <button onClick={() => navigate("/")} className="text-gray-600 hover:text-amber-600 font-medium transition-colors">Home</button>
            <button onClick={() => navigate("/library")} className="text-gray-600 hover:text-amber-600 font-medium transition-colors">Library</button>
            <button
              onClick={() => {
                if (!user) navigate("/login");
                else if (user.role === "admin") navigate("/admin");
                else if (user.role === "seller") navigate("/seller/dashboard");
                else navigate("/reading-analytics");
              }}
              className="text-gray-600 hover:text-amber-600 font-medium transition-colors">
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-10">
        {/* Page heading */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Wallet</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage deposits, withdrawals, and payment methods
              <span className="ml-2 text-amber-600 font-medium">· 1 USD = {exchangeRate.toLocaleString()} SLL</span>
            </p>
          </div>
          <button onClick={loadBalance} disabled={balanceLoading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl transition-colors">
            <RefreshCw className={`w-4 h-4 ${balanceLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Notification */}
        {banner && <Banner type={banner.type} message={banner.message} onClose={() => setBanner(null)} />}

        {/* Balance cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <BalanceCard
            label="SLL Balance"
            value={`Le ${(balanceLoading ? 0 : balanceSLL).toLocaleString()}`}
            sub={`≈ $${((balanceSLL || 0) / exchangeRate).toFixed(2)} USD`}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            onDeposit={() => { setActiveTab("deposit"); setDepositMethod("orange_money"); }}
            onWithdraw={() => { setActiveTab("withdraw"); setWithdrawMethod("orange_money"); }}
          />
          <BalanceCard
            label="USD Balance"
            value={`$${(balanceLoading ? 0 : balanceUSD).toFixed(2)}`}
            sub={`≈ Le ${((balanceUSD || 0) * exchangeRate).toLocaleString()}`}
            gradient="bg-gradient-to-br from-violet-600 to-purple-700"
            onDeposit={() => { setActiveTab("deposit"); setDepositMethod("stripe"); }}
            onWithdraw={() => { setActiveTab("withdraw"); setWithdrawMethod("stripe"); }}
          />
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-8 w-full">
          {([
            { id: "balance", label: "Overview" },
            { id: "deposit", label: "💳 Deposit" },
            { id: "withdraw", label: "💸 Withdraw" },
            { id: "history", label: <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" />History</span> },
            { id: "refunds", label: <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" />Refunds</span> },
          ] as { id: Tab; label: React.ReactNode }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
        {activeTab === "balance" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Supported Payment Methods</h3>
              <div className="space-y-3">
                {ALL_METHODS.map(m => {
                  const cfg = PAYMENT_CONFIGS[m];
                  return (
                    <div key={m} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <span className="text-xl">{cfg.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{cfg.label}</p>
                        <p className="text-xs text-gray-500">{cfg.processingTime} · {cfg.currency}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full`}
                        style={{ backgroundColor: cfg.bgColor, color: cfg.color }}>
                        {cfg.withdrawalFee === 0 ? "Free" : `${cfg.withdrawalFee}% fee`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <StripeConnect
                connectedMethod={stripeMethod}
                onConnect={loadBalance}
                onDisconnect={loadBalance}
              />
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h4 className="font-semibold text-amber-900 mb-2 text-sm">💡 Tip</h4>
                <p className="text-xs text-amber-800">
                  Orange Money, Afrimoney, and Qmoney are free with instant processing — best for local SLL transactions.
                  Stripe is ideal for international users and large USD withdrawals.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── DEPOSIT TAB ──────────────────────────────────────────────── */}
        {activeTab === "deposit" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-5">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {ALL_METHODS.map(m => (
                  <PaymentMethodCard key={m} method={m} selected={depositMethod === m}
                    onSelect={setDepositMethod} showDetails />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              {/* Phone number for mobile money */}
              {MOBILE_METHODS.includes(depositMethod) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+232 XX XXX XXXX"
                    value={depositPhone}
                    onChange={e => setDepositPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount ({depositCfg.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                    {depositCfg.currency === "SLL" ? "Le" : "$"}
                  </span>
                  <input
                    type="number"
                    min={depositCfg.minDeposit}
                    max={depositCfg.maxDeposit}
                    placeholder={`Min ${depositCfg.currency === "SLL" ? "Le" : "$"} ${depositCfg.minDeposit.toLocaleString()}`}
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Limit: {depositCfg.currency === "SLL" ? "Le" : "$"} {depositCfg.minDeposit.toLocaleString()} – {depositCfg.currency === "SLL" ? "Le" : "$"} {depositCfg.maxDeposit.toLocaleString()}
                </p>
              </div>

              {/* Fee breakdown */}
              <FeeBreakdown method={depositMethod} amount={parseFloat(depositAmount) || 0} direction="deposit" currency={depositCfg.currency} exchangeRate={exchangeRate} />

              {/* Stripe special note */}
              {depositMethod === "stripe" && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-800">
                  💳 You'll be redirected to complete your card payment securely via Stripe.
                  Standard Stripe fees (2.9% + $0.30) apply.
                </div>
              )}

              <button
                onClick={handleDeposit}
                disabled={depositLoading || !depositAmount}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3.5 transition-colors text-sm"
              >
                {depositLoading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                  : <><ArrowDown className="w-4 h-4" /> Proceed with Deposit</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── WITHDRAW TAB ─────────────────────────────────────────────── */}
        {activeTab === "withdraw" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-5">Select Withdrawal Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {ALL_METHODS.map(m => (
                  <PaymentMethodCard key={m} method={m} selected={withdrawMethod === m}
                    onSelect={setWithdrawMethod} showDetails />
                ))}
              </div>
            </div>

            {/* Stripe Connect prompt */}
            {withdrawMethod === "stripe" && !stripeMethod?.stripeAccountId && (
              <StripeConnect connectedMethod={stripeMethod} onConnect={loadBalance} onDisconnect={loadBalance} />
            )}

            {(withdrawMethod !== "stripe" || stripeMethod?.stripeAccountId) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
                {/* Current balance info */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <span className="text-sm text-gray-600">Available balance</span>
                  <span className="font-bold text-gray-900">
                    {withdrawCfg.currency === "SLL"
                      ? `Le ${balanceSLL.toLocaleString()}`
                      : `$${balanceUSD.toFixed(2)}`}
                  </span>
                </div>

                {/* Phone number */}
                {MOBILE_METHODS.includes(withdrawMethod) && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />Withdraw to Phone</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+232 XX XXX XXXX"
                      value={withdrawPhone}
                      onChange={e => setWithdrawPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    />
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount ({withdrawCfg.currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                      {withdrawCfg.currency === "SLL" ? "Le" : "$"}
                    </span>
                    <input
                      type="number"
                      min={withdrawCfg.minWithdrawal}
                      max={withdrawCfg.maxWithdrawal || undefined}
                      placeholder={`Min ${withdrawCfg.currency === "SLL" ? "Le" : "$"} ${withdrawCfg.minWithdrawal.toLocaleString()}`}
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    />
                  </div>
                  {withdrawCfg.maxWithdrawal && (
                    <p className="text-xs text-gray-400 mt-1">
                      Limit: {withdrawCfg.currency === "SLL" ? "Le" : "$"} {withdrawCfg.minWithdrawal.toLocaleString()} – {withdrawCfg.currency === "SLL" ? "Le" : "$"} {withdrawCfg.maxWithdrawal.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Fee breakdown */}
                <FeeBreakdown method={withdrawMethod} amount={parseFloat(withdrawAmount) || 0} direction="withdrawal" currency={withdrawCfg.currency} exchangeRate={exchangeRate} />

                <button
                  onClick={handleWithdraw}
                  disabled={withdrawLoading || !withdrawAmount}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold rounded-xl py-3.5 transition-colors text-sm"
                >
                  {withdrawLoading
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                    : <><ArrowUp className="w-4 h-4" /> Request Withdrawal</>
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── REFUNDS TAB ──────────────────────────────────────────────── */}
        {activeTab === "refunds" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="font-semibold text-gray-900">Request a Refund</h3>
              <p className="text-sm text-gray-500">Select a completed purchase and explain why you need a refund. An admin will review your request.</p>
              {refundsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : eligiblePurchases.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No eligible purchases for refund at this time.</p>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase</label>
                    <select
                      value={refundPurchaseId}
                      onChange={(e) => setRefundPurchaseId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="">Select a purchase…</option>
                      {eligiblePurchases.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.book?.title || "Book"} — {p.currency === "USD" ? "$" : "Le "}
                          {parseFloat(String(p.amount)).toLocaleString()} ({new Date(p.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason (min 10 characters)</label>
                    <textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      placeholder="Describe why you are requesting a refund…"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">{refundReason.length}/1000</p>
                  </div>
                  <button
                    onClick={handleRefundSubmit}
                    disabled={refundSubmitting || !refundPurchaseId}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3.5 transition-colors text-sm"
                  >
                    {refundSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                    ) : (
                      <><RotateCcw className="w-4 h-4" /> Submit Refund Request</>
                    )}
                  </button>
                </>
              )}
            </div>

            {myRefunds.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Your Refund Requests</h3>
                <div className="space-y-3">
                  {myRefunds.map((r) => (
                    <div key={r.id} className="flex justify-between items-start p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {r.Purchase?.Book?.title || "Purchase"} — {r.currency === "USD" ? "$" : "Le "}
                          {parseFloat(String(r.amount)).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.reason}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                        r.status === "pending" ? "bg-amber-100 text-amber-700" :
                        r.status === "approved" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ──────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <TransactionHistory
              transactions={transactions}
              pagination={pagination}
              loading={historyLoading}
              onPageChange={page => loadHistory(page)}
              onFilterChange={filters => {
                setHistoryFilters(filters);
                loadHistory(1, filters);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
