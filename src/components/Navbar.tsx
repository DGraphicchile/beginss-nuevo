import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, Coins } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Cafecito', path: '/cafecito' },
    { name: 'Círculos de acción', path: '/circulos' },
    { name: 'Intercambio', path: '/intercambio' },
    { name: 'Marketplace', path: '/marketplace' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (active: boolean) =>
    [
      'relative text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C7B] focus-visible:ring-offset-2 focus-visible:ring-offset-white',
      active
        ? 'bg-[#F28C7B] text-white shadow-sm aria-[current=page]:cursor-default'
        : 'text-[#3E6049] hover:text-[#3E6049] hover:bg-[#F28C7B]/20 hover:ring-1 hover:ring-[#F28C7B]/40 hover:-translate-y-0.5',
    ].join(' ');

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all">
      <div className="max-w-[90rem] mx-auto px-10">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img src="/logo-beginns-full.svg" alt="Beginss" className="h-14 w-auto" />
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center space-x-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={linkClass(active)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* auth section */}
          <div className="hidden md:flex items-center space-x-5">
            {user ? (
              <>
                <Link
                  to="/perfil"
                  className="flex items-center space-x-2 text-[#6E6E6E] hover:text-[#7CA982] transition-colors font-semibold"
                >
                  <User className="w-5 h-5" />
                  <span>{profile?.full_name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-semibold text-[#6E6E6E] hover:text-[#E6A5A1] transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#6E6E6E] hover:text-[#7CA982] transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="px-6 py-2.5 bg-[#3E6049] text-white rounded-full text-sm font-semibold hover:bg-[#4A7357] transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          {/* mobile toggle */}
          <button
            className="md:hidden text-[#6E6E6E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
                  {link.name}
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
                    Mi perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-sm font-semibold text-[#E6A5A1]"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold rounded-full text-[#6E6E6E] hover:bg-[#F28C7B]/20"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold rounded-full text-white bg-[#3E6049] text-center"
                  >
                    Crear cuenta
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

