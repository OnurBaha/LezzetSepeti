import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import MainLayout from '../components/layout/MainLayout';
import { CreditCard, Banknote, MapPin, ShieldCheck, CheckCircle2, Plus } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const PAYMENT_METHODS = [
  { id: 'online_credit_card', label: 'Online Kredi Kartı',   icon: <CreditCard size={18} />, desc: 'Güvenli ödeme' },
  { id: 'door_credit_card',   label: 'Kapıda Kredi Kartı',   icon: <CreditCard size={18} />, desc: 'Kapıda POS cihazı' },
  { id: 'door_cash',          label: 'Kapıda Nakit',          icon: <Banknote   size={18} />, desc: 'Para üstü hazırlayın' },
];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, restaurantId, restaurantName, totalAmount, appliedCoupon, discount } = useSelector((s) => s.cart);
  const { status: orderStatus } = useSelector((s) => s.order);

  const [paymentMethod, setPaymentMethod] = useState('online_credit_card');
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0]?.id || '');
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [note, setNote] = useState('');

  const deliveryFee = totalAmount > 0 ? 15 : 0;
  const grandTotal  = Math.max(0, totalAmount + deliveryFee - discount);
  const address     = user?.addresses?.find((a) => a.id === selectedAddress);

  const handleSubmit = async () => {
    if (!agreed || !selectedAddress) return;
    const result = await dispatch(createOrder({
      customerId:    user.id,
      restaurantId,
      items:         items.map((i) => ({ menuId: i.menuId, name: i.name, quantity: i.quantity, selectedOptions: i.selectedOptions || [], price: i.price })),
      financials:    { subTotal: totalAmount, deliveryFee, discount, totalAmount: grandTotal },
      paymentMethod,
      address:       address?.detail || '',
      customerNote:  note,
      couponCode:    appliedCoupon?.code || null,
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart());
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 2500);
    }
  };

  if (success) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in px-4">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-5 animate-bounce-sm">
            <CheckCircle2 size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-2">Siparişiniz alındı! 🎉</h2>
          <p className="text-gray-500 mb-6">Restoran siparişinizi onaylamasını bekleyin. Siparişlerim sayfasına yönlendiriliyorsunuz...</p>
          <div className="w-40 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-slide-up" style={{ width: '100%', transition: 'width 2.5s linear' }} />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0) {
    navigate('/cart'); return null;
  }

  return (
    <MainLayout>
      <div className="page-container py-8">
        <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6">Ödeme</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            {/* Address */}
            <div className="card p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-primary" /> Teslimat Adresi</h3>
              <div className="space-y-2">
                {user?.addresses?.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-0.5 accent-primary" />
                    <div>
                      <p className="text-sm font-semibold text-textColor-light dark:text-textColor-dark">{addr.title}</p>
                      <p className="text-xs text-gray-400">{addr.detail}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                <label className="label mt-4">Kapı Notu (İsteğe Bağlı)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Kapı zili çalışmıyor, lütfen mesaj atın..." rows={2} className="input resize-none" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><CreditCard size={18} className="text-primary" /> Ödeme Yöntemi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label key={pm.id} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'}`}>
                    <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="sr-only" />
                    <span className={paymentMethod === pm.id ? 'text-primary' : 'text-gray-400'}>{pm.icon}</span>
                    <span className="text-xs font-semibold text-center text-textColor-light dark:text-textColor-dark">{pm.label}</span>
                    <span className="text-[10px] text-gray-400 text-center">{pm.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer card p-4">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <a href="#" className="text-primary hover:underline">Mesafeli Satış Sözleşmesi</a>'ni okudum ve kabul ediyorum. Ödeme bilgilerim güvenli şekilde işlenecektir.
              </p>
            </label>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="card p-5 sticky top-20">
              <h3 className="font-bold mb-4">Sipariş Özeti</h3>
              <div className="space-y-2 mb-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate pr-2">{item.name} x{item.quantity}</span>
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="divider pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Teslimat</span><span>{formatPrice(deliveryFee)}</span></div>
                {discount > 0 && <div className="flex justify-between text-success"><span>İndirim</span><span>-{formatPrice(discount)}</span></div>}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="font-bold">Toplam</span>
                <span className="text-xl font-bold gradient-text">{formatPrice(grandTotal)}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!agreed || !selectedAddress || orderStatus === 'loading'}
                className="btn-primary w-full justify-center mt-5 h-12 text-base"
              >
                {orderStatus === 'loading' ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />İşleniyor...</span>
                ) : (
                  <span className="flex items-center gap-2"><ShieldCheck size={18} />Ödemeyi Onayla</span>
                )}
              </button>
              <div className="flex items-center gap-2 justify-center mt-3">
                <ShieldCheck size={12} className="text-success" />
                <p className="text-xs text-gray-400">256-bit SSL ile güvenli ödeme</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
