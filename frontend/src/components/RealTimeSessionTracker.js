"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RealTimeSessionTracker;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
const balanceService_1 = require("@/lib/balanceService");
function RealTimeSessionTracker({ bookId, bookTitle, bookLevel, userBalance, sessionType, onSessionEnd, onInsufficientBalance, }) {
    const [chargeState, setChargeState] = (0, react_1.useState)(() => (0, balanceService_1.initializeChargeState)(1, bookId, bookTitle, bookLevel, sessionType, userBalance));
    const [isPaused, setIsPaused] = (0, react_1.useState)(false);
    const [showTransactions, setShowTransactions] = (0, react_1.useState)(false);
    const timerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (chargeState.status !== "active" || isPaused) {
            if (timerRef.current)
                clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            setChargeState((prevState) => {
                const newState = (0, balanceService_1.processMinuteCharge)(prevState, prevState.minutesElapsed + 1);
                if (newState.status === "terminated") {
                    sonner_1.toast.error("Insufficient balance. Session terminated.");
                    onInsufficientBalance?.();
                    return newState;
                }
                const warning = (0, balanceService_1.getBalanceWarning)(newState.currentBalance, newState.chargePerMinute);
                if (warning && newState.minutesElapsed % 5 === 0) {
                    sonner_1.toast.warning(warning);
                }
                return newState;
            });
        }, 60000);
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [chargeState.status, isPaused, onInsufficientBalance]);
    const handlePause = () => {
        setIsPaused(true);
        setChargeState((prev) => (0, balanceService_1.pauseSession)(prev));
        sonner_1.toast.info("Session paused - no charges while paused");
    };
    const handleResume = () => {
        setIsPaused(false);
        setChargeState((prev) => (0, balanceService_1.resumeSession)(prev));
        sonner_1.toast.info("Session resumed");
    };
    const handleEndSession = () => {
        const finalState = (0, balanceService_1.completeSession)(chargeState);
        setChargeState(finalState);
        onSessionEnd?.(finalState);
        sonner_1.toast.success(`Session ended. Total charged: ${finalState.totalCharged.toFixed(2)} L`);
    };
    const handleTerminateSession = () => {
        const finalState = (0, balanceService_1.terminateSession)(chargeState);
        setChargeState(finalState);
        onSessionEnd?.(finalState);
        sonner_1.toast.error("Session terminated due to insufficient balance");
    };
    const summary = (0, balanceService_1.getSessionSummary)(chargeState);
    const chargePerMinute = (0, balanceService_1.getChargePerMinute)(bookLevel);
    const warningMessage = (0, balanceService_1.getBalanceWarning)(chargeState.currentBalance, chargePerMinute);
    return (<card_1.Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 sticky top-4 z-40">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900">Real-Time Pay-Per-Use Session</h3>
            <p className="text-sm text-gray-600">{bookTitle}</p>
          </div>
          <button_1.Button onClick={handleTerminateSession} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
            <lucide_react_1.X className="w-5 h-5"/>
          </button_1.Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-1 mb-1">
              <lucide_react_1.Clock className="w-4 h-4 text-blue-600"/>
              <p className="text-xs font-medium text-gray-600">Duration</p>
            </div>
            <p className="text-sm font-bold text-gray-900">{summary.duration}</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-red-100">
            <div className="flex items-center gap-1 mb-1">
              <lucide_react_1.TrendingDown className="w-4 h-4 text-red-600"/>
              <p className="text-xs font-medium text-gray-600">Charged</p>
            </div>
            <p className="text-sm font-bold text-red-600">{summary.totalCharged} L</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-green-100">
            <div className="flex items-center gap-1 mb-1">
              <lucide_react_1.DollarSign className="w-4 h-4 text-green-600"/>
              <p className="text-xs font-medium text-gray-600">Balance</p>
            </div>
            <p className={`text-sm font-bold ${chargeState.currentBalance < 0 ? "text-red-600" : "text-green-600"}`}>{summary.remainingBalance} L</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="flex items-center gap-1 mb-1">
              <lucide_react_1.DollarSign className="w-4 h-4 text-purple-600"/>
              <p className="text-xs font-medium text-gray-600">Rate</p>
            </div>
            <p className="text-sm font-bold text-gray-900">{chargePerMinute.toFixed(3)} L/min</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">📚 Level:</span> {bookLevel}
            <span className="ml-2 font-semibold">⏱️ Charges:</span> Every minute
            <span className="ml-2 font-semibold">📊 Transactions:</span> {summary.transactionCount}
          </p>
        </div>

        {warningMessage && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <lucide_react_1.AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"/>
            <p className="text-sm text-amber-800">{warningMessage}</p>
          </div>)}

        {chargeState.status === "terminated" && (<div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-red-700">⚠️ Session Terminated</p>
            <p className="text-xs text-red-600 mt-1">Insufficient balance to continue reading.</p>
          </div>)}

        <div className="flex gap-2">
          {isPaused ? (<button_1.Button onClick={handleResume} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <lucide_react_1.Play className="w-4 h-4 mr-2"/>
              Resume
            </button_1.Button>) : (<button_1.Button onClick={handlePause} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white" disabled={chargeState.status === "terminated"}>
              <lucide_react_1.Pause className="w-4 h-4 mr-2"/>
              Pause
            </button_1.Button>)}
          <button_1.Button onClick={handleEndSession} variant="outline" className="flex-1" disabled={chargeState.status === "terminated"}>
            End Session
          </button_1.Button>
          <button_1.Button onClick={() => setShowTransactions(!showTransactions)} variant="outline" size="sm" className="text-blue-600">
            {showTransactions ? "Hide" : "Show"} Txns
          </button_1.Button>
        </div>

        {showTransactions && chargeState.transactions.length > 0 && (<div className="bg-white rounded-lg border border-gray-200 p-3 max-h-48 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-700 mb-2">Transaction History</p>
            <div className="space-y-1">
              {chargeState.transactions.map((txn) => (<div key={txn.id} className="text-xs text-gray-600 flex justify-between">
                  <span>{txn.description}</span>
                  <span className={txn.type === "charge" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                    {txn.type === "charge" ? "-" : "+"}
                    {txn.amount.toFixed(2)} L
                  </span>
                </div>))}
            </div>
          </div>)}

        <div className="text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            {sessionType === "reading" ? "📖 Reading" : "🎧 Listening"}
          </span>
        </div>
      </div>
    </card_1.Card>);
}
