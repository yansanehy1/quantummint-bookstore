interface AuthorReplyFormProps {
    reviewId: number;
    reviewerName: string;
    onSubmit?: (reply: {
        content: string;
    }) => void;
    isAuthor?: boolean;
}
export default function AuthorReplyForm({ reviewId, reviewerName, onSubmit, isAuthor }: AuthorReplyFormProps): import("react").JSX.Element;
export {};
