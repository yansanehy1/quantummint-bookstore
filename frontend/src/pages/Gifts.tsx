
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BookOpen, Gift, Send, CheckCircle, Clock, X, Phone } from "lucide-react";

const SuccessMessage = ({ message, onClose }: { message: string | null; onClose: () => void }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between min-w-[300px] mt-10" role="alert">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-3" />
          <p className="font-medium text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 p-1 hover:bg-emerald-700 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Gifts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("send");
  const [selectedBook, setSelectedBook] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      claimedDate: null,
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
      claimedDate: null,
    },
  ];

  const handleSendGift = () => {
    const book = mockBooks.find((b) => b.id.toString() === selectedBook);
    if (book && recipientPhone) {
      setSuccessMessage(`Success! The book "${book.title}" was gifted to ${recipientPhone}.`);
      setSelectedBook("");
      setRecipientPhone("");
      setGiftNote("");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const currentBookPrice = mockBooks.find((b) => b.id.toString() === selectedBook)?.price || "$0.00";

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter] p-8">
      <SuccessMessage message={successMessage} onClose={() => setSuccessMessage(null)} />

      <main className="container max-w-6xl mx-auto py-12">
        <section className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
             <Gift className="w-8 h-8 text-pink-600 fill-pink-100" />
             Send the Gift of Reading
          </h1>
          <p className="text-xl text-slate-600">Share your favorite books with friends and family via mobile number.</p>
        </section>

        <section className="mb-12">
          <div className="flex overflow-x-auto border-b border-slate-200 bg-white rounded-t-xl shadow-sm">
            <button 
                onClick={() => setActiveTab("send")} 
                className={`flex-shrink-0 px-6 py-4 font-bold text-lg transition duration-200 border-b-4 ${activeTab === "send" ? "text-pink-600 border-pink-600 bg-pink-50" : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"}`}
            >
              <Send className="w-5 h-5 inline mr-2" />
              Send a Gift
            </button>
            <button 
                onClick={() => setActiveTab("sent")} 
                className={`flex-shrink-0 px-6 py-4 font-bold text-lg transition duration-200 border-b-4 ${activeTab === "sent" ? "text-pink-600 border-pink-600 bg-pink-50" : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"}`}
            >
              <Send className="w-5 h-5 inline mr-2" />
              Sent Gifts
            </button>
            <button 
                onClick={() => setActiveTab("received")} 
                className={`flex-shrink-0 px-6 py-4 font-bold text-lg transition duration-200 border-b-4 ${activeTab === "received" ? "text-pink-600 border-pink-600 bg-pink-50" : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"}`}
            >
              <Gift className="w-5 h-5 inline mr-2" />
              Received Gifts
            </button>
          </div>
        </section>
        
        {activeTab === "send" && (
          <section>
            <Card className="p-8 border-t-0 rounded-t-none">
              <h2 className="text-3xl font-extrabold mb-8 text-slate-800">New Gift Details</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-3">1. Select a Book</label>
                  <select
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl font-medium text-lg h-12 shadow-sm focus:ring-amber-500 focus:border-amber-500 transition"
                    aria-label="Select a Book"
                  >
                    <option value="" disabled>Choose a book from the store...</option>
                    {mockBooks.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} ({book.price})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-3">2. Recipient Phone Number (Sierra Leone)</label>
                  <div className="relative">
                     <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <Input 
                        type="tel" 
                        placeholder="+232 76 123 456" 
                        value={recipientPhone} 
                        onChange={(e) => setRecipientPhone(e.target.value)} 
                        className="pl-12 h-14"
                    />
                  </div>
                  <p className="text-sm text-slate-600 mt-2">The recipient will receive an SMS with a secure link to claim their digital book.</p>
                </div>
                
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-3">3. Personal Message (Optional)</label>
                  <textarea 
                    placeholder="Add a heartwarming message to your gift... (e.g., Happy Birthday!)" 
                    value={giftNote} 
                    onChange={(e) => setGiftNote(e.target.value)} 
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl font-medium h-32 shadow-sm focus:ring-amber-500 focus:border-amber-500 transition" 
                  />
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                    <Card className={`p-5 mb-6 ${selectedBook ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-200'}`}>
                      <h3 className="font-bold text-xl text-slate-900 mb-3">Order Summary</h3>
                      <div className="space-y-2 text-base">
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">Book Title:</span>
                          <span className="font-extrabold text-amber-700">{mockBooks.find((b) => b.id.toString() === selectedBook)?.title || 'Select a book above'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">Recipient:</span>
                          <span className="font-medium text-slate-900">{recipientPhone || "N/A"}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-amber-100">
                          <span className="text-xl font-extrabold text-slate-900">Total Cost:</span>
                          <span className="text-2xl font-extrabold text-emerald-700">{currentBookPrice}</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Button 
                      onClick={handleSendGift} 
                      disabled={!selectedBook || !recipientPhone} 
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      size="lg"
                    >
                      <Gift className="w-6 h-6 mr-3" />
                      Complete & Send Gift
                    </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {activeTab === "sent" && (
          <section>
            <Card className="p-8 border-t-0 rounded-t-none">
              <h2 className="text-3xl font-extrabold mb-6 text-slate-800">Gifts Sent History</h2>
              <div className="space-y-6">
                {mockSentGifts.length > 0 ? (
                  mockSentGifts.map((gift) => (
                    <Card key={gift.id} className="p-6 shadow-md transition hover:shadow-lg border-l-4 border-pink-500">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-slate-900 mb-1">{gift.bookTitle}</h3>
                          <p className="text-sm text-slate-600 mb-3">To: <span className="font-mono text-slate-800">{gift.recipientPhone}</span></p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            {gift.status === "claimed" ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                                <span className="text-sm text-emerald-700 font-bold">Claimed on {gift.claimedDate}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm text-yellow-700 font-bold">Pending Claim</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-left sm:text-right w-full sm:w-auto flex flex-col items-start sm:items-end">
                          <p className="text-xs text-slate-500 mb-2">Sent: {gift.sentDate}</p>
                          {gift.status !== "claimed" && (
                            <Button variant="outline" size="sm" className="border-pink-300 text-pink-600 hover:bg-pink-50">Resend SMS</Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 border border-dashed rounded-xl">
                    <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">You haven't sent any gifts yet. Start spreading the joy!</p>
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}

        {activeTab === "received" && (
          <section>
            <Card className="p-8 border-t-0 rounded-t-none">
              <h2 className="text-3xl font-extrabold mb-6 text-slate-800">Gifts Waiting for You</h2>
              <div className="space-y-6">
                {mockReceivedGifts.length > 0 ? (
                  mockReceivedGifts.map((gift) => (
                    <Card key={gift.id} className="p-6 shadow-md transition hover:shadow-lg border-l-4 border-cyan-500">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-slate-900 mb-1">{gift.bookTitle}</h3>
                          <p className="text-sm text-slate-600 mb-3">From: <span className="font-semibold text-slate-800">{gift.senderName}</span></p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            {gift.status === "claimed" ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                                <span className="text-sm text-emerald-700 font-bold">Claimed on {gift.claimedDate}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm text-yellow-700 font-bold">Received {gift.receivedDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          {gift.status !== "claimed" ? (
                            <Button className="bg-cyan-600 hover:bg-cyan-700">
                                <Gift className="w-5 h-5 mr-2" />
                                Claim Gift
                            </Button>
                          ) : (
                            <Button variant="outline" disabled className="text-slate-400">
                                Already Added to Library
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 border border-dashed rounded-xl">
                    <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">You haven't received any gifts yet. Check back soon!</p>
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




