import { Link } from 'react-router-dom';
import { Heart, Share2, Globe, MessageCircle } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 mt-16">
    <div className="page-container py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white text-lg">🍽️</span>
            </div>
            <span className="font-bold text-xl gradient-text">LezzetSepeti</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            En sevdiğin restoranlardan hızlı ve güvenli teslimat.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {[Share2, Globe, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-textColor-light dark:text-textColor-dark">Keşfet</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/restaurants" className="hover:text-primary transition-colors">Restoranlar</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Kampanyalar</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Popüler Yemekler</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-textColor-light dark:text-textColor-dark">Hesabım</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/orders"   className="hover:text-primary transition-colors">Siparişlerim</Link></li>
            <li><Link to="/profile"  className="hover:text-primary transition-colors">Profilim</Link></li>
            <li><Link to="/merchant/register" className="hover:text-primary transition-colors">Restoran Başvurusu</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3 text-textColor-light dark:text-textColor-dark">Destek</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="#" className="hover:text-primary transition-colors">Yardım Merkezi</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Kullanım Şartları</a></li>
          </ul>
        </div>
      </div>
      <div className="divider mt-8 pt-6 flex items-center justify-between text-xs text-gray-400">
        <p>© 2026 LezzetSepeti. Tüm hakları saklıdır.</p>
        <p className="flex items-center gap-1">Sevgiyle yapıldı <Heart size={12} className="text-primary fill-primary" /></p>
      </div>
    </div>
  </footer>
);

export default Footer;
