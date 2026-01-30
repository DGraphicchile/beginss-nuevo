import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import Button from '../components/Button';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPasswordForEmail } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!email.trim()) {
      setError(t('forgotPassword.errorRequired'));
      return;
    }
    setLoading(true);
    const { error } = await resetPasswordForEmail(email.trim());
    if (error) {
      setError(t('forgotPassword.errorGeneric'));
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-[#F9F7F4] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto rounded-3xl bg-[#FEF4EF] shadow-2xl ring-1 ring-black/5 p-6 md:p-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[#2D5444] hover:text-[#3E6049] font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('forgotPassword.backToLogin')}
        </Link>

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2D5444]/10 mb-6">
          <Mail className="w-7 h-7 text-[#2D5444]" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1F2D1F] mb-2 text-center">
          {t('forgotPassword.title')}
        </h1>
        <p className="text-[#5e3920] text-center mb-8">
          {t('forgotPassword.subtitle')}
        </p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-[#7CA982]/15 border border-[#7CA982]/40 text-[#2D5444] px-4 py-3 rounded-xl text-sm">
              {t('forgotPassword.successMessage')}
            </div>
            <p className="text-sm text-[#5e3920] text-center">
              {t('forgotPassword.checkSpam')}
            </p>
            <Link to="/login" className="block">
              <Button variant="primary" className="w-full">
                {t('forgotPassword.backToLogin')}
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#E6A5A1]/10 border border-[#E6A5A1] text-[#D85B5B] px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#2D5444] mb-2">
                {t('forgotPassword.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7CA982] focus:ring-2 focus:ring-[#7CA982]/25 outline-none transition-all"
                placeholder={t('forgotPassword.emailPlaceholder')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full rounded-full !bg-[#2D5444] !text-white hover:!bg-[#3E6049]"
            >
              {loading ? t('forgotPassword.sending') : t('forgotPassword.submit')}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
