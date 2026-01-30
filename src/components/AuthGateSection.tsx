import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

interface AuthGateSectionProps {
  /** Clave i18n para el nombre de la sección (ej: "auth.sectionNames.marketplace") */
  titleKey: string;
  /** Clase opcional para el contenedor */
  className?: string;
}

/**
 * Bloque compacto para mostrar en lugar del contenido protegido cuando el usuario no está logueado.
 * Se usa dentro de páginas donde solo una sección (perfiles, cards) requiere login.
 */
export default function AuthGateSection({ titleKey, className = '' }: AuthGateSectionProps) {
  const { t } = useTranslation();
  const displayTitle = t(titleKey);
  const defaultDescription = t('auth.gateDescription', { section: displayTitle });

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 rounded-[1.5rem] sm:rounded-[2rem] bg-[#F7EFE9]/80 border-2 border-dashed border-[#7CA982]/30 ${className}`}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F5C542]/20 text-[#2D5444] mb-6">
        <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-3 text-center">
        {displayTitle}
      </h2>
      <p className="text-sm sm:text-base text-[#5e3920] leading-relaxed mb-6 sm:mb-8 text-center max-w-md">
        {defaultDescription}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Link to="/registro">
          <Button variant="cta" className="w-full sm:w-auto text-sm sm:text-base px-6 py-2.5 sm:py-3">
            {t('auth.createAccount')}
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="outlined" className="w-full sm:w-auto text-sm sm:text-base px-6 py-2.5 sm:py-3">
            {t('auth.alreadyHaveAccount')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
