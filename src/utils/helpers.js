// Fiyat formatlama
export const formatPrice = (price) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);

// Tarih formatlama
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

// Saat formatlama
export const formatDateTime = (dateStr) =>
  new Date(dateStr).toLocaleString('tr-TR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

// Sipariş durumu Türkçe
export const getOrderStatusLabel = (status) => {
  const map = {
    received:   'Alındı',
    preparing:  'Hazırlanıyor',
    on_the_way: 'Kuryede',
    delivered:  'Teslim Edildi',
    cancelled:  'İptal Edildi',
  };
  return map[status] || status;
};

// Sipariş durumu rengi
export const getOrderStatusColor = (status) => {
  const map = {
    received:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    preparing:  'bg-warning/10 text-warning',
    on_the_way: 'bg-primary/10 text-primary',
    delivered:  'bg-success/10 text-success',
    cancelled:  'bg-danger/10 text-danger',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

// Yıldız render yardımcısı
export const getStarArray = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - 0.5 <= rating) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

// Kart numarasını maskele
export const maskCardNumber = (num) => {
  if (!num) return '';
  return num.replace(/(\d{4})\s?(\d{4})\s?(\d{4})\s?(\d{4})/, '$1 **** **** $4');
};

// Sepet item key üret
export const getCartItemKey = (item) =>
  `${item.menuId}-${JSON.stringify(item.selectedOptions || [])}`;

// Mutfak türü ikonları
export const getCuisineIcon = (cuisine) => {
  const map = {
    'Burger':      '🍔',
    'Pizza':       '🍕',
    'Türk Mutfağı':'🥙',
    'Japon':       '🍱',
    'Vegan':       '🥗',
    'Izgara':      '🥩',
    'Tatlı':       '🍰',
    'Deniz Ürünleri': '🦞',
    'Çin':         '🍜',
    'Meksika':     '🌮',
  };
  return map[cuisine] || '🍽️';
};
