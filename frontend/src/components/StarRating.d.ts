interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
}
export default function StarRating({ rating, onRatingChange, readOnly, size, showLabel, }: StarRatingProps): import("react").JSX.Element;
export {};
