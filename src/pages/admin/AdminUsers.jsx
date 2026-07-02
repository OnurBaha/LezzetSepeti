import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Search, UserCheck, UserX, Trash2, Shield } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

const AdminUsers = () => {
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // userId bekleyen silme

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`${API}/users`)
      .then((r) => setUsers(r.data))
      .catch(() => toast.error('Kullanıcılar yüklenirken hata oluştu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) => {
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const ROLE_COLORS = {
    customer: 'badge-primary',
    merchant: 'badge-warning',
    courier:  'badge-success',
    admin:    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  };
  const ROLE_LABELS = { customer: 'Müşteri', merchant: 'Merchant', courier: 'Kurye', admin: 'Admin' };

  const handleToggleActive = async (u) => {
    setProcessingId(u.id);
    try {
      const isCurrentlyActive = u.isActive !== false; // default true
      await axios.patch(`${API}/users/${u.id}`, { isActive: !isCurrentlyActive });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isActive: !isCurrentlyActive } : x));
      toast.success(isCurrentlyActive ? `${u.name} askıya alındı` : `${u.name} aktif edildi`);
    } catch {
      toast.error('İşlem sırasında hata oluştu');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (u) => {
    setProcessingId(u.id);
    try {
      await axios.delete(`${API}/users/${u.id}`);
      setUsers(prev => prev.filter(x => x.id !== u.id));
      toast.success(`${u.name} silindi`);
    } catch {
      toast.error('Silme işlemi başarısız');
    } finally {
      setProcessingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6">Kullanıcı Yönetimi</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Ad veya e-posta ara..." className="input pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input max-w-[160px]">
          <option value="all">Tüm Roller</option>
          <option value="customer">Müşteri</option>
          <option value="merchant">Merchant</option>
          <option value="courier">Kurye</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Silme onayı */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-lg text-textColor-light dark:text-textColor-dark mb-2">Kullanıcıyı Sil</h3>
            <p className="text-sm text-gray-500 mb-5">
              <strong>{confirmDelete.name}</strong> adlı kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={processingId === confirmDelete.id}
                className="btn-primary flex-1 justify-center bg-danger hover:bg-red-600 border-danger"
              >
                {processingId === confirmDelete.id ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                {['Kullanıcı', 'Rol', 'Durum', 'Telefon', 'Adres Sayısı', 'Kayıt Tarihi', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">Yükleniyor...</td></tr>
              )}
              {filtered.map((u) => {
                const isActive = u.isActive !== false;
                const isProcessing = processingId === u.id;
                return (
                  <tr key={u.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!isActive ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-textColor-light dark:text-textColor-dark">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`badge ${ROLE_COLORS[u.role] || 'badge-gray'}`}>{ROLE_LABELS[u.role] || u.role}</span></td>
                    <td className="px-4 py-3">
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`}>
                        {isActive ? 'Aktif' : 'Askıda'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.phone || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{u.addresses?.length || 0}</td>
                    <td className="px-4 py-3 text-gray-500">{u.createdAt ? formatDate(u.createdAt) : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleActive(u)}
                          disabled={isProcessing || u.role === 'admin'}
                          title={isActive ? 'Askıya Al' : 'Aktif Et'}
                          className={`p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                            isActive
                              ? 'text-gray-400 hover:text-warning hover:bg-warning/10'
                              : 'text-gray-400 hover:text-success hover:bg-success/10'
                          }`}
                        >
                          {isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(u)}
                          disabled={isProcessing || u.role === 'admin'}
                          title="Kullanıcıyı Sil"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400">Kullanıcı bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
          {filtered.length} kullanıcı listeleniyor
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
