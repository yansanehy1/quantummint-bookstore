import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Gift, Send, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function Gifts() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("send");
  const [selectedBook, setSelectedBook] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [giftNote, setGiftNote] = useState("");

  const mockBooks = [
    { id: 1, title: "Introduction to Physics", price: "$4.99" },
    { id: 2, title: "Advanced Mathematics", price: "$5.99" },
    { id: 3, title: "Sierra Leone History", price: "$3.99" },
    { id: 4, title: "Web Development Basics", price: "$6.99" },
  ];

  const mockSentGifts = [
    {
      id: 1,
      bookTitle: "Introduction to Physics",
      recipientPhone: "+232 76 123 456",
      status: "claimed",
      sentDate: "2024-01-10",
      claimedDate: "2024-01-12",
    },
    {
      id: 2,
      bookTitle: "Advanced Mathematics",
      recipientPhone: "+232 78 456 789",
      status: "pending",
      sentDate: "2024-01-15",
      claimedDate: null as string | null,
    },
  ];

  const mockReceivedGifts = [
    {
      id: 1,
      bookTitle: "Sierra Leone History",
      senderName: "Fatima Jalloh",
      status: "claimed",
      receivedDate: "2024-01-08",
      claimedDate: "2024-01-08",
    },
    {
      id: 2,
      bookTitle: "Web Development Basics",
      senderName: "Ahmed Hassan",
      status: "pending",
      receivedDate: "2024-01-14",
      claimedDate: null as string | null,
    },
  ];

  const handleSendGift = () => {
    if (selectedBook && recipientPhone) {
      alert(`Gift sent! The recipient will receive an SMS at ${recipientPhone}`);
      setSelectedBook("");
      setRecipientPhone("");
      setGiftNote("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
            <BookOpen className="w-8 h-8 text-amber-600" />
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
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gift Books</h1>
          <p className="text-xl text-gray-600">Share the joy of learning by gifting books to friends and family.</p>
        </section>

        {/* Tabs */}
        <section className="mb-12">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("send")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "send"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Send a Gift
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "sent"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Sent Gifts
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "received"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Gift className="w-4 h-4 inline mr-2" />
              Received Gifts
            </button>
          </div>
        </section>

        {/* Send Gift Tab */}
        {activeTab === "send" && (
          <section className="mb-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-8">Send a Book Gift</h2>
              
              <div className="space-y-6">
                {/* Select Book */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3" htmlFor="book-select">Select a Book</label>
                  <select
                    id="book-select"
                    aria-label="Select a book to gift"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium"
                  >
                    <option value="">Choose a book...</option>
                    {mockBooks.map(book => (
                      <option key={book.id} value={String(book.id)}>
                        {book.title} ({book.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3" htmlFor="recipient-phone">Recipient Phone Number</label>
                  <Input
                    id="recipient-phone"
                    type="tel"
                    placeholder="+232 76 123 456"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="py-2 h-12"
                  />
                  <p className="text-sm text-gray-600 mt-2">They'll receive an SMS with a link to claim their gift.</p>
                </div>

                {/* Gift Note */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3" htmlFor="gift-note">Personal Message (Optional)</label>
                  <textarea
                    id="gift-note"
                    aria-label="Personal message to include with the gift"
                    placeholder="Add a personal message to your gift..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium h-24"
                  />
                </div>

                {/* Summary */}
                {selectedBook && (
                  <Card className="p-6 bg-blue-50 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3">Gift Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Book:</span>
                        <span className="font-semibold text-gray-900">
                          {mockBooks.find(b => String(b.id) === selectedBook)?.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Recipient:</span>
                        <span className="font-semibold text-gray-900">{recipientPhone || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="text-gray-700">Cost:</span>
                        <span className="font-semibold text-gray-900">
                          {mockBooks.find(b => String(b.id) === selectedBook)?.price}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                <Button
                  onClick={handleSendGift}
                  disabled={!selectedBook || !recipientPhone}
                  className="w-full bg-pink-600 hover:bg-pink-700 py-3 text-lg"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Send Gift Now
                </Button>
              </div>
            </Card>
          </section>
        )}

        {/* Sent Gifts Tab */}
        {activeTab === "sent" && (
          <section className="mb-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Gifts You've Sent</h2>
              
              <div className="space-y-4">
                {mockSentGifts.length > 0 ? (
                  mockSentGifts.map(gift => (
                    <Card key={gift.id} className="p-6 border-l-4 border-pink-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{gift.bookTitle}</h3>
                          <p className="text-sm text-gray-600 mb-3">To: {gift.recipientPhone}</p>
                          <div className="flex items-center gap-2">
                            {gift.status === "claimed" ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600 font-semibold">Claimed on {gift.claimedDate}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-yellow-600 font-semibold">Waiting to be claimed</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-2">Sent {gift.sentDate}</p>
                          <Button variant="outline" size="sm">Resend SMS</Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">You haven't sent any gifts yet.</p>
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}

        {/* Received Gifts Tab */}
        {activeTab === "received" && (
          <section className="mb-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Gifts You've Received</h2>
              
              <div className="space-y-4">
                {mockReceivedGifts.length > 0 ? (
                  mockReceivedGifts.map(gift => (
                    <Card key={gift.id} className="p-6 border-l-4 border-cyan-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{gift.bookTitle}</h3>
                          <p className="text-sm text-gray-600 mb-3">From: {gift.senderName}</p>
                          <div className="flex items-center gap-2">
                            {gift.status === "claimed" ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600 font-semibold">Claimed on {gift.claimedDate}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-yellow-600 font-semibold">Received {gift.receivedDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {gift.status !== "claimed" && (
                            <Button className="bg-cyan-600 hover:bg-cyan-700">Claim Gift</Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">You haven't received any gifts yet.</p>
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}
