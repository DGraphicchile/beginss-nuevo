import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/AuthContext';
import LanguageSelect from './LanguageSelect';

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { nameKey: 'nav.inicio', path: '/' },
    { nameKey: 'nav.cafecito', path: '/cafecito' },
    { nameKey: 'nav.circulos', path: '/circulos' },
    { nameKey: 'nav.intercambio', path: '/intercambio' },
    { nameKey: 'nav.marketplace', path: '/marketplace' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (active: boolean) =>
    [
      'relative text-xs lg:text-sm font-semibold px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 rounded-full transition-all duration-200 whitespace-nowrap',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C7B] focus-visible:ring-offset-2 focus-visible:ring-offset-white',
      active
        ? 'bg-[#F28C7B] text-white shadow-sm aria-[current=page]:cursor-default'
        : 'text-[#3E6049] hover:text-[#3E6049] hover:bg-[#F28C7B]/20 hover:ring-1 hover:ring-[#F28C7B]/40 hover:-translate-y-0.5',
    ].join(' ');

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20 gap-2 min-w-0">
          <Link to="/" className="flex items-center shrink-0 min-w-0">
            <img
              src="/logo-beginns-full.svg"
              alt="Beginss"
              className="h-7 sm:h-8 md:h-10 lg:h-12 xl:h-14 w-auto max-h-full object-contain"
            />
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={linkClass(active)}
                >
                  {t(link.nameKey)}
                </Link>
              );
            })}
          </div>

          {/* auth + language (selector arriba a la derecha) */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 shrink-0 min-w-0">
            <LanguageSelect />
            {user ? (
              <>
                <Link
                  to="/perfil"
                  className="flex items-center space-x-1.5 text-[#6E6E6E] hover:text-[#7CA982] transition-colors font-semibold text-xs lg:text-sm min-w-0 max-w-[120px] lg:max-w-[160px] truncate"
                  title={profile?.full_name}
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                  <span className="truncate">{profile?.full_name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs lg:text-sm font-semibold text-[#6E6E6E] hover:text-[#E6A5A1] transition-colors whitespace-nowrap"
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs lg:text-sm font-semibold text-[#6E6E6E] hover:text-[#7CA982] transition-colors whitespace-nowrap"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/registro"
                  className="px-3 lg:px-5 py-2 lg:py-2.5 bg-[#3E6049] text-white rounded-full text-xs lg:text-sm font-semibold hover:bg-[#4A7357] transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.08)] whitespace-nowrap"
                >
                  {t('nav.createAccount')}
                </Link>
              </>
            )}
          </div>

          {/* mobile toggle */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            <LanguageSelect />
            <button
              className="text-[#6E6E6E]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'block text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200',
                    active
                      ? 'bg-[#F28C7B] text-white shadow-sm'
                      : 'text-[#3E6049] hover:bg-[#F28C7B]/20 hover:text-[#3E6049]',
                  ].join(' ')}
                >
                  {t(link.nameKey)}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <>
                  <Link
                    to="/perfil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-semibold text-[#6E6E6E]"
                  >
                    {t('nav.myProfile')}
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-sm font-semibold text-[#E6A5A1]"
                  >
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold rounded-full text-[#6E6E6E] hover:bg-[#F28C7B]/20"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold rounded-full text-white bg-[#3E6049] text-center"
                  >
                    {t('nav.createAccount')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

