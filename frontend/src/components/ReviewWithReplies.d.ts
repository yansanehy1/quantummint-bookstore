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
    onReplySubmit?: (reviewId: number, reply: {
        content: string;
    }) => void;
    onReplyDelete?: (replyId: number) => void;
}
export default function ReviewWithReplies({ review, replies, bookAuthorId, currentUserId, onDelete, onEdit, onHelpful, onUnhelpful, onReplySubmit, onReplyDelete, }: ReviewWithRepliesProps): import("react").JSX.Element;
export {};
