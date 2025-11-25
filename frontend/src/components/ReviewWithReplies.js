"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReviewWithReplies;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const StarRating_1 = __importDefault(require("./StarRating"));
const AuthorReplyForm_1 = __importDefault(require("./AuthorReplyForm"));
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
function ReviewWithReplies({ review, replies = [], bookAuthorId, currentUserId, onDelete, onEdit, onHelpful, onUnhelpful, onReplySubmit, onReplyDelete, }) {
    const [showReplyForm, setShowReplyForm] = (0, react_1.useState)(false);
    const [userHelpful, setUserHelpful] = (0, react_1.useState)(false);
    const isBookAuthor = currentUserId === bookAuthorId;
    const handleHelpful = () => {
        if (!userHelpful) {
            setUserHelpful(true);
            onHelpful?.(review.id);
            sonner_1.toast.success("Marked as helpful");
        }
    };
    const handleUnhelpful = () => {
        if (!userHelpful) {
            setUserHelpful(true);
            onUnhelpful?.(review.id);
            sonner_1.toast.success("Marked as unhelpful");
        }
    };
    return (<card_1.Card className="p-6">
      {/* Review Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-gray-900">{review.userName}</h4>
            {review.isVerifiedPurchase && (<div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <lucide_react_1.CheckCircle className="w-3 h-3 text-green-600"/>
                <span className="text-xs font-medium text-green-700">
                  Verified Purchase
                </span>
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

      {/* Review Title and Content */}
      <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
      <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

      {/* Helpful/Unhelpful */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 mb-4">
        <span className="text-sm text-gray-600">Was this helpful?</span>
        <div className="flex gap-2">
          <button_1.Button onClick={handleHelpful} disabled={userHelpful} variant="outline" size="sm" className="text-green-600 hover:bg-green-50 disabled:opacity-50">
            <lucide_react_1.ThumbsUp className="w-4 h-4 mr-1"/>
            Yes ({review.helpfulCount})
          </button_1.Button>
          <button_1.Button onClick={handleUnhelpful} disabled={userHelpful} variant="outline" size="sm" className="text-red-600 hover:bg-red-50 disabled:opacity-50">
            <lucide_react_1.ThumbsDown className="w-4 h-4 mr-1"/>
            No ({review.unhelpfulCount})
          </button_1.Button>
        </div>
      </div>

      {/* Author Replies */}
      {replies.length > 0 && (<div className="ml-8 mt-6 space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <lucide_react_1.MessageCircle className="w-4 h-4"/>
            Author Replies ({replies.length})
          </div>
          {replies.map((reply) => (<card_1.Card key={reply.id} className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-blue-900">{reply.authorName}</p>
                    {reply.isAuthor && (<span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Author
                      </span>)}
                  </div>
                  <p className="text-xs text-blue-700">{reply.date}</p>
                </div>
                {reply.isAuthor && (<button_1.Button onClick={() => onReplyDelete?.(reply.id)} variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                  </button_1.Button>)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
            </card_1.Card>))}
        </div>)}

      {/* Reply Form */}
      {isBookAuthor && (<>
          {!showReplyForm ? (<button_1.Button onClick={() => setShowReplyForm(true)} variant="outline" size="sm" className="mt-4 text-blue-600 border-blue-300 hover:bg-blue-50">
              <lucide_react_1.MessageCircle className="w-4 h-4 mr-2"/>
              Reply as Author
            </button_1.Button>) : (<>
              <AuthorReplyForm_1.default reviewId={review.id} reviewerName={review.userName} isAuthor={true} onSubmit={(reply) => {
                    onReplySubmit?.(review.id, reply);
                    setShowReplyForm(false);
                }}/>
              <button_1.Button onClick={() => setShowReplyForm(false)} variant="outline" size="sm" className="mt-2">
                Cancel
              </button_1.Button>
            </>)}
        </>)}
    </card_1.Card>);
}
