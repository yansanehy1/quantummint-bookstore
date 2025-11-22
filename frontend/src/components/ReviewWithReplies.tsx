import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StarRating from "./StarRating";
import AuthorReplyForm from "./AuthorReplyForm";
import { ThumbsUp, ThumbsDown, Trash2, Edit2, CheckCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Reply {
  id: number;
  authorName: string;
  content: string;
  date: string;
  isAuthor?: boolean;
}

interface ReviewWithRepliesProps {
  review: {
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
  };
  replies?: Reply[];
  bookAuthorId?: number;
  currentUserId?: number;
  onDelete?: (reviewId: number) => void;
  onEdit?: (reviewId: number) => void;
  onHelpful?: (reviewId: number) => void;
  onUnhelpful?: (reviewId: number) => void;
  onReplySubmit?: (reviewId: number, reply: { content: string }) => void;
  onReplyDelete?: (replyId: number) => void;
}

export default function ReviewWithReplies({
  review,
  replies = [],
  bookAuthorId,
  currentUserId,
  onDelete,
  onEdit,
  onHelpful,
  onUnhelpful,
  onReplySubmit,
  onReplyDelete,
}: ReviewWithRepliesProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userHelpful, setUserHelpful] = useState(false);

  const isBookAuthor = currentUserId === bookAuthorId;

  const handleHelpful = () => {
    if (!userHelpful) {
      setUserHelpful(true);
      onHelpful?.(review.id);
      toast.success("Marked as helpful");
    }
  };

  const handleUnhelpful = () => {
    if (!userHelpful) {
      setUserHelpful(true);
      onUnhelpful?.(review.id);
      toast.success("Marked as unhelpful");
    }
  };

  return (
    <Card className="p-6">
      {/* Review Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-gray-900">{review.userName}</h4>
            {review.isVerifiedPurchase && (
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  Verified Purchase
                </span>
              </div>
            )}
          </div>
          <StarRating rating={review.rating} readOnly size="sm" showLabel={false} />
          <p className="text-xs text-gray-500 mt-1">{review.date}</p>
        </div>
        {review.isUserReview && (
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit?.(review.id)}
              variant="outline"
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete?.(review.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Review Title and Content */}
      <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
      <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

      {/* Helpful/Unhelpful */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 mb-4">
        <span className="text-sm text-gray-600">Was this helpful?</span>
        <div className="flex gap-2">
          <Button
            onClick={handleHelpful}
            disabled={userHelpful}
            variant="outline"
            size="sm"
            className="text-green-600 hover:bg-green-50 disabled:opacity-50"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Yes ({review.helpfulCount})
          </Button>
          <Button
            onClick={handleUnhelpful}
            disabled={userHelpful}
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            No ({review.unhelpfulCount})
          </Button>
        </div>
      </div>

      {/* Author Replies */}
      {replies.length > 0 && (
        <div className="ml-8 mt-6 space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MessageCircle className="w-4 h-4" />
            Author Replies ({replies.length})
          </div>
          {replies.map((reply) => (
            <Card key={reply.id} className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-blue-900">{reply.authorName}</p>
                    {reply.isAuthor && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Author
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-700">{reply.date}</p>
                </div>
                {reply.isAuthor && (
                  <Button
                    onClick={() => onReplyDelete?.(reply.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {isBookAuthor && (
        <>
          {!showReplyForm ? (
            <Button
              onClick={() => setShowReplyForm(true)}
              variant="outline"
              size="sm"
              className="mt-4 text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Reply as Author
            </Button>
          ) : (
            <>
              <AuthorReplyForm
                reviewId={review.id}
                reviewerName={review.userName}
                isAuthor={true}
                onSubmit={(reply) => {
                  onReplySubmit?.(review.id, reply);
                  setShowReplyForm(false);
                }}
              />
              <Button
                onClick={() => setShowReplyForm(false)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Cancel
              </Button>
            </>
          )}
        </>
      )}
    </Card>
  );
}
