import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import MainLayout from '../components/layout/MainLayout';
import { CreditCard, Banknote, MapPin, ShieldCheck, CheckCircle2, User, Lock, Eye, EyeOff } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'online_credit_card', label: 'Online Kredi/Banka Kartı', icon: <CreditCard size={18} />, desc: 'Güvenli 3D ödeme' },
  { id: 'door_credit_card',   label: 'Kapıda Kredi Kartı',       icon: <CreditCard size={18} />, desc: 'Kapıda POS cihazı' },
  { id: 'door_cash',          label: 'Kapıda Nakit',              icon: <Banknote   size={18} />, desc: 'Para üstü hazırlayın' },
];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, restaurantId, restaurantName, totalAmount, appliedCoupon, discount } = useSelector((s) => s.cart);
  const { status: orderStatus } = useSelector((s) => s.order);
  const isGuest = !user;

  const [paymentMethod, setPaymentMethod] = useState('online_credit_card');
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [note, setNote] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  // Guest form
  const [guestForm, setGuestForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  // Card info (for ALL users when online payment selected)
  const [cardForm, setCardForm] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // User address
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      setSelectedAddress(user.addresses[0].id);
    }
  }, [user]);

  const address = user?.addresses?.find((a) => a.id === selectedAddress);

  const deliveryFee = totalAmount > 0 ? 15 : 0;
  const grandTotal = Math.max(0, totalAmount + deliveryFee - discount);

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (val) => {
    let cleaned = val.replace(/\s/g, '').replace(/\D/g, '');
    cleaned = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return cleaned.substring(0, 19);
  };

  const formatExpiry = (val) => {
    let cleaned = val.replace(/\D/g, '');
    if (cleaned.length >= 2) cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    return cleaned;
  };

  const validateForm = () => {
    if (isGuest) {
      if (!guestForm.firstName.trim() || !guestForm.lastName.trim()) {
        toast.error('Lütfen adınızı ve soyadınızı giriniz'); return false;
      }
      if (!guestForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestForm.email)) {
        toast.error('Lütfen geçerli bir e-posta adresi giriniz'); return false;
      }
      if (!guestForm.phone.trim() || guestForm.phone.replace(/\D/g, '').length < 10) {
        toast.error('Lütfen geçerli bir telefon numarası giriniz'); return false;
      }
      if (!guestForm.address.trim()) {
        toast.error('Lütfen teslimat adresinizi giriniz'); return false;
      }
    } else {
      if (!selectedAddress) {
        toast.error('Lütfen teslimat adresi seçiniz'); return false;
      }
    }

    if (paymentMethod === 'online_credit_card') {
      if (!cardForm.cardHolder.trim()) {
        toast.error('Lütfen kart sahibinin adını giriniz'); return false;
      }
      if (cardForm.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Kart numarası 16 haneli olmalıdır'); return false;
      }
      if (!cardForm.expiry || cardForm.expiry.length !== 5) {
        toast.error('Lütfen geçerli bir son kullanma tarihi giriniz (AA/YY)'); return false;
      }
      const [mm] = cardForm.expiry.split('/');
      const month = parseInt(mm, 10);
      if (month < 1 || month > 12) {
        toast.error('Geçersiz ay. 01-12 arasında olmalıdır'); return false;
      }
      if (cardForm.cvv.length !== 3) {
        toast.error('CVV 3 haneli olmalıdır'); return false;
      }
    }

    if (!agreed) {
      toast.error('Lütfen sözleşmeyi kabul ediniz'); return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const result = await dispatch(createOrder({
      customerId: isGuest ? null : user.id,
      guestInfo: isGuest ? {
        firstName: guestForm.firstName,
        lastName: guestForm.lastName,
        email: guestForm.email,
        phone: guestForm.phone,
      } : null,
      restaurantId,
      restaurantName,
      items: items.map((i) => ({ menuId: i.menuId, name: i.name, quantity: i.quantity, selectedOptions: i.selectedOptions || [], price: i.price })),
      financials: { subTotal: totalAmount, deliveryFee, discount, totalAmount: grandTotal },
      paymentMethod,
      address: isGuest ? guestForm.address : address?.detail || '',
      customerNote: note,
      couponCode: appliedCoupon?.code || null,
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart());
      setSuccess(true);
      setTimeout(() => navigate(isGuest ? '/' : '/orders'), 3000);
    }
  };

  if (success) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in px-4">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6 animate-bounce-sm">
            <CheckCircle2 size={48} className="text-success" />
          </div>
          <h2 className="text-3xl font-bold text-textColor-light dark:text-textColor-dark mb-3">Siparişiniz alındı! 🎉</h2>
          <p className="text-gray-500 mb-2">Restoran siparişinizi onaylayacak.</p>
          {isGuest && <p className="text-sm text-gray-400 mb-6">Sipariş takibi için e-posta adresinizi kontrol edin.</p>}
          {!isGuest && <p className="text-gray-400 mb-6">Siparişlerim sayfasına yönlendiriliyorsunuz...</p>}
          <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '100%', transition: 'width 3s linear', animation: 'progress 3s linear' }} />
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
        <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6 flex items-center gap-2">
          <ShieldCheck size={24} className="text-primary" /> Ödeme
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">

            {/* Guest: Kişisel Bilgiler */}
            {isGuest && (
              <div className="card p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-textColor-light dark:text-textColor-dark">
                  <User size={18} className="text-primary" /> Kişisel Bilgiler
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="label">Ad *</label>
                    <input name="firstName" className="input" value={guestForm.firstName} onChange={handleGuestChange} placeholder="Adınız" />
                  </div>
                  <div>
                    <label className="label">Soyad *</label>
                    <input name="lastName" className="input" value={guestForm.lastName} onChange={handleGuestChange} placeholder="Soyadınız" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">E-posta *</label>
                    <input type="email" name="email" className="input" value={guestForm.email} onChange={handleGuestChange} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="label">Telefon *</label>
                    <input type="tel" name="phone" className="input" value={guestForm.phone} onChange={handleGuestChange} placeholder="05XXXXXXXXX" />
                  </div>
                </div>
              </div>
            )}

            {/* Teslimat Adresi */}
            {isGuest ? (
              <div className="card p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-textColor-light dark:text-textColor-dark">
                  <MapPin size={18} className="text-primary" /> Teslimat Adresi *
                </h3>
                <textarea
                  name="address"
                  rows={3}
                  className="input resize-none"
                  value={guestForm.address}
                  onChange={handleGuestChange}
                  placeholder="Mahalle, sokak adı, bina no, daire no, ilçe, şehir..."
                />
              </div>
            ) : (
              <div className="card p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-textColor-light dark:text-textColor-dark">
                  <MapPin size={18} className="text-primary" /> Teslimat Adresi
                </h3>
                {user?.addresses?.length > 0 ? (
                  <div className="space-y-2">
                    {user.addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddress === addr.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-0.5 accent-primary"
                        />
                        <div>
                          <p className="text-sm font-semibold text-textColor-light dark:text-textColor-dark">{addr.title}</p>
                          <p className="text-xs text-gray-400">{addr.detail}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Kayıtlı adresiniz yok. Lütfen profil sayfanızdan adres ekleyin.</p>
                )}
              </div>
            )}

            {/* Ödeme Yöntemi */}
            <div className="card p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-textColor-light dark:text-textColor-dark">
                <CreditCard size={18} className="text-primary" /> Ödeme Yöntemi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="sr-only"
                    />
                    <span className={paymentMethod === pm.id ? 'text-primary' : 'text-gray-400'}>{pm.icon}</span>
                    <span className="text-xs font-semibold text-center text-textColor-light dark:text-textColor-dark">{pm.label}</span>
                    <span className="text-[10px] text-gray-400 text-center">{pm.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kart Bilgileri - Online ödeme seçilince TÜM kullanıcılara göster */}
            {paymentMethod === 'online_credit_card' && (
              <div className="card p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-textColor-light dark:text-textColor-dark">
                  <Lock size={18} className="text-primary" /> Kart Bilgileri
                  <span className="ml-auto flex items-center gap-1 text-xs text-success font-normal">
                    <ShieldCheck size={12} /> 256-bit SSL Güvenli
                  </span>
                </h3>

                {/* Kart Önizleme */}
                <div className="relative h-44 rounded-2xl bg-gradient-to-br from-primary via-primary-600 to-purple-600 p-5 mb-5 overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-12 -translate-x-8" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-8 bg-yellow-400/90 rounded-md" />
                      <div className="text-white/60 font-bold text-xs uppercase tracking-wider">KREDI KARTI</div>
                    </div>
                    <div>
                      <p className="text-white font-mono text-lg tracking-[0.2em] mb-2">
                        {cardForm.cardNumber
                          ? cardForm.cardNumber.padEnd(19, '●').replace(/(.{4})/g, '$1 ').trim()
                          : '●●●● ●●●● ●●●● ●●●●'}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-white/60 text-[10px] uppercase mb-0.5">Kart Sahibi</p>
                          <p className="text-white text-sm font-semibold uppercase tracking-wide">
                            {cardForm.cardHolder || 'AD SOYAD'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-[10px] uppercase mb-0.5">Son Kul.</p>
                          <p className="text-white text-sm font-mono">{cardForm.expiry || 'AA/YY'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Kart Sahibinin Adı Soyadı *</label>
                    <input
                      name="cardHolder"
                      className="input uppercase"
                      value={cardForm.cardHolder}
                      onChange={handleCardChange}
                      placeholder="AD SOYAD"
                      autoComplete="cc-name"
                    />
                  </div>
                  <div>
                    <label className="label">Kart Numarası *</label>
                    <div className="relative">
                      <input
                        name="cardNumber"
                        className="input tracking-widest pr-12"
                        value={cardForm.cardNumber}
                        onChange={(e) => setCardForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        autoComplete="cc-number"
                        inputMode="numeric"
                      />
                      <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Son Kullanma Tarihi *</label>
                      <input
                        name="expiry"
                        className="input"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                        placeholder="AA/YY"
                        maxLength="5"
                        autoComplete="cc-exp"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="label">CVV *</label>
                      <div className="relative">
                        <input
                          name="cvv"
                          type={showCvv ? 'text' : 'password'}
                          className="input pr-10"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                          placeholder="●●●"
                          maxLength="3"
                          autoComplete="cc-csc"
                          inputMode="numeric"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Kartın arkasındaki 3 haneli kod</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sipariş Notu */}
            <div className="card p-5">
              <label className="font-semibold text-sm text-textColor-light dark:text-textColor-dark mb-2 block">
                Sipariş Notu <span className="text-gray-400 font-normal">(İsteğe Bağlı)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Kapı zili çalışmıyor, lütfen mesaj atın. Ekstra sos isteğim var..."
                rows={2}
                className="input resize-none"
              />
            </div>

            {/* Sözleşme */}
            <label className="flex items-start gap-3 cursor-pointer card p-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary shrink-0"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <a href="#" className="text-primary hover:underline">Mesafeli Satış Sözleşmesi</a>'ni ve{' '}
                <a href="#" className="text-primary hover:underline">Gizlilik Politikası</a>'nı okudum, kabul ediyorum.
                Ödeme bilgilerim güvenli şekilde işlenecektir.
              </p>
            </label>
          </div>

          {/* Right: Sipariş Özeti */}
          <div>
            <div className="card p-5 sticky top-20">
              <h3 className="font-bold mb-4 text-textColor-light dark:text-textColor-dark">Sipariş Özeti</h3>
              <p className="text-xs text-gray-400 mb-3">{restaurantName}</p>
              <div className="space-y-2 mb-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex-1 pr-2">
                      <span className="text-gray-700 dark:text-gray-300">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                      {item.selectedOptions?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.selectedOptions.join(', ')}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t dark:border-gray-800 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ara Toplam</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Teslimat</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>İndirim ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t dark:border-gray-800">
                <span className="font-bold text-textColor-light dark:text-textColor-dark">Toplam</span>
                <span className="text-xl font-bold gradient-text">{formatPrice(grandTotal)}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!agreed || orderStatus === 'loading'}
                className="btn-primary w-full justify-center mt-5 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderStatus === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    İşleniyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={18} />
                    {paymentMethod === 'online_credit_card' ? 'Güvenli Ödeme Yap' : 'Siparişi Onayla'}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 justify-center mt-3">
                <ShieldCheck size={12} className="text-success" />
                <p className="text-xs text-gray-400">256-bit SSL ile şifrelenmiş güvenli bağlantı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
