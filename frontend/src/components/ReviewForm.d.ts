interface ReviewFormProps {
    bookId: number;
    bookTitle: string;
    onSubmit?: (review: {
        rating: number;
        title: string;
        content: string;
    }) => void;
    isVerifiedPurchase?: boolean;
}
export default function ReviewForm({ bookId, bookTitle, onSubmit, isVerifiedPurchase, }: ReviewFormProps): import("react").JSX.Element;
export {};
