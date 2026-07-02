import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { register, status, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);
  useEffect(() => { clearError(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    await register(form);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-primary/5 to-pink-50 dark:from-background-dark dark:via-primary/10 dark:to-gray-950 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-primary shadow-primary flex items-center justify-center text-3xl">🍽️</div>
            <span className="font-bold text-2xl gradient-text">LezzetSepeti</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-textColor-light dark:text-textColor-dark">Hemen üye ol!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Binlerce lezzetle buluş</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Ad Soyad</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="name" type="text" required placeholder="Adınız Soyadınız" className="input pl-11"
                  value={form.name} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="label">E-posta</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" required placeholder="ornek@mail.com" className="input pl-11"
                  value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="label">Telefon</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" type="tel" required placeholder="0555 123 4567" className="input pl-11"
                  value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="label">Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="password" type={showPass ? 'text' : 'password'} required placeholder="En az 6 karakter" minLength={6} className="input pl-11 pr-11"
                  value={form.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-primary rounded"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                <a href="#" className="text-primary hover:underline">Kullanıcı Sözleşmesi</a> ve{' '}
                <a href="#" className="text-primary hover:underline">KVKK Aydınlatma Metni</a>'ni okudum ve kabul ediyorum.
              </span>
            </label>

            <button
              type="submit"
              disabled={status === 'loading' || !agreed}
              className="btn-primary w-full h-12 text-base justify-center"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Kayıt yapılıyor...</span>
              ) : (
                <span className="flex items-center gap-2"><UserPlus size={18} />Kayıt Ol</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Giriş Yap</Link>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/merchant/register" className="text-sm text-gray-400 hover:text-primary transition-colors">
            Restoran sahibi misiniz? Başvuru yapın →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
