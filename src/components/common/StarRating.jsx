import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 'sm', showNumber = true }) => {
  const sizes = { xs: 10, sm: 14, md: 18, lg: 22 };
  const px = sizes[size] || 14;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={px}
            className={
              star <= Math.round(rating)
                ? 'text-warning fill-warning'
                : 'text-gray-300 dark:text-gray-600'
            }
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-textColor-light dark:text-textColor-dark">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
