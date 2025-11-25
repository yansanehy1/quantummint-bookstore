"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const wouter_1 = require("wouter");
// Icons used directly from lucide-react
const lucide_react_1 = require("lucide-react");
// --- START: MOCK UI COMPONENTS (to satisfy single-file mandate) ---
const NotificationBar = ({ message, type, onClose }) => {
    if (!message)
        return null;
    const baseClasses = "fixed bottom-4 right-4 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 transition-all duration-300 transform";
    let colorClasses = "bg-green-500 text-white";
    if (type === 'error')
        colorClasses = "bg-red-500 text-white";
    if (type === 'info')
        colorClasses = "bg-blue-500 text-white";
    return (<div className={`${baseClasses} ${colorClasses}`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:opacity-80">
        <lucide_react_1.X className="w-5 h-5"/>
      </button>
    </div>);
};
// Mock 'toast' function using the internal NotificationBar state
const useToastMock = () => {
    const [toastState, setToastState] = (0, react_1.useState)({ message: '', type: '', id: 0 });
    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToastState({ message, type, id });
        setTimeout(() => {
            setToastState(current => (current.id === id ? { message: '', type: '', id: 0 } : current));
        }, 3000); // Auto-dismiss after 3s
    };
    return {
        toastState,
        success: (message) => showToast(message, 'success'),
        error: (message) => showToast(message, 'error'),
        info: (message) => showToast(message, 'info'),
        onClose: () => setToastState({ message: '', type: '', id: 0 })
    };
};
const Button = ({ children, className = "", variant = "default", onClick, disabled, 'aria-label': ariaLabel, 'aria-pressed': ariaPressed }) => {
    let baseClasses = "font-semibold transition duration-200 ease-in-out py-2 px-4 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center";
    if (variant === "default") {
        baseClasses += " bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 focus:ring-amber-500/50";
    }
    else if (variant === "outline") {
        baseClasses += " bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-300/50";
    }
    else if (variant === "ghost") {
        baseClasses += " bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300/50 shadow-none";
    }
    if (disabled) {
        baseClasses = baseClasses.replace("hover:bg-amber-700 active:bg-amber-800", "").replace("hover:bg-gray-50 active:bg-gray-100", "") + " opacity-50 cursor-not-allowed";
    }
    return (<button className={`${baseClasses} ${className}`} onClick={onClick} disabled={disabled} aria-label={ariaLabel} aria-pressed={ariaPressed}>
      {children}
    </button>);
};
const Card = ({ children, className = "" }) => (<div className={`bg-white rounded-2xl shadow-lg transition duration-300 hover:shadow-xl ${className}`}>
    {children}
  </div>);
const Header = () => (<header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
    <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-black text-amber-700">Book<span className="text-gray-900">Verse</span></h1>
      <nav className="hidden sm:flex space-x-6 text-gray-600 font-medium">
        <a href="#" className="hover:text-amber-600 transition">Library</a>
        <a href="#" className="hover:text-amber-600 transition">Explore</a>
        <a href="#" className="hover:text-amber-600 transition">Wallet (500)</a>
      </nav>
      <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">Sign Out</Button>
    </div>
  </header>);
const Footer = () => (<footer className="bg-gray-900 text-white py-10 mt-12">
    <div className="container max-w-6xl mx-auto px-4 text-center">
      <p>&copy; {new Date().getFullYear()} BookVerse. All rights reserved.</p>
    </div>
  </footer>);
