import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import Button from '../components/Button';
import { CalendarDays, Megaphone, Users, Sparkles } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const resetSuccess = (location.state as { message?: string } | null)?.message === 'resetSuccess';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t('login.errorRequired'));
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      if (error.message?.includes('Invalid login credentials')) {
        setError(t('login.errorInvalid'));
      } else {
        setError(t('login.errorGeneric'));
      }
      setLoading(false);
    } else {
      navigate('/perfil');
    }
  };

  return (
    <section className="min-h-screen bg-[#F9F7F4] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl rounded-3xl bg-[#2D5444] shadow-2xl ring-1 ring-black/5 p-6 md:p-10 lg:p-12 flex flex-col items-center">
        {/* DECORACIONES */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full ring-2 ring-white/15" />
        </div>

        {/* TEXTO CENTRADO ARRIBA */}
        <div className="text-center max-w-3xl mb-10">
          <h1 className="font-['Montserrat',ui-sans-serif] text-white text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            {t('login.welcome')}
          </h1>
          <p className="font-['Montserrat',ui-sans-serif] text-white/90 text-lg md:text-[18px] leading-relaxed mb-4">
            <Trans i18nKey="login.subtitle" components={{ strong: <strong className="text-white" /> }} />
            <br />
            <span className="font-semibold">{t('login.inspire')}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor: 'rgba(56,189,248,0.16)', color: '#E8F8FF', borderColor: 'rgba(56,189,248,0.45)' }}>
              <CalendarDays className="h-4 w-4" /> {t('login.events')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor: 'rgba(245,158,11,0.18)', color: '#FFF7E6', borderColor: 'rgba(245,158,11,0.45)' }}>
              <Megaphone className="h-4 w-4" /> {t('login.talks')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor: 'rgba(251,146,60,0.18)', color: '#FFEFE3', borderColor: 'rgba(251,146,60,0.45)' }}>
              <Users className="h-4 w-4" /> {t('login.community')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor: 'rgba(244,114,182,0.18)', color: '#FFE6F3', borderColor: 'rgba(244,114,182,0.45)' }}>
              <Sparkles className="h-4 w-4" /> {t('login.inspireChip')}
            </span>
          </div>
        </div>

        {/* GRID DEBAJO: imágenes + login */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* IMÁGENES */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 self-start">
            <div className="overflow-hidden h-[360px] md:h-[420px] bg-white/10 rounded-[18px] rounded-tl-[48px]">
              <img
                src="/inspire-inclusion-international-womens-day-divers-2025-01-09-05-22-00-utc.jpg"
                alt="Comunidad Beginss"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden h-[360px] md:h-[420px] bg-white/10 rounded-[18px] rounded-br-[48px]">
              <img
                src="/vertical-portrait-group-of-real-successful-busine-2025-02-12-03-13-40-utc.jpg"
                alt="Actividades Beginss"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
            {resetSuccess && (
              <div className="mb-4 bg-[#7CA982]/15 border border-[#7CA982]/40 text-[#2D5444] px-4 py-3 rounded-xl text-sm">
                {t('resetPassword.successLogin')}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-[#E6A5A1]/10 border border-[#E6A5A1] text-[#D85B5B] px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#2D5444] mb-2">
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
                  placeholder={t('login.emailPlaceholder')}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#2D5444]">
                    {t('login.password')}
                  </label>
                  <Link
                    to="/olvidar-contrasena"
                    className="text-sm font-medium text-[#3E6049] hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
                  placeholder={t('login.passwordPlaceholder')}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full rounded-full !bg-black !text-white hover:brightness-110"
              >
                {loading ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>
            <p className="font-['Montserrat',ui-sans-serif] mt-4 text-center text-sm text-[#2D5444]">
              {t('login.noAccount')}{' '}
              <Link to="/registro" className="font-semibold text-[#3E6049] hover:underline">
                {t('login.signUpHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
