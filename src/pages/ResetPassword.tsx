import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import Button from '../components/Button';
import { Lock, ArrowLeft } from 'lucide-react';

/** Detecta si la URL tiene el hash de recuperación (antes de que Supabase lo procese). */
function getRecoveryFromHash(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hash.includes('type=recovery');
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isPasswordRecovery, updatePassword, clearPasswordRecovery, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryFromUrl] = useState(getRecoveryFromHash);

  const showResetForm = Boolean(user && (isPasswordRecovery || recoveryFromUrl));

  // Solo redirigir a login si hay usuario y NO estamos en flujo de recuperación (ni por evento ni por URL)
  useEffect(() => {
    if (user && !isPasswordRecovery && !recoveryFromUrl) {
      navigate('/login', { replace: true });
    }
  }, [user, isPasswordRecovery, recoveryFromUrl, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError(t('resetPassword.errorPasswordLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('resetPassword.errorMismatch'));
      return;
    }
    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    if (updateError) {
      setError(t('resetPassword.errorGeneric'));
      setLoading(false);
      return;
    }
    clearPasswordRecovery();
    await signOut();
    navigate('/login', { replace: true, state: { message: 'resetSuccess' } });
  };

  if (!user) {
    return (
      <section className="min-h-screen bg-[#F9F7F4] pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#2D5444] border-t-transparent mb-4" />
          <p className="text-[#5e3920]">{t('resetPassword.loading')}</p>
        </div>
      </section>
    );
  }

  if (!showResetForm) {
    return null;
  }

  return (
    <section className="min-h-screen bg-[#F9F7F4] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto rounded-3xl bg-[#FEF4EF] shadow-2xl ring-1 ring-black/5 p-6 md:p-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[#2D5444] hover:text-[#3E6049] font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('resetPassword.backToLogin')}
        </Link>

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2D5444]/10 mb-6">
          <Lock className="w-7 h-7 text-[#2D5444]" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1F2D1F] mb-2 text-center">
          {t('resetPassword.title')}
        </h1>
        <p className="text-[#5e3920] text-center mb-8">
          {t('resetPassword.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-[#E6A5A1]/10 border border-[#E6A5A1] text-[#D85B5B] px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#2D5444] mb-2">
              {t('resetPassword.newPasswordLabel')}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
              placeholder={t('resetPassword.newPasswordPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#2D5444] mb-2">
              {t('resetPassword.confirmPasswordLabel')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
              placeholder={t('resetPassword.confirmPasswordPlaceholder')}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full rounded-full !bg-[#2D5444] !text-white hover:!bg-[#3E6049]"
          >
            {loading ? t('resetPassword.saving') : t('resetPassword.submit')}
          </Button>
        </form>
      </div>
    </section>
  );
}
