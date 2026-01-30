import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Repeat, Users, Briefcase, Sparkles, Heart, ArrowRight } from 'lucide-react';
import FloatingElements from '../components/FloatingElements';
import { useAuth } from '../lib/AuthContext';

const CARDS_CONFIG = [
  { id: 'conexion', link: '/intercambio/conexion-propuestas', icon: Users, color: '#cf3f5c', image: '/conexion-propuestas.jpg' },
  { id: 'servicios', link: '/intercambio/servicios', icon: Briefcase, color: '#2D5444', image: '/servicios-intercambio.jpg' }
];

export default function Intercambio() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const cards = CARDS_CONFIG.map((c) => ({
    ...c,
    title: t(`intercambioPage.cards.${c.id}.title`),
    description: t(`intercambioPage.cards.${c.id}.description`),
  }));

  return (
    <div className="min-h-screen overflow-x-hidden">
       <section className="relative min-h-[50vh] sm:min-h-[55vh] lg:min-h-[60vh] flex items-center pt-28 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="/trendy-and-interracial-group-of-girlfriends-lookin-2024-11-15-08-57-27-utc.jpg"
      alt="Beginss Community"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
  </div>

  <FloatingElements />

  <div className="max-w-7xl mx-auto relative z-10 w-full">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
        <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5C542]" />
        <span className="text-[#1E1E1E] text-xs sm:text-sm font-bold uppercase tracking-wider">
          {t('intercambioPage.hero.badge')}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
        {t('intercambioPage.hero.title')}
      </h1>

      <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-semibold mb-4 sm:mb-6 leading-relaxed drop-shadow-md">
          {t('intercambioPage.hero.subtitle1')}
        </p>
        <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed drop-shadow-md">
          {t('intercambioPage.hero.subtitle2')}
        </p>
      </div>
    </div>
  </div>
</section>




      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-3 h-3 bg-[#F5C542] rounded-full"></div>
        <div className="absolute bottom-40 left-10 w-2 h-2 bg-[#cf3f5c] rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-4 border-[#2D5444] rounded-full opacity-5"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-20">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-[#F5C542]/10 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 shadow-2xl border-2 border-[#F5C542]/20">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F5C542] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                    <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                    {t('intercambioPage.sectionConnect.title')}
                  </h2>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#cf3f5c] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                      {t('intercambioPage.sectionConnect.platformTitle')}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t('intercambioPage.sectionConnect.platformDescription')}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FAFAFA] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-3 sm:mb-4">
              {t('intercambioPage.exploreSection.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('intercambioPage.exploreSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {cards.map((card) => (
              <Link
                key={card.id}
                to={card.link}
                className="group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative h-52 sm:h-60 lg:h-64 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: card.color }}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-8">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                    {card.description}
                  </p>

                  <div className="flex items-center font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform" style={{ color: card.color }}>
                    <span>{t('intercambioPage.explore')}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/international-women-s-day-.jpg"
            alt="Beginss Community"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <img
            src="/recurso-5.svg"
            alt="Beginss Icon"
            className="w-16 h-16 mx-auto mb-6"
          />
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>
            {t('intercambioPage.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            {t('intercambioPage.cta.subtitle')}
          </p>
          {!user && (
            <Link to="/registro">
              <button className="px-8 py-4 bg-white text-[#2D5444] rounded-full font-bold text-lg hover:bg-[#F7EFE9] transition-colors shadow-2xl">
                {t('intercambioPage.cta.createAccount')}
              </button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
