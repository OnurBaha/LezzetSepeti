import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, setFilters } from '../store/slices/restaurantSlice';
import MainLayout from '../components/layout/MainLayout';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ChevronRight, MapPin, Search, Star, Zap, Tag, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { getCuisineIcon } from '../utils/helpers';

const CATEGORIES = [
  'Burger', 'Pizza', 'Türk Mutfağı', 'Japon', 'Vegan', 'Izgara', 'Tatlı', 'Deniz Ürünleri'
];

const BANNERS = [
  { code: 'LEZZET20', desc: '%20 İndirim — Tüm siparişlerde geçerli', color: 'from-primary to-pink-400', icon: '🎉' },
  { code: 'ILKSIPARIM', desc: 'İlk siparişine özel 50₺ indirim!', color: 'from-violet-500 to-purple-600', icon: '🎁' },
  { code: 'BURGER15', desc: 'Burger Vadisi\'nde %15 indirim', color: 'from-orange-400 to-red-500', icon: '🍔' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: restaurants, status, filters } = useSelector((s) => s.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleCategoryClick = (cuisine) => {
    dispatch(setFilters({ cuisine }));
    navigate('/restaurants');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/restaurants');
  };

  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-pink-50 dark:from-primary/10 dark:to-transparent py-16 md:py-24">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="page-container relative">
          <div className="max-w-2xl animate-fade-in">
            {/* Location bar */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <MapPin size={14} />
              İstanbul, Kadıköy
              <ChevronRight size={14} />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-textColor-light dark:text-textColor-dark leading-tight mb-4">
              Lezzetin en hızlı{' '}
              <span className="gradient-text">yolu</span>{' '}
              kapına kadar 🚀
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Yüzlerce restorandan dilediğini seç, 30 dakikada teslim edelim.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Restoran veya yemek ara..."
                  className="input pl-11 h-14 text-base shadow-sm"
                  readOnly
                  onClick={() => navigate('/restaurants')}
                />
              </div>
              <button type="submit" className="btn-primary h-14 px-6 text-base">
                Ara
              </button>
            </form>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { icon: <UtensilsCrossed size={16} />, label: `${restaurants.length}+ Restoran` },
                { icon: <Zap size={16} />, label: '20 dk Teslimat' },
                { icon: <Star size={16} />, label: '4.8 Ortalama Puan' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <span className="text-primary">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-10 space-y-14">
        {/* Campaign Banners */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2"><Tag size={22} className="text-primary" /> Aktif Kampanyalar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BANNERS.map((b, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${b.color} p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-lg`}
              >
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">{b.icon}</div>
                <p className="text-xs font-semibold opacity-80 mb-1">Kupon Kodu</p>
                <p className="text-2xl font-bold mb-1">{b.code}</p>
                <p className="text-sm opacity-90">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="section-title mb-4">Mutfak Türleri</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:scale-[1.04] shrink-0 shadow-card group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{getCuisineIcon(cat)}</span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">{cat}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Top Rated Restaurants */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title flex items-center gap-2">
              <Star size={22} className="text-warning fill-warning" /> En Çok Sevilen Restoranlar
            </h2>
            <Link to="/restaurants" className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
              Tümünü Gör <ArrowRight size={16} />
            </Link>
          </div>

          {status === 'loading' && <LoadingSpinner />}
          {status === 'failed'  && (
            <div className="card p-8 text-center">
              <p className="text-gray-500">Restoranlar yüklenemedi. JSON Server çalışıyor mu?</p>
              <button onClick={() => dispatch(fetchRestaurants())} className="btn-primary mt-4">Tekrar Dene</button>
            </div>
          )}
          {status === 'succeeded' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {topRated.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </section>

        {/* All Restaurants */}
        {status === 'succeeded' && restaurants.length > 4 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Tüm Restoranlar</h2>
              <Link to="/restaurants" className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                Filtrele <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
