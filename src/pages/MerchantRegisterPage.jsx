import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Building2, FileText, ShieldCheck, Upload } from 'lucide-react';

const MerchantRegisterPage = () => (
  <MainLayout>
    <div className="page-container py-16 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4">🏪</div>
        <h1 className="text-3xl font-bold text-textColor-light dark:text-textColor-dark">Restoran Başvurusu</h1>
        <p className="text-gray-500 mt-2">Platformumuza katılın, binlerce müşteriye ulaşın</p>
      </div>

      <div className="card p-8 space-y-5">
        <div><label className="label">Restoran Adı *</label><input type="text" className="input" placeholder="Burger Vadisi" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Vergi Dairesi</label><input type="text" className="input" placeholder="Kadıköy V.D." /></div>
          <div><label className="label">Vergi Numarası</label><input type="text" className="input" placeholder="1234567890" /></div>
        </div>
        <div><label className="label">İşletme Sahibi Adı *</label><input type="text" className="input" placeholder="Ahmet Yılmaz" /></div>
        <div><label className="label">Telefon *</label><input type="tel" className="input" placeholder="0532 123 4567" /></div>
        <div><label className="label">Şube Adresi *</label><input type="text" className="input" placeholder="Kadıköy, İstanbul" /></div>
        <div><label className="label">Mutfak Türü *</label><input type="text" className="input" placeholder="Burger, Pizza, Türk Mutfağı..." /></div>

        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <ShieldCheck size={20} className="text-primary shrink-0" />
          <p className="text-xs text-gray-500">Başvurunuz admin onayına düşecektir. Onay sonrası hesabınızı aktive edebilirsiniz.</p>
        </div>

        <button className="btn-primary w-full justify-center h-12 text-base">
          <Upload size={18} /> Başvuruyu Gönder
        </button>

        <p className="text-center text-sm text-gray-400">
          Zaten hesabınız var mı? <Link to="/login" className="text-primary hover:underline">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  </MainLayout>
);

export default MerchantRegisterPage;
