import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AuthorReplyFormProps {
  reviewId: number;
  reviewerName: string;
  onSubmit?: (reply: { content: string }) => void;
  isAuthor?: boolean;
}

export default function AuthorReplyForm({ reviewId, reviewerName, onSubmit, isAuthor = false }: AuthorReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter your reply");
      return;
    }

    if (content.length > 1000) {
      toast.error("Reply must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit?.({ content });
      setContent("");
      toast.success("Reply posted successfully!");
    } catch (error) {
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 bg-blue-50 border border-blue-200 ml-8 mt-4">
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900">Author Reply</p>
          <p className="text-sm text-blue-700">Respond to {reviewerName}'s review</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts on this review. Thank the reviewer, address their feedback, or provide additional context..."
          rows={4}
          maxLength={1000}
          className="w-full"
        />
        <p className="text-xs text-gray-600">{content.length}/1000 characters</p>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || !content.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Reply"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setContent("")}>
            Clear
          </Button>
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
    </Card>
  );
}
