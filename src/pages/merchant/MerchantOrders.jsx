import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMerchantOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import MerchantLayout from './MerchantLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Check, X, ChevronRight, Clock } from 'lucide-react';
import { formatPrice, formatDateTime, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const TABS = [
  { key: 'received',   label: 'Gelen Siparişler' },
  { key: 'preparing',  label: 'Hazırlanıyor' },
  { key: 'on_the_way', label: 'Kuryede' },
  { key: 'done',       label: 'Tamamlananlar' },
];

const MerchantOrders = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: orders, status } = useSelector((s) => s.order);
  const [tab, setTab] = useState('received');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user?.restaurantId) dispatch(fetchMerchantOrders(user.restaurantId));
  }, [user?.restaurantId, dispatch]);

  const getTabOrders = (key) => {
    if (key === 'done') return orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));
    return orders.filter((o) => o.status === key);
  };

  const handleStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  return (
    <MerchantLayout>
      <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6">Siparişler</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const count = getTabOrders(t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key ? 'bg-primary text-white shadow-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.key ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {status === 'loading' && <LoadingSpinner />}
      <div className="space-y-3">
        {getTabOrders(tab).map((order) => (
          <div key={order.id} className="card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">#{order.id.slice(-4)}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-textColor-light dark:text-textColor-dark">{order.items.length} ürün · {formatPrice(order.financials.totalAmount)}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> {formatDateTime(order.orderDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`status-pill ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                <ChevronRight size={16} className={`text-gray-400 transition-transform ${expanded === order.id ? 'rotate-90' : ''}`} />
              </div>
            </button>

            {expanded === order.id && (
              <div className="px-4 pb-4 border-t border-gray-50 dark:border-gray-800 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Order Items */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2">SİPARİŞ İÇERİĞİ</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-textColor-light dark:text-textColor-dark">{item.quantity}x {item.name}</span>
                        <span className="text-gray-400">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    {order.customerNote && (
                      <div className="mt-3 p-2 bg-warning/10 rounded-lg text-xs text-gray-600 dark:text-gray-300">
                        📝 Not: {order.customerNote}
                      </div>
                    )}
                  </div>
                  {/* Delivery & Financials */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2">TESLİMAT</p>
                    <p className="text-sm text-textColor-light dark:text-textColor-dark">{order.address}</p>
                    <div className="mt-3 space-y-1 text-xs text-gray-400">
                      <div className="flex justify-between"><span>Ara Toplam:</span><span>{formatPrice(order.financials.subTotal)}</span></div>
                      <div className="flex justify-between"><span>İndirim:</span><span className="text-success">-{formatPrice(order.financials.discount)}</span></div>
                      <div className="flex justify-between font-bold text-primary"><span>Toplam:</span><span>{formatPrice(order.financials.totalAmount)}</span></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
                  {order.status === 'received' && (
                    <>
                      <button onClick={() => handleStatus(order.id, 'preparing')} className="btn-primary flex-1 justify-center py-2 text-sm">
                        <Check size={15} /> Onayla
                      </button>
                      <button onClick={() => handleStatus(order.id, 'cancelled')} className="btn-danger flex-1 justify-center py-2 text-sm">
                        <X size={15} /> Reddet
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => handleStatus(order.id, 'on_the_way')} className="btn-primary flex-1 justify-center py-2 text-sm">
                      🚴 Kuryeye Teslim Et
                    </button>
                  )}
                  {order.status === 'on_the_way' && (
                    <button onClick={() => handleStatus(order.id, 'delivered')} className="btn-primary flex-1 justify-center py-2 text-sm">
                      <Check size={15} /> Teslim Edildi
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {getTabOrders(tab).length === 0 && status !== 'loading' && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400 text-sm">Bu sekmede sipariş yok</p>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
};

export default MerchantOrders;
