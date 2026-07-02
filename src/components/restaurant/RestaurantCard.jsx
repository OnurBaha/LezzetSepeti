import { Link } from 'react-router-dom';
import { Clock, Star, ShoppingBag, Zap } from 'lucide-react';
import { formatPrice, getCuisineIcon } from '../../utils/helpers';
import StarRating from '../common/StarRating';

const RestaurantCard = ({ restaurant }) => {
  const {
    id, name, logo, cuisine, rating, reviewCount, deliveryTime, deliveryFee, minOrderAmount, isOpen, scores
  } = restaurant;

  return (
    <Link to={`/restaurant/${id}`} className="block group">
      <div className={`card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${!isOpen ? 'opacity-70' : ''}`}>
        {/* Cover / Logo area */}
        <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
          <img
            src={logo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Status badge */}
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${
            isOpen ? 'bg-success text-white' : 'bg-gray-500 text-white'
          }`}>
            {isOpen ? 'Açık' : 'Kapalı'}
          </div>

          {/* Cuisine icon */}
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/90 dark:bg-gray-900/90 flex items-center justify-center text-xl shadow-lg">
            {getCuisineIcon(cuisine)}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-base text-textColor-light dark:text-textColor-dark group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{cuisine}</p>

          <div className="flex items-center gap-1 mb-3">
            <StarRating rating={rating} size="sm" />
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-50 dark:border-gray-800">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-primary" />
              {deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <Zap size={12} className="text-warning" />
              {deliveryFee === 0 ? 'Ücretsiz' : `${deliveryFee}₺`}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag size={12} className="text-gray-400" />
              min. {minOrderAmount}₺
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
