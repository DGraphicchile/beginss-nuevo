import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import Button from './Button';

interface RequireAuthProps {
  children: ReactNode;
  /** Título de la sección (ej: "Marketplace", "Trueque") */
  title: string;
  /** Clave i18n para el título (ej: "auth.sectionNames.marketplace") */
  titleKey?: string;
  /** Descripción breve para invitar a registrarse */
  description?: string;
  /** Nombre del ícono o sección para el mensaje */
  sectionName?: string;
}

/**
 * Muestra la vista real solo si el usuario está logueado.
 * Si no está logueado, muestra una pantalla de invitación a registrarse/iniciar sesión.
 */
export default function RequireAuth({ children, title, titleKey, description, sectionName }: RequireAuthProps) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse rounded-full h-12 w-12 border-4 border-[#2D5444] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    const displayTitle = titleKey ? t(titleKey) : title;
    const defaultDescription = t('auth.gateDescription', { section: displayTitle });
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#F5C542]/20 text-[#2D5444] mb-8">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mb-4">
            {displayTitle}
          </h1>
          <p className="text-lg text-[#5e3920] leading-relaxed mb-8">
            {description ?? defaultDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registro">
              <Button variant="cta" className="w-full sm:w-auto">
                {t('auth.createAccount')}
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outlined" className="w-full sm:w-auto">
                {t('auth.alreadyHaveAccount')}
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-[#6E6E6E]">
            {t('auth.joinCommunity')}
            <ArrowRight className="inline-block w-4 h-4 ml-1 align-middle" />
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
