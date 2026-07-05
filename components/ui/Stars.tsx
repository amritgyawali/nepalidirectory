import { Star } from "lucide-react";

type StarsProps = {
  rating: number;
  size?: number;
};

export function Stars({ rating, size = 15 }: StarsProps) {
  return (
    <span className="stars" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index + 1 <= Math.round(rating);
        return (
          <Star
            key={index}
            size={size}
            fill={filled ? "#f5b300" : "#e3e5e8"}
            stroke={filled ? "#f5b300" : "#d3d6db"}
            aria-hidden
          />
        );
      })}
    </span>
  );
}
