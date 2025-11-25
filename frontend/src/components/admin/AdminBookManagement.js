"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminBookManagement;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const textarea_1 = require("@/components/ui/textarea");
const dialog_1 = require("@/components/ui/dialog");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
const wouter_1 = require("wouter");
const sonner_1 = require("sonner");
function AdminBookManagement() {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [books, setBooks] = (0, react_1.useState)([
        {
            id: 1,
            title: "Language Arts - JSS 1, Term 1",
            author: "Sierra Books Admin",
            seller: "Administrator",
            category: "Language Arts",
            status: "approved",
            submittedDate: "2025-11-02",
            pages: 3,
        },
        {
            id: 2,
            title: "Advanced Mathematics",
            author: "Prof. Fatima Jalloh",
            seller: "Fatima Jalloh",
            category: "Mathematics",
            status: "pending",
            submittedDate: "2025-11-01",
            pages: 5,
        },
        {
            id: 3,
            title: "Physics Basics",
            author: "Dr. Ahmed Hassan",
            seller: "Ahmed Hassan",
            category: "Science",
            status: "pending",
            submittedDate: "2025-10-31",
            pages: 4,
        },
    ]);
    const [selectedBook, setSelectedBook] = (0, react_1.useState)(null);
    const [rejectionReason, setRejectionReason] = (0, react_1.useState)("");
    const [showRejectDialog, setShowRejectDialog] = (0, react_1.useState)(false);
    const pendingBooks = books.filter(b => b.status === "pending");
    const approvedBooks = books.filter(b => b.status === "approved");
    const rejectedBooks = books.filter(b => b.status === "rejected");
    const approveBook = (bookId) => {
        setBooks(books.map(b => b.id === bookId ? { ...b, status: "approved" } : b));
        sonner_1.toast.success("Book approved successfully");
    };
    const rejectBook = (bookId) => {
        if (!rejectionReason.trim()) {
            sonner_1.toast.error("Please provide a rejection reason");
            return;
        }
        setBooks(books.map(b => b.id === bookId ? { ...b, status: "rejected", rejectionReason } : b));
        sonner_1.toast.success("Book rejected with reason sent to seller");
        setShowRejectDialog(false);
        setRejectionReason("");
        setSelectedBook(null);
    };
    const BookCard = ({ book }) => (<card_1.Card className="p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">By {book.author}</p>
          <p className="text-xs text-gray-500 mt-1">Seller: {book.seller}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${book.status === "approved" ? "bg-green-600" :
            book.status === "pending" ? "bg-yellow-600" : "bg-red-600"}`}>
          {book.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm mb-4 py-3 border-t border-b border-gray-200">
        <div>
          <p className="text-gray-600">Category</p>
          <p className="font-medium">{book.category}</p>
        </div>
        <div>
          <p className="text-gray-600">Pages</p>
          <p className="font-medium">{book.pages}</p>
        </div>
        <div>
          <p className="text-gray-600">Submitted</p>
          <p className="font-medium">{book.submittedDate}</p>
        </div>
      </div>

      {book.rejectionReason && (<div className="bg-red-50 border border-red-200 rounded p-2 mb-4">
          <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason:</p>
          <p className="text-xs text-red-700">{book.rejectionReason}</p>
        </div>)}

      <div className="flex gap-2">
        <dialog_1.Dialog>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button variant="outline" size="sm" className="flex-1">
              <lucide_react_1.Eye className="w-4 h-4 mr-2"/>
              View Details
            </button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent className="max-w-2xl">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>{book.title}</dialog_1.DialogTitle>
            </dialog_1.DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Author</p>
                  <p className="font-medium">{book.author}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Seller</p>
                  <p className="font-medium">{book.seller}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="font-medium">{book.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pages</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Submission Date</p>
                <p className="font-medium">{book.submittedDate}</p>
              </div>
            </div>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>

        {book.status === "pending" && (<>
            <button_1.Button onClick={() => approveBook(book.id)} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              <lucide_react_1.CheckCircle className="w-4 h-4 mr-2"/>
              Approve
            </button_1.Button>
            <dialog_1.Dialog open={showRejectDialog && selectedBook?.id === book.id} onOpenChange={setShowRejectDialog}>
              <dialog_1.DialogTrigger asChild>
                <button_1.Button onClick={() => setSelectedBook(book)} size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                  <lucide_react_1.XCircle className="w-4 h-4 mr-2"/>
                  Reject
                </button_1.Button>
              </dialog_1.DialogTrigger>
              <dialog_1.DialogContent>
                <dialog_1.DialogHeader>
                  <dialog_1.DialogTitle>Reject Book</dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Provide a detailed reason for rejecting <strong>{book.title}</strong>. The seller will receive this feedback.
                  </p>
                  <textarea_1.Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Explain the issues that need to be addressed..." rows={4}/>
                  <div className="flex gap-3">
                    <button_1.Button onClick={() => rejectBook(book.id)} className="bg-red-600 hover:bg-red-700">
                      Reject Book
                    </button_1.Button>
                    <button_1.Button onClick={() => setShowRejectDialog(false)} variant="outline">
                      Cancel
                    </button_1.Button>
                  </div>
                </div>
              </dialog_1.DialogContent>
            </dialog_1.Dialog>
          </>)}
      </div>
    </card_1.Card>);
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
            <p className="text-gray-600 mt-1">Review and approve book submissions from sellers</p>
          </div>
          <button_1.Button variant="outline" onClick={() => setLocation("/admin-dashboard")}>
            Back to Admin
          </button_1.Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <card_1.Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingBooks.length}</p>
              </div>
              <lucide_react_1.Clock className="w-8 h-8 text-yellow-600 opacity-50"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedBooks.length}</p>
              </div>
              <lucide_react_1.CheckCircle className="w-8 h-8 text-green-600 opacity-50"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedBooks.length}</p>
              </div>
              <lucide_react_1.XCircle className="w-8 h-8 text-red-600 opacity-50"/>
            </div>
          </card_1.Card>
        </div>

        {/* Tabs */}
        <tabs_1.Tabs defaultValue="pending" className="w-full">
          <tabs_1.TabsList className="grid w-full grid-cols-3">
            <tabs_1.TabsTrigger value="pending">
              Pending ({pendingBooks.length})
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="approved">
              Approved ({approvedBooks.length})
            </tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="rejected">
              Rejected ({rejectedBooks.length})
            </tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          {/* Pending Tab */}
          <tabs_1.TabsContent value="pending" className="space-y-4 mt-6">
            {pendingBooks.length > 0 ? (<div className="grid md:grid-cols-2 gap-4">
                {pendingBooks.map(book => (<BookCard key={book.id} book={book}/>))}
              </div>) : (<card_1.Card className="p-8 text-center">
                <lucide_react_1.MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                <p className="text-gray-600">No pending books for review</p>
              </card_1.Card>)}
          </tabs_1.TabsContent>

          {/* Approved Tab */}
          <tabs_1.TabsContent value="approved" className="space-y-4 mt-6">
            {approvedBooks.length > 0 ? (<div className="grid md:grid-cols-2 gap-4">
                {approvedBooks.map(book => (<BookCard key={book.id} book={book}/>))}
              </div>) : (<card_1.Card className="p-8 text-center">
                <lucide_react_1.MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                <p className="text-gray-600">No approved books yet</p>
              </card_1.Card>)}
          </tabs_1.TabsContent>

          {/* Rejected Tab */}
          <tabs_1.TabsContent value="rejected" className="space-y-4 mt-6">
            {rejectedBooks.length > 0 ? (<div className="grid md:grid-cols-2 gap-4">
                {rejectedBooks.map(book => (<BookCard key={book.id} book={book}/>))}
              </div>) : (<card_1.Card className="p-8 text-center">
                <lucide_react_1.MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                <p className="text-gray-600">No rejected books</p>
              </card_1.Card>)}
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </div>
    </div>);
}
