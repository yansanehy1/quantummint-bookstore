import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StarRating from "./StarRating";
import { ThumbsUp, ThumbsDown, Trash2, Edit2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: number;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpfulCount: number;
  unhelpfulCount: number;
  isVerifiedPurchase: boolean;
  isUserReview?: boolean;
}

interface ReviewsListProps {
  reviews: Review[];
  sortBy?: "recent" | "helpful" | "rating-high" | "rating-low";
  onDelete?: (reviewId: number) => void;
  onEdit?: (reviewId: number) => void;
  onHelpful?: (reviewId: number) => void;
  onUnhelpful?: (reviewId: number) => void;
}

export default function ReviewsList({
  reviews,
  sortBy = "recent",
  onDelete,
  onEdit,
  onHelpful,
  onUnhelpful,
}: ReviewsListProps) {
  const [sortMethod, setSortMethod] = useState(sortBy);
  const [userHelpful, setUserHelpful] = useState<Set<number>>(new Set());

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortMethod) {
      case "helpful":
        return b.helpfulCount - a.helpfulCount;
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "recent":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleHelpful = (reviewId: number) => {
    if (!userHelpful.has(reviewId)) {
      setUserHelpful(new Set(userHelpful).add(reviewId));
      onHelpful?.(reviewId);
      toast.success("Marked as helpful");
    }
  };

  const handleUnhelpful = (reviewId: number) => {
    if (!userHelpful.has(reviewId)) {
      setUserHelpful(new Set(userHelpful).add(reviewId));
      onUnhelpful?.(reviewId);
      toast.success("Marked as unhelpful");
    }
  };

  if (reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 self-center">Sort by:</span>
        {(["recent", "helpful", "rating-high", "rating-low"] as const).map((method) => (
          <Button
            key={method}
            onClick={() => setSortMethod(method)}
            variant={sortMethod === method ? "default" : "outline"}
            size="sm"
            className={sortMethod === method ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {method === "recent" && "Recent"}
            {method === "helpful" && "Most Helpful"}
            {method === "rating-high" && "Highest Rating"}
            {method === "rating-low" && "Lowest Rating"}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900">{review.userName}</h4>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Verified Purchase</span>
                    </div>
                  )}
                </div>
                <StarRating rating={review.rating} readOnly size="sm" showLabel={false} />
                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
              </div>
              {review.isUserReview && (
                <div className="flex gap-2">
                  <Button onClick={() => onEdit?.(review.id)} variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => onDelete?.(review.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
            <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Was this helpful?</span>
              <div className="flex gap-2">
                <Button onClick={() => handleHelpful(review.id)} disabled={userHelpful.has(review.id)} variant="outline" size="sm" className="text-green-600 hover:bg-green-50 disabled:opacity-50">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Yes ({review.helpfulCount})
                </Button>
                <Button onClick={() => handleUnhelpful(review.id)} disabled={userHelpful.has(review.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50 disabled:opacity-50">
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  No ({review.unhelpfulCount})
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
