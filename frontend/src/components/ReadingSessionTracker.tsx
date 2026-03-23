
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { AlertCircle, Pause, Play, X, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  formatTime,
  calculateCharge,
  getBalanceWarning,
  estimateReadingTime,
  BookLevel,
} from "../services/readingSessionManager";

interface ReadingSessionTrackerProps {
  bookId: string | number;
  bookTitle: string;
  bookLevel: BookLevel;
  userBalance: number;
  sessionType: "reading" | "listening";
  onSessionEnd?: (minutesSpent: number, chargeAmount: number) => void;
  onInsufficientBalance?: () => void;
}

export default function ReadingSessionTracker({
  bookId,
  bookTitle,
  bookLevel,
  userBalance,
  sessionType,
  onSessionEnd,
  onInsufficientBalance,
}: ReadingSessionTrackerProps) {
  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [minutesSpent, setMinutesSpent] = useState(0);
  const [chargeAmount, setChargeAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(userBalance);

  useEffect(() => {
    if (!isActive || isPaused) return;
    const interval = setInterval(() => setMinutesSpent((prev) => prev + 1), 60000);
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  useEffect(() => {
    const hourlyRate = bookLevel === "JSS" ? 1 : bookLevel === "SSS" ? 2 : 2.5;
    const charge = calculateCharge(minutesSpent, hourlyRate);
    const newBalance = userBalance - charge;
    setChargeAmount(charge);
    setRemainingBalance(newBalance);
    if (newBalance <= 0 && minutesSpent > 0) {
      handleSessionEnd(true);
    }
  }, [minutesSpent, userBalance, bookLevel]);

  const handlePause = () => {
    setIsPaused(true);
    toast.info("Session paused");
  };

  const handleResume = () => {
    setIsPaused(false);
    toast.info("Session resumed");
  };

  const handleSessionEnd = (insufficient = false) => {
    setIsActive(false);
    onSessionEnd?.(minutesSpent, chargeAmount);
    if (insufficient) {
      toast.error("Insufficient balance. Session terminated.");
      onInsufficientBalance?.();
    } else {
      toast.success(`Session ended. Charged ${chargeAmount.toFixed(2)} leones.`);
    }
  };

  const warningMessage = getBalanceWarning(remainingBalance, chargeAmount, bookLevel);
  const estimatedTime = estimateReadingTime(userBalance, bookLevel);

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 sticky top-4 z-40">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900">Pay-Per-Use Session</h3>
            <p className="text-sm text-slate-600">{bookTitle}</p>
          </div>
          <Button onClick={() => handleSessionEnd()} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-medium text-slate-600">Time Spent</p>
            </div>
            <p className="text-lg font-bold text-slate-900">{formatTime(minutesSpent)}</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <p className="text-xs font-medium text-slate-600">Charged</p>
            </div>
            <p className="text-lg font-bold text-slate-900">{chargeAmount.toFixed(2)} L</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-xs font-medium text-slate-600">Balance</p>
            </div>
            <p className={`text-lg font-bold ${remainingBalance < 0 ? "text-red-600" : "text-green-600"}`}>{remainingBalance.toFixed(2)} L</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <p className="text-xs text-slate-600">
            <span className="font-semibold">Rate:</span> {bookLevel === "JSS" ? "1" : bookLevel === "SSS" ? "2" : "2.5"} leone/hour
            <span className="ml-3 font-semibold">Estimated time:</span> {formatTime(estimatedTime)}
          </p>
        </div>

        {warningMessage && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{warningMessage}</p>
          </div>
        )}

        <div className="flex gap-2">
          {isPaused ? (
            <Button onClick={handleResume} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button onClick={handlePause} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={() => handleSessionEnd()} variant="outline" className="flex-1">
            End Session
          </Button>
        </div>

        <div className="text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            {sessionType === "reading" ? "📖 Reading" : "🎧 Listening"}
          </span>
        </div>
      </div>
    </Card>
  );
}



