"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthorReplyForm;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const textarea_1 = require("@/components/ui/textarea");
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
function AuthorReplyForm({ reviewId, reviewerName, onSubmit, isAuthor = false }) {
    const [content, setContent] = (0, react_1.useState)("");
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    if (!isAuthor)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            sonner_1.toast.error("Please enter your reply");
            return;
        }
        if (content.length > 1000) {
            sonner_1.toast.error("Reply must be less than 1000 characters");
            return;
        }
        setIsSubmitting(true);
        try {
            onSubmit?.({ content });
            setContent("");
            sonner_1.toast.success("Reply posted successfully!");
        }
        catch (error) {
            sonner_1.toast.error("Failed to post reply");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<card_1.Card className="p-4 bg-blue-50 border border-blue-200 ml-8 mt-4">
      <div className="flex items-start gap-2 mb-3">
        <lucide_react_1.AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"/>
        <div>
          <p className="font-semibold text-blue-900">Author Reply</p>
          <p className="text-sm text-blue-700">Respond to {reviewerName}'s review</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea_1.Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts on this review. Thank the reviewer, address their feedback, or provide additional context..." rows={4} maxLength={1000} className="w-full"/>
        <p className="text-xs text-gray-600">{content.length}/1000 characters</p>

        <div className="flex gap-2">
          <button_1.Button type="submit" disabled={isSubmitting || !content.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            <lucide_react_1.Send className="w-4 h-4 mr-2"/>
            {isSubmitting ? "Posting..." : "Post Reply"}
          </button_1.Button>
          <button_1.Button type="button" variant="outline" onClick={() => setContent("")}>
            Clear
          </button_1.Button>
        </div>

        <div className="bg-white rounded p-3 border border-blue-100 text-xs text-gray-600">
          <p className="font-medium text-gray-700 mb-2">Tips for a great reply:</p>
          <ul className="space-y-1">
            <li>✓ Be professional and courteous</li>
            <li>✓ Address specific points from the review</li>
            <li>✓ Provide helpful context or clarification</li>
            <li>✗ Avoid being defensive</li>
          </ul>
        </div>
      </form>
    </card_1.Card>);
}
