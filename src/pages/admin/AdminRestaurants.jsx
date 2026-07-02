import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from '../../store/slices/restaurantSlice';
import AdminLayout from './AdminLayout';
import Modal from '../../components/common/Modal';
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import StarRating from '../../components/common/StarRating';

const EMPTY_FORM = { name: '', cuisine: '', address: '', deliveryTime: '30-40 dk', deliveryFee: 15, minOrderAmount: 100, commission: 15 };

const AdminRestaurants = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.restaurant);
  const [search, setSearch] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { dispatch(fetchRestaurants()); }, [dispatch]);

  const filtered = items.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase()));

  const openAdd  = ()   => { setEditItem(null); setForm(EMPTY_FORM); setIsModal(true); };
  const openEdit = (r)  => { setEditItem(r); setForm({ name: r.name, cuisine: r.cuisine, address: r.address, deliveryTime: r.deliveryTime, deliveryFee: r.deliveryFee, minOrderAmount: r.minOrderAmount, commission: r.commission || 15 }); setIsModal(true); };
  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, deliveryFee: Number(form.deliveryFee), minOrderAmount: Number(form.minOrderAmount), commission: Number(form.commission), isOpen: true };
    if (editItem) dispatch(updateRestaurant({ id: editItem.id, data }));
    else          dispatch(addRestaurant(data));
    setIsModal(false);
  };

  const handleToggleStatus = (r) => {
    dispatch(updateRestaurant({ id: r.id, data: { status: r.status === 'active' ? 'suspended' : 'active', isApproved: r.status !== 'active' } }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu restoranı silmek istediğinize emin misiniz?')) dispatch(deleteRestaurant(id));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark">Restoran Yönetimi</h1>
        <button onClick={openAdd} className="btn-primary"><Plus size={18} /> Restoran Ekle</button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Restoran ara..." className="input pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                {['Restoran', 'Mutfak', 'Puan', 'Teslimat', 'Komisyon', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={r.logo} alt={r.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-textColor-light dark:text-textColor-dark">{r.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">{r.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.cuisine}</td>
                  <td className="px-4 py-3"><StarRating rating={r.rating} size="xs" /></td>
                  <td className="px-4 py-3 text-gray-500">{r.deliveryTime}</td>
                  <td className="px-4 py-3"><span className="badge badge-primary">%{r.commission || 15}</span></td>
                  <td className="px-4 py-3">
                    <span className={`status-pill ${r.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {r.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {r.status === 'active' ? 'Aktif' : 'Askıda'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all" title="Düzenle">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleToggleStatus(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-warning hover:bg-warning/10 transition-all" title="Durum Değiştir">
                        <PauseCircle size={14} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-all" title="Sil">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">Restoran bulunamadı</div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModal} onClose={() => setIsModal(false)} title={editItem ? 'Restoranı Düzenle' : 'Yeni Restoran Ekle'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Restoran Adı *</label><input name="name" required className="input" value={form.name} onChange={handleChange} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Mutfak Türü *</label><input name="cuisine" required className="input" value={form.cuisine} onChange={handleChange} placeholder="Burger, Pizza..." /></div>
            <div><label className="label">Teslimat Süresi</label><input name="deliveryTime" className="input" value={form.deliveryTime} onChange={handleChange} /></div>
          </div>
          <div><label className="label">Adres</label><input name="address" className="input" value={form.address} onChange={handleChange} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Teslimat Ücreti (₺)</label><input name="deliveryFee" type="number" className="input" value={form.deliveryFee} onChange={handleChange} /></div>
            <div><label className="label">Min. Sipariş (₺)</label><input name="minOrderAmount" type="number" className="input" value={form.minOrderAmount} onChange={handleChange} /></div>
            <div><label className="label">Komisyon (%)</label><input name="commission" type="number" className="input" value={form.commission} onChange={handleChange} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">{editItem ? 'Güncelle' : 'Ekle'}</button>
            <button type="button" onClick={() => setIsModal(false)} className="btn-secondary flex-1 justify-center">İptal</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminRestaurants;
