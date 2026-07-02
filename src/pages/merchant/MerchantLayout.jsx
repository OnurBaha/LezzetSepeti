import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, MessageSquare, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';

const NAV_ITEMS = [
  { to: '/merchant/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/merchant/orders',    icon: <ShoppingBag     size={18} />, label: 'Siparişler' },
  { to: '/merchant/menu',      icon: <UtensilsCrossed size={18} />, label: 'Menü Yönetimi' },
  { to: '/merchant/reviews',   icon: <MessageSquare   size={18} />, label: 'Yorumlar' },
];

const MerchantLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-lg">🍽️</div>
            <span className="font-bold gradient-text">LezzetSepeti</span>
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-textColor-light dark:text-textColor-dark truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400">Restoran Yetkilisi</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={pathname === item.to ? 'sidebar-item-active' : 'sidebar-item'}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button onClick={toggle} className="sidebar-item w-full">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Açık Tema' : 'Koyu Tema'}
          </button>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-all">
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-5xl">{children}</div>
      </main>
    </div>
  );
};

export default MerchantLayout;
