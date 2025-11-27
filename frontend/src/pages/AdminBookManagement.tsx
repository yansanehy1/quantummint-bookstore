import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, ArrowLeft } from "lucide-react";
// Mocking useLocation from wouter for structural integrity
// In a real environment, you would use: import { useLocation } from "wouter";
const useLocation = () => [null, (path: string) => console.log('Navigating to', path)];

// --- Mock Components for Single File Requirement (Simplified Shadcn/Tailwind Implementation) ---

// 1. Mock Button
const Button = ({ children, onClick, variant = "default", size = "default", className = "", disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: string; size?: string; className?: string; disabled?: boolean }) => {
  let baseClasses = "font-medium transition duration-150 ease-in-out rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  if (size === "sm") {
    baseClasses += " px-3 py-1.5 text-sm";
  } else {
    baseClasses += " px-4 py-2 text-base";
  }

  switch (variant) {
    case "outline":
      baseClasses += " bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500";
      break;
    case "ghost":
      baseClasses += " bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500";
      break;
    default:
      baseClasses += " bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
      break;
  }

  return (
    <button className={`${baseClasses} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

// 2. Mock Card
// 2. Mock Card
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-xl transition duration-300 ${className}`}>
    {children}
  </div>
);

// 3. Mock Input/Textarea
const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${className}`}
    {...props}
  />
);

// 4. Mock Toast/Sonner
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed bottom-4 right-4 z-50 space-y-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`p-4 rounded-xl shadow-2xl min-w-80 border-l-4 ${toast.type === 'success' ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'
          } transition duration-300 ease-in-out`}
      >
        {toast.message}
      </div>
    ))}
  </div>
);

// 5. Mock Dialog (Simplified Modal)
interface DialogContextType {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType>({ isOpen: false, handleOpenChange: () => { } });

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({ children, open, onOpenChange }: DialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Controlled state override
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpenState: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpenState);
    } else {
      setIsOpen(newOpenState);
    }
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <DialogContext.Provider value={{ isOpen, handleOpenChange }}>
      {/* Render Trigger component */}
      {childrenArray.filter((child): child is React.ReactElement => React.isValidElement(child) && child.type === DialogTrigger)}

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => handleOpenChange(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
          >
            {/* Render Content component */}
            {childrenArray.filter((child): child is React.ReactElement => React.isValidElement(child) && child.type === DialogContent)}
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild }: { children: React.ReactElement; asChild?: boolean }) => {
  const { handleOpenChange } = React.useContext(DialogContext);

  const child = React.Children.only(children);
  return React.cloneElement(child as React.ReactElement<any>, { onClick: () => handleOpenChange(true) });
};

const DialogContent = ({ children, className = "p-6" }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="border-b border-gray-100 p-4"><div className="text-xl font-semibold text-gray-900">{children}</div></div>;
const DialogTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-bold">{children}</h3>;


// 6. Mock Tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({ activeTab: '', setActiveTab: () => { } });

const Tabs = ({ children, defaultValue, className }: { children: React.ReactNode; defaultValue: string; className?: string }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex bg-gray-100 p-1 rounded-xl shadow-inner ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value }: { children: React.ReactNode; value: string }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive ? 'bg-white text-blue-700 shadow-md' : 'text-gray-600 hover:text-blue-500'
        }`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className }: { children: React.ReactNode; value: string; className?: string }) => {
  const { activeTab } = React.useContext(TabsContext);
  return activeTab === value ? <div className={className}>{children}</div> : null;
};
// --- END MOCK COMPONENTS ---

interface BookSubmission {
  id: number;
  title: string;
  author: string;
  seller: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  pages: number;
  rejectionReason?: string;
}

