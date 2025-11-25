"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReviewsList;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const StarRating_1 = __importDefault(require("./StarRating"));
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
function ReviewsList({ reviews, sortBy = "recent", onDelete, onEdit, onHelpful, onUnhelpful, }) {
    const [sortMethod, setSortMethod] = (0, react_1.useState)(sortBy);
    const [userHelpful, setUserHelpful] = (0, react_1.useState)(new Set());
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
    const handleHelpful = (reviewId) => {
        if (!userHelpful.has(reviewId)) {
            setUserHelpful(new Set(userHelpful).add(reviewId));
            onHelpful?.(reviewId);
            sonner_1.toast.success("Marked as helpful");
        }
    };
    const handleUnhelpful = (reviewId) => {
        if (!userHelpful.has(reviewId)) {
            setUserHelpful(new Set(userHelpful).add(reviewId));
            onUnhelpful?.(reviewId);
            sonner_1.toast.success("Marked as unhelpful");
        }
    };
    if (reviews.length === 0) {
        return (<card_1.Card className="p-8 text-center">
        <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
      </card_1.Card>);
    }
    return (<div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 self-center">Sort by:</span>
        {["recent", "helpful", "rating-high", "rating-low"].map((method) => (<button_1.Button key={method} onClick={() => setSortMethod(method)} variant={sortMethod === method ? "default" : "outline"} size="sm" className={sortMethod === method ? "bg-amber-600 hover:bg-amber-700" : ""}>
            {method === "recent" && "Recent"}
            {method === "helpful" && "Most Helpful"}
            {method === "rating-high" && "Highest Rating"}
            {method === "rating-low" && "Lowest Rating"}
          </button_1.Button>))}
      </div>

      <div className="space-y-4">
        {sortedReviews.map((review) => (<card_1.Card key={review.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900">{review.userName}</h4>
                  {review.isVerifiedPurchase && (<div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                      <lucide_react_1.CheckCircle className="w-3 h-3 text-green-600"/>
                      <span className="text-xs font-medium text-green-700">Verified Purchase</span>
                    </div>)}
                </div>
                <StarRating_1.default rating={review.rating} readOnly size="sm" showLabel={false}/>
                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
              </div>
              {review.isUserReview && (<div className="flex gap-2">
                  <button_1.Button onClick={() => onEdit?.(review.id)} variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <lucide_react_1.Edit2 className="w-4 h-4"/>
                  </button_1.Button>
                  <button_1.Button onClick={() => onDelete?.(review.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                  </button_1.Button>
                </div>)}
            </div>

            <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
            <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Was this helpful?</span>
              <div className="flex gap-2">
                <button_1.Button onClick={() => handleHelpful(review.id)} disabled={userHelpful.has(review.id)} variant="outline" size="sm" className="text-green-600 hover:bg-green-50 disabled:opacity-50">
                  <lucide_react_1.ThumbsUp className="w-4 h-4 mr-1"/>
                  Yes ({review.helpfulCount})
                </button_1.Button>
                <button_1.Button onClick={() => handleUnhelpful(review.id)} disabled={userHelpful.has(review.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50 disabled:opacity-50">
                  <lucide_react_1.ThumbsDown className="w-4 h-4 mr-1"/>
                  No ({review.unhelpfulCount})
                </button_1.Button>
              </div>
            </div>
          </card_1.Card>))}
      </div>
    </div>);
}
