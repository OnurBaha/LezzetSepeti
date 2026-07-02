import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Sun, Moon, AlertTriangle, Percent, ToggleLeft, ToggleRight } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const AdminSettings = () => {
  const { isDark, toggle } = useDarkMode();
  const [commission, setCommission] = useState(15);
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6">Ayarlar</h1>

      <div className="max-w-2xl space-y-5">
        {/* Commission */}
        <div className="card p-5">
          <h2 className="font-bold text-textColor-light dark:text-textColor-dark mb-4 flex items-center gap-2">
            <Percent size={18} className="text-primary" /> Komisyon Oranları
          </h2>
          <div>
            <label className="label">Platform Varsayılan Komisyon Oranı (%)</label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={5} max={30} value={commission} onChange={(e) => setCommission(e.target.value)}
                className="flex-1 accent-primary"
              />
              <span className="text-2xl font-bold text-primary w-12 text-center">%{commission}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Bu oran restoran bazlı özel komisyon tanımlanmadığında kullanılır.</p>
          </div>
        </div>

        {/* Theme */}
        <div className="card p-5">
          <h2 className="font-bold text-textColor-light dark:text-textColor-dark mb-4">Tema Tercihi</h2>
          <div className="flex gap-3">
            <button
              onClick={() => isDark && toggle()}
              className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                !isDark ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'
              }`}
            >
              <Sun size={24} className={!isDark ? 'text-primary' : 'text-gray-400'} />
              <span className="text-sm font-semibold">Açık Tema</span>
            </button>
            <button
              onClick={() => !isDark && toggle()}
              className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                isDark ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'
              }`}
            >
              <Moon size={24} className={isDark ? 'text-primary' : 'text-gray-400'} />
              <span className="text-sm font-semibold">Koyu Tema</span>
            </button>
          </div>
        </div>

        {/* Maintenance */}
        <div className="card p-5 border-2 border-danger/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-danger mt-0.5 shrink-0" />
              <div>
                <h2 className="font-bold text-textColor-light dark:text-textColor-dark">Bakım Modu</h2>
                <p className="text-xs text-gray-400 mt-1">Aktif edildiğinde kullanıcılar platforma erişemez. Sadece admin girişi açık kalır.</p>
              </div>
            </div>
            <button onClick={() => setMaintenance(!maintenance)} className={`shrink-0 transition-colors ${maintenance ? 'text-danger' : 'text-gray-400 hover:text-danger'}`}>
              {maintenance ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
          {maintenance && (
            <div className="mt-3 px-3 py-2 bg-danger/10 rounded-xl text-xs text-danger font-medium animate-fade-in">
              ⚠️ Bakım modu aktif - kullanıcılar platforma erişemiyor
            </div>
          )}
        </div>

        <button onClick={handleSave} className="btn-primary">
          <Save size={18} /> {saved ? 'Kaydedildi ✓' : 'Ayarları Kaydet'}
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