const StarRating = ({ rating, readOnly = true, size = "md", showLabel = true }) => {
    const numStars = Math.round(rating * 2) / 2; // Round to nearest half
    const maxStars = 5;
    const starSize = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
    const starClasses = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    return (<div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
            const full = index < Math.floor(numStars);
            const half = !full && index < numStars;
            return (<lucide_react_1.Star key={index} className={`${starClasses} ${full || half ? 'text-amber-500 fill-amber-500' : 'text-gray-300 fill-gray-100'}`}/>);
        })}
      {showLabel && <span className="ml-2 font-semibold text-gray-900">{rating.toFixed(1)}</span>}
    </div>);
};
const ReviewForm = ({ onSubmit }) => {
    const [rating, setRating] = (0, react_1.useState)(0);
    const [title, setTitle] = (0, react_1.useState)('');
    const [content, setContent] = (0, react_1.useState)('');
    const { success } = useToastMock();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || !title || !content)
            return;
        onSubmit({ rating, title, content });
        setRating(0);
        setTitle('');
        setContent('');
        success("Review submitted successfully!");
    };
    return (<Card className="p-6 border border-gray-100">
      <h4 className="text-xl font-bold mb-4">Write a Review</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (<lucide_react_1.Star key={star} className={`w-6 h-6 cursor-pointer transition ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 fill-gray-100'}`} onClick={() => setRating(star)}/>))}
          </div>
        </div>
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
          <input id="review-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" required/>
        </div>
        <div>
          <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
          <textarea id="review-content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" required/>
        </div>
        <Button type="submit" className="w-full">Submit Review</Button>
      </form>
    </Card>);
};
const ReviewWithReplies = ({ review, replies, onDelete, onEdit, onHelpful, onUnhelpful, onReplySubmit, onReplyDelete }) => {
    const [showReplyForm, setShowReplyForm] = (0, react_1.useState)(false);
    const [replyContent, setReplyContent] = (0, react_1.useState)('');
    const isUserReview = review.userName === "You"; // Simple mock for user identity
    const isAuthor = review.userName === "Dr. Ahmed Hassan"; // Simple mock for author identity
    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (replyContent.trim()) {
            onReplySubmit(review.id, { content: replyContent });
            setReplyContent('');
            setShowReplyForm(false);
        }
    };
    return (<Card className="p-6 space-y-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700 text-lg">{review.userName[0]}</div>
          <div>
            <p className="font-bold text-gray-900">{review.userName}</p>
            <StarRating rating={review.rating} size="sm" showLabel={false}/>
          </div>
        </div>
        <div className="text-right">
          {review.isVerifiedPurchase && (<div className="flex items-center text-xs text-green-600 mb-1">
              <lucide_react_1.Verified className="w-4 h-4 mr-1"/> Verified Purchase
            </div>)}
          <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
        </div>
      </div>
      
      <h5 className="text-xl font-bold text-gray-900">{review.title}</h5>
      <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-auto p-1 text-gray-600 hover:text-green-600" onClick={() => onHelpful(review.id)} aria-label="Mark review as helpful">
            <lucide_react_1.ThumbsUp className="w-4 h-4 mr-1"/> ({review.helpfulCount})
          </Button>
          <Button variant="ghost" className="h-auto p-1 text-gray-600 hover:text-red-600" onClick={() => onUnhelpful(review.id)} aria-label="Mark review as unhelpful">
            <lucide_react_1.ThumbsDown className="w-4 h-4 mr-1"/> ({review.unhelpfulCount})
          </Button>
        </div>

        {isUserReview && (<>
            <Button variant="ghost" className="h-auto p-1 text-red-600" onClick={() => onDelete(review.id)} aria-label="Delete review">
              <lucide_react_1.Trash2 className="w-4 h-4"/>
            </Button>
            <Button variant="ghost" className="h-auto p-1 text-blue-600" onClick={() => onEdit(review.id)} aria-label="Edit review">
              <lucide_react_1.Edit className="w-4 h-4"/>
            </Button>
          </>)}
        <Button variant="ghost" className="h-auto p-1 text-amber-600" onClick={() => setShowReplyForm(!showReplyForm)} aria-label="Toggle reply form">
          <lucide_react_1.MessageSquare className="w-4 h-4 mr-1"/> Reply
        </Button>
      </div>

      {showReplyForm && (<form onSubmit={handleReplySubmit} className="mt-4 flex gap-2">
          <input type="text" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Write a reply..." className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500" required/>
          <Button type="submit" className="px-3">
            <lucide_react_1.Send className="w-4 h-4"/>
          </Button>
        </form>)}

      {replies.length > 0 && (<div className="pl-8 pt-2 border-l-2 border-gray-100 space-y-3">
          {replies.map((reply) => (<div key={reply.id} className="text-sm p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-gray-900">{reply.authorName} {reply.isAuthor && <span className="text-amber-600 text-xs font-semibold">(Author)</span>}</p>
                {reply.authorName === "You" && (<Button variant="ghost" className="h-auto p-0.5 text-red-600" onClick={() => onReplyDelete(reply.id)} aria-label="Delete reply">
                        <lucide_react_1.Trash2 className="w-3 h-3"/>
                    </Button>)}
              </div>
              <p className="text-gray-700">{reply.content}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(reply.date).toLocaleDateString()}</p>
            </div>))}
        </div>)}
    </Card>);
};
const BookAccessGate = ({ bookPrice, userBalance, isPurchased, onPurchase, onStartPayPerUse }) => {
    const { success, info } = useToastMock();
    const handlePurchase = () => {
        if (userBalance >= bookPrice) {
            onPurchase();
            success(`Purchased for $${bookPrice.toFixed(2)}!`);
        }
        else {
            info("Insufficient balance. Please top up your wallet.");
        }
    };
    return (<Card className="p-8 border-4 border-amber-200 bg-amber-50">
            <h2 className="text-2xl font-bold mb-4 text-amber-800">Unlock Full Access</h2>
            <p className="text-gray-700 mb-6">This book is not yet in your library. Choose an access option below.</p>
            
            <div className="grid md:grid-cols-2 gap-4">
                <Button onClick={handlePurchase} className="flex-col h-auto py-5 bg-amber-600 hover:bg-amber-700 text-white shadow-xl hover:shadow-2xl transition">
                    <lucide_react_1.ShoppingCart className="w-6 h-6 mb-1"/>
                    <span className="text-lg">Buy Permanently</span>
                    <span className="text-sm font-light">for ${bookPrice.toFixed(2)}</span>
                </Button>
                
                <Button onClick={() => onStartPayPerUse("reading")} variant="outline" className="flex-col h-auto py-5 border-amber-600 text-amber-800 hover:bg-amber-100 shadow-xl hover:shadow-2xl transition">
                    <lucide_react_1.Eye className="w-6 h-6 mb-1"/>
                    <span className="text-lg">Pay Per Use</span>
                    <span className="text-sm font-light">Start Reading Session</span>
                </Button>
            </div>
        </Card>);
};
const RealTimeSessionTracker = ({ sessionType, onSessionEnd }) => {
    const [seconds, setSeconds] = (0, react_1.useState)(0);
    const { info } = useToastMock();
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const endSession = () => {
        const minutes = Math.floor(seconds / 60);
        const cost = (minutes * 0.1).toFixed(2); // Mock cost calculation
        info(`Session ended. Duration: ${minutes} min. Mock cost: $${cost}.`);
        onSessionEnd({ minutes, cost });
    };
    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    return (<Card className="p-6 bg-blue-50 border-4 border-blue-200">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <lucide_react_1.Headphones className={`w-6 h-6 ${sessionType === 'listening' ? 'text-blue-600' : 'hidden'}`}/>
                    <lucide_react_1.BookOpen className={`w-6 h-6 ${sessionType === 'reading' ? 'text-blue-600' : 'hidden'}`}/>
                    <div>
                        <p className="font-bold text-lg text-blue-800">Active {sessionType === 'reading' ? 'Reading' : 'Listening'} Session</p>
                        <p className="text-sm text-gray-600">Cost: $0.10/min (Mock Rate)</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-mono font-extrabold text-blue-900">{formatTime(seconds)}</p>
                    <Button onClick={endSession} className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 text-sm px-3">
                        End Session
                    </Button>
                </div>
            </div>
        </Card>);
};
// --- END: MOCK UI COMPONENTS ---
const App = () => {
    const [, setLocation] = (0, wouter_1.useLocation)();
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [currentTime, setCurrentTime] = (0, react_1.useState)(0);
    const [duration, setDuration] = (0, react_1.useState)(0);
    const [isBookmarked, setIsBookmarked] = (0, react_1.useState)(false);
    const [showBookmarks, setShowBookmarks] = (0, react_1.useState)(false);
    const audioRef = (0, react_1.useRef)(null);
    const [activeTab, setActiveTab] = (0, react_1.useState)("reader");
    const [activeSession, setActiveSession] = (0, react_1.useState)(null);
    const [isPurchased, setIsPurchased] = (0, react_1.useState)(false);
    const [userBalance] = (0, react_1.useState)(500);
    const readerPanelRef = (0, react_1.useRef)(null);
    const reviewsPanelRef = (0, react_1.useRef)(null);
    const { toastState, success, info, onClose } = useToastMock(); // Use mock toast
    const mockReviews = [
        {
            id: 1,
            userName: "Sarah Johnson",
            rating: 5,
            title: "Excellent and comprehensive!",
            content: "This book is incredibly well-written and covers all the essential concepts. The audio narration is clear and helpful.",
            date: "2024-10-15",
            helpfulCount: 24,
            unhelpfulCount: 2,
            isVerifiedPurchase: true,
        },
        {
            id: 2,
            userName: "Michael Chen",
            rating: 4,
            title: "Great content, could use more examples",
            content: "The explanations are solid, but I wish there were more worked examples throughout each chapter.",
            date: "2024-10-10",
            helpfulCount: 15,
            unhelpfulCount: 1,
            isVerifiedPurchase: true,
        },
    ];
    const mockReplies = {
        1: [
            {
                id: 1,
                authorName: "Dr. Ahmed Hassan",
                content: "Thank you so much for the detailed feedback! We're glad you found the audio narration helpful. We're constantly working to improve the content based on reader suggestions.",
                date: "2024-10-16",
                isAuthor: true,
            },
        ],
        2: [
            {
                id: 2,
                authorName: "Dr. Ahmed Hassan",
                content: "Great point about the examples! We've actually included additional worked examples in the appendix. You can find them on pages 240-250. We'll consider adding more examples to the main text in the next edition.",
                date: "2024-10-12",
                isAuthor: true,
            },
        ],
    };
    const handleStartPayPerUse = (sessionType) => {
        setActiveSession({ type: sessionType });
        info(`Starting new pay-per-use ${sessionType} session.`);
    };
    const handleSessionEnd = (_state) => {
        setActiveSession(null);
    };
    const mockBook = {
        id: 1,
        title: "Introduction to Physics",
        author: "Dr. Ahmed Hassan",
        category: "Science",
        price: 4.99,
        rating: 4.5,
        reviews: 128,
        description: "A comprehensive introduction to physics covering mechanics, thermodynamics, and waves. Perfect for high school and early university students. This book aims to simplify complex concepts and provide a solid foundation for further study in the physical sciences.",
        pages: 256,
        language: "English",
        publishedDate: "2023-06-15",
        cover: "⚛️", // Using a thematic emoji instead of a generic book
        hasAudio: true,
    };
    const mockPages = [
        { number: 1, content: "Chapter 1: Fundamentals of Motion\n\nMotion is the change in position of an object over time. The study of motion without considering the forces that cause it is called kinematics.", audioUrl: "https://mock-audio/page1.mp3", audioTimestamp: 0 },
        { number: 2, content: "Velocity and Speed\n\nVelocity is a vector quantity that describes the rate of change of position. Speed is the magnitude of velocity.", audioUrl: "https://mock-audio/page2.mp3", audioTimestamp: 0 },
        { number: 3, content: "Acceleration\n\nAcceleration is the rate of change of velocity. It can be positive (speeding up) or negative (slowing down).", audioUrl: "https://mock-audio/page3.mp3", audioTimestamp: 0 },
    ];
    const mockBookmarks = [
        { id: 1, page: 1, note: "Important definition", timestamp: "2024-01-15 10:30" },
        { id: 2, page: 2, note: "Need to review this", timestamp: "2024-01-15 11:45" },
    ];
    const currentPageData = mockPages.find(p => p.number === currentPage);
    // Reviews state and handlers
    const [reviews, setReviews] = (0, react_1.useState)(mockReviews);
    const [replies, setReplies] = (0, react_1.useState)(mockReplies);
    const handleHelpful = (id) => {
        setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)));
        success("Marked as helpful!");
    };
    const handleUnhelpful = (id) => {
        setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, unhelpfulCount: r.unhelpfulCount + 1 } : r)));
        info("Feedback registered.");
    };
    const handleDeleteReview = (id) => {
        setReviews((rs) => rs.filter((r) => r.id !== id));
        success("Review deleted.");
    };
    const handleEditReview = (id) => {
        info("Edit dialog opened (Not implemented).");
    };
    const handleReplySubmit = (reviewId, reply) => {
        const newReply = {
            id: Date.now(),
            authorName: "You",
            content: reply.content,
            date: new Date().toISOString(),
            isAuthor: false, // The user is not the book author
        };
        setReplies((map) => ({ ...map, [reviewId]: [...(map[reviewId] || []), newReply] }));
        success("Reply posted!");
    };
    const handleReplyDelete = (replyId) => {
        setReplies((map) => {
            const entries = Object.entries(map).map(([rid, arr]) => [rid, arr.filter((r) => r.id !== replyId)]);
            return Object.fromEntries(entries);
        });
        success("Reply deleted.");
    };
    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            }
            else {
                // Mocked play functionality (will fail without a real audio source)
                // audioRef.current.play().catch(e => console.log("Audio play failed:", e));
                info(isPlaying ? "Audio paused." : "Audio playing (Mocked).");
            }
            setIsPlaying(!isPlaying);
        }
    };
    const handleAddBookmark = () => {
        setIsBookmarked(!isBookmarked);
        if (!isBookmarked) {
            success(`Bookmark added to Page ${currentPage}.`);
            mockBookmarks.push({ id: Date.now(), page: currentPage, note: `Quick mark on Page ${currentPage}`, timestamp: new Date().toLocaleTimeString() });
        }
        else {
            info(`Bookmark removed from Page ${currentPage}.`);
        }
    };
    const handleNextPage = (0, react_1.useCallback)(() => {
        if (currentPage < mockPages.length) {
            setCurrentPage(currentPage + 1);
            setCurrentTime(0);
            setIsPlaying(false);
            info(`Mapsd to Page ${currentPage + 1}`);
        }
    }, [currentPage, mockPages.length, info]);
    const handlePreviousPage = (0, react_1.useCallback)(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setCurrentTime(0);
            setIsPlaying(false);
            info(`Mapsd to Page ${currentPage - 1}`);
        }
    }, [currentPage, info]);
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    // Keyboard navigation: Space toggles play, arrows navigate pages
    (0, react_1.useEffect)(() => {
        const onKey = (e) => {
            // Check if focus is not on an input/textarea
            if (["INPUT", "TEXTAREA"].includes(e.target.tagName))
                return;
            if (e.key === " ") {
                e.preventDefault();
                handlePlayPause();
            }
            else if (e.key === "ArrowRight") {
                handleNextPage();
            }
            else if (e.key === "ArrowLeft") {
                handlePreviousPage();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [handleNextPage, handlePlayPause, handlePreviousPage]);
    // Lazy-load audio src per page (mocked)
    (0, react_1.useEffect)(() => {
        if (audioRef.current && currentPageData?.audioUrl) {
            // In a real app, you'd load the audio here. For mock, we skip actual loading.
            // audioRef.current.src = currentPageData.audioUrl;
            // audioRef.current.load(); 
            setDuration(180); // Mock duration
            setCurrentTime(0); // Reset time on page change
        }
    }, [currentPageData]);
    return (<div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-16">
        {/* Book Header Section */}
        <section className="grid md:grid-cols-3 gap-10 mb-16">
          
          {/* Cover & Action Buttons */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="bg-white rounded-3xl p-6 shadow-2xl transition duration-300 hover:shadow-amber-400/50 w-full max-w-sm aspect-h-1 aspect-w-1 mb-8">
                <div className="bg-gradient-to-br from-amber-200 to-orange-300 rounded-2xl h-full flex items-center justify-center text-[10rem] shadow-inner">{mockBook.cover}</div>
            </div>
            
            <div className="w-full max-w-sm space-y-3">
                <Button onClick={() => { success(`Added "${mockBook.title}" to cart.`); setLocation("/checkout"); }} className="w-full py-4 text-xl bg-amber-600 hover:bg-amber-700 shadow-amber-500/50 shadow-lg">
                    <lucide_react_1.ShoppingCart className="w-6 h-6 mr-3"/>
                    Buy Now - ${mockBook.price.toFixed(2)}
                </Button>
                <Button variant="outline" className="w-full py-3"><lucide_react_1.Download className="w-5 h-5 mr-2"/>Download Sample</Button>
                <Button variant="outline" className="w-full py-3"><lucide_react_1.Share2 className="w-5 h-5 mr-2"/>Share Book</Button>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-2 leading-tight">{mockBook.title}</h1>
            <p className="text-2xl text-amber-600 font-medium mb-6">by {mockBook.author}</p>
            
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center text-xl">
                <StarRating rating={mockBook.rating} readOnly size="md" showLabel={true}/>
                <span className="text-gray-600 ml-3">({mockBook.reviews} reviews)</span>
              </div>
              {mockBook.hasAudio && (<div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow-inner">
                  <lucide_react_1.Headphones className="w-5 h-5"/>
                  <span className="text-sm">Audio Available</span>
                </div>)}
            </div>

            <p className="text-gray-700 mb-8 text-xl leading-relaxed border-l-4 border-amber-400 pl-4">{mockBook.description}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-white/70 backdrop-blur-sm"><p className="text-gray-600 text-sm mb-1">Pages</p><p className="text-2xl font-extrabold text-amber-700">{mockBook.pages}</p></Card>
              <Card className="p-4 bg-white/70 backdrop-blur-sm"><p className="text-gray-600 text-sm mb-1">Category</p><p className="text-2xl font-extrabold text-gray-900">{mockBook.category}</p></Card>
              <Card className="p-4 bg-white/70 backdrop-blur-sm"><p className="text-gray-600 text-sm mb-1">Language</p><p className="text-2xl font-extrabold text-gray-900">{mockBook.language}</p></Card>
              <Card className="p-4 bg-white/70 backdrop-blur-sm"><p className="text-gray-600 text-sm mb-1">Published</p><p className="text-2xl font-extrabold text-gray-900">{mockBook.publishedDate}</p></Card>
            </div>
          </div>
        </section>

        {/* Reader/Reviews Tabs & Content */}
        <section>
          <div className="flex gap-4 border-b-2 border-gray-200 mb-8" role="tablist" aria-label="Reading page tabs">
            <button id="tab-reader" role="tab" aria-selected={activeTab === "reader"} aria-controls="tab-content-reader" onClick={() => { setActiveTab("reader"); setTimeout(() => readerPanelRef.current?.focus(), 0); }} className={`px-4 py-3 text-lg font-bold transition ${activeTab === "reader" ? "border-b-4 border-amber-600 text-amber-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>Reader Access</button>
            <button id="tab-reviews" role="tab" aria-selected={activeTab === "reviews"} aria-controls="tab-content-reviews" onClick={() => { setActiveTab("reviews"); setTimeout(() => reviewsPanelRef.current?.focus(), 0); }} className={`px-4 py-3 text-lg font-bold transition ${activeTab === "reviews" ? "border-b-4 border-amber-600 text-amber-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>Reviews & Ratings</button>
          </div>

          
          {activeTab === "reader" && (<div id="tab-content-reader" role="tabpanel" aria-labelledby="tab-reader" ref={readerPanelRef} tabIndex={-1} className="space-y-10">
                {/* Access Gates and Session Tracking */}
                <div className="space-y-6">
                    {activeSession && (<RealTimeSessionTracker bookId={mockBook.id} bookTitle={mockBook.title} bookLevel="SSS" userBalance={userBalance} sessionType={activeSession.type} onSessionEnd={handleSessionEnd}/>)}
                    
                    {!isPurchased && !activeSession && (<BookAccessGate bookId={mockBook.id} bookTitle={mockBook.title} bookLevel="SSS" bookPrice={mockBook.price} userBalance={userBalance} isPurchased={isPurchased} onPurchase={() => { setIsPurchased(true); success("Book purchased successfully!"); }} onStartPayPerUse={handleStartPayPerUse}/>)}

                    {(isPurchased || activeSession) && (<Card className="p-8 bg-green-50 border-4 border-green-200">
                            <h2 className="text-2xl font-bold mb-4 text-green-800">Your Library Access</h2>
                            <p className="text-gray-700 mb-4">This book is ready to read. Continue where you left off!</p>
                            <Button className="bg-green-600 hover:bg-green-700 text-white"><lucide_react_1.BookOpen className="w-5 h-5 mr-2"/>Continue Reading</Button>
                        </Card>)}
                </div>

                {/* Live Reader Section */}
                <Card className="p-8 border-2 border-gray-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Current Chapter Preview</h2>
                        <Button onClick={() => setShowBookmarks(!showBookmarks)} variant={showBookmarks ? "default" : "outline"} className={showBookmarks ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500 text-blue-600 hover:bg-blue-50"}>
                            <lucide_react_1.Bookmark className="w-4 h-4 mr-2"/>
                            Bookmarks ({mockBookmarks.length})
                        </Button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Reading Panel */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white border-4 border-gray-100 rounded-xl p-8 shadow-xl min-h-[500px] flex flex-col justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-6 border-b pb-2">Page {currentPage} of {mockPages.length}</p>
                                    <p className="text-gray-900 text-xl leading-loose whitespace-pre-wrap font-serif">{currentPageData?.content}</p>
                                </div>
                                <div className="text-center mt-6">
                                    <Button onClick={handleAddBookmark} aria-pressed={isBookmarked} aria-label="Toggle bookmark" className={`py-2 px-6 ${isBookmarked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 hover:bg-gray-400 text-gray-700"}`}>
                                        <lucide_react_1.Bookmark className="w-4 h-4 mr-2"/>
                                        {isBookmarked ? "Bookmarked" : "Add Bookmark"}
                                    </Button>
                                </div>
                            </div>

                            {/* Audio Player */}
                            {mockBook.hasAudio && (<Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg border-2 border-blue-200">
                                    <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center"><lucide_react_1.Headphones className="w-5 h-5 mr-2"/> Audio Narration</h3>
                                    <div className="flex items-center gap-4">
                                        <button aria-label={isPlaying ? "Pause audio" : "Play audio"} onClick={handlePlayPause} className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:bg-blue-700 transition transform hover:scale-105">
                                            {isPlaying ? <lucide_react_1.Pause className="w-7 h-7"/> : <lucide_react_1.Play className="w-7 h-7 ml-1"/>}
                                        </button>
                                        <div className="flex-1">
                                            <div role="progressbar" aria-valuenow={Math.round(((currentTime / (duration || 1)) * 100))} aria-valuemin={0} aria-valuemax={100} className="bg-blue-200 h-2 rounded-full mb-2 cursor-pointer" onClick={(e) => { }}>
                                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-100" style={{ width: `${(currentTime / (duration || 1)) * 100 || 0}%` }}/>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 font-mono">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>
                                        <lucide_react_1.Volume2 className="w-6 h-6 text-blue-600"/>
                                    </div>
                                    <audio ref={audioRef} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}/>
                                </Card>)}
                            
                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center mt-8">
                                <Button onClick={handlePreviousPage} disabled={currentPage === 1} variant="outline" className="py-3 px-6 text-lg hover:bg-gray-100" aria-label="Go to previous page">
                                    ← Previous
                                </Button>
                                <span className="text-xl font-bold text-gray-800">
                                    {currentPage} <span className="text-gray-500 font-normal">/ {mockPages.length}</span>
                                </span>
                                <Button onClick={handleNextPage} disabled={currentPage === mockPages.length} className="py-3 px-6 text-lg bg-amber-600 hover:bg-amber-700" aria-label="Go to next page">
                                    Next →
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar Bookmarks */}
                        {showBookmarks && (<div className="lg:col-span-1">
                                <Card className="p-5 h-full bg-amber-50 shadow-inner border border-amber-200">
                                    <h3 className="font-bold text-xl mb-4 text-amber-800 flex items-center"><lucide_react_1.Bookmark className="w-5 h-5 mr-2"/> Your Bookmarks</h3>
                                    <div className="space-y-4">
                                        {mockBookmarks.length > 0 ? (mockBookmarks.map(bm => (<div key={bm.id} className="border-l-4 border-amber-600 pl-3 py-2 bg-white rounded-md shadow-sm">
                                                    <p className="text-sm font-bold text-gray-900">Page {bm.page}</p>
                                                    <p className="text-sm text-gray-700 italic">"{bm.note}"</p>
                                                    <p className="text-xs text-gray-500 mt-1">{bm.timestamp}</p>
                                                </div>))) : (<p className="text-gray-600 text-sm">No bookmarks yet. Click 'Add Bookmark' above!</p>)}
                                    </div>
                                </Card>
                            </div>)}
                    </div>
                </Card>
            </div>)}

          
          {activeTab === "reviews" && (<div id="tab-content-reviews" role="tabpanel" aria-labelledby="tab-reviews" ref={reviewsPanelRef} tabIndex={-1} className="space-y-10">
              
              {/* Ratings Summary */}
              <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                <h3 className="text-3xl font-bold mb-8 text-amber-800">Overall Ratings & Breakdown</h3>
                <div className="grid md:grid-cols-3 gap-12 items-center">
                  <div className="text-center border-r md:border-r-2 border-amber-200 pr-6">
                    <p className="text-7xl font-extrabold text-amber-600 mb-2">{mockBook.rating.toFixed(1)}</p>
                    <StarRating rating={mockBook.rating} readOnly size="lg" showLabel={false}/>
                    <p className="text-lg text-gray-600 mt-4">Based on <span className="font-bold">{mockBook.reviews}</span> reviews</p>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                const count = stars === 5 ? 83 : stars === 4 ? 32 : stars === 3 ? 9 : stars === 2 ? 3 : 1;
                const percentage = ((count / mockBook.reviews) * 100);
                return (<div key={stars} className="flex items-center gap-3">
                                <span className="text-lg font-medium text-gray-700 w-8">{stars}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-3.5">
                                    <div className="bg-amber-500 h-3.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}/>
                                </div>
                                <span className="text-base text-gray-600 w-12 text-right">{count}</span>
                            </div>);
            })}
                  </div>
                </div>
              </Card>

              {/* Review Submission Form */}
              <ReviewForm onSubmit={({ rating, title, content }) => {
                const newReview = {
                    id: Date.now(),
                    userName: "You",
                    rating,
                    title,
                    content,
                    date: new Date().toISOString(),
                    helpfulCount: 0,
                    unhelpfulCount: 0,
                    isVerifiedPurchase: true,
                    isUserReview: true,
                };
                setReviews((rs) => [newReview, ...rs]);
            }}/>

              {/* Individual Reviews */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">All Customer Reviews ({reviews.length})</h3>
                {reviews.map((review) => (<ReviewWithReplies key={review.id} review={review} replies={replies[review.id] || []} bookAuthorId={1} currentUserId={1} onDelete={handleDeleteReview} onEdit={handleEditReview} onHelpful={handleHelpful} onUnhelpful={handleUnhelpful} onReplySubmit={handleReplySubmit} onReplyDelete={handleReplyDelete}/>))}
              </div>
            </div>)}
        </section>
      </main>
      
      <Footer />
      {/* Global Notification/Toast */}
      <NotificationBar {...toastState} onClose={onClose}/>
    </div>);
};
exports.default = App;
