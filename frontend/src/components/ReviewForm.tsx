import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  bookId: number;
  bookTitle: string;
  onSubmit?: (review: { rating: number; title: string; content: string }) => void;
  isVerifiedPurchase?: boolean;
}

export default function ReviewForm({
  bookId,
  bookTitle,
  onSubmit,
  isVerifiedPurchase = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a review title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter your review");
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit?.({ rating, title, content });
      setRating(0);
      setTitle("");
      setContent("");
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <h3 className="text-2xl font-bold mb-2">Share Your Review</h3>
      <p className="text-gray-600 mb-6">
        Help other learners by sharing your experience with "{bookTitle}"
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} size="lg" showLabel={true} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Great content and clear explanations" maxLength={200} className="w-full" />
          <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share what you liked or didn't like about this book. Be specific and helpful to other learners." rows={5} maxLength={2000} className="w-full" />
          <p className="text-xs text-gray-500 mt-1">{content.length}/2000 characters</p>
        </div>

        {isVerifiedPurchase && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Verified Purchase</p>
              <p className="text-xs text-green-700">You have purchased this book</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting || rating === 0 || !title.trim() || !content.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          <Button type="button" variant="outline" onClick={() => { setRating(0); setTitle(""); setContent(""); }}>
            Clear
          </Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Review Guidelines:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ Be honest and constructive</li>
            <li>✓ Share specific examples from the book</li>
            <li>✓ Avoid spoilers</li>
            <li>✗ No spam or promotional content</li>
            <li>✗ No offensive language</li>
          </ul>
        </div>
      </form>
    </Card>
  );
}
