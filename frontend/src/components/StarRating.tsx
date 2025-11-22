import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = "md",
  showLabel = true,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  } as const;

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readOnly && onRatingChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={readOnly}
            className={`transition ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">
          {displayRating > 0 ? `${displayRating}.0` : "No rating"}
        </span>
      )}
    </div>
  );
}
