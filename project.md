# Proje Başlatma Rehberi (React + Vite + Tailwind + JSON Server + Redux Toolkit)

---

## 1. Genel Proje Bilgileri
- **Proje Adı:** `LezzetSepeti`
- **Kısa Açıklama:** `Müşteri (Kullanıcı): Kayıt olma, giriş yapma, konum/adres yönetimi, restoran listeleme (filtreleme/sıralama), sepete ürün ekleme/çıkarma, kupon kodu kullanma, sipariş verme, siparişi canlı takip etme, geçmiş siparişleri görme, restoranı değerlendirme (Hız, Servis, Lezzet) ve yorum yapma. Restoran (Şube Yetkilisi): Restoran profili yönetimi (çalışma saatleri, minimum paket tutarı), menü/kategori yönetimi (yemek ekleme, fiyat, içerik, stok durumu), gelen siparişleri onaylama/reddetme, sipariş durumunu güncelleme (Hazırlanıyor, Kuryeye Verildi), ciro ve sipariş raporlarını inceleme.Kurye: Kendine atanan veya havuzdan seçtiği siparişi görme, harita üzerinden teslimat adresine gitme, sipariş durumunu Teslim Edildi olarak güncelleme.Sistem Admini (Süper Admin): Tüm sistemi tek bir panelden yönetme. Restoran/şube ekleme, onaylama veya askıya alma; kupon ve kampanya tanımlama (genel veya restorana özel); kullanıcı, restoran ve kurye şikayetlerini/hesaplarını yönetme; sistem genelindeki finansal raporları görme.`
- **Hedef Kitle:** `Yoğun Çalışan Beyaz Yakalılar: Evde yemek yapmaya vakti olmayan, öğle ve akşam yemeklerinde hızlı, pratik ve düzenli teslimat bekleyen kitle. (Zaman onlar için kritiktir).Öğrenciler ve Genç Yetişkinler: Bütçe odaklı, indirim kuponlarını, "kampanyaları" ve "öğrenci dostu menüleri" sıkı takip eden, gece geç saatlerde sipariş verme eğilimi yüksek kitle.Ev Hanımları / Aileler: Özellikle hafta sonları veya misafir ağırlarken "büyük porsiyonlu menüleri" veya aile boyu paketleri tercih eden, restoran temizliğine ve yorumlarına çok dikkat eden kitle.Dijital Yerliler (Genç Kuşak): Kullanıcı deneyimine (UX) çok önem veren; hantal, yavaş veya ödeme adımı karmaşık olan uygulamaları anında terk eden kitle.Yerel Esnaf ve Butik Restoranlar: Dijitalleşmek isteyen ama kendi kuryesi veya web sitesi olmayan küçük işletmeler. Onlar için uygulamanın kurye desteği sunması ve kullanım kolaylığı kritiktir.Büyük Zincir Restoranlar ve Şubeler: Birden fazla şubesi olan, admin panelinde "rol ve yetkilendirme" (X şubesinin müdürü sadece kendi şubesini görsün) isteyen, entegrasyon kabiliyeti yüksek profesyonel işletmeler.Sadece Paket Servis Yapanlar (Ghost Kitchen): Fiziksel bir restoranı olmayıp, sadece bu tarz uygulamalar üzerinden satış yapan, tamamen dijital odaklı modern mutfaklar. Restoran Kuryeleri: Doğrudan restoranın kendi bünyesinde çalışan ve sadece o restoranın siparişlerini taşıyan kuryeler.Serbest Zamanlı (Freelance / Esnaf) Kuryeler: Havuzdaki siparişlerden kendine uygun olanı seçip paket başına veya saatlik ücretle çalışan, uygulamanın sunduğu kurye aplikasyonunun navigasyon ve kazanç panelinin net olmasına önem veren kitle.`

---

## 2. Tasarım Sistemi ve Görsel Kimlik (Design System)


### Renk Paleti (Harmonious Palette)

- **Primary (Ana Renk - Örn. Marka Kimliği, Butonlar):**
  - HSL: `hsla(335, 100%, 50%, 1.00)` (Canlı Mor / Indigo)
  - Kullanım Alanı: Butonlar, aktif menü elemanları, odaklanılan kartlar.
