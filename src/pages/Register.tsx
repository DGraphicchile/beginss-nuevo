import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import Button from '../components/Button';
import { CalendarDays, Megaphone, Users, Sparkles, HeartHandshake, BadgeCheck } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (password.length < 6) {
      setError(t('register.errorPasswordLength'));
      setLoading(false);
      return;
    }
    const { error } = await signUp(email, password, fullName);
    if (error) {
      const msg = typeof error?.message === 'string' ? error.message : '';
      const isEmailExists =
        msg.toLowerCase().includes('already registered') ||
        msg.toLowerCase().includes('already exists') ||
        msg.toLowerCase().includes('user already registered') ||
        (error as { code?: string }).code === '23505';
      if (isEmailExists) {
        setError(t('register.errorEmailExists'));
      } else {
        setError(t('register.errorGeneric'));
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate('/perfil');
  };

  return (
    <section className="min-h-screen bg-[#F9F7F4] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Panel beige */}
      <div className="relative mx-auto max-w-6xl rounded-3xl bg-[#FEF4EF] shadow-2xl ring-1 ring-black/5 p-6 md:p-10 lg:p-12 flex flex-col items-center">
        {/* Decoración sutil */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl">
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#F28C7B]/20 blur-xl" />
          <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-[#7CA982]/20 blur-xl" />
          <div className="absolute top-8 left-8 h-10 w-10 rounded-full ring-2 ring-[#38BDF8]/35" />
          <div className="absolute bottom-10 right-12 h-12 w-12 rounded-full ring-2 ring-[#F59E0B]/35" />
        </div>

        <div className="text-center max-w-3xl mb-10">
          <h1 className="font-['Montserrat',ui-sans-serif] text-[#1F2D1F] text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            {t('register.title')}
          </h1>
          <p className="font-['Montserrat',ui-sans-serif] text-[#3E6049] text-lg md:text-[18px] leading-relaxed mb-4">
            <Trans i18nKey="register.subtitle" components={{ strong: <strong />, br: <br /> }} />
            <br />
            <span className="font-semibold">{t('register.inspire')}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor:'rgba(56,189,248,0.16)', color:'#0EA5E9', borderColor:'rgba(56,189,248,0.45)' }}>
              <CalendarDays className="h-4 w-4" /> {t('register.agenda')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor:'rgba(245,158,11,0.18)', color:'#B45309', borderColor:'rgba(245,158,11,0.45)' }}>
              <Megaphone className="h-4 w-4" /> {t('register.promotion')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor:'rgba(251,146,60,0.18)', color:'#C2410C', borderColor:'rgba(251,146,60,0.45)' }}>
              <Users className="h-4 w-4" /> {t('register.community')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor:'rgba(244,114,182,0.18)', color:'#BE185D', borderColor:'rgba(244,114,182,0.45)' }}>
              <Sparkles className="h-4 w-4" /> {t('register.impact')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor:'rgba(124,169,130,0.18)', color:'#2F5E44', borderColor:'rgba(124,169,130,0.45)' }}>
              <HeartHandshake className="h-4 w-4" /> {t('register.collaborate')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ring-1"
              style={{ backgroundColor:'rgba(242,140,123,0.18)', color:'#9A3427', borderColor:'rgba(242,140,123,0.45)' }}>
              <BadgeCheck className="h-4 w-4" /> {t('register.quality')}
            </span>
          </div>
        </div>

        {/* Grid: imágenes + formulario */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Dos imágenes (mismo formato que Login) */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 self-start">
            {/* Izquierda: esquina superior izquierda más pronunciada */}
            <div className="overflow-hidden h-[360px] md:h-[420px] bg-white/60 rounded-[18px] rounded-tl-[48px]">
              <img
                src="/portrait-of-smiling-diverse-women-smiling-and-supp-2025-02-20-10-16-07-utc.jpg" 
                alt="Comunidad Beginss"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Derecha: esquina inferior derecha más pronunciada */}
            <div className="overflow-hidden h-[360px] md:h-[420px] bg-white/60 rounded-[18px] rounded-br-[48px]">
              <img
                src="/smiling-african-american-woman-hugging-stylish-mul-2024-11-15-05-18-45-utc.jpg" 
                alt="Actividades Beginss"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Formulario */}
          <div className="rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-[#E6A5A1]/10 border border-[#E6A5A1] text-[#D85B5B] px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#2D5444] mb-2">
                  {t('register.fullName')}
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
                  placeholder={t('register.fullNamePlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#2D5444] mb-2">
                  {t('register.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
                  placeholder={t('register.emailPlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#2D5444] mb-2">
                  {t('register.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
                  placeholder={t('register.passwordPlaceholder')}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full rounded-full !bg-black !text-white hover:brightness-110"
              >
                {loading ? t('register.submitting') : t('register.submit')}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-[#2D5444]">
                {t('register.hasAccount')}{' '}
                <Link to="/login" className="text-[#3E6049] hover:underline font-semibold">
                  {t('register.signIn')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
