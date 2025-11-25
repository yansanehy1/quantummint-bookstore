"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadingSessionTracker;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
const readingSessionManager_1 = require("@/lib/readingSessionManager");
function ReadingSessionTracker({ bookId, bookTitle, bookLevel, userBalance, sessionType, onSessionEnd, onInsufficientBalance, }) {
    const [isActive, setIsActive] = (0, react_1.useState)(true);
    const [isPaused, setIsPaused] = (0, react_1.useState)(false);
    const [minutesSpent, setMinutesSpent] = (0, react_1.useState)(0);
    const [chargeAmount, setChargeAmount] = (0, react_1.useState)(0);
    const [remainingBalance, setRemainingBalance] = (0, react_1.useState)(userBalance);
    (0, react_1.useEffect)(() => {
        if (!isActive || isPaused)
            return;
        const interval = setInterval(() => setMinutesSpent((prev) => prev + 1), 60000);
        return () => clearInterval(interval);
    }, [isActive, isPaused]);
    (0, react_1.useEffect)(() => {
        const hourlyRate = bookLevel === "JSS" ? 1 : bookLevel === "SSS" ? 2 : 2.5;
        const charge = (0, readingSessionManager_1.calculateCharge)(minutesSpent, hourlyRate);
        const newBalance = userBalance - charge;
        setChargeAmount(charge);
        setRemainingBalance(newBalance);
        if (newBalance <= 0 && minutesSpent > 0) {
            handleSessionEnd(true);
        }
    }, [minutesSpent, userBalance, bookLevel]);
    const handlePause = () => {
        setIsPaused(true);
        sonner_1.toast.info("Session paused");
    };
    const handleResume = () => {
        setIsPaused(false);
        sonner_1.toast.info("Session resumed");
    };
    const handleSessionEnd = (insufficient = false) => {
        setIsActive(false);
        onSessionEnd?.(minutesSpent, chargeAmount);
        if (insufficient) {
            sonner_1.toast.error("Insufficient balance. Session terminated.");
            onInsufficientBalance?.();
        }
        else {
            sonner_1.toast.success(`Session ended. Charged ${chargeAmount.toFixed(2)} leones.`);
        }
    };
    const warningMessage = (0, readingSessionManager_1.getBalanceWarning)(remainingBalance, chargeAmount, bookLevel);
    const estimatedTime = (0, readingSessionManager_1.estimateReadingTime)(userBalance, bookLevel);
    return (<card_1.Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 sticky top-4 z-40">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900">Pay-Per-Use Session</h3>
            <p className="text-sm text-gray-600">{bookTitle}</p>
          </div>
          <button_1.Button onClick={() => handleSessionEnd()} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
            <lucide_react_1.X className="w-5 h-5"/>
          </button_1.Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <lucide_react_1.Clock className="w-4 h-4 text-blue-600"/>
              <p className="text-xs font-medium text-gray-600">Time Spent</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{(0, readingSessionManager_1.formatTime)(minutesSpent)}</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <lucide_react_1.DollarSign className="w-4 h-4 text-amber-600"/>
              <p className="text-xs font-medium text-gray-600">Charged</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{chargeAmount.toFixed(2)} L</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <lucide_react_1.DollarSign className="w-4 h-4 text-green-600"/>
              <p className="text-xs font-medium text-gray-600">Balance</p>
            </div>
            <p className={`text-lg font-bold ${remainingBalance < 0 ? "text-red-600" : "text-green-600"}`}>{remainingBalance.toFixed(2)} L</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Rate:</span> {bookLevel === "JSS" ? "1" : bookLevel === "SSS" ? "2" : "2.5"} leone/hour
            <span className="ml-3 font-semibold">Estimated time:</span> {(0, readingSessionManager_1.formatTime)(estimatedTime)}
          </p>
        </div>

        {warningMessage && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <lucide_react_1.AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"/>
            <p className="text-sm text-amber-800">{warningMessage}</p>
          </div>)}

        <div className="flex gap-2">
          {isPaused ? (<button_1.Button onClick={handleResume} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <lucide_react_1.Play className="w-4 h-4 mr-2"/>
              Resume
            </button_1.Button>) : (<button_1.Button onClick={handlePause} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white">
              <lucide_react_1.Pause className="w-4 h-4 mr-2"/>
              Pause
            </button_1.Button>)}
          <button_1.Button onClick={() => handleSessionEnd()} variant="outline" className="flex-1">
            End Session
          </button_1.Button>
        </div>

        <div className="text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            {sessionType === "reading" ? "📖 Reading" : "🎧 Listening"}
          </span>
        </div>
      </div>
    </card_1.Card>);
}
