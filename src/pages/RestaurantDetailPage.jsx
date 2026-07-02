import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetails } from '../store/slices/restaurantSlice';
import { addToCart } from '../store/slices/cartSlice';
import { fetchRestaurantReviews } from '../store/slices/reviewSlice';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import StarRating from '../components/common/StarRating';
import { Clock, MapPin, ShoppingBag, Plus, Minus, Star, MessageSquare, Zap, ChevronDown, ChevronUp, Info, Check } from 'lucide-react';
import { formatPrice, getCuisineIcon, formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const MenuItemCard = ({ item, onAdd }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`card p-4 transition-all duration-200 ${!item.inStock ? 'opacity-50' : 'hover:shadow-md'}`}>
      <div className="flex gap-4">
        {item.image && (
          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-textColor-light dark:text-textColor-dark line-clamp-1">{item.name}</h4>
            {!item.inStock && <span className="badge badge-danger shrink-0">Tükendi</span>}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          {item.options?.length > 0 && (
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-primary mt-1 font-medium">
              <Info size={12} /> Seçenekler {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
          {expanded && item.options?.map((opt) => (
            <div key={opt.id} className="mt-2 pl-2 border-l-2 border-primary/30">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{opt.title}{opt.required && ' *'}</p>
              <p className="text-xs text-gray-400">{opt.items.join(', ')}</p>
            </div>
          ))}
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-primary">{formatPrice(item.price)}</span>
            <button
              onClick={() => onAdd(item)}
              disabled={!item.inStock}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-primary"
            >
              <Plus size={14} /> Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentRestaurant: restaurant, currentMenus: menus, detailStatus } = useSelector((s) => s.restaurant);
  const { items: reviews } = useSelector((s) => s.review);
  const [activeTab, setActiveTab] = useState('menu');
  const [addedItem, setAddedItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurantDetails(id));
    dispatch(fetchRestaurantReviews(id));
  }, [id, dispatch]);

  const categories = [...new Set(menus.map((m) => m.category))];

  const handleAddToCart = (item) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(addToCart({ item: { menuId: item.id, name: item.name, price: item.price, image: item.image, selectedOptions: [] }, restaurantId: id, restaurantName: restaurant?.name }));
    setAddedItem(item.name);
    setTimeout(() => setAddedItem(null), 2000);
  };

  if (detailStatus === 'loading') return <MainLayout><LoadingSpinner text="Restoran yükleniyor..." /></MainLayout>;
  if (!restaurant) return <MainLayout><div className="page-container py-20 text-center text-gray-500">Restoran bulunamadı.</div></MainLayout>;

  const avgScore = ((restaurant.scores?.speed || 0) + (restaurant.scores?.service || 0) + (restaurant.scores?.flavor || 0)) / 3;

  return (
    <MainLayout>
      {/* Added to cart toast */}
      {addedItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-success text-white rounded-2xl shadow-lg animate-slide-up font-semibold">
          <Check size={18} /> "{addedItem}" sepete eklendi!
        </div>
      )}

      {/* Cover */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img src={restaurant.coverImage || restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 page-container pb-4">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl shrink-0">
              {getCuisineIcon(restaurant.cuisine)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className={`badge text-xs font-bold px-2.5 py-1 ${restaurant.isOpen ? 'bg-success text-white' : 'bg-gray-500 text-white'}`}>
                  {restaurant.isOpen ? '● Açık' : '● Kapalı'}
                </span>
                <span className="text-white/80 text-sm flex items-center gap-1"><Clock size={13} /> {restaurant.deliveryTime}</span>
                <span className="text-white/80 text-sm flex items-center gap-1"><MapPin size={13} /> {restaurant.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT: Menu + Reviews */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800">
              {['menu', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 font-semibold text-sm border-b-2 transition-all -mb-px ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-primary'
                  }`}
                >
                  {tab === 'menu' ? '🍽️ Menü' : `💬 Değerlendirmeler (${reviews.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'menu' && (
              <div className="space-y-8">
                {categories.map((cat) => (
                  <div key={cat}>
                    <h3 className="font-bold text-lg text-textColor-light dark:text-textColor-dark mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-primary rounded-full" />
                      {cat}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {menus.filter((m) => m.category === cat).map((item) => (
                        <MenuItemCard key={item.id} item={item} onAdd={handleAddToCart} />
                      ))}
                    </div>
                  </div>
                ))}
                {menus.length === 0 && (
                  <div className="card p-10 text-center text-gray-400">Henüz menü eklenmemiş.</div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 && (
                  <div className="card p-10 text-center"><p className="text-gray-400">Henüz değerlendirme yok.</p></div>
                )}
                {reviews.map((rev) => (
                  <div key={rev.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                          {rev.customerId?.charAt(rev.customerId.length - 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-textColor-light dark:text-textColor-dark">Müşteri</p>
                          <p className="text-xs text-gray-400">{formatDate(rev.createdAt)}</p>
                        </div>
                      </div>
                      <StarRating rating={rev.averageRating} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{rev.comment}</p>
                    <div className="flex gap-4 mt-3 text-xs text-gray-400">
                      <span>Hız: ⭐ {rev.ratings.speed}</span>
                      <span>Servis: ⭐ {rev.ratings.service}</span>
                      <span>Lezzet: ⭐ {rev.ratings.flavor}</span>
                    </div>
                    {rev.merchantReply && (
                      <div className="mt-3 pl-4 border-l-2 border-primary/30 bg-primary/5 rounded-r-xl py-2 pr-3">
                        <p className="text-xs font-semibold text-primary mb-1">🍽️ Restoran Yanıtı</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{rev.merchantReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info Card */}
          <div className="space-y-4">
            <div className="card p-5 sticky top-20">
              <h3 className="font-bold mb-4 text-textColor-light dark:text-textColor-dark">Restoran Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Clock size={14} /> Teslimat Süresi</span>
                  <span className="font-semibold">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><Zap size={14} /> Teslimat Ücreti</span>
                  <span className="font-semibold">{restaurant.deliveryFee === 0 ? 'Ücretsiz' : `${restaurant.deliveryFee}₺`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-2"><ShoppingBag size={14} /> Min. Sipariş</span>
                  <span className="font-semibold">{restaurant.minOrderAmount}₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Çalışma Saati</span>
                  <span className="font-semibold">{restaurant.workingHours?.open} - {restaurant.workingHours?.close}</span>
                </div>
              </div>

              <div className="divider mt-4 pt-4">
                <p className="text-xs font-semibold text-gray-400 mb-3">Puan Kırılımı</p>
                {[
                  { label: 'Hız',     val: restaurant.scores?.speed   || 0 },
                  { label: 'Servis',  val: restaurant.scores?.service || 0 },
                  { label: 'Lezzet',  val: restaurant.scores?.flavor  || 0 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(s.val / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-primary">{s.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <span className="text-3xl font-bold gradient-text">{avgScore.toFixed(1)}</span>
                <p className="text-xs text-gray-400 mt-1">Genel Puan · {restaurant.reviewCount} yorum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RestaurantDetailPage;
