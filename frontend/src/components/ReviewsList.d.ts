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
export default function ReviewsList({ reviews, sortBy, onDelete, onEdit, onHelpful, onUnhelpful, }: ReviewsListProps): import("react").JSX.Element;
export {};
