import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../store/slices/couponSlice';
import AdminLayout from './AdminLayout';
import Modal from '../../components/common/Modal';
import { Plus, Trash2, Tag, ToggleLeft, ToggleRight, CalendarClock } from 'lucide-react';
import { formatDate, formatPrice } from '../../utils/helpers';

const EMPTY = { code: '', description: '', type: 'percentage', value: '', minOrder: '', restaurantId: 'all', expiryDate: '', maxUses: 100 };

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { items: coupons } = useSelector((s) => s.coupon);
  const [isModal, setIsModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [tab, setTab] = useState('active');

  useEffect(() => { dispatch(fetchCoupons()); }, [dispatch]);

  const active   = coupons.filter((c) => c.isActive && new Date(c.expiryDate) >= new Date());
  const inactive = coupons.filter((c) => !c.isActive || new Date(c.expiryDate) < new Date());

  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCoupon({ ...form, value: Number(form.value), minOrder: Number(form.minOrder), maxUses: Number(form.maxUses) }));
    setIsModal(false);
    setForm(EMPTY);
  };

  const handleToggle = (c) => dispatch(updateCoupon({ id: c.id, data: { isActive: !c.isActive } }));
  const handleDelete = (id) => { if (window.confirm('Kuponu silmek istediğinize emin misiniz?')) dispatch(deleteCoupon(id)); };

  const list = tab === 'active' ? active : inactive;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark">Kupon Yönetimi</h1>
        <button onClick={() => setIsModal(true)} className="btn-primary"><Plus size={18} /> Yeni Kupon</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-gray-100 dark:border-gray-800">
        {[{ key: 'active', label: `Aktif (${active.length})` }, { key: 'inactive', label: `Süresi Dolmuş (${inactive.length})` }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-5 py-2.5 font-semibold text-sm border-b-2 -mb-px transition-all ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <div key={c.id} className={`card p-5 ${!c.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"><Tag size={16} className="text-primary" /></div>
                <div>
                  <p className="font-bold text-lg text-primary">{c.code}</p>
                  <p className="text-[10px] text-gray-400">{c.restaurantId === 'all' ? 'Tüm Restoranlar' : c.restaurantId}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleToggle(c)} className={`p-1.5 rounded-lg transition-all ${c.isActive ? 'text-success hover:bg-success/10' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {c.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="text-sm font-bold text-textColor-light dark:text-textColor-dark mb-1">
              {c.type === 'percentage' ? `%${c.value} İndirim` : `${formatPrice(c.value)} İndirim`}
            </p>
            <p className="text-xs text-gray-400 mb-3">{c.description}</p>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between"><span>Min. Sepet:</span><span className="font-medium">{formatPrice(c.minOrder)}</span></div>
              <div className="flex justify-between"><span>Kullanım:</span><span className="font-medium">{c.usedCount}/{c.maxUses}</span></div>
              <div className="flex items-center gap-1 mt-2"><CalendarClock size={11} /> {formatDate(c.expiryDate)} tarihine kadar</div>
            </div>
            {/* Usage bar */}
            <div className="mt-3 w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(c.usedCount / c.maxUses) * 100}%` }} />
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full card p-12 text-center">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="text-gray-400 text-sm">{tab === 'active' ? 'Aktif kupon yok' : 'Süresi dolmuş kupon yok'}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModal} onClose={() => setIsModal(false)} title="Yeni Kupon Oluştur" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Kupon Kodu *</label><input name="code" required className="input uppercase" value={form.code} onChange={handleChange} placeholder="LEZZET20" /></div>
          <div><label className="label">Açıklama</label><input name="description" className="input" value={form.description} onChange={handleChange} placeholder="Tüm siparişlerde %20 indirim" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">İndirim Türü</label>
              <select name="type" className="input" value={form.type} onChange={handleChange}>
                <option value="percentage">Yüzdesel (%)</option>
                <option value="fixed">Sabit Tutar (₺)</option>
              </select>
            </div>
            <div><label className="label">İndirim Değeri *</label><input name="value" type="number" required className="input" value={form.value} onChange={handleChange} placeholder="20" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Min. Sipariş (₺)</label><input name="minOrder" type="number" className="input" value={form.minOrder} onChange={handleChange} /></div>
            <div><label className="label">Max Kullanım</label><input name="maxUses" type="number" className="input" value={form.maxUses} onChange={handleChange} /></div>
          </div>
          <div><label className="label">Son Kullanma Tarihi</label><input name="expiryDate" type="date" className="input" value={form.expiryDate} onChange={handleChange} /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">Oluştur</button>
            <button type="button" onClick={() => setIsModal(false)} className="btn-secondary flex-1 justify-center">İptal</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCoupons;
