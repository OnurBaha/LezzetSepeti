import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, LogOut, LayoutDashboard, Menu as MenuIcon, X, Bell } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isMerchant, isCourier } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((s) => s.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin)    return '/admin/dashboard';
    if (isMerchant) return '/merchant/dashboard';
    if (isCourier)  return '/courier';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/20 dark:border-white/5">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-primary group-hover:shadow-primary-lg transition-shadow">
              <span className="text-white text-lg">🍽️</span>
            </div>
            <span className="font-bold text-xl gradient-text">LezzetSepeti</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/restaurants"
              className={`btn-ghost text-sm ${isActive('/restaurants') ? 'bg-primary/10 text-primary' : ''}`}
            >
              Restoranlar
            </Link>
            {isAuthenticated && !isAdmin && !isMerchant && !isCourier && (
              <Link
                to="/orders"
                className={`btn-ghost text-sm ${isActive('/orders') ? 'bg-primary/10 text-primary' : ''}`}
              >
                Siparişlerim
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode */}
            <button
              onClick={toggle}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              title={isDark ? 'Açık tema' : 'Koyu tema'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart - giriş yapması gerekmiyor */}
            {!isAdmin && !isMerchant && !isCourier && (
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-primary/10 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-textColor-light dark:text-textColor-dark max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-20 animate-slide-down overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-textColor-light dark:text-textColor-dark truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        {(isAdmin || isMerchant) && (
                          <button
                            onClick={() => { navigate(getDashboardLink()); setUserMenuOpen(false); }}
                            className="w-full sidebar-item text-sm"
                          >
                            <LayoutDashboard size={16} /> Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                          className="w-full sidebar-item text-sm"
                        >
                          <User size={16} /> Profilim
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-all duration-200"
                        >
                          <LogOut size={16} /> Çıkış Yap
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login"    className="btn-ghost text-sm">Giriş Yap</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Kayıt Ol</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-primary/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-3 space-y-1 animate-slide-down">
            <Link to="/restaurants" onClick={() => setMobileOpen(false)} className="block btn-ghost w-full text-left">Restoranlar</Link>
            {isAuthenticated && !isAdmin && !isMerchant && (
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="block btn-ghost w-full text-left">Siparişlerim</Link>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login"    onClick={() => setMobileOpen(false)} className="block btn-ghost w-full text-left">Giriş Yap</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-primary w-full text-center mt-2">Kayıt Ol</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
