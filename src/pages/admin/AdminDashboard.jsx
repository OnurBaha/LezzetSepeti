import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../../store/slices/restaurantSlice';
import { fetchAllOrders } from '../../store/slices/orderSlice';
import AdminLayout from './AdminLayout';
import { UtensilsCrossed, ShoppingBag, Users, TrendingUp, Activity } from 'lucide-react';
import { formatPrice, formatDateTime, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';

const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
      {trend && <span className="badge badge-success text-[10px]">↑ {trend}</span>}
    </div>
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <p className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mt-1">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items: restaurants } = useSelector((s) => s.restaurant);
  const { items: orders } = useSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalRevenue  = orders.reduce((s, o) => s + o.financials.totalAmount, 0);
  const activeOrders  = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const openRestaurants = restaurants.filter((r) => r.isOpen).length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 8);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark">Sistem Dashboard 🔧</h1>
          <p className="text-gray-400 text-sm mt-1">Platforma genel bakış</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<UtensilsCrossed size={20} className="text-primary" />}   label="Toplam Restoran"     value={restaurants.length}          color="bg-primary/10"  trend={`${openRestaurants} açık`} />
          <StatCard icon={<ShoppingBag    size={20} className="text-warning" />}    label="Aktif Sipariş"       value={activeOrders.length}         color="bg-warning/10"  />
          <StatCard icon={<TrendingUp     size={20} className="text-success" />}    label="Toplam Ciro"         value={formatPrice(totalRevenue)}   color="bg-success/10"  trend="Bu ay" />
          <StatCard icon={<Users          size={20} className="text-blue-500" />}   label="Toplam Sipariş"      value={orders.length}               color="bg-blue-100 dark:bg-blue-900/20" />
        </div>

        {/* Revenue by restaurant */}
        <div className="card p-5">
          <h2 className="font-bold text-textColor-light dark:text-textColor-dark mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Restoran Ciro Sıralaması
          </h2>
          <div className="space-y-3">
            {[...restaurants]
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .map((r, idx) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  idx === 0 ? 'bg-warning' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-textColor-light dark:text-textColor-dark">{r.name}</span>
                    <span className="font-bold text-primary">{formatPrice(r.totalRevenue)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-pink-400 rounded-full transition-all duration-700"
                      style={{ width: `${(r.totalRevenue / (restaurants[0]?.totalRevenue || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card p-5">
          <h2 className="font-bold text-textColor-light dark:text-textColor-dark mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary" /> Son Siparişler
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2 text-xs text-gray-400 font-semibold">SİPARİŞ</th>
                  <th className="text-left py-2 text-xs text-gray-400 font-semibold">TARİH</th>
                  <th className="text-left py-2 text-xs text-gray-400 font-semibold">TUTAR</th>
                  <th className="text-left py-2 text-xs text-gray-400 font-semibold">DURUM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 font-medium text-textColor-light dark:text-textColor-dark">#{o.id.slice(-6)}</td>
                    <td className="py-3 text-gray-400">{formatDateTime(o.orderDate)}</td>
                    <td className="py-3 font-bold text-primary">{formatPrice(o.financials.totalAmount)}</td>
                    <td className="py-3"><span className={`status-pill ${getOrderStatusColor(o.status)}`}>{getOrderStatusLabel(o.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
