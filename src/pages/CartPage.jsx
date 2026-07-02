import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, validateCoupon, removeCoupon, clearCart } from '../store/slices/cartSlice';
import MainLayout from '../components/layout/MainLayout';
import { Minus, Plus, Trash2, Tag, ShoppingCart, ArrowRight, X, Info } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, restaurantName, totalAmount, appliedCoupon, discount, couponStatus, couponError } = useSelector((s) => s.cart);
  const [couponCode, setCouponCode] = useState('');

  const deliveryFee = totalAmount > 0 ? 15 : 0;
  const grandTotal  = Math.max(0, totalAmount + deliveryFee - discount);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    dispatch(validateCoupon({ code: couponCode.toUpperCase(), restaurantId: items[0]?.restaurantId, subTotal: totalAmount }));
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="page-container py-20 text-center animate-fade-in">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-2">Sepetiniz boş</h2>
          <p className="text-gray-400 mb-8">Lezzetli yemekler sizi bekliyor!</p>
          <Link to="/restaurants" className="btn-primary">Restoranları Keşfet</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container py-8">
        <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6 flex items-center gap-2">
          <ShoppingCart size={24} className="text-primary" /> Sepetim
          <span className="badge badge-primary ml-2">{restaurantName}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="card p-4 flex gap-4 animate-fade-in">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-textColor-light dark:text-textColor-dark line-clamp-1">{item.name}</h4>
                    <button
                      onClick={() => dispatch(removeFromCart(idx))}
                      className="p-1 rounded-lg text-gray-300 hover:text-danger hover:bg-danger/10 transition-all shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {item.selectedOptions?.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.selectedOptions.join(', ')}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ index: idx, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ index: idx, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="card p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-textColor-light dark:text-textColor-dark">
                <Tag size={18} className="text-primary" /> İndirim / Kupon Kodu
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-4 py-3 bg-success/10 border border-success/20 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-success">{appliedCoupon.code}</p>
                    <p className="text-xs text-gray-400">{formatPrice(discount)} indirim uygulandı</p>
                  </div>
                  <button onClick={() => { dispatch(removeCoupon()); setCouponCode(''); }} className="text-gray-400 hover:text-danger transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="KUPON KODUNU GİR" className="input flex-1 uppercase"
                    value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button onClick={handleApplyCoupon} disabled={couponStatus === 'loading'} className="btn-primary px-4 shrink-0">
                    {couponStatus === 'loading' ? '...' : 'Uygula'}
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-danger mt-2">{couponError}</p>}
              <p className="text-xs text-gray-400 mt-2">Deneyebilirsiniz: LEZZET20, ILKSIPARIM, BURGER15</p>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="card p-5 sticky top-20">
              <h3 className="font-bold mb-4 text-textColor-light dark:text-textColor-dark">Sipariş Özeti</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ara Toplam</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teslimat Ücreti</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>İndirim ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>
              <div className="divider mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-textColor-light dark:text-textColor-dark">Toplam</span>
                <span className="text-xl font-bold gradient-text">{formatPrice(grandTotal)}</span>
              </div>
              {/* Guest info banner */}
              {!user && (
                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
                  <Info size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary">Misafir olarak sipariş verebilirsiniz</p>
                    <p className="text-gray-500 text-xs mt-0.5">Ödeme sayfasında iletişim ve adres bilgilerinizi girerek giriş yapmadan sipariş verebilirsiniz.</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full justify-center mt-5 h-12 text-base"
              >
                Ödemeye Geç <ArrowRight size={18} />
              </button>
              <button onClick={() => dispatch(clearCart())} className="btn-ghost w-full justify-center mt-2 text-danger hover:bg-danger/10 text-sm">
                <Trash2 size={14} /> Sepeti Temizle
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
