import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, setFilters } from '../store/slices/restaurantSlice';
import MainLayout from '../components/layout/MainLayout';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react';
import { getCuisineIcon } from '../utils/helpers';

const CUISINES = ['Tümü', 'Burger', 'Pizza', 'Türk Mutfağı', 'Japon', 'Vegan', 'Izgara'];
const SORT_OPTIONS = [
  { label: 'En Popüler',      value: 'rating' },
  { label: 'En Hızlı',        value: 'deliveryTime' },
  { label: 'En Düşük Ücret',  value: 'deliveryFee' },
  { label: 'Min Tutar ↑',     value: 'minOrder' },
];

const RestaurantsPage = () => {
  const dispatch = useDispatch();
  const { items, status, filters } = useSelector((s) => s.restaurant);
  const [search, setSearch] = useState(filters.search || '');
  const [selectedCuisine, setSelectedCuisine] = useState(filters.cuisine || 'Tümü');
  const [sortBy, setSortBy] = useState('rating');
  const [minRating, setMinRating] = useState(0);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);

  useEffect(() => { dispatch(fetchRestaurants()); }, [dispatch]);

  // Ana sayfadan filter geldiyse uygula, sonra Redux'u temizle
  useEffect(() => {
    if (filters.search) {
      setSearch(filters.search);
      dispatch(setFilters({ search: '' }));
    }
    if (filters.cuisine) {
      setSelectedCuisine(filters.cuisine);
      dispatch(setFilters({ cuisine: '' }));
    }
  }, []);

  // Filter + sort
  const filtered = items
    .filter((r) => {
      const matchSearch   = !search   || r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase());
      const matchCuisine  = selectedCuisine === 'Tümü' || r.cuisine === selectedCuisine;
      const matchRating   = r.rating >= minRating;
      const matchOpen     = !showOnlyOpen || r.isOpen;
      return matchSearch && matchCuisine && matchRating && matchOpen;
    })
    .sort((a, b) => {
      if (sortBy === 'rating')       return b.rating - a.rating;
      if (sortBy === 'deliveryFee')  return a.deliveryFee - b.deliveryFee;
      if (sortBy === 'minOrder')     return a.minOrderAmount - b.minOrderAmount;
      return 0;
    });

  const clearFilters = () => {
    setSearch('');
    setSelectedCuisine('Tümü');
    setSortBy('rating');
    setMinRating(0);
    setShowOnlyOpen(false);
  };

  const hasActiveFilters = search || selectedCuisine !== 'Tümü' || sortBy !== 'rating' || minRating > 0 || showOnlyOpen;

  return (
    <MainLayout>
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textColor-light dark:text-textColor-dark mb-2">Restoranlar</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{filtered.length} restoran listeleniyor</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Restoran veya yemek türü ara..."
                className="input pl-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-danger">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input pl-10 pr-10 appearance-none cursor-pointer min-w-[180px]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CUISINES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCuisine === c
                    ? 'bg-primary text-white shadow-primary'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {c !== 'Tümü' && getCuisineIcon(c)} {c}
              </button>
            ))}
          </div>

          {/* Extra Filters Row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* Min Rating */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Star size={14} className="text-warning" />
              <span>Min. Puan:</span>
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    minRating === r ? 'bg-warning/20 text-warning' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {r === 0 ? 'Tümü' : r}
                </button>
              ))}
            </div>

            {/* Open Only */}
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox" checked={showOnlyOpen} onChange={(e) => setShowOnlyOpen(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              Sadece Açık Olanlar
            </label>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-danger hover:underline">
                <X size={12} /> Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {status === 'loading' && <LoadingSpinner />}
        {status === 'failed' && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">😕</p>
            <p className="font-semibold text-textColor-light dark:text-textColor-dark mb-2">Restoranlar yüklenemedi</p>
            <p className="text-sm text-gray-400 mb-4">JSON Server'ın çalıştığından emin olun: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">npm run server</code></p>
            <button onClick={() => dispatch(fetchRestaurants())} className="btn-primary">Tekrar Dene</button>
          </div>
        )}
        {status === 'succeeded' && filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold text-textColor-light dark:text-textColor-dark mb-1">Sonuç bulunamadı</p>
            <p className="text-sm text-gray-400">Farklı bir arama yapmayı veya filtreleri temizlemeyi deneyin.</p>
            <button onClick={clearFilters} className="btn-primary mt-4">Filtreleri Temizle</button>
          </div>
        )}
        {status === 'succeeded' && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RestaurantsPage;