export default function AdminBookManagement() {
  const [, setLocation] = useLocation();
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Custom toast implementation using the local state
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const toast = {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
  };

  // Mock Data
  const [books, setBooks] = useState<BookSubmission[]>([
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
      title: "Physics Basics: Electricity and Magnetism",
      author: "Dr. Ahmed Hassan",
      seller: "Ahmed Hassan",
      category: "Science",
      status: "pending",
      submittedDate: "2025-10-31",
      pages: 4,
    },
    {
      id: 4,
      title: "West African History",
      author: "Binta K. Mansaray",
      seller: "Binta K. Mansaray",
      category: "History",
      status: "rejected",
      submittedDate: "2025-10-29",
      pages: 7,
      rejectionReason: "Formatting issues and blurry images in chapters 1 & 3. Please revise and resubmit."
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<BookSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const pendingBooks = books.filter((b) => b.status === "pending");
  const approvedBooks = books.filter((b) => b.status === "approved");
  const rejectedBooks = books.filter((b) => b.status === "rejected");

  const approveBook = (bookId: number) => {
    setBooks(
      books.map((b) => (b.id === bookId ? { ...b, status: "approved", rejectionReason: undefined } : b))
    );
    toast.success("Book approved successfully and moved to the Approved tab.");
  };

  const rejectBook = (bookId: number) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a detailed rejection reason.");
      return;
    }
    setBooks(
      books.map((b) =>
        b.id === bookId ? { ...b, status: "rejected", rejectionReason } : b
      )
    );
    toast.error("Book rejected. Reason sent to seller.");
    setShowRejectDialog(false);
    setRejectionReason("");
    setSelectedBook(null);
  };

  const handleOpenRejectDialog = (book: BookSubmission) => {
    setSelectedBook(book);
    setRejectionReason(book.rejectionReason || "");
    setShowRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setShowRejectDialog(false);
    setRejectionReason("");
    setSelectedBook(null);
  };

  const getStatusColor = (status: BookSubmission['status']) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: BookSubmission['status']) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 mr-1.5" />;
      case "pending":
        return <Clock className="w-4 h-4 mr-1.5" />;
      case "rejected":
        return <XCircle className="w-4 h-4 mr-1.5" />;
      default:
        return null;
    }
  };

  const BookCard = ({ book }: { book: BookSubmission }) => (
    <Card className="p-5 group shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-extrabold text-xl text-gray-900 leading-tight group-hover:text-blue-700 transition duration-300">{book.title}</h3>
          <p className="text-sm text-gray-600 mt-1">By <span className="font-semibold">{book.author}</span></p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center whitespace-nowrap ${getStatusColor(book.status)}`}
        >
          {getStatusIcon(book.status)}
          {book.status.toUpperCase()}
        </div>
      </div>

      {/* Book Metadata */}
      <div className="grid grid-cols-3 gap-3 text-sm mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <p className="text-gray-500 font-medium">Category</p>
          <p className="font-semibold text-gray-800">{book.category}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Pages</p>
          <p className="font-semibold text-gray-800">{book.pages}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Submitted</p>
          <p className="font-semibold text-gray-800">{book.submittedDate}</p>
        </div>
      </div>

      {/* Rejection Feedback Area */}
      {book.rejectionReason && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4 transition duration-300">
          <p className="text-xs font-bold text-red-900 flex items-center mb-1">
            <XCircle className="w-4 h-4 mr-2 text-red-600" />
            REJECTED: Feedback for Seller
          </p>
          <p className="text-sm text-red-700 mt-1">{book.rejectionReason}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {/* View Details Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl p-6">
            <DialogHeader>
              <DialogTitle>{book.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Author</p>
                  <p className="font-bold text-lg">{book.author}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Seller</p>
                  <p className="font-bold text-lg">{book.seller}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="font-bold text-lg">{book.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Pages</p>
                  <p className="font-bold text-lg">{book.pages}</p>
                </div>
              </div>
              <div className='pt-2'>
                <p className="text-sm font-medium text-gray-600 mb-1">Submission Date</p>
                <p className="font-medium text-lg">{book.submittedDate}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {book.status === "pending" && (
          <>
            <Button
              onClick={() => approveBook(book.id)}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 transition duration-200"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>

            <Button
              onClick={() => handleOpenRejectDialog(book)}
              size="sm"
              className="flex-1 bg-red-600 hover:bg-red-700 transition duration-200"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Book Submission Review</h1>
            <p className="text-lg text-gray-600 mt-2">Manage and approve educational content submitted by platform sellers.</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/admin-dashboard")} className="hidden sm:flex border-blue-400 text-blue-600 hover:bg-blue-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="p-5 shadow-xl transition hover:shadow-2xl hover:scale-[1.01] bg-yellow-50 border-yellow-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-4xl font-extrabold text-yellow-700 mt-1">{pendingBooks.length}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500 opacity-60" />
            </div>
          </Card>
          <Card className="p-5 shadow-xl transition hover:shadow-2xl hover:scale-[1.01] bg-green-50 border-green-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-4xl font-extrabold text-green-700 mt-1">{approvedBooks.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-60" />
            </div>
          </Card>
          <Card className="p-5 shadow-xl transition hover:shadow-2xl hover:scale-[1.01] bg-red-50 border-red-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-4xl font-extrabold text-red-700 mt-1">{rejectedBooks.length}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500 opacity-60" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
            <TabsTrigger value="pending">Pending ({pendingBooks.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedBooks.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedBooks.length})</TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-6">
            {pendingBooks.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {pendingBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center shadow-lg">
                <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700">All caught up!</p>
                <p className="text-gray-500 mt-2">No book submissions are currently pending review.</p>
              </Card>
            )}
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved" className="space-y-6">
            {approvedBooks.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {approvedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center shadow-lg">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700">No approved books yet.</p>
                <p className="text-gray-500 mt-2">Approved submissions will appear here.</p>
              </Card>
            )}
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected" className="space-y-6">
            {rejectedBooks.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {rejectedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center shadow-lg">
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700">Zero rejected books.</p>
                <p className="text-gray-500 mt-2">Submissions that did not meet the criteria will appear here.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Rejection Dialog (outside BookCard to handle state globally) */}
        {selectedBook && (
          <Dialog open={showRejectDialog} onOpenChange={handleCloseRejectDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Reject Book: {selectedBook.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-gray-600">
                  Provide a detailed reason for rejecting the book. This feedback will be sent to the seller <strong>({selectedBook.seller})</strong>.
                </p>
                <Textarea
                  value={rejectionReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                  placeholder="Explain the issues (e.g., poor formatting, incomplete content, incorrect category) that need to be addressed..."
                  rows={5}
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button onClick={handleCloseRejectDialog} variant="outline" className='text-gray-600 hover:bg-gray-100'>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => rejectBook(selectedBook.id)}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!rejectionReason.trim()}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}