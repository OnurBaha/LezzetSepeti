import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetails, addMenuItem, updateMenuItem, deleteMenuItem } from '../../store/slices/restaurantSlice';
import MerchantLayout from './MerchantLayout';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', inStock: true, image: '', options: [] };

const MerchantMenu = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { currentRestaurant: restaurant, currentMenus: menus, detailStatus } = useSelector((s) => s.restaurant);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingOption, setEditingOption] = useState(null);
  const [showOptionEditor, setShowOptionEditor] = useState(false);
  const [optionForm, setOptionForm] = useState({ title: '', required: false, items: [] });
  const [newOptionItem, setNewOptionItem] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (user?.restaurantId) dispatch(fetchRestaurantDetails(user.restaurantId));
  }, [user?.restaurantId, dispatch]);

  const categories = [...new Set(menus.map((m) => m.category).filter(Boolean))];

  const openAdd  = ()     => { 
    setEditItem(null); 
    setForm(EMPTY_FORM); 
    setEditingOption(null);
    setShowOptionEditor(false);
    setIsModalOpen(true); 
  };
  const openEdit = (item) => { 
    setEditItem(item); 
    setForm({ 
      name: item.name, 
      description: item.description, 
      price: item.price, 
      category: item.category, 
      inStock: item.inStock, 
      image: item.image || '',
      options: item.options || []
    }); 
    setEditingOption(null);
    setShowOptionEditor(false);
    setIsModalOpen(true); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAddOption = () => {
    setEditingOption(null);
    setOptionForm({ title: '', required: false, items: [] });
    setNewOptionItem('');
    setShowOptionEditor(true);
  };

  const openEditOption = (index) => {
    setEditingOption(index);
    setOptionForm({ ...form.options[index] });
    setNewOptionItem('');
    setShowOptionEditor(true);
  };

  const addOptionItem = () => {
    if (newOptionItem.trim()) {
      setOptionForm(prev => ({
        ...prev,
        items: [...prev.items, newOptionItem.trim()]
      }));
      setNewOptionItem('');
    }
  };

  const removeOptionItem = (idx) => {
    setOptionForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const saveOption = () => {
    if (!optionForm.title.trim() || optionForm.items.length === 0) {
      toast.error('Lütfen seçenek başlığı ve en az bir seçenek ekleyin');
      return;
    }
    
    const newOption = {
      id: editingOption !== null ? form.options[editingOption].id : `o-${Date.now()}`,
      title: optionForm.title,
      required: optionForm.required,
      items: optionForm.items
    };

    setForm(prev => {
      const newOptions = [...prev.options];
      if (editingOption !== null) {
        newOptions[editingOption] = newOption;
      } else {
        newOptions.push(newOption);
      }
      return { ...prev, options: newOptions };
    });
    
    setEditingOption(null);
    setShowOptionEditor(false);
    setOptionForm({ title: '', required: false, items: [] });
    setNewOptionItem('');
  };

  const removeOption = (idx) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { 
      ...form, 
      price: Number(form.price), 
      restaurantId: user.restaurantId 
    };
    if (editItem) dispatch(updateMenuItem({ id: editItem.id, data }));
    else          dispatch(addMenuItem(data));
    setIsModalOpen(false);
  };

  const handleToggleStock = (item) => {
    dispatch(updateMenuItem({ id: item.id, data: { inStock: !item.inStock } }));
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    dispatch(deleteMenuItem(confirmDeleteId));
    toast.success('Ürün silindi');
    setConfirmDeleteId(null);
  };

  return (
    <MerchantLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark">Menü Yönetimi</h1>
        <button onClick={openAdd} className="btn-primary"><Plus size={18} /> Yeni Ürün</button>
      </div>

      {/* Silme Onay Modalı */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-2 text-textColor-light dark:text-textColor-dark">Ürünü Sil</h3>
            <p className="text-sm text-gray-500 mb-5">Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="btn-primary flex-1 justify-center !bg-danger hover:!bg-red-600 !border-danger">Evet, Sil</button>
              <button onClick={() => setConfirmDeleteId(null)} className="btn-secondary flex-1 justify-center">İptal</button>
            </div>
          </div>
        </div>
      )}

      {detailStatus === 'loading' && <LoadingSpinner />}

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="font-bold text-lg text-textColor-light dark:text-textColor-dark mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />{cat}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {menus.filter((m) => m.category === cat).map((item) => (
                <div key={item.id} className={`card p-4 flex items-center gap-4 ${!item.inStock ? 'opacity-60' : ''}`}>
                  {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-textColor-light dark:text-textColor-dark truncate">{item.name}</h4>
                      <span className={`badge ${item.inStock ? 'badge-success' : 'badge-danger'}`}>{item.inStock ? 'Stokta Var' : 'Tükendi'}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                    <p className="font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleToggleStock(item)} className={`p-2 rounded-xl transition-all ${item.inStock ? 'text-success hover:bg-success/10' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`} title="Stok Durumu">
                      {item.inStock ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                    <button onClick={() => openEdit(item)} className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl text-gray-400 hover:text-danger hover:bg-danger/10 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {menus.length === 0 && detailStatus !== 'loading' && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-400 mb-4">Henüz menünüze ürün eklemediniz</p>
            <button onClick={openAdd} className="btn-primary"><Plus size={16} /> İlk Ürünü Ekle</button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
          <div>
            <label className="label">Ürün Adı *</label>
            <input name="name" required className="input" value={form.name} onChange={handleChange} placeholder="Kasap Burger Menü" />
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea name="description" rows={2} className="input resize-none" value={form.description} onChange={handleChange} placeholder="150gr dana köfte, patates..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Fiyat (₺) *</label>
              <input name="price" type="number" required min="0" className="input" value={form.price} onChange={handleChange} placeholder="185" />
            </div>
            <div>
              <label className="label">Kategori *</label>
              <input name="category" required className="input" value={form.category} onChange={handleChange} placeholder="Menüler, Burgerler..." />
            </div>
          </div>
          <div>
            <label className="label">Görsel URL</label>
            <input name="image" type="url" className="input" value={form.image} onChange={handleChange} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="inStock" type="checkbox" checked={form.inStock} onChange={handleChange} className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-textColor-light dark:text-textColor-dark">Stokta Mevcut</span>
          </label>

          {/* Seçenekler (Sos, Malzeme vb.) */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-textColor-light dark:text-textColor-dark">Seçenekler (Sos, Malzeme vb.)</h3>
              <button type="button" onClick={openAddOption} className="btn-small btn-primary">
                <Plus size={14} /> Seçenek Ekle
              </button>
            </div>

            {/* Seçenek Editörü */}
            {showOptionEditor && (
              <div className="bg-primary/5 p-4 rounded-lg mb-3 space-y-3">
                <div>
                  <label className="label text-sm">Seçenek Başlığı *</label>
                  <input 
                    type="text" 
                    className="input text-sm" 
                    value={optionForm.title} 
                    onChange={(e) => setOptionForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Örn: Sos Seçimi, Ekstra Malzeme"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={optionForm.required} 
                    onChange={(e) => setOptionForm(prev => ({ ...prev, required: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-textColor-light dark:text-textColor-dark">Zorunlu Seçenek</span>
                </label>
                
                <div>
                  <label className="label text-sm">Seçenek Değerleri *</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      className="input text-sm flex-1" 
                      value={newOptionItem}
                      onChange={(e) => setNewOptionItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionItem())}
                      placeholder="Örn: BBQ Sos, Ketçap, Mayonez"
                    />
                    <button type="button" onClick={addOptionItem} className="btn-small btn-primary">
                      <Plus size={14} /> Ekle
                    </button>
                  </div>
                  <div className="space-y-1">
                    {optionForm.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded text-sm">
                        <span>{item}</span>
                        <button type="button" onClick={() => removeOptionItem(idx)} className="text-danger hover:bg-danger/10 p-1 rounded">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={saveOption} className="btn-small btn-primary flex-1">
                    {editingOption !== null ? 'Güncelle' : 'Ekle'}
                  </button>
                  <button type="button" onClick={() => { setEditingOption(null); setShowOptionEditor(false); setOptionForm({ title: '', required: false, items: [] }); setNewOptionItem(''); }} className="btn-small btn-secondary flex-1">
                    İptal
                  </button>
                </div>
              </div>
            )}

            {/* Seçenekler Listesi */}
            <div className="space-y-2">
              {form.options.map((opt, idx) => (
                <div key={opt.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-textColor-light dark:text-textColor-dark">
                      {opt.title}
                      {opt.required && <span className="text-danger ml-1">*</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{opt.items.join(', ')}</p>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button type="button" onClick={() => openEditOption(idx)} className="p-1.5 rounded text-primary hover:bg-primary/10">
                      <Edit2 size={14} />
                    </button>
                    <button type="button" onClick={() => removeOption(idx)} className="p-1.5 rounded text-danger hover:bg-danger/10">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t">
            <button type="submit" className="btn-primary flex-1 justify-center">
              {editItem ? 'Güncelle' : 'Ekle'}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1 justify-center">
              İptal
            </button>
          </div>
        </form>
      </Modal>
    </MerchantLayout>
  );
};

export default MerchantMenu;
