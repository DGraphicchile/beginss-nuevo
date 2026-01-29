import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language?.split('-')[0] ?? 'es'}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="text-sm font-semibold text-[#3E6049] bg-white/80 border border-[#3E6049]/30 rounded-full px-3 py-1.5 cursor-pointer hover:bg-[#F28C7B]/10 focus:outline-none focus:ring-2 focus:ring-[#F28C7B]/50"
      aria-label="Idioma / Language"
    >
      {LANGUAGES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
