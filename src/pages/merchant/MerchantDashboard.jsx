import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMerchantOrders } from '../../store/slices/orderSlice';
import { fetchRestaurantDetails } from '../../store/slices/restaurantSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MerchantLayout from './MerchantLayout';
import { ShoppingBag, TrendingUp, Star, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { formatPrice, formatDateTime, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const MerchantDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: orders, status } = useSelector((s) => s.order);
  const { currentRestaurant: restaurant } = useSelector((s) => s.restaurant);

  useEffect(() => {
    if (user?.restaurantId) {
      dispatch(fetchMerchantOrders(user.restaurantId));
      dispatch(fetchRestaurantDetails(user.restaurantId));
    }
  }, [user?.restaurantId, dispatch]);

  const activeOrders     = orders.filter((o) => ['received', 'preparing'].includes(o.status));
  const todayOrders      = orders.filter((o) => new Date(o.orderDate).toDateString() === new Date().toDateString());
  const todayRevenue     = todayOrders.reduce((s, o) => s + o.financials.totalAmount, 0);

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark">
              {restaurant?.name || 'Dashboard'} 🍽️
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {restaurant?.isOpen ? '🟢 Restoranınız şu an açık' : '🔴 Restoranınız kapalı'}
            </p>
          </div>
          <Link to="/merchant/orders" className="btn-primary">
            Siparişler <ArrowRight size={16} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<ShoppingBag size={22} className="text-primary" />}    label="Aktif Sipariş"     value={activeOrders.length}          color="bg-primary/10"  />
          <StatCard icon={<TrendingUp  size={22} className="text-success" />}    label="Bugün Ciro"        value={formatPrice(todayRevenue)}     color="bg-success/10"  sub={`${todayOrders.length} sipariş`} />
          <StatCard icon={<Star        size={22} className="text-warning" />}    label="Genel Puan"        value={restaurant?.rating?.toFixed(1) || '-'} color="bg-warning/10" sub={`${restaurant?.reviewCount || 0} yorum`} />
          <StatCard icon={<Clock       size={22} className="text-blue-500" />}   label="Ort. Teslimat"     value={restaurant?.deliveryTime || '-'}      color="bg-blue-100 dark:bg-blue-900/20" />
        </div>

        {/* Active Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-textColor-light dark:text-textColor-dark">Bekleyen Siparişler</h2>
            <Link to="/merchant/orders" className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all">
              Tümü <ChevronRight size={14} />
            </Link>
          </div>
          {status === 'loading' && <LoadingSpinner />}
          {activeOrders.length === 0 && status !== 'loading' && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm">Bekleyen sipariş yok!</p>
            </div>
          )}
          <div className="space-y-3">
            {activeOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-textColor-light dark:text-textColor-dark">#{order.id.slice(-6)}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(order.orderDate)} · {order.items.length} ürün</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary text-sm">{formatPrice(order.financials.totalAmount)}</span>
                  <span className={`status-pill ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        {restaurant?.scores && (
          <div className="card p-5">
            <h2 className="font-bold text-textColor-light dark:text-textColor-dark mb-4">Puan Kırılımı</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '🚀 Hız',    val: restaurant.scores.speed },
                { label: '💁 Servis', val: restaurant.scores.service },
                { label: '😋 Lezzet', val: restaurant.scores.flavor },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{s.val}</div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(s.val / 5) * 100}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
};

export default MerchantDashboard;
