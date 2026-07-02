import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login, status, error, isAuthenticated, role, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = { admin: '/admin/dashboard', merchant: '/merchant/dashboard', courier: '/courier', customer: '/' };
      navigate(redirect[role] || '/', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => { clearError(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  const demoLogins = [
    { label: '👤 Müşteri',  email: 'caner@mail.com',          password: '123456' },
    { label: '🍽️ Merchant', email: 'burger@merchant.com',     password: 'merchant123' },
    { label: '🔧 Admin',    email: 'admin@lezzetsepeti.com',  password: 'admin123' },
    { label: '📦 Kurye',    email: 'ali@courier.com',         password: 'courier123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-primary/5 to-pink-50 dark:from-background-dark dark:via-primary/10 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-primary shadow-primary flex items-center justify-center text-3xl">🍽️</div>
            <span className="font-bold text-2xl gradient-text">LezzetSepeti</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-textColor-light dark:text-textColor-dark">Tekrar hoş geldiniz!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">E-posta</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="ornek@mail.com"
                  className="input pl-11"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="input pl-11 pr-11"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <a href="#" className="text-xs text-primary hover:underline">Şifremi unuttum</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full h-12 text-base justify-center"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Giriş yapılıyor...</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={18} /> Giriş Yap</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Kayıt Ol</Link>
          </div>

          {/* Demo Logins */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-center text-gray-400 mb-3 font-medium">Demo Hesaplar ile Hızlı Giriş</p>
            <div className="grid grid-cols-2 gap-2">
              {demoLogins.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => setForm({ email: d.email, password: d.password })}
                  className="px-3 py-2 text-xs font-medium rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary border border-gray-200 dark:border-gray-700 transition-all"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
