import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'es', labelKey: 'languageSelect.spanish', flag: '🇪🇸' },
  { code: 'en', labelKey: 'languageSelect.english', flag: '🇺🇸' },
  { code: 'pt-BR', labelKey: 'languageSelect.portugueseBR', flag: '🇧🇷' },
] as const;

function getActiveLang(i18nLang: string | undefined): string {
  if (!i18nLang) return 'es';
  if (i18nLang.startsWith('pt')) return 'pt-BR';
  if (i18nLang.startsWith('en')) return 'en';
  return 'es';
}

export default function LanguageSelect() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const currentLang = getActiveLang(i18n.language);
  const currentOption = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-[#3E6049]/30 bg-white/80 px-2.5 py-1.5 shadow-sm hover:bg-[#F28C7B]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C7B] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label={t('common.language')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-current={currentLang}
      >
        <span className="text-lg leading-none" role="img" aria-hidden>
          {currentOption.flag}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#3E6049] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('common.language')}
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[10rem] rounded-xl border border-[#3E6049]/20 bg-white py-1 shadow-lg"
        >
          {LANGUAGES.map(({ code, labelKey, flag }) => {
            const isActive = currentLang === code;
            return (
              <li key={code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#3E6049]/10 text-[#3E6049]'
                      : 'text-[#1E1E1E] hover:bg-[#F28C7B]/10'
                  }`}
                >
                  <span className="text-lg" role="img" aria-hidden>
                    {flag}
                  </span>
                  {t(labelKey)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
