import React, { useState } from 'react';
import { Book, Review } from '../types';
import { Button } from './ui/Button';
import { StarRating } from './ui/StarRating';
import { X, Play, MessageSquare, Sparkles, ImagePlus } from 'lucide-react';
import { generateBookSummary, generateBookCover } from '@/services/aiService';

interface BookDetailsModalProps {
  book: Book;
  onClose: () => void;
  onStart: () => void;
  onAddReview: (bookId: string, review: Omit<Review, 'id' | 'userId' | 'userName' | 'date'>) => void;
  onUpdateBook: (updatedBook: Book) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose, onStart, onAddReview, onUpdateBook }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) return;
    onAddReview(book.id, { rating: newRating, comment: newComment });
    setNewComment('');
    setNewRating(0);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateBookSummary(book.title, book.description);
      onUpdateBook({ ...book, aiSummary: summary });
    } catch (e) {
      console.error(e);
      alert("Failed to generate summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateCover = async () => {
    setIsGeneratingCover(true);
    try {
      const coverUrl = await generateBookCover(book.title, book.description);
      onUpdateBook({ ...book, coverUrl });
    } catch (e) {
      console.error(e);
      alert("Failed to generate cover");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">

        {/* Left: Cover & Action */}
        <div className="md:w-1/3 bg-slate-100 p-8 flex flex-col items-center justify-between text-center relative group">
          <button onClick={onClose} className="absolute top-4 left-4 md:hidden p-2 bg-white rounded-full shadow"><X size={20} /></button>

          <div className="relative w-48 mx-auto shadow-lg rounded-lg overflow-hidden bg-slate-200 aspect-[2/3]">
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />

            {/* AI Cover Gen Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleGenerateCover}
                isLoading={isGeneratingCover}
                className="gap-2 shadow-xl"
              >
                <ImagePlus size={16} />
                {isGeneratingCover ? 'Creating...' : 'New AI Cover'}
              </Button>
            </div>
            {isGeneratingCover && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            )}
          </div>

          <div className="space-y-6 mt-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">{book.title}</h2>
              <p className="text-slate-500 text-sm">{book.author}</p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <StarRating rating={book.rating} size={20} />
              <span className="text-sm font-bold text-slate-700">{book.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({book.reviews.length} reviews)</span>
            </div>
          </div>
          <div className="w-full mt-8">
            <Button size="lg" className="w-full gap-2" onClick={onStart}>
              <Play size={20} fill="currentColor" /> Start Learning
            </Button>
            <p className="text-xs text-slate-400 mt-4">Price: ${book.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Right: Info & Reviews */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-4 pt-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'info' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 pt-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Reviews ({book.reviews.length})
              </button>
            </div>
            <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-slate-600"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'info' ? (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{book.description}</p>
                </div>

                {/* AI Summary Section */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <Sparkles size={16} className="text-emerald-600" />
                      </div>
                      AI Insight & Learning Outcomes
                    </h3>
                    {!book.aiSummary && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-sm"
                        onClick={handleGenerateSummary}
                        isLoading={isGeneratingSummary}
                      >
                        Generate Summary
                      </Button>
                    )}
                  </div>
                  {book.aiSummary ? (
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap prose prose-sm prose-emerald max-w-none">
                      {book.aiSummary}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm italic flex flex-col gap-1">
                      <p>{isGeneratingSummary ? 'Analyzing educational content...' : 'Unlock key themes and learning outcomes with AI.'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">What you'll learn</h3>
                  <ul className="space-y-2">
                    {book.chapters.map((ch, idx) => (
                      <li key={ch.id} className="flex items-center gap-3 text-slate-600 text-sm">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</div>
                        {ch.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* Reviews List */}
                <div className="space-y-6">
                  {book.reviews.length === 0 ? (
                    <p className="text-center text-slate-400 py-8">No reviews yet. Be the first!</p>
                  ) : (
                    book.reviews.map(review => (
                      <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-slate-900 text-sm">{review.userName}</div>
                          <span className="text-xs text-slate-400">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} size={14} className="mb-2" />
                        <p className="text-slate-600 text-sm">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Form */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><MessageSquare size={16} /> Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Your Rating</label>
                      <StarRating rating={newRating} interactive onRatingChange={setNewRating} size={24} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Your Review</label>
                      <textarea
                        className="w-full rounded-lg border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 text-sm p-3 min-h-[80px]"
                        placeholder="What did you think about this book?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" type="submit" disabled={newRating === 0}>Submit Review</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


