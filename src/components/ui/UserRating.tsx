
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function UserRating({
  rating,
  size = "md",
  showValue = true,
  className,
}: UserRatingProps) {
  // Normalize rating between 0 and 5
  const normalizedRating = Math.max(0, Math.min(5, rating));
  
  // Calculate the percentage for the filled stars
  const percentage = (normalizedRating / 5) * 100;
  
  // Determine color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-amber-500";
    if (rating >= 2) return "text-orange-500";
    return "text-red-500";
  };
  
  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  
  const containerSizes = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  };
  
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <div className={cn("relative", containerSizes[size])}>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn("text-gray-200", starSizes[size])}
              fill="currentColor"
            />
          ))}
        </div>
        <div
          className="flex absolute inset-0 overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(getRatingColor(normalizedRating), starSizes[size])}
              fill="currentColor"
            />
          ))}
        </div>
      </div>
      
      {showValue && (
        <span className={cn("font-medium", getRatingColor(normalizedRating), textSizes[size])}>
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
