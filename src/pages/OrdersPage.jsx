import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '../store/slices/orderSlice';
import { addReview } from '../store/slices/reviewSlice';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { CheckCircle2, Clock, Truck, Package, Star } from 'lucide-react';
import { formatPrice, formatDateTime, getOrderStatusLabel, getOrderStatusColor } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['received', 'preparing', 'on_the_way', 'delivered'];
const STEP_ICONS = {
  received:   <Package   size={16} />,
  preparing:  <Clock     size={16} />,
  on_the_way: <Truck     size={16} />,
  delivered:  <CheckCircle2 size={16} />,
};

const OrderStatusBar = ({ status }) => {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-4">
      {STATUS_STEPS.map((step, idx) => (
        <div key={step} className="flex items-center flex-1">
          <div className={`flex flex-col items-center gap-1 ${idx <= currentIdx ? 'text-primary' : 'text-gray-300 dark:text-gray-700'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
              idx < currentIdx  ? 'bg-primary border-primary text-white' :
              idx === currentIdx ? 'bg-primary/10 border-primary text-primary' :
              'bg-transparent border-gray-200 dark:border-gray-700'
            }`}>
              {STEP_ICONS[step]}
            </div>
            <span className="text-[10px] font-medium whitespace-nowrap hidden sm:block">
              {getOrderStatusLabel(step)}
            </span>
          </div>
          {idx < STATUS_STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${idx < currentIdx ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [ratings, setRatings] = useState({ speed: 5, service: 5, flavor: 5 });
  const [comment, setComment] = useState('');

  const handleStar = (category, val) => setRatings((prev) => ({ ...prev, [category]: val }));

  return (
    <Modal isOpen onClose={onClose} title="Siparişi Değerlendir" size="md">
      <div className="space-y-5">
        {['speed', 'service', 'flavor'].map((cat) => {
          const labels = { speed: '🚀 Hız', service: '💁 Servis', flavor: '😋 Lezzet' };
          return (
            <div key={cat}>
              <p className="label">{labels[cat]}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => handleStar(cat, v)}
                    className={`text-2xl transition-transform hover:scale-110 ${v <= ratings[cat] ? 'text-warning' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div>
          <label className="label">Yorumunuz</label>
          <textarea
            rows={3} placeholder="Lezzetli miydi? Teslimat hızlı mıydı?" className="input resize-none"
            value={comment} onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          onClick={() => onSubmit({ ratings, comment, customerId: order.customerId, orderId: order.id })}
          className="btn-primary w-full justify-center"
        >
          Değerlendirmeyi Gönder
        </button>
      </div>
    </Modal>
  );
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: orders, status } = useSelector((s) => s.order);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [tab, setTab] = useState('active');
  const [reviewedIds, setReviewedIds] = useState(new Set());

  useEffect(() => {
    if (user?.id) dispatch(fetchCustomerOrders(user.id));
  }, [user?.id, dispatch]);

  const activeOrders    = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter((o) =>  ['delivered', 'cancelled'].includes(o.status));

  const handleReviewSubmit = async (reviewData) => {
    const result = await dispatch(addReview({ restaurantId: reviewOrder.restaurantId, reviewData }));
    if (result.meta.requestStatus === 'fulfilled') {
      // Siparişi DB'de reviewed: true olarak işaretle
      try {
        await import('axios').then(({ default: axios }) =>
          axios.patch(`http://localhost:5000/orders/${reviewOrder.id}`, { reviewed: true })
        );
      } catch (_) { /* sessizce geç */ }
      setReviewedIds(prev => new Set([...prev, reviewOrder.id]));
      toast.success('Değerlendirmeniz gönderildi! Teşekkür ederiz ♥️');
    } else {
      toast.error('Değerlendirme gönderilirken hata oluştu');
    }
    setReviewOrder(null);
  };

  return (
    <MainLayout>
      <div className="page-container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6">Siparişlerim</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-gray-800">
          {[
            { key: 'active',    label: `Aktif (${activeOrders.length})` },
            { key: 'completed', label: `Geçmiş (${completedOrders.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 font-semibold text-sm border-b-2 -mb-px transition-all ${
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {status === 'loading' && <LoadingSpinner />}
        {status === 'succeeded' && (
          <div className="space-y-4 animate-fade-in">
            {(tab === 'active' ? activeOrders : completedOrders).map((order) => (
              <div key={order.id} className="card p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-sm text-textColor-light dark:text-textColor-dark">#{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(order.orderDate)}</p>
                  </div>
                  <span className={`status-pill ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-xs text-gray-500 dark:text-gray-400">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                </div>

                {/* Financial */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                  <span className="text-xs text-gray-400">{order.items.length} ürün · {order.address}</span>
                  <span className="font-bold text-primary">{formatPrice(order.financials.totalAmount)}</span>
                </div>

                {/* Status Bar for active orders */}
                {!['delivered', 'cancelled'].includes(order.status) && (
                  <OrderStatusBar status={order.status} />
                )}

                {/* Review Button - sadece teslim edilmiş ve henüz değerlendirilmemiş siparişler */}
                {order.status === 'delivered' && !reviewedIds.has(order.id) && !order.reviewed && (
                  <button
                    onClick={() => setReviewOrder(order)}
                    className="btn-secondary w-full justify-center mt-4 text-sm"
                  >
                    <Star size={16} className="text-warning" /> Değerlendir
                  </button>
                )}
                {(order.status === 'delivered' && (reviewedIds.has(order.id) || order.reviewed)) && (
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-success font-medium">
                    <CheckCircle2 size={14} /> Değerlendirme yapıldı
                  </div>
                )}
              </div>
            ))}
            {(tab === 'active' ? activeOrders : completedOrders).length === 0 && (
              <div className="card p-12 text-center">
                <p className="text-4xl mb-4">{tab === 'active' ? '📭' : '📋'}</p>
                <p className="text-gray-400">{tab === 'active' ? 'Aktif siparişiniz yok' : 'Geçmiş sipariş bulunamadı'}</p>
              </div>
            )}
          </div>
        )}

        {reviewOrder && (
          <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} onSubmit={handleReviewSubmit} />
        )}
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
