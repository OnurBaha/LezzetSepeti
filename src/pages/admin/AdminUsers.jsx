import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Search, UserCheck, UserX } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const ROLE_COLORS = {
    customer: 'badge-primary',
    merchant: 'badge-warning',
    courier:  'badge-success',
    admin:    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  };
  const ROLE_LABELS = { customer: 'Müşteri', merchant: 'Merchant', courier: 'Kurye', admin: 'Admin' };

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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <tr>
                {['Kullanıcı', 'Rol', 'Telefon', 'Adres Sayısı', 'Kayıt Tarihi', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Yükleniyor...</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-textColor-light dark:text-textColor-dark">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`badge ${ROLE_COLORS[u.role] || 'badge-gray'}`}>{ROLE_LABELS[u.role] || u.role}</span></td>
                  <td className="px-4 py-3 text-gray-500">{u.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{u.addresses?.length || 0}</td>
                  <td className="px-4 py-3 text-gray-500">{u.createdAt ? formatDate(u.createdAt) : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-success hover:bg-success/10 transition-all" title="Aktif Et"><UserCheck size={15} /></button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-all" title="Askıya Al"><UserX size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">Kullanıcı bulunamadı</td></tr>
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
