import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#7CA982]/20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img src="/logo-beginns-full.svg" alt="Beginss" className="h-10 sm:h-12 w-auto max-w-[200px] object-contain" />
            </div>
            <p className="text-[#5F5F5F] text-sm sm:text-base mb-6 max-w-md leading-relaxed">
              {t('footer.tagline')}
            </p>
            <a
              href="https://www.instagram.com/beginsscomunidad?igsh=NjF1cDludnNsOW04"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-10 h-10 bg-[#7CA982] hover:bg-[#3E6049] rounded-full items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#3E6049]">{t('footer.explore')}</h3>
            <ul className="space-y-2 text-sm text-[#5F5F5F]">
              <li>
                <Link to="/marketplace" className="hover:text-[#7CA982] transition-colors">
                  {t('nav.marketplace')}
                </Link>
              </li>
              <li>
                <Link to="/cafecito" className="hover:text-[#7CA982] transition-colors">
                  {t('nav.cafecito')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#3E6049]">{t('footer.information')}</h3>
            <ul className="space-y-2 text-sm text-[#5F5F5F]">
              <li>
                <Link to="/valores" className="hover:text-[#7CA982] transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#7CA982] transition-colors">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#7CA982] transition-colors">
                  {t('footer.termsAndConditions')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#7CA982]/20 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs sm:text-sm text-[#8E8E8E]">
              {t('footer.copyright')}
            </p>
            <p className="text-xs sm:text-sm text-[#8E8E8E]">
              {t('footer.mobileAppSoon')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
