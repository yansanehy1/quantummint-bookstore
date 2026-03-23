
import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number | "sm" | "md" | "lg";
  showLabel?: boolean;
  interactive?: boolean; // Keep for backward compatibility with previous usages
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = "md",
  showLabel = false,
  interactive = false, // Default to false if not specified, but readOnly prop takes precedence
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const isInteractive = (interactive || !readOnly) && !!onRatingChange;

  const getSizeClass = () => {
    if (typeof size === 'number') return ''; // Custom size via style/prop not class
    switch (size) {
      case "sm": return "w-4 h-4";
      case "md": return "w-5 h-5";
      case "lg": return "w-6 h-6";
      default: return "w-5 h-5";
    }
  };

  const pxSize = typeof size === 'number' ? size : undefined;
  const sizeClass = getSizeClass();

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => isInteractive && onRatingChange?.(star)}
            onMouseEnter={() => isInteractive && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={!isInteractive}
            className={`transition-transform duration-200 ${!isInteractive ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={pxSize}
              className={`${sizeClass} ${
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300 fill-slate-100"
              }`}
            />
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-700 ml-2">
          {displayRating > 0 ? `${displayRating.toFixed(1)}` : "No rating"}
        </span>
      )}
    </div>
  );
};