- **Secondary (İkinci Renk - Örn. Accent, Vurgu):**
  - HSL: `hsla(0, 0%, 100%, 1.00)` (Sıcak Pembe / Fuşya)
  - Kullanım Alanı: Bildirimler, badge'ler, dikkat çekici etiketler.
- **Neutral Background (Arka Plan Renkleri):**
  - Light Mode: `hsl(210, 40%, 98%)` (Çok açık gri-mavi)
  - Dark Mode: `hsl(222, 47%, 11%)` (Koyu lacivert-siyah)
- **Neutral Text (Yazı Renkleri):**
  - Light Mode: `hsl(217, 19%, 27%)` (Koyu Gri)
  - Dark Mode: `hsl(210, 40%, 98%)` (Beyaza yakın)
- **Semantic Colors (Durum Renkleri):**
  - Success (Başarı): `hsl(142, 71%, 45%)` (Zümrüt Yeşili)
  - Warning (Uyarı): `hsl(38, 92%, 50%)` (Amber Sarısı)
  - Error (Hata): `hsl(350, 89%, 60%)` (Gül Kırmızısı)

### Tipografi ve Fontlar
- **Birincil Yazı Tipi:** `Outfit` veya `Inter` (Google Fonts'tan otomatik çekilecek)
- **Başlıklar (Headings):** `font-semibold` veya `font-bold`
- **Gövde Metni (Body):** `font-normal` ve `antialiased`

### UI Özellikleri ve Efektler
- **Glassmorphic Kartlar:** Arka planda `backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20` kullanımı.
- **Gölgeler (Shadows):** Butonlar ve kartlar için yumuşak gölgeler (`shadow-lg shadow-purple-500/10`).
- **Mikro Etkileşimler:** `transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]` hover ve tıklama efektleri.

---

## 3. Sayfa Yapısı ve Yönlendirmeler (Page Routes)


- **`/` (Dashboard / Ana Sayfa):**
  - Bileşenler: Konum/Adres seçici bar, Kategori/Mutfak türleri listesi (Slider), Aktif Kampanyalar/Kuponlar banner alanı, Yakındaki Popüler Restoranlar listesi (Grid layout)
- **`/login` (Giriş Yap Sayfası):**
  - Bileşenler: E-posta ve şifre giriş formu, "Şifremi Unuttum" linki, Sosyal medya ile giriş butonları (Google/Apple), Rol Seçici/Yönlendirici Mekanizma (Giriş yapan aktörün role bilgisine göre otomatik yönlendirme: customer -> /, merchant -> /merchant/dashboard, admin -> /admin/dashboard, courier -> kurye ekranı).
- **`/register` (Kayıt Ol Sayfası):**
  - Bileşenler: Ad, soyad, e-posta, telefon ve şifre alanlarından oluşan üyelik formu, Kullanıcı Sözleşmesi ve KVKK onay kutucukları.
- **`/merchant/register` (Restoran Başvuru Sayfası):**
  - Bileşenler: Restoran adı, vergi dairesi/no, işletme sahibi bilgileri, şube adresi ve iletişim bilgilerini içeren kurumsal başvuru formu (Admin onayına düşer).
- **`/restaurants` (Restoranlar Sayfası):**
  - Bileşenler: Akıllı filtreleme alanı (Puan, Hız, Teslimat Ücreti, Minimum Paket Tutarı), Mutfak türü seçimi, Restoran listeleme kartları (Restoran adı, puanı, ortalama teslimat süresi, popüler yorumu).
- **`/restaurant/:id` (Restoran Detay Sayfası):**
  - Bileşenler:Restoran kapak ve logo alanı, Restoran puan detayları (Hız, Servis, Lezzet kırılımları), Menü kategorileri (Hızlı linkler), Yemek listesi kartları (Yemek adı, içeriği, fiyatı, "Sepete Ekle" butonu), Ürün opsiyon seçimi modalı (Soslar, malzemeler, içecekler).
- **`/checkout` (Ödeme Sayfası):**
  - Bileşenler:Kayıtlı Kredi Kartları listesi, "Yeni Kart Ekle" seçeneği (Kart sahibi, Kart Numarası, SKT, CVC alanları), Ödeme Yöntemi seçici (Online Kredi Kartı, Kapıda Kredi Kartı, Kapıda Nakit), Mesafeli Satış Sözleşmesi onayı ve "Ödeme Yap ve Siparişi Tamamla" butonu.
- **`/orders` (Siparişlerim Sayfası):**
  - Bileşenler: Geçmiş siparişler listesi, Aktif sipariş kartı ve Canlı Durum Takip Çubuğu (State Machine: Alındı -> Hazırlanıyor -> Kuryede -> Teslim Edildi), Teslim edilen siparişler için "Değerlendir ve Yorum Yap" modalı (1-5 Puan, Hız, Servis, Lezzet yıldızları ve metin alanı).
- **`/cart` (Sepet Sayfası):**
  - Bileşenler: : Sepetteki ürünlerin listesi (Miktar artırma/azaltma), Adres seçim/ekleme kartı, İndirim / Kupon Kodu uygulama alanı, Ödeme yöntemi seçimi (Kredi Kartı, Kapıda Ödeme), Sipariş Toplamı ve "Siparişi Onayla" butonu.
- **`/merchant/dashboard` (Restoran Dashboard Sayfası):**
  - Bileşenler: : Sepetteki ürünlerin listesi (Miktar artırma/azaltma), Adres seçim/ekleme kartı, İndirim / Kupon Kodu uygulama alanı, Ödeme yöntemi seçimi (Kredi Kartı, Kapıda Ödeme), Sipariş Toplamı ve "Siparişi Onayla" butonu.
- **`/merchant/orders` (Gelen Siparişler Sayfası):**
  - Bileşenler: : Sipariş durumu sekmeleri (Gelen Siparişler, Hazırlananlar, Kuryedekiler, Tamamlananlar/İptaller), Sipariş detay kartı (Ürünler, müşteri notu, teslimat adresi), Durum güncelleme butonları (Onayla, Hazırlandı/Kuryeye Ver, İptal Et).
- **`/merchant/menu` (Restoran Menüsü Sayfası):**
  - Bileşenler: : Menü kategorileri listesi, Yeni Yemek Ekleme butonu ve Form Modalı (Yemek adı, fiyatı, açıklaması, görseli, opsiyon grupları), Stokta Var/Yok kontrolü (Toggle switch).
- **`/merchant/reviews` (Restoran Yorumları Sayfası):**
  - Bileşenler: : Genel puan kartı (Hız, Servis, Lezzet ortalamaları), Müşteri yorumları listesi (Filtrelenebilir: Sadece düşük puanlar, cevapsızlar), Restoran cevap yazma formu.
- **`/admin/dashboard` (Sistem Admin Dashboard Sayfası):**
  - Bileşenler: : Sistem geneli anlık istatistik kartları (Toplam aktif restoran, aktif kurye, anlık sipariş sayısı), Günlük/Aylık Ciro ve Komisyon Grafiği, Son aktiviteler ve sistem logları listesi.
- **`/admin/restaurants` (Restoran Yönetim Sayfası):**
  - Bileşenler: : Kayıtlı restoranlar tablosu (Arama, sıralama ve filtreleme), "Yeni Şube/Restoran Ekle" butonu ve detaylı başvuru/tanımlama formu, Restoran düzenleme/silme/askıya alma aksiyon butonları.
- **`/admin/coupons` (Kupon Yönetim Sayfası):**
  - Bileşenler: : Aktif ve süresi geçmiş kuponlar listesi, "Yeni Kupon Tanımla" butonu ve Form Modalı (Kupon kodu, indirim türü: yüzdesel/sabit, geçerli olacağı restoranlar listesi, son kullanma tarihi, minimum sepet tutarı).
- **`/admin/users` (Kullanıcı ve Kurye Yönetim Sayfası):**
  - Bileşenler: :Müşteri ve Kurye listeleri (Rol filtresi), Kullanıcı detay kartı (Sipariş geçmişi, şikayetler), Hesap dondurma veya kurye aktivasyon onay butonları. /admin/users
- **`/admin/settings` (Ayarlar Sayfası):**
  - Bileşenler: : Platform komisyon oranları belirleme alanı, Dark Mode / Light Mode tema seçici, Sistem bakım modu açma/kapama şalteri.

---

## 4. Veri Modeli ve Veritabanı Şeması (`db.json`)

Bu sadece örnektir benim asıl gerekli olan veri tabanı tablo şemamı sen oluşturacaksın. 
```json
{
  "users": [
    {
      "id": "u-101",
      "name": "Caner Yıldırım",
      "email": "caner@mail.com",
      "password": "hashed_password_123",
      "role": "customer",
      "phone": "05555555555",
      "addresses": [
        { "id": "a1", "title": "Ev", "detail": "Kadıköy, İstanbul" },
        { "id": "a2", "title": "İş", "detail": "Levent, İstanbul" }
      ],
      "savedCards": [
        { "id": "c1", "cardHolder": "Caner Yıldırım", "cardNumber": "4355 **** **** 1122", "bankName": "Garanti" }
      ]
    },
    {
      "id": "u-102",
      "name": "Ahmet Şef",
      "email": "burger@merchant.com",
      "role": "merchant",
      "restaurantId": "r-201"
    }
  ],
  "restaurants": [
    {
      "id": "r-201",
      "name": "Burger Vadisi",
      "cuisine": "Burger",
      "rating": 4.5,
      "deliveryTime": "30-40 dk",
      "deliveryFee": 15,
      "minOrderAmount": 120,
      "isOpen": true,
      "logo": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      "scores": { "speed": 4.6, "service": 4.4, "flavor": 4.5 }
    }
  ],
  "menus": [
    {
      "id": "m-301",
      "restaurantId": "r-201",
      "name": "Kasap Burger Menü",
      "description": "150gr dana köfte, patates kızartması ve içecek ile",
      "price": 185,
      "category": "Menüler",
      "inStock": true,
      "options": [
        { "id": "o1", "title": "İçecek Seçimi", "items": ["Coca-Cola", "Fanta", "Ayran"] },
        { "id": "o2", "title": "Soslar", "items": ["Ketçap", "Mayonez", "Ranch Sos"] }
      ]
    }
  ],
  "coupons": [
    {
      "id": "cp-401",
      "code": "LEZZET20",
      "type": "percentage",
      "value": 20,
      "minOrder": 150,
      "restaurantId": "all",
      "expiryDate": "2026-12-31"
    }
  ],
  "orders": [
    {
      "id": "ord-501",
      "customerId": "u-101",
      "restaurantId": "r-201",
      "items": [
        { "menuId": "m-301", "name": "Kasap Burger Menü", "quantity": 1, "selectedOptions": ["Coca-Cola", "Ranch Sos"], "price": 185 }
      ],
      "financials": {
        "subTotal": 185,
        "deliveryFee": 15,
        "discount": 37,
        "totalAmount": 163
      },
      "paymentMethod": "online_credit_card",
      "paymentStatus": "paid",
      "status": "preparing",
      "address": "Kadıköy, İstanbul",
      "orderDate": "2026-07-02 T11:30:00Z"
    }
  ],
  "reviews": [
    {
      "id": "rev-601",
      "restaurantId": "r-201",
      "customerId": "u-101",
      "orderId": "ord-501",
      "comment": "Burger çok sıcaktı ama patatesler biraz tuzsuzdu.",
      "ratings": { "speed": 5, "service": 4, "flavor": 4 },
      "createdAt": "2026-07-02",
      "merchantReply": "Geri bildiriminiz için teşekkürler, dikkat edeceğiz!"
    }
  ]
}
```

---

## 5. Global State Yönetimi (Redux Toolkit)


### 1. `authSlice`
- **State Yapısı:**
  ```javascript
  {
    user: null, 
    token: null, 
    role: null,   
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  }
  ```
- **Async Thunk Eylemleri (Actions):**
  - `loginUser(credentials)` -> `POST /auth/login`
  - `registerUser(userData)` -> `POST /auth/register`
  - `logoutUser() ` -> `POST /auth/logout`
  - `fetchCurrentUser()` -> `GET /auth/me`


### 2. `restaurantSlice`
- **State Yapısı:**
  ```javascript
  {
    items: [], 
    currentRestaurant: null, 
    filters: { cuisine: '', rating: 0, search: '' },
    status: 'idle',
    error: null
  }
  ```
- **Async Thunk Eylemleri:**
  - `fetchRestaurants(filters)` -> `GET /restaurants`
  - `fetchRestaurantDetails(id)` -> `GET /restaurants/:id `
  - `addRestaurant(restaurantData)` -> `POST /admin/restaurants`
  - `updateRestaurant({id, data})` -> `PATCH/merchant/restaurants/:id  `
  - `deleteRestaurant(id)` -> `DELETE /admin/restaurants/:id `

### 3. `cartSlice`
- **State Yapısı:**
  ```javascript
  {
    restaurantId: null,
    items: [],
    totalAmount: 0,
    appliedCoupon: null
  }
  ```
- **Async Thunk Eylemleri:**
  - `addToCart(item)` -> `POST /cart`
  - `removeFromCart(productId)` -> `DELETE /cart/:productId`
  - `updateQuantity({productId, quantity})` -> `PATCH /cart/:productId`
  - `applyCoupon(couponCode)` -> `POST /cart/apply-coupon`
  - `clearCart()` -> `DELETE /cart`

### 4. `orderSlice`
- **State Yapısı:**
  ```javascript
  {
    items: [],
    activeOrder: null,
    status: 'idle',
    error: null
  }
  ```
- **Async Thunk Eylemleri:**
  - `createOrder(orderData)` -> `POST /orders`
  - `fetchCustomerOrders()` -> `GET /orders/customer`
  - `fetchMerchantOrders(merchantId)` -> `GET /orders/merchant/:merchantId`
  - `updateOrderStatus({orderId, status})` -> `PATCH /orders/:orderId/status`


### 5. `reviewSlice`
- **State Yapısı:**
  ```javascript
  {
    items: [],
    status: 'idle',
    error: null
  }
  ```
- **Async Thunk Eylemleri:**
  - `fetchRestaurantReviews(restaurantId)` -> `GET /restaurants/:restaurantId/reviews`
  - `addReview({orderId, reviewData})` -> `POST /orders/:orderId/reviews`
  - `replyToReview({reviewId, replyText})` -> `POST /reviews/:reviewId/reply`

### 5. `paymentSlice`
- **State Yapısı:**
  ```javascript
  {
    savedCards: [], 
    selectedCardId: null, 
    paymentMethod: 'online_credit_card', 
    status: 'idle', 
    error: null
  }
  ```
- **Async Thunk Eylemleri:**
  - `fetchSavedCards(userId)` -> `GET /users/:userId`
  - `addNewCard({ userId, cardData }) ` -> `PATCH /users/:userId`
  - `processPayment({ orderId, paymentDetails })` -> `PATCH /orders/:orderId`



---

## 6. Antigravity Geliştirme Sırası ve Talimatları

Antigravity'nin bu `project.md` dosyasını okuyarak sırasıyla hangi adımları yapmasını bekliyoruz?

1. **Adım 1: Klasör Yapısını İncele ve Ayarla**:
   - `src/` klasörünün altında `components/`, `pages/`, `store/`, `hooks/` dizinlerini oluştur.
2. **Adım 2: Bağımlılıkları ve Konfigürasyonu Yapılandır**:
   - `@reduxjs/toolkit`, `react-redux`, `react-router-dom`, `axios`, `lucide-react` paketlerini yükle.
   - `tailwind.config.js` dosyasını yukarıda belirtilen renk paletine (HSL değerleriyle) göre güncelle.
3. **Adım 3: Store ve Slice Dosyalarını Oluştur**:
   - `store/index.js` dosyasını oluştur ve store'u uygulamaya bağla.
   - `projectsSlice.js` ve `clientsSlice.js` dosyalarını async thunk'ları ile birlikte yaz.
4. **Adım 4: JSON Server Kurulumu**:
   - Proje kökünde `db.json` dosyasını oluştur ve doldur.
   - Projenin `package.json` dosyasına `"server": "json-server --watch db.json --port 5000"` scriptini ekle.
5. **Adım 5: Sayfaları ve Yönlendirmeleri (Routing) Tasarla**:
   - `react-router-dom` ile sayfaları oluştur ve birbirine bağla.
   - Modern, responsive ve koyu mod destekli UI bileşenlerini geliştir.
