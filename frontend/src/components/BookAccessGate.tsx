import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ShoppingCart, Clock } from "lucide-react";
import { toast } from "sonner";
import { estimateReadingTime, type BookLevel } from "@/lib/readingSessionManager";

interface BookAccessGateProps {
  bookId: number;
  bookTitle: string;
  bookLevel: BookLevel;
  bookPrice: number;
  userBalance: number;
  isPurchased: boolean;
  onPurchase?: () => void;
  onStartPayPerUse?: (sessionType: "reading" | "listening") => void;
}

export default function BookAccessGate({ bookId, bookTitle, bookLevel, bookPrice, userBalance, isPurchased, onPurchase, onStartPayPerUse }: BookAccessGateProps) {
  const [selectedSessionType, setSelectedSessionType] = useState<"reading" | "listening" | null>(null);

  if (isPurchased) return null;

  const hasEnoughBalance = userBalance >= bookPrice;
  const estimatedMinutes = estimateReadingTime(userBalance, bookLevel);
  const estimatedHours = Math.floor(estimatedMinutes / 60);
  const hourlyRate = bookLevel === "JSS" ? 1 : bookLevel === "SSS" ? 2 : 2.5;

  const handlePayPerUse = (sessionType: "reading" | "listening") => {
    if (userBalance < hourlyRate) {
      toast.error("Insufficient balance to start a reading session");
      return;
    }
    onStartPayPerUse?.(sessionType);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg text-gray-900">Access Required</h3>
            <p className="text-sm text-gray-700">You don't have access to this book yet. Choose an option below.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                Buy Book
              </h4>
              <p className="text-sm text-gray-600 mt-1">Own the book forever. Unlimited reading and listening.</p>
            </div>
            <span className="text-2xl font-bold text-blue-600">{bookPrice.toFixed(2)} L</span>
          </div>

          {hasEnoughBalance ? (
            <Button onClick={onPurchase} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">Insufficient balance. You need {(bookPrice - userBalance).toFixed(2)} L more.</p>
              <Button variant="outline" className="w-full mt-2 text-red-600 border-red-300">Add Funds</Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                Pay-Per-Use
              </h4>
              <p className="text-sm text-gray-600 mt-1">Read or listen by the hour. No long-term commitment.</p>
            </div>
            <span className="text-lg font-bold text-green-600">{hourlyRate} L/hr</span>
          </div>

          {userBalance >= hourlyRate ? (
            <div className="space-y-2">
              <div className="bg-green-50 rounded p-2 text-xs text-green-800">
                <p className="font-semibold mb-1">Your balance: {userBalance.toFixed(2)} L</p>
                <p>Estimated reading time: {estimatedHours} hours</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handlePayPerUse("reading")} variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">📖 Read</Button>
                <Button onClick={() => handlePayPerUse("listening")} variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">🎧 Listen</Button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">Insufficient balance. Minimum {hourlyRate} L required.</p>
              <Button variant="outline" className="w-full mt-2 text-red-600 border-red-300">Add Funds</Button>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            <span className="font-semibold">📚 Book Level:</span> {bookLevel}
            <span className="ml-3 font-semibold">💰 Rate:</span> {hourlyRate} leone/hour
          </p>
        </div>
      </div>
    </Card>
  );
}
